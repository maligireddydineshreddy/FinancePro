# 🔧 Fix MongoDB Connection Timeout

## ✅ Verified
- MONGODB_URI exists in Render ✅
- Password is correct ✅
- MongoDB cluster is running ✅
- Network access allows all IPs ✅

But still getting timeout error!

---

## 🎯 Solution: Increase Connection Timeout

The backend code has a 10-second timeout, which might be too short. Let's increase it.

---

## Step 1: Update Backend Connection Code

We need to update `backend/config/db.js` to increase the timeout.

### Current Code (in db.js):
```javascript
await mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 10000, // 10 seconds - might be too short
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
});
```

### Updated Code (increase timeouts):
```javascript
await mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000, // Increase to 30 seconds
});
```

---

## Step 2: Update the File

You need to update `backend/config/db.js`:

1. Go to GitHub → Your repository
2. Navigate to: `financepro-complete` → `backend` → `config` → `db.js`
3. Click edit (pencil icon)
4. Find the `mongoose.connect` call
5. Change:
   - `serverSelectionTimeoutMS: 10000` → `serverSelectionTimeoutMS: 30000`
   - `connectTimeoutMS: 10000` → `connectTimeoutMS: 30000`
6. Commit the changes

---

## Step 3: Alternative - Quick Test

Before changing code, let's try:

1. **Redeploy Backend** in Render:
   - Go to Render → Backend service → Events tab
   - Click "Manual Deploy" → "Deploy latest commit"
   - Sometimes a fresh deployment helps

2. **Wait and Test:**
   - Wait for deployment to complete
   - Try register/login again
   - Check if it works

---

## Step 4: Check Connection String Format

Also verify the connection string format in Render:

It should be exactly:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/databaseName?retryWrites=true&w=majority&appName=Cluster0
```

**Common issues:**
- Missing database name (should be `/financeApp` or your DB name)
- Missing `?retryWrites=true&w=majority`
- Extra spaces or line breaks
- Special characters in password need to be URL-encoded (e.g., `@` becomes `%40`)

---

## Step 5: Test MongoDB Connection Directly

To verify the connection string works:

1. Go to MongoDB Atlas → Clusters → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Make sure it matches what's in Render (with password replaced)

---

## 🔍 Debug Steps

If still not working, check Render logs for:

1. Does it show: `✅ Database Connected Successfully!!`?
   - If yes: Connection works, issue is elsewhere
   - If no: Connection still failing

2. Any other error messages in logs?

---

## ✅ Try This First

**Before changing code, try:**
1. Redeploy backend in Render (Events → Manual Deploy)
2. Wait 2-3 minutes
3. Test register/login again

If that doesn't work, then update the timeout settings.

---

**Try redeploying first, then let me know if it still times out!**

