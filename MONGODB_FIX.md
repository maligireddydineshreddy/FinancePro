# MongoDB Connection Issue - Fix Guide

## Problem
The backend cannot connect to MongoDB Atlas, causing registration and other database operations to fail with timeout errors.

## Solution Steps

### 1. Whitelist Your IP Address in MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Select your cluster (`Cluster0`)
4. Click on **"Network Access"** (or **"IP Access List"**) in the left sidebar
5. Click **"Add IP Address"** button
6. You have two options:
   - **Option A (Recommended for development)**: Click **"Allow Access from Anywhere"** button, which will add `0.0.0.0/0` to allow all IPs
   - **Option B (More secure)**: Add your current IP address by clicking **"Add Current IP Address"**
7. Click **"Confirm"**

### 2. Verify Database User Credentials

1. In MongoDB Atlas, go to **"Database Access"** in the left sidebar
2. Verify the user `someshrocks144` exists and has proper permissions
3. If needed, create a new database user or reset the password

### 3. Check Cluster Status

1. Go to **"Database"** in MongoDB Atlas
2. Make sure your cluster is **running** (not paused)
3. If paused, click **"Resume"** to start it

### 4. Verify Connection String

The current connection string in `backend/config/db.js` is:
```
mongodb+srv://someshrocks144:somesh2004@cluster0.gs6wg.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

Make sure:
- Username and password are correct
- Cluster name matches (`cluster0.gs6wg.mongodb.net`)
- Database name is correct (`financeApp`)

### 5. Restart the Backend

After making changes in MongoDB Atlas, restart the backend:
```bash
cd backend
npm start
```

### 6. Test the Connection

Try registering a user again in the frontend. The connection should work after whitelisting your IP.

## Quick Fix for Development (Less Secure)

If you just want to get it working quickly for development:

1. In MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Wait 1-2 minutes for changes to propagate
5. Restart your backend server

## Still Having Issues?

If the problem persists:
- Check your internet connection
- Verify the MongoDB Atlas cluster is not paused
- Check if you're behind a VPN or corporate firewall
- Verify the username and password in the connection string are correct

