# 🚀 Free Deployment Guide - FinancePro to financepro.life

Complete step-by-step guide to deploy your FinancePro app for FREE using GitHub.

## 📋 Prerequisites

✅ GitHub account (free)  
✅ Domain: financepro.life (you already have this)  
✅ MongoDB Atlas account (free tier)  
✅ 30 minutes of time  

---

## 🎯 Deployment Architecture (100% FREE)

1. **Frontend** → Vercel (FREE)
2. **Backend** → Render (FREE tier)
3. **ML API** → Render (FREE tier)
4. **Database** → MongoDB Atlas (FREE tier)

**Total Cost: $0/month**

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Create .gitignore (Already created)

The `.gitignore` file is already in place to exclude sensitive files.

### 1.2 Push Code to GitHub

```bash
# Navigate to project directory
cd "/Users/maligireddydineshreddy/Downloads/financeApp 2"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FinancePro app ready for deployment"

# Create repository on GitHub first, then:
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/financepro.git
git branch -M main
git push -u origin main
```

**OR use GitHub Desktop/VS Code Git extension for easier workflow**

---

## Step 2: Deploy Backend API (Render - FREE)

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (FREE)
3. Connect your GitHub account

### 2.2 Create Web Service

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository (`financepro`)
3. Configure:
   - **Name**: `financepro-backend`
   - **Region**: Singapore (closest to India)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: **FREE**

### 2.3 Set Environment Variables

Click **"Environment"** tab and add:

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string_here
CORS_ORIGIN=https://financepro.life,https://www.financepro.life
```

**Important**: Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string.

### 2.4 Deploy

Click **"Create Web Service"** - Deployment will start automatically.

**Note**: Copy the URL (e.g., `https://financepro-backend.onrender.com`) - you'll need it later.

⚠️ **Free Tier Limitation**: Service spins down after 15 min inactivity (first request takes ~30 seconds).

---

## Step 3: Deploy ML API (Render - FREE)

### 3.1 Create Another Web Service

1. Click **"New"** → **"Web Service"**
2. Select the same GitHub repository
3. Configure:
   - **Name**: `financepro-ml-api`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `ml`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **FREE**

### 3.2 Set Environment Variables

```env
PORT=10000
CORS_ORIGINS=https://financepro.life,https://www.financepro.life
```

### 3.3 Deploy

Click **"Create Web Service"** - Deployment will start.

**Note**: Copy the URL (e.g., `https://financepro-ml-api.onrender.com`) - you'll need it later.

⚠️ **Same limitation**: Spins down after inactivity.

---

## Step 4: Deploy Frontend (Vercel - FREE)

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (FREE)
3. Connect your GitHub account

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository (`financepro`)
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Set Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

```env
VITE_API_URL=https://financepro-backend.onrender.com/api
VITE_ML_API_URL=https://financepro-ml-api.onrender.com
```

**Important**: Replace with your actual Render backend and ML API URLs.

### 4.4 Deploy

Click **"Deploy"** - Deployment will start automatically.

**Note**: Copy the deployment URL (e.g., `https://financepro.vercel.app`).

---

## Step 5: Configure Custom Domain (financepro.life)

### 5.1 Frontend Domain (Vercel)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add domain: `financepro.life`
3. Add domain: `www.financepro.life`
4. Copy the DNS records shown

### 5.2 Configure DNS at Your Domain Registrar

Go to your domain registrar (where you bought financepro.life) and add DNS records:

#### For Main Domain (financepro.life):
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
```

#### For WWW (www.financepro.life):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**OR** if Vercel shows different values, use those.

**Wait 5-30 minutes** for DNS propagation.

### 5.3 (Optional) Backend Subdomain

If you want `api.financepro.life` for backend:

1. In Render → Your backend service → **Settings** → **Custom Domains**
2. Add `api.financepro.life`
3. Add DNS record:
```
Type: CNAME
Name: api
Value: your-backend-service.onrender.com
```

---

## Step 6: Update Environment Variables

After getting all deployment URLs:

### 6.1 Update Frontend (Vercel)

Update environment variables in Vercel:
```env
VITE_API_URL=https://financepro-backend.onrender.com/api
VITE_ML_API_URL=https://financepro-ml-api.onrender.com
```

**Redeploy** frontend after updating.

### 6.2 Update Backend (Render)

Update `CORS_ORIGIN`:
```env
CORS_ORIGIN=https://financepro.life,https://www.financepro.life
```

Service will restart automatically.

### 6.3 Update ML API (Render)

Update `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://financepro.life,https://www.financepro.life
```

Service will restart automatically.

---

## Step 7: MongoDB Atlas Configuration

### 7.1 Network Access

1. Go to MongoDB Atlas → **Network Access**
2. Ensure `0.0.0.0/0` is whitelisted (allows all IPs - OK for serverless)

### 7.2 Verify Connection String

Make sure your connection string in Render backend environment variables is correct.

---

## Step 8: Test Your Deployment

1. Visit `https://financepro.life` (wait for DNS if needed)
2. Test login/register
3. Test all features
4. Check browser console for any errors

---

## Step 9: (Optional) Keep Services Awake (Free Solution)

Render free tier spins down after 15 min. To keep services awake:

### Option A: Cron Job (Free)

Use [cron-job.org](https://cron-job.org) (free):

1. Create account
2. Add new cron job:
   - **URL**: `https://financepro-backend.onrender.com/api/users/health` (create a health endpoint)
   - **Schedule**: Every 10 minutes
3. Repeat for ML API

### Option B: Accept Cold Starts

First request after spin-down takes ~30 seconds. Subsequent requests are fast.

---

## 🎉 You're Done!

Your FinancePro app is now live at **financepro.life**!

### Your URLs:
- **Frontend**: `https://financepro.life`
- **Backend**: `https://financepro-backend.onrender.com`
- **ML API**: `https://financepro-ml-api.onrender.com`

---

## 🔧 Troubleshooting

### Issue: Services not connecting
- Check environment variables are set correctly
- Verify CORS origins match your domain
- Check MongoDB Atlas IP whitelist

### Issue: DNS not working
- Wait longer (can take up to 48 hours)
- Check DNS records are correct
- Use online DNS checker tools

### Issue: Cold starts on Render
- This is normal for free tier
- Consider cron-job.org to keep services awake
- Or upgrade to paid plan ($7/month per service)

---

## 📊 Cost Summary

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Vercel | **FREE** |
| Backend | Render (Free) | **FREE** |
| ML API | Render (Free) | **FREE** |
| Database | MongoDB Atlas (M0) | **FREE** |
| Domain | Your registrar | Already paid |
| **TOTAL** | | **$0/month** |

---

## 🔐 Security Reminders

1. ✅ Never commit `.env` files
2. ✅ Use environment variables in deployment platforms
3. ✅ Keep MongoDB connection string secret
4. ✅ Use HTTPS (automatic with Vercel/Render)
5. ✅ Regularly update dependencies

---

**Need Help?** Check deployment platform docs or GitHub Issues.

Good luck with your deployment! 🚀

