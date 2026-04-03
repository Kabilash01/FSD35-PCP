const express = require('express');
const app = express();

app.use(express.json());

const evaluationRoutes = require('./routes/evaluationRoutes');

// Print all routes in the evaluationRoutes router
const routes = [];
evaluationRoutes.stack.forEach((middleware) => {
  if (middleware.route) {
    const methods = Object.keys(middleware.route.methods);
    const path = middleware.route.path;
    routes.push(`${methods.map(m => m.toUpperCase()).join(',')} ${path}`);
  }
});

console.log('Registered routes in evaluationRoutes:');
routes.forEach(route => console.log(`  ✓ ${route}`));

// Check if /admin/create route exists
const hasAdminCreateRoute = routes.some(r => r.includes('/admin/create'));
console.log(`\n✅ /admin/create route exists: ${hasAdminCreateRoute}`);

// Check if /admin/:id route exists
const hasAdminIdRoute = routes.some(r => r.includes('admin') && r.includes(':id'));
console.log(`✅ /admin/:id route exists: ${hasAdminIdRoute}`);
