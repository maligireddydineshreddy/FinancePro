# 🔧 Fix: Users Created on Website Can't Login Locally (and Vice Versa)

## ❌ The Problem

When you create a user:
- **On website** → User is created in Render backend's database connection
- **On local** → User is created in local backend's database connection

If they're pointing to **different databases** or the **website frontend** isn't configured correctly, users won't sync.

---

## ✅ The Solution

Both environments need to use the **same backend URL** or at least the **same database**.

Since both backends should use the same MongoDB Atlas database, the issue is likely that:
1. **Vercel (website)** doesn't have the correct `VITE_API_URL` environment variable
2. The website frontend is defaulting to `http://localhost:3001/api` (which won't work from the website)

---

## 🎯 Step-by-Step Fix

### Step 1: Verify Vercel Environment Variables

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project (`financepro.life` or similar)
3. Go to **Settings** → **Environment Variables**
4. Check if these variables exist:

**Required Variables:**
```
VITE_API_URL = https://financepro-backend-rdfu.onrender.com/api
VITE_ML_API_URL = https://financepro-ml-api.onrender.com
```

### Step 2: Add/Update Environment Variables in Vercel

If they don't exist or are wrong:

1. Click **"Add New"**
2. Add `VITE_API_URL`:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://financepro-backend-rdfu.onrender.com/api`
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

3. Add `VITE_ML_API_URL`:
   - **Key**: `VITE_ML_API_URL`
   - **Value**: `https://financepro-ml-api.onrender.com`
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

### Step 3: Redeploy on Vercel

After adding/updating environment variables:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

---

## 🔍 Verify the Fix

After redeploying:

1. **Check Website Frontend:**
   - Open browser console (F12) on `https://www.financepro.life`
   - Type: `console.log(import.meta.env.VITE_API_URL)`
   - Should show: `https://financepro-backend-rdfu.onrender.com/api`

2. **Test User Creation:**
   - Create a new user on the **website**
   - Try logging in with the **same credentials locally**
   - Should work! ✅

3. **Test Reverse:**
   - Create a new user **locally**
   - Try logging in on the **website**
   - Should work! ✅

---

## 📝 Current Configuration

**Local Frontend** (`frontend/src/config/api.js`):
```javascript
BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
```

- If `VITE_API_URL` is not set → Uses `http://localhost:3001/api` ✅ (Correct for local)
- If `VITE_API_URL` is set → Uses that value

**Website Frontend (Vercel)**:
- Should use `VITE_API_URL` from environment variables
- Should point to: `https://financepro-backend-rdfu.onrender.com/api`

---

## ✅ Expected Behavior After Fix

- **Website** → Creates users in Render backend → Saved to MongoDB Atlas
- **Local** → Creates users in local backend → Saved to **same** MongoDB Atlas
- **Both share the same database** → Users work everywhere! ✅

---

## 🚨 Still Not Working?

If users still don't sync:

1. **Check Backend Logs:**
   - Render backend logs: https://dashboard.render.com
   - Look for MongoDB connection errors

2. **Verify MongoDB URI:**
   - Both backends should use the same `MONGODB_URI`
   - Check Render environment variables

3. **Check CORS:**
   - Backend should allow requests from both `localhost:5173` and `financepro.life`

