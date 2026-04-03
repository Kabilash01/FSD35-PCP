# 🧪 Testing Guide - Internal Evaluation Management System

## Complete Test Scenarios

This guide walks you through testing every feature of the application.

---

## ✅ Pre-Test Setup

### 1. Start MongoDB Atlas
- Create a free cluster at mongodb.com
- Get connection string
- Update `backend/.env` with your MONGO_URI

### 2. Start Backend Server
```bash
cd evaluation-system/backend
node server.js

# Expected output:
# MongoDB Atlas Connected
# Server running on port 5000
```

### 3. Start Frontend Server
```bash
cd evaluation-system/frontend
npm run dev

# Expected output:
# VITE ready in XXX ms
# Local: http://localhost:5173/
```

---

## 🧪 Test Scenario 1: User Registration

### Test Case 1.1: Register Evaluator
**Steps:**
1. Open `http://localhost:5173` in browser
2. Click "Register" link
3. Fill in form:
   - Name: `John Evaluator`
   - Email: `john@test.com`
   - Password: `test123`
   - Role: `Evaluator`
4. Click "Register"

**Expected Result:**
- ✅ Redirected to login page
- ✅ Success message or no error
- ✅ User created in MongoDB

### Test Case 1.2: Register Admin
**Steps:**
1. Go to register page
2. Fill in form:
   - Name: `Admin User`
   - Email: `admin@test.com`
   - Password: `test123`
   - Role: `Admin`
3. Click "Register"

**Expected Result:**
- ✅ Redirected to login page
- ✅ User created with admin role

### Test Case 1.3: Duplicate Email Validation
**Steps:**
1. Try to register with `john@test.com` again

**Expected Result:**
- ❌ Error message: "Email already registered"
- ✅ Registration blocked

---

## 🔐 Test Scenario 2: Authentication

### Test Case 2.1: Evaluator Login
**Steps:**
1. Go to login page
2. Enter credentials:
   - Email: `john@test.com`
   - Password: `test123`
3. Click "Login"

**Expected Result:**
- ✅ Redirected to `/evaluator` dashboard
- ✅ Navbar shows "John Evaluator (evaluator)"
- ✅ Token stored in localStorage
- ✅ Dashboard shows "My Submitted Evaluations" section

### Test Case 2.2: Admin Login
**Steps:**
1. Logout (click Logout button)
2. Login with admin credentials:
   - Email: `admin@test.com`
   - Password: `test123`

**Expected Result:**
- ✅ Redirected to `/admin` dashboard
- ✅ Navbar shows "Admin User (admin)"
- ✅ Shows "Registered Evaluators" table
- ✅ Shows "All Evaluations" table

### Test Case 2.3: Invalid Credentials
**Steps:**
1. Logout
2. Try login with wrong password

**Expected Result:**
- ❌ Error: "Invalid credentials"
- ✅ Stays on login page

---

## 📝 Test Scenario 3: Evaluation Submission (Evaluator)

### Test Case 3.1: Submit First Evaluation
**Steps:**
1. Login as evaluator (`john@test.com`)
2. Click "+ New Evaluation" button
3. Fill form:
   - Submission Title: `Project Alpha Review`
   - Candidate Name: `Jane Smith`
   - Score: `85`
   - Remarks: `Excellent work on the frontend`
4. Click "Submit & Finalize"

**Expected Result:**
- ✅ Success message: "✅ Evaluation submitted and finalized..."
- ✅ Form clears
- ✅ Warning visible: "⚠️ Once submitted, scores are final..."

### Test Case 3.2: View Submitted Evaluation
**Steps:**
1. Click "Evaluator Dashboard" or navigate back
2. Check the evaluations table

**Expected Result:**
- ✅ Table shows 1 row with:
  - Submission: "Project Alpha Review"
  - Candidate: "Jane Smith"
  - Score: "85"
  - Remarks: "Excellent work on the frontend"
  - Status: "🔒 Finalized" (in green)
  - Date: Today's date
- ✅ No edit button visible

### Test Case 3.3: Submit Multiple Evaluations
**Steps:**
1. Submit 2 more evaluations with different data

**Expected Result:**
- ✅ All 3 evaluations appear in dashboard
- ✅ Sorted by date (newest first)
- ✅ All show "🔒 Finalized" status

### Test Case 3.4: Score Validation
**Steps:**
1. Try to submit evaluation with score `150`
2. Try to submit with score `-10`

