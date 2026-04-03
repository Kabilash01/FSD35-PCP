const http = require('http');

function makeRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData
        });
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  try {
    // Step 1: Login
    console.log('Step 1: Login...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'test123'
    });
    console.log(`Login status: ${loginRes.status}`);
    if (loginRes.status !== 200) {
      console.log('Error:', loginRes.data);
      return;
    }

    const loginData = JSON.parse(loginRes.data);
    const token = loginData.token;
    console.log(`✅ Got token: ${token.substring(0, 30)}...`);

    // Step 2: Test existing endpoint
    console.log('\nStep 2: Test existing endpoint /evaluations/all...');
    const allRes = await makeRequest('GET', '/api/evaluations/all', null, token);
    console.log(`Status: ${allRes.status}`);
    console.log(`Response preview: ${allRes.data.substring(0, 100)}...`);

    // Step 3: Test new endpoint
    console.log('\nStep 3: Test new endpoint /evaluations/admin/create...');
    const createRes = await makeRequest('POST', '/api/evaluations/admin/create', {
      evaluatorId: '69cfc75da537f41a6913d02c',
      evaluatorName: 'kabilash',
      submissionTitle: 'Node.js API Test',
      candidateName: 'Test Candidate',
      score: 88,
      remarks: 'Testing via Node.js'
    }, token);
    console.log(`Status: ${createRes.status}`);
    console.log(`Response: ${createRes.data}`);

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
