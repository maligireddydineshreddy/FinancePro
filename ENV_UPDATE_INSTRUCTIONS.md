# 📝 Update .env File - Step by Step

## 🎯 What to Update

In the `backend/.env` file, find this line:

```
MONGODB_URI=mongodb+srv://maligireddydineshreddy_db_user:n2HCZ24yafy7Ildg@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

**Replace it with:**

```
MONGODB_URI=mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

**What changed:** The password from `n2HCZ24yafy7Ildg` to `Din47788`

---

## 📋 Steps in Finder

### Step 1: Show Hidden Files (if .env is not visible)

1. In Finder, press **`Cmd + Shift + .`** (Command + Shift + Period)
2. This shows hidden files (files starting with `.`)

### Step 2: Open .env File

1. Double-click **`.env`** file
2. It will open in **TextEdit**

### Step 3: Update the Connection String

1. Find the line with `MONGODB_URI=`
2. Replace the password part:
   - **OLD:** `n2HCZ24yafy7Ildg`
   - **NEW:** `Din47788`
3. Make sure the full line is:
   ```
   MONGODB_URI=mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 4: Save

1. Press **`Cmd + S`** to save
2. Close TextEdit

### Step 5: Restart Backend

After saving, restart the backend:

```bash
# Kill existing backend
pkill -f "node server.js"

# Start backend again
cd "/Users/maligireddydineshreddy/Downloads/financeApp 2/backend"
node server.js
```

---

## ✅ Verify It Worked

After restarting, check the logs. You should see:
```
✅ Database Connected Successfully!!
```

If you see this, the connection works! ✅

---

**Update the password in .env file and restart backend!**