**Expected Result:**
- ❌ Browser validation prevents submission (HTML5 min/max)
- ✅ Score must be 0-100

### Test Case 3.5: Required Fields
**Steps:**
1. Try to submit evaluation with empty fields

**Expected Result:**
- ❌ Browser shows "Please fill out this field"
- ✅ Submission blocked

---

## 👨‍💼 Test Scenario 4: Admin Dashboard

### Test Case 4.1: View All Evaluators
**Steps:**
1. Logout
2. Login as admin (`admin@test.com`)
3. Check "Registered Evaluators" table

**Expected Result:**
- ✅ Shows at least 1 evaluator
- ✅ Displays name, email, joined date
- ✅ Count shown: "Registered Evaluators (1)"

### Test Case 4.2: View All Evaluations
**Steps:**
1. Check "All Evaluations" table on admin dashboard

**Expected Result:**
- ✅ Shows all 3 evaluations from John
- ✅ Each row shows:
  - Evaluator name
  - Submission title
  - Candidate name
  - Score
  - Remarks
  - Status: "🔒 Finalized"
  - Date
- ✅ Count shown: "All Evaluations (3)"

### Test Case 4.3: Multiple Evaluators
**Steps:**
1. Logout
2. Register another evaluator: `jane@test.com`
3. Login as Jane and submit 2 evaluations
4. Logout and login as admin

**Expected Result:**
- ✅ "Registered Evaluators" shows 2 users
- ✅ "All Evaluations" shows 5 total evaluations
- ✅ Can see which evaluator submitted which evaluation

---

## 🔒 Test Scenario 5: Authorization & Security

### Test Case 5.1: Evaluator Cannot Access Admin Routes
**Steps:**
1. Login as evaluator
2. Manually navigate to `http://localhost:5173/admin`

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Cannot view admin dashboard

### Test Case 5.2: Admin Cannot Submit Evaluations
**Steps:**
1. Login as admin
2. Try to navigate to `/evaluator/submit`

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ No submit button visible for admins

### Test Case 5.3: Unauthenticated Access Blocked
**Steps:**
1. Logout
2. Try to access `/evaluator` directly
3. Try to access `/admin` directly

**Expected Result:**
- ✅ Both redirect to `/login`
- ✅ Protected routes work correctly

### Test Case 5.4: Token Persistence
**Steps:**
1. Login as evaluator
2. Refresh the page (F5)

**Expected Result:**
- ✅ Still logged in
- ✅ Dashboard still accessible
- ✅ Token persisted in localStorage

### Test Case 5.5: Logout Functionality
**Steps:**
1. Login
2. Click "Logout" button

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Token removed from localStorage
- ✅ Cannot access protected routes anymore

---

## 🚫 Test Scenario 6: Immutability Enforcement

### Test Case 6.1: No Edit Button in UI
**Steps:**
1. Login as evaluator
2. Check evaluations table

**Expected Result:**
- ✅ No "Edit" button visible
- ✅ No "Delete" button visible
- ✅ Only "🔒 Finalized" status shown

### Test Case 6.2: API Level Protection (Backend)
**Steps:**
1. Login and get JWT token from localStorage
2. Use Postman/Thunder Client to try:
```http
PUT http://localhost:5000/api/evaluations/<id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 100
}
```

**Expected Result:**
- ❌ 404 Not Found (route doesn't exist)
- ✅ No way to update via API

### Test Case 6.3: Database Level Protection
**Steps:**
1. Open MongoDB Compass or Atlas UI
2. Try to manually update an evaluation's score

**Expected Result:**
- ⚠️ While you CAN manually edit in DB (you're admin)
- ✅ The application has no routes to do this
- ✅ Mongoose hooks would throw errors if routes existed

---

## 🌐 Test Scenario 7: API Testing (Postman)

### Test Case 7.1: Register via API
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "api@test.com",
  "password": "test123",
  "role": "evaluator"
}
```

**Expected Result:**
- ✅ Status: 201 Created
- ✅ Response: "User registered successfully"

### Test Case 7.2: Login via API
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "api@test.com",
  "password": "test123"
}
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Response includes:
  - `token`: JWT token string
  - `user`: { id, name, email, role }

### Test Case 7.3: Submit Evaluation via API
```http
POST http://localhost:5000/api/evaluations/submit
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "submissionTitle": "API Test Submission",
  "candidateName": "Test Candidate",
  "score": 90,
  "remarks": "Submitted via API"
}
```

**Expected Result:**
- ✅ Status: 201 Created
- ✅ Response includes created evaluation with `isFinalized: true`

### Test Case 7.4: Get My Evaluations via API
```http
GET http://localhost:5000/api/evaluations/my
Authorization: Bearer <token>
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Array of evaluations for logged-in user

