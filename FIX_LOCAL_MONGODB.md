# 🔧 Fix Local MongoDB Connection

## ❌ Problem
- Local backend showing: `bad auth : authentication failed`
- MongoDB password in local `.env` file is wrong

---

## ✅ Solution: Update Local .env File

### Step 1: Get Correct Connection String

Use the **same connection string** that works on Render:

```
mongodb+srv://maligireddydineshreddy_db_user:YOUR_CORRECT_PASSWORD@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

Replace `YOUR_CORRECT_PASSWORD` with the password you set in MongoDB Atlas (the one that works on Render).

---

### Step 2: Update backend/.env File

1. Open: `backend/.env`
2. Find the line: `MONGODB_URI=...`
3. Replace it with the correct connection string (with correct password)
4. Save the file

---

### Step 3: Restart Backend

After updating .env:

1. Kill the backend process
2. Restart it

Or use these commands:
```bash
# Kill backend
pkill -f "node server.js"

# Restart backend
cd backend
node server.js
```

---

## ✅ Alternative: Use Render Connection String

If you're not sure about the password, you can:

1. Go to **Render Dashboard** → Backend service → **Environment** tab
2. Copy the `MONGODB_URI` value (it should have the correct password)
3. Paste it in your local `backend/.env` file
4. Restart backend

---

**Update the MongoDB password in backend/.env file with the correct password!**

