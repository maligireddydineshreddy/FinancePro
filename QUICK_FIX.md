# 🔴 URGENT: Fix Registration Error - Step by Step

## The Problem
You cannot register because MongoDB Atlas is blocking the connection. Your IP address needs to be whitelisted.

## ✅ QUICK FIX (5 minutes)

### Step 1: Open MongoDB Atlas
1. Go to: **https://cloud.mongodb.com/**
2. Sign in with your MongoDB account (the one with email/password used in the connection string)

### Step 2: Navigate to Network Access
1. Once logged in, you'll see your clusters
2. Click on **"Network Access"** in the left sidebar (under Security)

### Step 3: Add Your IP Address
1. Click the green **"+ ADD IP ADDRESS"** button
2. You'll see a popup with options
3. **EASIEST OPTION**: Click the **"ALLOW ACCESS FROM ANYWHERE"** button
   - This adds `0.0.0.0/0` which allows all IPs (OK for development)
4. Click **"Confirm"**

### Step 4: Wait
- Wait **2-3 minutes** for MongoDB Atlas to apply the changes

### Step 5: Test Again
- Go back to your app and try registering again
- It should work now!

---

## 🔍 Alternative: Find Your Specific IP

If you prefer to whitelist only your IP (more secure):

1. In MongoDB Atlas Network Access, click "+ ADD IP ADDRESS"
2. Click **"ADD CURRENT IP ADDRESS"** button
3. Click "Confirm"
4. Wait 2-3 minutes

---

## ⚠️ Still Not Working?

1. **Check if cluster is running**: In MongoDB Atlas, go to "Database" → make sure your cluster status is "Running" (not "Paused")
2. **Check credentials**: Make sure the username `someshrocks144` and password are correct
3. **Wait longer**: Sometimes it takes up to 5 minutes for changes to propagate

---

## 📞 Need Help?

If you've done all the steps and it's still not working, check:
- Are you behind a VPN? (Try disabling it)
- Are you on a corporate network? (May have firewall blocking)
- Is your MongoDB Atlas cluster paused? (Resume it)

