# 🔧 Fix 500 Internal Server Error

## ✅ Good News
- CORS error is **FIXED**! ✅
- Requests are reaching the backend
- The issue is now a server-side error (500)

## ❌ Problem
- **500 Internal Server Error** on login and signup
- This is a backend code/database issue

---

## 🔍 Step 1: Check Backend Logs in Render

The logs will show the exact error:

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service** (financepro-backend)
3. Click **"Logs"** tab (left sidebar)
4. **Try to login or register** on your website
5. **Go back to Render logs** and look for error messages
6. Look for:
   - Database connection errors
   - Missing `bcrypt` errors
   - Code errors
   - Any red error messages

**Share what error you see in the logs!**

---

## 🔍 Common 500 Error Causes

### Issue 1: Database Connection Failed
**Error in logs**: `MongoServerError`, `MongooseError`, or connection timeout

**Solution:**
1. Go to Render → Backend service → **Environment** tab
2. Check `MONGODB_URI` variable:
   - Should be your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...`
3. Make sure MongoDB Atlas allows connections from Render:
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (or Render's IPs)

---

### Issue 2: Missing bcrypt Module
**Error in logs**: `Cannot find module 'bcrypt'` or similar

**Solution:**
1. Go to Render → Backend service → **Events** tab
2. Check build logs for installation errors
3. If bcrypt failed to install, try:
   - **Manual Deploy** → **Deploy latest commit**
   - This will reinstall dependencies

---

### Issue 3: Code Error in UserController
**Error in logs**: Syntax error, undefined variable, etc.

**Solution:**
- Check the exact error message in logs
- Share it with me and I'll help fix it

---

### Issue 4: Environment Variables Missing
**Error in logs**: `process.env.MONGODB_URI is undefined`

**Solution:**
1. Go to Render → Backend service → **Environment** tab
2. Make sure `MONGODB_URI` exists and is correct
3. Click **"Save Changes"** if you updated it
4. **Redeploy** (Events → Manual Deploy)

---

## 🔍 Step 2: Check Backend Health

Test if backend is running:

1. Visit: `https://financepro-backend-rdfu.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"FinancePro backend API is running"}`
3. If you get an error, backend might be down

---

## 🔍 Step 3: Check MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Sign in
3. Check **Network Access**:
   - Should allow `0.0.0.0/0` (all IPs) or Render's IPs
4. Check **Database Access**:
   - Make sure your user has read/write permissions

---

## 📋 What to Share

After checking Render logs, share:

1. **The exact error message** from backend logs
2. **MongoDB connection status** (working or not)
3. **Environment variables** status (MONGODB_URI set?)

---

## ✅ Quick Fixes to Try

### Fix 1: Redeploy Backend
1. Render → Backend service → Events tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete
4. Test again

### Fix 2: Check MongoDB URI
1. Verify `MONGODB_URI` in Render environment variables
2. Should start with: `mongodb+srv://`
3. Make sure it's correct

### Fix 3: Wake Up Backend
1. First request after sleep takes ~30 seconds
2. Visit backend health endpoint
3. Wait 30 seconds
4. Try login/register again

---

**Check the Render logs first - that will tell us exactly what's wrong!**