### Test Case 7.5: Unauthorized Access (No Token)
```http
GET http://localhost:5000/api/evaluations/my
```

**Expected Result:**
- ❌ Status: 401 Unauthorized
- ✅ Message: "No token, unauthorized"

### Test Case 7.6: Admin-Only Route with Evaluator Token
```http
GET http://localhost:5000/api/evaluations/all
Authorization: Bearer <evaluator_token>
```

**Expected Result:**
- ❌ Status: 403 Forbidden
- ✅ Message: "Access denied: insufficient role"

---

## 📊 Test Scenario 8: Data Validation

### Test Case 8.1: Missing Required Fields
**Steps:**
1. Login as evaluator
2. Try to submit evaluation with empty "Candidate Name"

**Expected Result:**
- ❌ Frontend validation: "Please fill out this field"

### Test Case 8.2: Score Out of Range
**Steps:**
1. Inspect element and remove min/max attributes
2. Try to submit score of 150

**Expected Result:**
- ✅ Frontend might allow, but backend should validate
- ✅ MongoDB schema has min: 0, max: 100

### Test Case 8.3: Invalid Email Format
**Steps:**
1. Register with email: "notanemail"

**Expected Result:**
- ❌ HTML5 validation: "Please include @ in email"

---

## ✅ Test Results Checklist

After completing all tests, verify:

### Authentication ✅
- [ ] Registration works for both roles
- [ ] Login redirects to correct dashboard
- [ ] Logout clears session
- [ ] Token persists on refresh
- [ ] Invalid credentials are rejected

### Authorization ✅
- [ ] Evaluators can only access evaluator routes
- [ ] Admins can only access admin routes
- [ ] Protected routes require authentication
- [ ] Role-based access control works

### Evaluation Submission ✅
- [ ] Evaluators can submit evaluations
- [ ] All fields are required
- [ ] Score validates to 0-100 range
- [ ] Success message shows after submission
- [ ] Form clears after submission

### Evaluation Viewing ✅
- [ ] Evaluators see only their own evaluations
- [ ] Admins see all evaluations
- [ ] Tables display correct data
- [ ] Counts are accurate
- [ ] Dates format correctly

### Immutability ✅
- [ ] No edit buttons in UI
- [ ] "🔒 Finalized" badge shows
- [ ] No PUT/PATCH/DELETE routes exist
- [ ] Warning message displays on submit form

### API Testing ✅
- [ ] All endpoints respond correctly
- [ ] JWT authorization works
- [ ] Role-based endpoints enforce roles
- [ ] Error messages are descriptive

---

## 🐛 Known Edge Cases

### Edge Case 1: Token Expiry
- Tokens expire after 1 day
- User must login again after expiry
- **Test:** Wait 24 hours and try to access dashboard

### Edge Case 2: Concurrent Evaluations
- Multiple evaluators can submit at same time
- **Test:** Open 2 browsers, login as different evaluators, submit simultaneously

### Edge Case 3: Special Characters
- Names/titles with special characters
- **Test:** Use `O'Brien`, `Jean-Claude`, `José` in names

---

## 📝 Test Report Template

```
TEST SESSION REPORT
Date: _________________
Tester: _______________

Registration Tests:        [ ] Pass  [ ] Fail
Authentication Tests:      [ ] Pass  [ ] Fail
Evaluation Submission:     [ ] Pass  [ ] Fail
Admin Dashboard:           [ ] Pass  [ ] Fail
Authorization:             [ ] Pass  [ ] Fail
Immutability:             [ ] Pass  [ ] Fail
API Testing:              [ ] Pass  [ ] Fail

Issues Found:
1. _____________________________
2. _____________________________
3. _____________________________

Notes:
_________________________________
_________________________________
```

---

## 🎉 All Tests Passing?

If all tests pass, your application is:
- ✅ Fully functional
- ✅ Secure
- ✅ Ready for deployment!

**Congratulations! 🚀**
