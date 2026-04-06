# Internal Evaluation Management System

## 📋 Project Overview
A production-ready, role-based evaluation management system where evaluators submit scores and admins manage records. **Scores are immutable once submitted** — enforced at API, database model, and UI levels.

## 🚀 Tech Stack
- **Frontend**: React.js (Vite), React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT + bcryptjs
- **Deployment**: Render (backend), Vercel (frontend)

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Evaluator** | Register, Login, Submit Evaluation (immutable), View Own Evaluations |
| **Admin** | Register, Login, View All Evaluations, View All Evaluators |

## 🔒 Security Features
- ✅ JWT-based authentication with 1-day token expiry
- ✅ Role-based access control (RBAC) middleware
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Protected routes on both backend and frontend
- ✅ **Evaluation immutability** enforced at multiple levels:
  - Mongoose pre-hooks block any update attempts
  - No PUT/PATCH/DELETE routes exist for evaluations
  - Frontend shows "🔒 Finalized" badge with no edit UI

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user (evaluator or admin) |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/evaluations/submit` | Evaluator | Submit new evaluation (immutable) |
| GET | `/api/evaluations/my` | Evaluator | Get own submitted evaluations |
| GET | `/api/evaluations/all` | Admin | Get all evaluations from all evaluators |
| GET | `/api/evaluations/evaluators` | Admin | Get list of all registered evaluators |

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['evaluator', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Evaluations Collection
```javascript
{
  evaluatorId: ObjectId (ref: User),
  evaluatorName: String,
  submissionTitle: String,
  candidateName: String,
  score: Number (0-100),
  remarks: String,
  isFinalized: Boolean (always true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup
```bash
cd backend
npm install

# Create .env file with:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_change_this_in_production

# Start backend server
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file with:
VITE_API_URL=http://localhost:5000/api

# Start frontend dev server
npm run dev
```

## 🌐 Deployment

### Backend Deployment (Render.com)
1. Push backend folder to GitHub repository
2. Create new **Web Service** on Render
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key for JWT signing
   - `PORT`: 5000 (or any port)
6. Deploy

### Frontend Deployment (Vercel)
1. Push frontend folder to GitHub repository
2. Import project in Vercel dashboard
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api`
5. Deploy

## 📂 Project Structure

```
evaluation-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register & login logic
│   │   └── evaluationController.js  # Evaluation CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access control
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Evaluation.js         # Evaluation schema with immutability
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── evaluationRoutes.js   # Evaluation endpoints
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   └── ProtectedRoute.jsx  # Route protection HOC
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── EvaluatorDashboard.jsx  # Evaluator home
    │   │   ├── SubmitEvaluation.jsx    # Submit new evaluation
    │   │   └── AdminDashboard.jsx      # Admin home
    │   ├── App.jsx               # Main app with routing
    │   └── main.jsx              # React entry point
    ├── .env                      # Frontend env variables
    └── package.json
```

## ✅ Finality Enforcement Checklist

- ✅ No PUT/PATCH/DELETE routes exist for evaluations
- ✅ Mongoose pre-hooks (`findOneAndUpdate`, `updateOne`) throw errors
- ✅ `isFinalized: true` stored in database on every submission
- ✅ Frontend displays "🔒 Finalized" badge on all records
- ✅ No edit button exists anywhere in the UI
- ✅ JWT authentication required on all protected routes
- ✅ Role-based middleware blocks cross-role access

## 🎯 Usage Flow

### For Evaluators:
1. Register with role "evaluator"
2. Login to access evaluator dashboard
3. Click "+ New Evaluation" button
4. Fill in submission details (title, candidate name, score, remarks)
5. Submit (⚠️ **Warning**: Cannot be modified after submission)
6. View all submitted evaluations in dashboard

### For Admins:
1. Register with role "admin"
2. Login to access admin dashboard
3. View all registered evaluators in table
4. View all evaluations submitted by all evaluators
5. Monitor evaluation activity and scores

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/evaluationDB
JWT_SECRET=your_super_secret_key_change_this_in_production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚦 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access the app at: `http://localhost:5173`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas connection string in `.env`
- Ensure IP whitelist includes your current IP or `0.0.0.0/0` for development
- Check MongoDB user credentials

### CORS Errors
- Backend uses `cors()` middleware - should allow all origins in development
- For production, configure CORS to allow only your frontend domain

### JWT Token Errors
- Ensure `JWT_SECRET` is set in backend `.env`
- Check token is being sent in Authorization header as `Bearer <token>`
- Verify token hasn't expired (1-day expiry)

## 📝 License
ISC

## 👨‍💻 Author
Built as an internal evaluation management system with production-grade security and immutability features.

---

## 🌟 Live Demo Links
- **Frontend**: [Your Vercel URL here]
- **Backend**: [Your Render URL here]

---

**Note**: Remember to replace placeholder MongoDB URI and JWT secret with your actual credentials before deploying!
