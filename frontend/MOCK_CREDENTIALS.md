# Mock Test Credentials Guide

## Overview
This document contains test credentials for the JobPortal AI frontend application when running in **mock mode** (without database). These credentials allow team members to test the authentication flow and user scenarios.

## Quick Access
- **Application URL:** http://localhost:8081
- **Sign In Page:** http://localhost:8081/signin
- **Sign Up Page:** http://localhost:8081/signup

---

## Available Test Accounts

### 1. Complete Profile User (Dashboard Direct Access)
**Email:** `test@jobportal.com`  
**Password:** `Test@123`  
**Profile Status:** ✅ Complete  
**Flow:** Sign In → **Directly goes to Dashboard**

**User Details:**
- First Name: John
- Last Name: Doe
- Phone: +1 1234567890
- User Type: Candidate

**Use Case:** Test dashboard functionality with a fully set up user profile.

---

### 2. Incomplete Profile User (Profile Creation Required)
**Email:** `incomplete@jobportal.com`  
**Password:** `Test@123`  
**Profile Status:** ⚠️ Incomplete  
**Flow:** Sign In → **Redirects to Profile Creation page**

**User Details:**
- First Name: (Not set)
- Last Name: (Not set)
- Phone: (Not set)
- User Type: (Not set)

**Use Case:** Test the profile completion flow and validation.

---

### 3. Employer User (Complete Profile)
**Email:** `employer@jobportal.com`  
**Password:** `Test@123`  
**Profile Status:** ✅ Complete  
**Flow:** Sign In → **Directly goes to Dashboard**

**User Details:**
- First Name: Jane
- Last Name: Smith
- Phone: +1 9876543210
- User Type: Employer

**Use Case:** Test employer-specific features and dashboard.

---

### 4. Candidate User (Complete Profile)
**Email:** `candidate@jobportal.com`  
**Password:** `Test@123`  
**Profile Status:** ✅ Complete  
**Flow:** Sign In → **Directly goes to Dashboard**

**User Details:**
- First Name: Alice
- Last Name: Johnson
- Phone: +44 5551234567
- User Type: Candidate

**Use Case:** Test candidate-specific features and job search functionality.

---

## Test Scenarios

### Scenario 1: New User Sign Up → Profile Creation
**Steps:**
1. Navigate to `/signup`
2. Fill in registration form:
   - **Name:** Your Name
   - **Email:** `newuser@example.com` (use any email not in test list)
   - **Password:** `Test@123` (or any valid password meeting requirements)
   - **Confirm Password:** Same as password
3. Click **"Create Account"**
4. **Expected Result:** Redirects to Profile Creation page

**What to Test:**
- Form validation (email format, password strength)
- Password confirmation matching
- Successful registration flow
- Redirect to profile creation

---

### Scenario 2: Sign In with Complete Profile → Dashboard
**Steps:**
1. Navigate to `/signin`
2. Enter credentials:
   - **Email:** `test@jobportal.com`
   - **Password:** `Test@123`
3. Click **"Sign In"**
4. **Expected Result:** Directly navigates to Dashboard (profile is complete)

**What to Test:**
- Successful authentication
- Profile completion check
- Direct dashboard access
- User data persistence

---

### Scenario 3: Sign In with Incomplete Profile → Profile Creation
**Steps:**
1. Navigate to `/signin`
2. Enter credentials:
   - **Email:** `incomplete@jobportal.com`
   - **Password:** `Test@123`
3. Click **"Sign In"**
4. **Expected Result:** Redirects to Profile Creation page

**What to Test:**
- Profile completion detection
- Automatic redirect logic
- Incomplete profile handling

---

### Scenario 4: Complete Profile After Sign Up
**Steps:**
1. Complete Scenario 1 (sign up new user)
2. On Profile Creation page, fill in:
   - **First Name:** John *(Required)*
   - **Last Name:** Doe *(Required)*
   - **Phone Number:** 1234567890 *(Optional)*
   - **User Type:** Select "Job Seeker" or "Employer" *(Required)*
