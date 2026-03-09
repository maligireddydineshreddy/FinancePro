# 🔧 Fix Stock Prediction Network Error

## ❌ Problem
- Error: "Network error: Could not connect to the prediction server"
- Stock prediction feature not working on `www.financepro.life`

---

## 🎯 Quick Fixes

### Fix 1: Verify Vercel Environment Variable

**The frontend needs `VITE_ML_API_URL` set in Vercel!**

1. Go to **Vercel Dashboard**: https://vercel.com
2. Select your project (FinancePro frontend)
3. Go to **Settings** → **Environment Variables**
4. Check if `VITE_ML_API_URL` exists
5. If missing or wrong, add/update:

   **Key:** `VITE_ML_API_URL`  
   **Value:** `https://financepro-ml-api.onrender.com`

   ⚠️ **NO trailing slash!**

6. **Redeploy** the frontend after updating

---

### Fix 2: Update ML API CORS in Render

The ML API needs to allow requests from your domain.

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Select your ML API service (`financepro-ml-api`)
3. Go to **Environment** tab
4. Add/Update `CORS_ORIGINS`:

   **Key:** `CORS_ORIGINS`  
   **Value:** `https://financepro.life,https://www.financepro.life,https://financepro.vercel.app`

   ⚠️ **Comma-separated, NO spaces!**

5. **Save** - Render will auto-redeploy

---

### Fix 3: Wake Up ML API (If Sleeping)

Render free tier services sleep after 15 minutes of inactivity.

1. Open in browser: `https://financepro-ml-api.onrender.com/docs`
2. Wait 30-60 seconds for it to wake up
3. Should see FastAPI documentation page
4. Try stock prediction again

---

## 🔍 Diagnostic Steps

### Step 1: Check Browser Console

1. Go to `https://www.financepro.life`
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Navigate to Stock Prediction page
5. Try to get a prediction
6. Look for errors - **what do you see?**

Common errors:
- `CORS policy: No 'Access-Control-Allow-Origin'` → CORS issue
- `Failed to fetch` → ML API URL wrong or API down
- `404 Not Found` → Wrong endpoint URL
- `Network Error` → Can't reach ML API

---

### Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Clear network log (🚫 icon)
3. Try to get stock prediction
4. Look for request to `/get_stock_prediction`
5. Click on it:
   - **Status Code**: What number? (200 = success, 404/500 = error)
   - **Request URL**: Should be `https://financepro-ml-api.onrender.com/get_stock_prediction`
   - **If wrong URL**: Vercel env var not set correctly

---

### Step 3: Test ML API Directly

1. Open: `https://financepro-ml-api.onrender.com/docs`
2. Should see FastAPI Swagger UI
3. If error/timeout: ML API is sleeping or down
4. Wait 30-60 seconds and refresh

---

## ✅ Expected Configuration

### Vercel Environment Variables (Frontend)
```
VITE_API_URL=https://financepro-backend-rdfu.onrender.com/api
VITE_ML_API_URL=https://financepro-ml-api.onrender.com
```

### Render Environment Variables (ML API)
```
CORS_ORIGINS=https://financepro.life,https://www.financepro.life
```

---

## 🚀 After Fixes

1. Update Vercel env var → Redeploy frontend
2. Update Render ML API CORS → Auto-redeploy
3. Wait 2-3 minutes for deployments
4. Wake up ML API (visit `/docs`)
5. Test stock prediction on website

---

## 📞 Still Not Working?

Share:
1. Browser console errors (F12 → Console)
2. Network tab request details (F12 → Network)
3. Does `https://financepro-ml-api.onrender.com/docs` work?
4. What is `VITE_ML_API_URL` set to in Vercel?

