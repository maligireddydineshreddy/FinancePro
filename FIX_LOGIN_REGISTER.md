# 🔧 Fix Login/Register Issue on Deployed Site

## ❌ Problem
- Website is live but can't login
- Can't register new users
- API calls are likely being blocked by CORS

## ✅ Solution

The backend CORS configuration needs to allow requests from your Vercel domain. Follow these steps:

---

## 🎯 Step 1: Update Environment Variables in Render (Backend)

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service** (financepro-backend)
3. Click **"Environment"** tab (left sidebar)
4. Find **`CORS_ORIGIN`** variable, or click **"Add Environment Variable"**

5. **Add/Update `CORS_ORIGIN`**:
   - **Key:** `CORS_ORIGIN`
   - **Value:** 
     ```
     https://financepro.life,https://www.financepro.life,https://personal-finance-management-kohl.vercel.app
     ```
   - (Copy this exact value, includes all your domains)

6. Click **"Save Changes"**

7. **Redeploy** the backend:
   - Go to **"Events"** tab
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔍 Step 2: Verify Backend is Running

Test if your backend is accessible:

1. Visit: `https://financepro-backend-rdfu.onrender.com/api/health`
2. You should see: `{"status":"ok","message":"FinancePro backend API is running"}`

If you get an error, the backend might be sleeping. Wake it up by visiting the URL above.

---

## 🔍 Step 3: Verify Frontend Environment Variables

In **Vercel Dashboard**:

1. Go to your project
2. **Settings** → **Environment Variables**
3. Verify these are set:
   - **`VITE_API_URL`** = `https://financepro-backend-rdfu.onrender.com/api`
   - **`VITE_ML_API_URL`** = `https://financepro-ml-api.onrender.com`

4. If not set, add them and **Redeploy** the frontend

---

## 🧪 Step 4: Test Login/Register

1. Wait 2-3 minutes after redeploying backend
2. Visit: `https://financepro.life`
3. Try to:
   - **Register** a new user
   - **Login** with existing credentials

---

## 🔍 Step 5: Check Browser Console

If still not working:

1. Open browser **Developer Tools** (F12)
2. Go to **Console** tab
3. Try to login/register
4. Look for errors like:
   - `CORS policy: No 'Access-Control-Allow-Origin' header`
   - `Network Error`
   - `404 Not Found`

---

## 🛠️ Alternative: Allow All Origins (Less Secure)

If you want to allow all origins (not recommended for production but easier):

In Render backend environment variables:
- **Remove** `CORS_ORIGIN` variable (or leave it empty)
- The updated code will now allow all origins if `CORS_ORIGIN` is not set

---

## ✅ Expected Result

After fixing CORS:
- ✅ Login page works
- ✅ Register page works
- ✅ Users can create accounts
- ✅ Users can login

---

## 📋 Checklist

- [ ] Updated `CORS_ORIGIN` in Render backend
- [ ] Redeployed backend service
- [ ] Verified backend health endpoint works
- [ ] Verified frontend environment variables
- [ ] Tested login
- [ ] Tested register

---

**If still having issues, share the browser console error messages!**

