# 🧪 Test CRUD Endpoints

This guide shows you how to test the new admin CRUD operations using curl or Postman.

---

## Step 1: Get Admin Token

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d {"email":"admin@test.com","password":"test123"}
```

**Response:**
```json
{
  "token": "eyJhbGc...", 
  "user": {"id": "user_id", "name": "Admin User", "email": "admin@test.com", "role": "admin"}
}
```

**Copy the `token` value for the next steps.**

---

## Step 2: Test Evaluation CRUD

### 2.1: CREATE Evaluation
```bash
curl -X POST http://localhost:5000/api/evaluations/admin/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "evaluatorId": "evaluator_user_id",
    "evaluatorName": "John Evaluator",
    "submissionTitle": "API Test Evaluation",
    "candidateName": "Test Subject",
    "score": 88,
    "remarks": "Created via API"
  }
```

**Expected:** ✅ Status 201, evaluation created with ID

### 2.2: READ Evaluation
```bash
curl -X GET http://localhost:5000/api/evaluations/admin/EVALUATION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:** ✅ Status 200, returns evaluation details

### 2.3: UPDATE Evaluation
```bash
curl -X PUT http://localhost:5000/api/evaluations/admin/EVALUATION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "score": 92,
    "remarks": "Updated score via API"
  }
```

**Expected:** ✅ Status 200, evaluation updated

### 2.4: DELETE Evaluation
```bash
curl -X DELETE http://localhost:5000/api/evaluations/admin/EVALUATION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:** ✅ Status 200, evaluation deleted

---

## Step 3: Test User/Evaluator CRUD

### 3.1: CREATE User
```bash
curl -X POST http://localhost:5000/api/auth/admin/users/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "name": "New Evaluator",
    "email": "newevaluator@test.com",
    "password": "test123",
    "role": "evaluator"
  }
```

**Expected:** ✅ Status 201, user created with ID

### 3.2: READ User (optional)
```bash
curl -X GET http://localhost:5000/api/auth/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:** ✅ Status 200, returns user details (without password)

### 3.3: UPDATE User
```bash
curl -X PUT http://localhost:5000/api/auth/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "name": "Updated Name",
    "email": "updated@test.com"
  }
```

**Expected:** ✅ Status 200, user updated

### 3.4: DELETE User
```bash
curl -X DELETE http://localhost:5000/api/auth/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:** ✅ Status 200, user deleted (and all their evaluations)

---

## Testing via Postman (Easier)

1. **Import Collection** - Import the requests above into Postman
2. **Set Variables** - Create environment variables:
   - `token` - Paste your JWT token
   - `admin_token` - Your admin token
   - `evaluator_id` - An evaluator's user ID
   - `eval_id` - An evaluation's ID
   - `user_id` - A user's ID

3. **Test Each Request** - Run them in order from Step 1 onwards

---

## If You Get 404 Errors

❌ **Status 404** = Route not found

**Check:**
1. ✅ Backend server is running: `node server.js`
2. ✅ Route path is correct (check console logs)
3. ✅ Token is valid and admin role
4. ✅ Restart backend after any code changes

**Debug:**
```bash
# Check backend is running
curl http://localhost:5000/

# You should see: "API Running"
```

---

## If You Get 401/403 Errors

❌ **Status 401** = Missing/invalid token
❌ **Status 403** = Not admin role

**Fix:**
1. Get a fresh token from Step 1
2. Verify admin user exists: `admin@test.com` / `test123`
3. Verify you're logged in as admin, not evaluator

---

## If You Get 500 Errors

❌ **Status 500** = Backend error

**Check:**
1. MongoDB Atlas connection status
2. Backend console for error details
3. All required fields are provided

---

## Success Checklist ✅

After testing, verify:
- [ ] CREATE evaluation works (201)
- [ ] READ evaluation works (200)
- [ ] UPDATE evaluation works (200)
- [ ] DELETE evaluation works (200)
- [ ] CREATE user works (201)
- [ ] UPDATE user works (200)
- [ ] DELETE user works (200)
- [ ] UI buttons appear in Admin Dashboard
- [ ] Modal forms open correctly
- [ ] No console errors in browser

🎉 **All tests passing? feature is ready to use!**
