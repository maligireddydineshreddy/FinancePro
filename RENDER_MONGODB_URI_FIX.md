# 🔧 Fix Render MONGODB_URI

## ❌ Current (WRONG - Missing Database Name)

```
mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/?appName=Cluster0
```

**Problem:** No database name specified, so it defaults to `test` database!

---

## ✅ Correct (WITH Database Name)

```
mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

**Changes:**
1. Added `/financeApp` after `.net` and before `?`
2. Added `retryWrites=true&w=majority&` (recommended for reliability)

---

## 📋 Step-by-Step Fix

### 1. Go to Render Dashboard
- https://dashboard.render.com
- Select your backend service

### 2. Update MONGODB_URI
- Go to **Environment** tab
- Find `MONGODB_URI`
- Click **Edit** or **Update**

### 3. Replace with Correct Value

**Copy and paste this exact value:**

```
mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Save and Redeploy
- Click **Save Changes**
- Render will automatically redeploy
- Wait 2-3 minutes

---

## ✅ Verify

After redeploying, check Render logs:
- Should see: `✅ Database Connected Successfully!!`
- Both local and website will now use `financeApp` database
- Users will sync everywhere! 🎉

