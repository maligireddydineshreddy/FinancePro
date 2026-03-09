# 📝 Update backend/.env File Manually

## ✅ Correct MongoDB Connection String

The connection string you provided is missing the database name. Use this complete version:

```
MONGODB_URI=mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🎯 Steps to Update

1. **Open** `backend/.env` file in a text editor

2. **Find** the line starting with `MONGODB_URI=`

3. **Replace** it with:
   ```
   MONGODB_URI=mongodb+srv://maligireddydineshreddy_db_user:Din47788@cluster0.ty1bowt.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
   ```

4. **Save** the file

5. **Restart backend:**
   ```bash
   pkill -f "node server.js"
   cd backend
   node server.js
   ```

---

**After updating, the login should work!**