3. Click **"Complete Profile"**
4. **Expected Result:** Redirects to Dashboard

**What to Test:**
- Required field validation
- Form submission
- Profile update functionality
- Redirect to dashboard after completion

---

## Accessing Test Credentials in Application

### Method 1: Test Credentials Component (Visual)
1. Navigate to Sign In page: http://localhost:8081/signin
2. Look for **"🔧 Show Test Credentials"** button in bottom-right corner
3. Click to expand and view all credentials

### Method 2: Browser Console
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Navigate to Console tab
3. Credentials are automatically printed on page load (development mode)

### Method 3: Code Reference
```javascript
import { TEST_CREDENTIALS } from './services/mockUsers';

// Access specific credentials
const completeUser = TEST_CREDENTIALS.COMPLETE_PROFILE;
console.log(completeUser.email); // 'test@jobportal.com'
```

---

## Important Notes

### Password Requirements
- All test account passwords: **`Test@123`**
- New signups: Any password meeting validation rules (min 8 chars, uppercase, lowercase, number, special char)

### Mock Mode Status
- **Mock mode is currently ENABLED** (default behavior)
- Mock mode activates automatically when backend API is unavailable
- Data persists in browser local storage during testing
- Mock mode is isolated and doesn't affect real database integration

### Profile Completion Criteria
A profile is considered complete when:
- ✅ First Name is set
- ✅ Last Name is set
- ✅ User Type is set

Phone number is **optional** and doesn't affect completion status.

### User Flow Summary
```
Sign Up → Profile Creation → Dashboard
  OR
Sign In → [Check Profile]
         ├─ Complete → Dashboard
         └─ Incomplete → Profile Creation → Dashboard
```

---

## Quick Reference Table

| Email | Password | Profile Status | Expected Flow |
|-------|----------|---------------|---------------|
| `test@jobportal.com` | `Test@123` | Complete | Sign In → Dashboard |
| `incomplete@jobportal.com` | `Test@123` | Incomplete | Sign In → Profile Creation |
| `employer@jobportal.com` | `Test@123` | Complete | Sign In → Dashboard |
| `candidate@jobportal.com` | `Test@123` | Complete | Sign In → Dashboard |
| *Any new email* | *Any valid password* | Incomplete | Sign Up → Profile Creation |

---

## Troubleshooting

### Issue: "User not found" error
**Solution:** Make sure you're using one of the test credentials listed above, or sign up with a new email first.

### Issue: Not redirecting correctly
**Solution:** 
- Clear browser local storage
- Check browser console for errors
- Verify mock mode is enabled in `frontend/src/config/appConfig.js`

### Issue: Test credentials not showing
**Solution:**
- Ensure you're in development mode
- Check that `VITE_ENABLE_MOCK_MODE` is not set to `false` in `.env`
- Refresh the page

### Issue: Profile not saving
**Solution:**
- Check browser console for mock mode messages
- Verify all required fields are filled
- Try clearing local storage and starting fresh

---

## For Developers

### Disabling Mock Mode
When database is ready:
1. Create/update `frontend/.env` file:
   ```env
   VITE_ENABLE_MOCK_MODE=false
   ```
2. Restart development server
3. Mock mode will be disabled, app will use real API only

### Mock Code Location
- Mock users service: `frontend/src/services/mockUsers.js`
- Configuration: `frontend/src/config/appConfig.js`
- Authentication service: `frontend/src/services/authService.js`

### Testing in Mock Mode
Mock mode is designed for:
- ✅ Frontend development without backend
- ✅ UI/UX testing
- ✅ Authentication flow testing
- ✅ Profile completion testing

Mock mode is **NOT** for:
- ❌ Production use
- ❌ Performance testing
- ❌ Security testing
- ❌ Integration with real database

---

## Support

For questions or issues:
1. Check browser console for error messages
2. Verify mock mode configuration
3. Review this documentation
4. Contact the development team

---

**Last Updated:** January 2025  
**Environment:** Development / Mock Mode  
**Application Version:** 1.0.0

