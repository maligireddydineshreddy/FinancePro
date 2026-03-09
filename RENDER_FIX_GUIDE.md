# 🔧 Render Deployment Fix Guide

## Common Issues & Solutions

### Issue 1: Build Failed - Check These Settings

In Render, verify these settings match:

✅ **Root Directory**: `backend`
✅ **Build Command**: `npm install`
✅ **Start Command**: `node server.js`
✅ **Runtime**: `Node`
✅ **Plan**: `Free`

---

### Issue 2: "Module not found" or "Cannot find module"

**Solution**: Make sure Root Directory is set to `backend`

1. Go to Render → Your service → Settings
2. Check "Root Directory" field
3. Should be: `backend` (not empty, not `frontend`, not `ml`)

---

### Issue 3: "Command failed" or "Exit status 1"

**Check the deploy logs:**

1. In Render dashboard, click **"Logs"** (left sidebar)
2. Or click the **"deploy logs"** link in the failed event
3. Look for error messages
4. Common errors:
   - Missing dependencies → Check package.json
   - Wrong start command → Should be `node server.js`
   - Port issues → Environment variable `PORT` should be set

---

### Issue 4: Port Configuration

Make sure environment variable is set:

**In Render → Environment Variables:**
```
PORT=10000
```

Render automatically provides the PORT environment variable, but setting it explicitly helps.

---

### Issue 5: MongoDB Connection Error

**If you see MongoDB errors:**

1. Check `MONGODB_URI` environment variable is set correctly
2. Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Check connection string format is correct

---

## ✅ Quick Fix Steps

1. **Click "Logs" in Render** to see the actual error
2. **Check Settings** → Verify Root Directory = `backend`
3. **Check Build Command** = `npm install`
4. **Check Start Command** = `node server.js`
5. **Check Environment Variables** are all set
6. **Try Manual Deploy** button if needed

---

## 📋 Correct Configuration Checklist

- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] Runtime: `Node`
- [ ] Environment Variables:
  - [ ] `PORT=10000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=your_connection_string`
  - [ ] `CORS_ORIGIN=your_frontend_url`

---

**Need help?** Share the error message from the logs!

