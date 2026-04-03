# 🚀 Quick Start Guide - Internal Evaluation Management System

## ⚡ 5-Minute Setup

### Step 1: MongoDB Atlas Setup (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user with username and password
4. Add your IP to Network Access (or use `0.0.0.0/0` for testing)
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

### Step 2: Backend Configuration (1 minute)
```bash
cd evaluation-system/backend

# Edit the .env file with your actual MongoDB URI:
# MONGO_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/evaluationDB
# JWT_SECRET=your_random_secret_key_here_make_it_long_and_complex
```

### Step 3: Start Backend Server (30 seconds)
```bash
# From backend directory
node server.js

# You should see:
# MongoDB Atlas Connected
# Server running on port 5000
```

### Step 4: Start Frontend (30 seconds)
```bash
# Open a new terminal
cd evaluation-system/frontend
npm run dev

# You should see:
# VITE ready in XXX ms
# Local: http://localhost:5173/
```

### Step 5: Test the Application! (1 minute)
1. Open browser to `http://localhost:5173`
2. Click "Register" 
3. Create an **Evaluator** account:
   - Name: Test Evaluator
   - Email: evaluator@test.com
   - Password: test123
   - Role: Evaluator
4. Login and submit an evaluation
5. Logout and create an **Admin** account:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: test123
   - Role: Admin
6. Login as admin and view all evaluations!

---

## 🧪 Testing Immutability

### Verify that evaluations cannot be edited:
1. Login as evaluator
2. Submit an evaluation
3. Check that:
   - ✅ "🔒 Finalized" badge appears
   - ✅ No edit button exists
   - ✅ Score is permanently recorded

---

## 📦 Deployment Checklist

### Before Deploying:
- [ ] Test locally with both evaluator and admin accounts
- [ ] Verify MongoDB Atlas connection works
- [ ] Change JWT_SECRET to a strong random value
- [ ] Test evaluation submission and retrieval
- [ ] Verify role-based access control works

### Backend Deployment (Render):
1. Create GitHub repo for backend folder
2. Push to GitHub
3. Create new Web Service on Render.com
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables (MONGO_URI, JWT_SECRET, PORT)
7. Deploy and copy the URL

### Frontend Deployment (Vercel):
1. Create GitHub repo for frontend folder
2. Push to GitHub
3. Import project to Vercel
4. Set framework to Vite
5. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`
6. Deploy!

---

## 🐛 Common Issues & Solutions

### Backend won't start:
```bash
# Issue: MongoDB connection error
# Solution: Check MONGO_URI in .env file
# Make sure IP is whitelisted in MongoDB Atlas

# Issue: Port already in use
# Solution: Change PORT in .env to 5001 or another free port
```

### Frontend won't connect to backend:
```bash
# Issue: CORS errors
# Solution: Backend already has cors() enabled - should work

# Issue: 401 Unauthorized
# Solution: Clear localStorage and login again
localStorage.clear()
```

### Can't submit evaluation:
```bash
# Issue: Token expired
# Solution: Login again (tokens expire after 1 day)

# Issue: Wrong role
# Solution: Make sure you're logged in as "evaluator" not "admin"
```

---

## 📊 API Testing with Postman/Thunder Client

### 1. Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "evaluator"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response includes token - copy it!
```

### 3. Submit Evaluation (use token from login)
```http
POST http://localhost:5000/api/evaluations/submit
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "submissionTitle": "Project Alpha Review",
  "candidateName": "Jane Smith",
  "score": 85,
  "remarks": "Excellent work on the frontend implementation"
}
```

### 4. Get My Evaluations
```http
GET http://localhost:5000/api/evaluations/my
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Get All Evaluations (admin only)
```http
GET http://localhost:5000/api/evaluations/all
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 🎯 Project Features Verification

After setup, verify these features work:

### Authentication:
- ✅ Register with evaluator role
- ✅ Register with admin role
- ✅ Login redirects to correct dashboard
- ✅ Logout clears token and redirects to login
- ✅ Protected routes block unauthorized access

### Evaluator Features:
- ✅ Submit new evaluation
- ✅ View own evaluations in table
- ✅ See "🔒 Finalized" status on all evaluations
- ✅ No edit button appears anywhere
- ✅ Score validation (0-100 range enforced)

### Admin Features:
- ✅ View all evaluators in table
- ✅ View all evaluations from all evaluators
- ✅ See evaluator name with each evaluation
- ✅ Cannot submit evaluations (evaluator role only)

### Security:
- ✅ JWT required for protected routes
- ✅ Role check prevents cross-role access
- ✅ Passwords are hashed (never stored plain)
- ✅ Mongoose hooks prevent evaluation updates
- ✅ No PUT/PATCH/DELETE routes exist for evaluations

---

## 💡 Development Tips

### Hot Reload
Both backend and frontend support hot reload during development:
- Backend: Restart server manually after changes
- Frontend: Vite auto-reloads on file save

### Debugging
```javascript
// Backend - add console.logs in controllers
console.log('User data:', req.user);
console.log('Request body:', req.body);

// Frontend - use React DevTools
console.log('Form state:', form);
console.log('Auth context:', user);
```

### Database Inspection
Use MongoDB Compass or Atlas UI to view:
- Users collection
- Evaluations collection
- Verify isFinalized is always true
- Check timestamps

---

## 🎉 You're All Set!

Your Internal Evaluation Management System is ready for:
- ✅ Development and testing
- ✅ Demo and presentation
- ✅ Production deployment
- ✅ Further customization

**Need help?** Check the main README.md for detailed documentation!
