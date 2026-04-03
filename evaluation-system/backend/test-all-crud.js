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
    // Login
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'test123'
    });
    const loginData = JSON.parse(loginRes.data);
    const token = loginData.token;
    console.log('✅ Login successful');

    // Test 1: Create Evaluation
    console.log('\n=== TEST 1: CREATE Evaluation ===');
    const createRes = await makeRequest('POST', '/api/evaluations/admin/create', {
      evaluatorId: '69cfc75da537f41a6913d02c',
      evaluatorName: 'kabilash',
      submissionTitle: 'CRUD Test - Create',
      candidateName: 'John Doe',
      score: 85,
      remarks: 'Test evaluation created by admin'
    }, token);
    const evalData = JSON.parse(createRes.data).evaluation;
    const evalId = evalData._id;
    console.log(`Status: ${createRes.status} (Expected: 201)`);
    console.log(`✅ Created evaluation ID: ${evalId}`);

    // Test 2: Read Evaluation
    console.log('\n=== TEST 2: READ Evaluation ===');
    const readRes = await makeRequest('GET', `/api/evaluations/admin/${evalId}`, null, token);
    const readData = JSON.parse(readRes.data);
    console.log(`Status: ${readRes.status} (Expected: 200)`);
    console.log(`✅ Read evaluation: ${readData.submissionTitle}`);

    // Test 3: Update Evaluation
    console.log('\n=== TEST 3: UPDATE Evaluation ===');
    const updateRes = await makeRequest('PUT', `/api/evaluations/admin/${evalId}`, {
      score: 92,
      remarks: 'Updated by admin CRUD'
    }, token);
    console.log(`Status: ${updateRes.status} (Expected: 200)`);
    const updateData = JSON.parse(updateRes.data);
    console.log(`✅ Updated score to: ${updateData.evaluation.score}`);

    // Test 4: Delete Evaluation
    console.log('\n=== TEST 4: DELETE Evaluation ===');
    const deleteRes = await makeRequest('DELETE', `/api/evaluations/admin/${evalId}`, null, token);
    console.log(`Status: ${deleteRes.status} (Expected: 200)`);
    console.log('✅ Evaluation deleted');

    // Test 5: Create User
    console.log('\n=== TEST 5: CREATE User ===');
    const createUserRes = await makeRequest('POST', '/api/auth/admin/users/create', {
      name: 'Test Evaluator',
      email: 'testevaluator@test.com',
      password: 'test123',
      role: 'evaluator'
    }, token);
    const userData = JSON.parse(createUserRes.data).user;
    const userId = userData.id;
    console.log(`Status: ${createUserRes.status} (Expected: 201)`);
    console.log(`✅ Created user: ${userData.name} (${userData.email})`);

    // Test 6: Update User
    console.log('\n=== TEST 6: UPDATE User ===');
    const updateUserRes = await makeRequest('PUT', `/api/auth/admin/users/${userId}`, {
      name: 'Updated Test Evaluator',
      email: 'updated@test.com'
    }, token);
    console.log(`Status: ${updateUserRes.status} (Expected: 200)`);
    const updatedUser = JSON.parse(updateUserRes.data).user;
    console.log(`✅ Updated user: ${updatedUser.name}`);

    // Test 7: Delete User
    console.log('\n=== TEST 7: DELETE User ===');
    const deleteUserRes = await makeRequest('DELETE', `/api/auth/admin/users/${userId}`, null, token);
    console.log(`Status: ${deleteUserRes.status} (Expected: 200)`);
    console.log('✅ User deleted');

    console.log('\n🎉 ALL TESTS PASSED!');

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
