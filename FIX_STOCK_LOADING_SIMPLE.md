# 🔧 Fix Stock Loading - Quick Guide

## ❌ Problem
- Stocks not loading, showing "Loading stocks..." forever

---

## ✅ Quick Fixes to Try

### Fix 1: Check Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your project
2. **Settings** → **Environment Variables**
3. Check if `VITE_ML_API_URL` exists
4. Should be: `https://financepro-ml-api.onrender.com`
5. **If missing or wrong:**
   - Add/Update: `VITE_ML_API_URL` = `https://financepro-ml-api.onrender.com`
   - Save
   - Go to **Deployments** tab
   - Click **"Redeploy"** on latest deployment

---

### Fix 2: Check ML API CORS in Render

1. Go to **Render Dashboard** → ML API service (`financepro-ml-api`)
2. **Environment** tab
3. Check for `CORS_ORIGINS` variable
4. **If it doesn't exist**, add it:
   - Key: `CORS_ORIGINS`
   - Value: `https://financepro.life,https://www.financepro.life,https://personal-finance-management-kohl.vercel.app`
5. **If it exists**, make sure it includes your domain
6. Save and redeploy ML API

---

### Fix 3: Test ML API

1. Visit: `https://financepro-ml-api.onrender.com/docs`
2. Should see FastAPI documentation
3. If not, ML API might be down

---

### Fix 4: Check Browser Console

1. On your website, press **F12**
2. Go to **Console** tab
3. Navigate to Stock Information or Stock Prediction page
4. Look for errors - share what you see!

---

## 🔍 Most Likely Issue

**Vercel environment variable `VITE_ML_API_URL` is missing or wrong!**

Check and update it first.

---

**Check Vercel environment variables first - that's most likely the issue!**

