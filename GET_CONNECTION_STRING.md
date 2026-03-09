# 🔗 Get the Correct MongoDB Connection String

## Problem
The connection string in your `.env` file might not match your actual cluster.

## Solution: Get Connection String from MongoDB Atlas

### Step 1: Open Your Cluster
1. In MongoDB Atlas, go to **"Clusters"** (left sidebar)
2. You should see your **"Cluster0"**

### Step 2: Click Connect
1. Click the **"Connect"** button on your Cluster0 card
2. A popup/dialog will appear with connection options

### Step 3: Choose Connection Method
1. Select **"Connect your application"**
2. Choose driver: **"Node.js"**
3. Choose version: **"5.5 or later"** (or latest)

### Step 4: Copy Connection String
You'll see a connection string like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 5: Update Connection String
1. **Replace `<username>`** with: `someshrocks144`
2. **Replace `<password>`** with: `somesh2004`
3. **Add database name**: Before the `?`, add `/financeApp`
   - So it becomes: `...mongodb.net/financeApp?retryWrites=true...`

### Step 6: Update .env File
1. Open `backend/.env` file
2. Update the `MONGODB_URI` line with your corrected connection string:
   ```
   MONGODB_URI=mongodb+srv://someshrocks144:somesh2004@cluster0.xxxxx.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
   ```
3. **Important**: Replace `xxxxx` with whatever is in your actual connection string

### Step 7: Restart Backend
```bash
cd backend
npm start
```

### Step 8: Test
Try registering in your app again!

---

## Example

If MongoDB Atlas gives you:
```
mongodb+srv://<username>:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
```

Your `.env` file should have:
```
MONGODB_URI=mongodb+srv://someshrocks144:somesh2004@cluster0.abc12.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

---

## Current Connection String (Check if this matches)

Your current connection string uses:
- Cluster: `cluster0.gs6wg.mongodb.net`

**Verify this matches** what MongoDB Atlas shows when you click "Connect" → "Connect your application".

If it's different, update your `.env` file!

