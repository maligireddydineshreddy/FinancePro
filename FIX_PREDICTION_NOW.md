# 🚀 Fix Stock Prediction - Action Steps

## ✅ Step 1: Push ML API CORS Fix to GitHub

The code has been fixed. Now push it:

```bash
git add ml/api.py
git commit -m "Fix ML API CORS configuration for stock prediction"
git push
```

Render will automatically redeploy the ML API in 2-3 minutes.

---

## ✅ Step 2: Verify Vercel Environment Variable

**CRITICAL:** The frontend must have `VITE_ML_API_URL` set!

1. Go to: https://vercel.com/dashboard
2. Select your FinancePro project
3. Go to **Settings** → **Environment Variables**
4. Check if `VITE_ML_API_URL` exists
5. If missing or wrong:

   **Add/Update:**
   - **Key:** `VITE_ML_API_URL`
   - **Value:** `https://financepro-ml-api.onrender.com`
   - **⚠️ NO trailing slash!**

6. Click **Save**
7. Go to **Deployments** tab
8. Click **⋯** (three dots) on latest deployment → **Redeploy**

---

## ✅ Step 3: Test the Fix

1. Wait 2-3 minutes for Render ML API to redeploy
2. Wake up ML API (if sleeping):
   - Visit: `https://financepro-ml-api.onrender.com/docs`
   - Wait 30-60 seconds
3. Go to your website: `https://www.financepro.life`
4. Navigate to **Stock Prediction** page
5. Try to get a prediction
6. Should work now! ✅

---

## 🔍 If Still Not Working

### Check Browser Console (F12 → Console)
- Look for errors
- Share the error message

### Check Network Tab (F12 → Network)
- Try prediction
- Click on `/get_stock_prediction` request
- Check:
  - **Status Code** (should be 200)
  - **Request URL** (should be `https://financepro-ml-api.onrender.com/get_stock_prediction`)

### Test ML API Directly
- Visit: `https://financepro-ml-api.onrender.com/docs`
- Should see FastAPI documentation
- If timeout: ML API is sleeping, wait 30-60 seconds

---

## ✅ Expected Result

After fixes:
- Stock dropdown loads ✅
- "Get Prediction" button works ✅
- Prediction results display ✅
- Charts render correctly ✅

