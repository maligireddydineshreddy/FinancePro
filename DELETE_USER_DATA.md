# 🗑️ Delete User Data from Database

## ✅ Methods to Delete User Data

You can delete a user's data in several ways:

---

## Method 1: Delete via MongoDB Atlas (Easiest)

### Step 1: Go to MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Sign in
3. Click **"Browse Collections"** (left sidebar)

### Step 2: Find the User

1. Select your cluster
2. Select database: `financeApp`
3. Select collection: `users`
4. You'll see a list of all users
5. Find the user you want to delete (by email or name)

### Step 3: Delete the User

1. Click on the user document (row)
2. Click the **trash icon** (🗑️) at the top
3. Confirm deletion

**Note:** This only deletes the user document. Associated data (expenses, savings, bills) will remain but won't be linked to anyone.

---

## Method 2: Delete User and All Associated Data

To delete the user AND all their expenses, savings, and bills:

### Option A: Via MongoDB Atlas

1. Go to **Browse Collections**
2. Delete from these collections:
   - `users` - Find and delete the user
   - `expenses` - Delete all documents where `userId` matches
   - `savings` - Delete all documents where `userId` matches
   - `bills` - Delete all documents where `userId` matches

### Option B: Using MongoDB Compass (Desktop App)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect using your MongoDB connection string
3. Navigate to `financeApp` database
4. For each collection (`users`, `expenses`, `savings`, `bills`):
   - Filter by user email or userId
   - Select all matching documents
   - Delete

---

## Method 3: Delete via API/Code (Advanced)

I can create a script to delete a user and all their data. Would you like me to create one?

---

## ⚠️ Important Notes

1. **Backup First:** Consider backing up your database before deleting
2. **Associated Data:** Deleting a user doesn't automatically delete their expenses, savings, or bills
3. **Irreversible:** Deletion is permanent - data cannot be recovered

---

## 📋 Quick Steps Summary

**Easiest way:**
1. MongoDB Atlas → Browse Collections
2. Database: `financeApp` → Collection: `users`
3. Find user → Click trash icon → Confirm

---

**Which method would you like to use? I can guide you through any of them!**

