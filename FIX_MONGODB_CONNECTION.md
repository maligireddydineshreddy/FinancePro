# 🔧 Fix MongoDB Connection Timeout

## ❌ Error Found
```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

**This means:** Backend can't connect to MongoDB Atlas (connection times out after 10 seconds)

---

## ✅ Solution: Fix MongoDB Atlas Network Access

The most common cause is MongoDB Atlas blocking connections from Render.

---

## 🎯 Step 1: Check MongoDB Atlas Network Access

### Go to MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Sign in with your account
3. Select your cluster (the one you're using)

### Check Network Access

1. In the left sidebar, click **"Network Access"** (under Security)
2. Look at the IP Access List

**What you should see:**
- Either `0.0.0.0/0` (allows all IPs) ✅
- Or specific IP addresses

**If you see:**
- Empty list or only your local IP ❌
- This is the problem!

---

## 🎯 Step 2: Allow All IPs (Recommended for Development)

1. In Network Access page, click **"Add IP Address"** button
2. Click **"Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` (allows all IPs)
3. Click **"Confirm"**
4. Wait 1-2 minutes for changes to take effect

**Note:** `0.0.0.0/0` allows all IPs. For production, you might want to restrict this later, but for now this will fix the issue.

---

## 🎯 Step 3: Verify MongoDB URI in Render

1. Go to **Render Dashboard** → Your backend service
2. Click **"Environment"** tab
3. Check for `MONGODB_URI` variable:
   - Should exist
   - Should be: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...`
   - Should include your database name

**If it's missing or wrong:**
1. Get your MongoDB connection string:
   - MongoDB Atlas → Clusters → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
2. In Render, add/update `MONGODB_URI`:
   - Key: `MONGODB_URI`
   - Value: Your connection string (replace `<password>` with actual password)
3. Click **"Save Changes"**
4. **Redeploy backend** (Events → Manual Deploy)

---

## 🎯 Step 4: Check MongoDB Cluster Status

1. In MongoDB Atlas, go to **"Clusters"** (left sidebar)
2. Check if your cluster shows:
   - **Status**: Running ✅
   - If it says "Paused" or "Stopped", click "Resume" or "Start"

---

## 🎯 Step 5: Test Again

After fixing Network Access:

1. Wait 1-2 minutes for changes to propagate
2. Go to your website: `https://www.financepro.life`
3. Try to **register** a new user
4. Should work now! ✅

---

## 🔍 Alternative: If Still Not Working

### Check Render Logs Again

1. After fixing Network Access, try login/register
2. Check Render backend logs
3. Should see: `✅ Database Connected Successfully!!`
4. If you still see connection errors, check:
   - MongoDB URI is correct
   - Password in URI is correct
   - Cluster is running

---

## ✅ Quick Checklist

- [ ] MongoDB Atlas → Network Access → Added `0.0.0.0/0`
- [ ] Waited 1-2 minutes for changes
- [ ] Verified `MONGODB_URI` in Render environment variables
- [ ] MongoDB cluster is running (not paused)
- [ ] Tested register/login - should work! ✅

---

**After allowing `0.0.0.0/0` in MongoDB Atlas Network Access, your login/register should work!**

