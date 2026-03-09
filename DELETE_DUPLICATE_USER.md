# 🗑️ Delete Duplicate User - Step by Step

## 🎯 Goal
- **DELETE:** User with password `Din477788` (works locally)
- **KEEP:** User with password `Din47788` (works on website)
- Email: `maligireddydineshreddy@gmail.com`

---

## ⚠️ Important Note
In MongoDB, each email should be unique. If you see two accounts with the same email, one might have:
- Different password hash
- Different _id
- Created at different times

---

## 🎯 Step-by-Step: Delete the Wrong User

### Step 1: Find the User in MongoDB Atlas

1. You're already in MongoDB Atlas → Data Explorer → `financeApp.users`
2. You should see a list of users

### Step 2: Identify the Correct User to Keep

**KEEP THIS ONE:**
- Email: `maligireddydineshreddy@gmail.com`
- Password: `Din47788` (works on website)
- This is the one you want to **KEEP**

**DELETE THIS ONE:**
- Email: `maligireddydineshreddy@gmail.com` (same email, different password)
- Password: `Din477788` (works locally)
- This is the one you want to **DELETE**

### Step 3: Identify by Password Hash

Since passwords are hashed, look for:
- The user that works with `Din47788` should have a bcrypt hash starting with `$2b$10$...`
- The user that works with `Din477788` should have a different hash

**OR** you can identify by:
- **Created date** - The newer one might be the duplicate
- **Look for "Maligireddy"** in the name field

### Step 4: Delete the Wrong User

1. Click on the user document (the one with password `Din477788`)
2. Look for the **trash icon** (🗑️) on the right side of the document
3. Click the trash icon
4. Confirm deletion

---

## 🔍 Alternative: Use Filter to Find User

If you can't tell which is which:

1. In the **Filter** box, type:
   ```
   { "email": "maligireddydineshreddy@gmail.com" }
   ```
2. Click **Apply**
3. This will show ONLY users with that email
4. You should see 1 or 2 users
5. Delete the one that matches password `Din477788`

---

## ✅ After Deletion

1. **Refresh** the page
2. The user with password `Din477788` should be gone
3. Only the user with password `Din47788` should remain
4. Test login with:
   - Email: `maligireddydineshreddy@gmail.com`
   - Password: `Din47788`
   - Should work on both local AND website now! ✅

---

**Find the user with password Din477788 and delete it using the trash icon!**

