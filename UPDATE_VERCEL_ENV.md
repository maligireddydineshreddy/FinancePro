# 🔧 Update Vercel Environment Variables

## ✅ Current Deployment URLs

- **Frontend**: `https://personal-finance-management-kohl.vercel.app`
- **Backend**: `https://financepro-backend-rdfu.onrender.com`
- **ML API**: `https://financepro-ml-api.onrender.com`

---

## 📝 Step-by-Step: Update Vercel Environment Variables

### Step 1: Go to Vercel Project

1. Go to: https://vercel.com/dashboard
2. Click on your project: `personal-finance-management` (or `FinancePro`)

### Step 2: Open Environment Variables

1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** (left sidebar)

### Step 3: Add/Update Variables

You need to add/update these two variables:

#### Variable 1: VITE_API_URL
- **Name**: `VITE_API_URL`
- **Value**: `https://financepro-backend-rdfu.onrender.com/api`
- Click **"Add"** or **"Update"** if it already exists

#### Variable 2: VITE_ML_API_URL
- **Name**: `VITE_ML_API_URL`
- **Value**: `https://financepro-ml-api.onrender.com`
- Click **"Add"** or **"Update"** if it already exists

### Step 4: Save

1. Make sure both variables are added
2. They should appear in the list

### Step 5: Redeploy

**Important**: After adding environment variables, you must redeploy!

1. Go to **"Deployments"** tab (top navigation)
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Confirm redeployment
6. Wait for deployment to complete (2-3 minutes)

---

## ✅ Verification

After redeployment:

1. Visit: `https://personal-finance-management-kohl.vercel.app`
2. Try logging in or registering
3. Check browser console (F12) for any errors
4. Test features like stock info, predictions, etc.

---

## 📋 Quick Checklist

- [ ] Added `VITE_API_URL` = `https://financepro-backend-rdfu.onrender.com/api`
- [ ] Added `VITE_ML_API_URL` = `https://financepro-ml-api.onrender.com`
- [ ] Redeployed frontend
- [ ] Tested the app works

---

**Once this is done, we can connect your domain! 🚀**

