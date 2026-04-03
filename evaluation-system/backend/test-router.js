const express = require('express');
const app = express();

app.use(express.json());

// Create a simple test router
const testRouter = express.Router();

testRouter.post('/admin/test', (req, res) => {
  res.json({ message: 'Test route works!', path: '/admin/test' });
});

testRouter.get('/normal', (req, res) => {
  res.json({ message: 'Normal route works!', path: '/normal' });
});

// Mount the test router
app.use('/api/test', testRouter);

// Add a debug endpoint to list routes
app.get('/api/debug-routes', (req, res) => {
  const routes = [];
  testRouter.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods);
      const path = middleware.route.path;
      routes.push(`${methods.map(m => m.toUpperCase()).join(',')} /api/test${path}`);
    }
  });
  res.json({ routes });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
  console.log('Try: POST http://localhost:5001/api/test/admin/test');
  console.log('Try: GET http://localhost:5001/api/test/normal');
  console.log('Debug: http://localhost:5001/api/debug-routes');
});
