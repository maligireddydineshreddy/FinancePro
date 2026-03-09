# ✅ Domain Connection Checklist - Step by Step

Follow this checklist and I'll help you with each step!

---

## 📋 Pre-Deployment Checklist

Before connecting your domain, ensure:

- [ ] ✅ Code is on GitHub (You've done this!)
- [ ] Backend deployed to Render
- [ ] ML API deployed to Render  
- [ ] Frontend deployed to Vercel
- [ ] All services are running

---

## 🚀 STEP-BY-STEP PROCESS

### Part 1: Deploy Backend to Render

#### Step 1.1: Go to Render
- [ ] Visit: https://render.com
- [ ] Sign in with GitHub

#### Step 1.2: Create Web Service
- [ ] Click "New" → "Web Service"
- [ ] Connect your `financepro` GitHub repository
- [ ] Configure:
  - Name: `financepro-backend`
  - Region: Singapore
  - Branch: `main`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Plan: **FREE**

#### Step 1.3: Add Environment Variables
- [ ] Click "Environment" tab
- [ ] Add these variables:
  ```
  PORT=10000
  NODE_ENV=production
  MONGODB_URI=your_mongodb_connection_string
  CORS_ORIGIN=https://financepro.life,https://www.financepro.life
  ```
- [ ] Replace `your_mongodb_connection_string` with your actual MongoDB URI

#### Step 1.4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (takes 2-5 minutes)
- [ ] **Copy the URL** (e.g., `https://financepro-backend.onrender.com`)

---

### Part 2: Deploy ML API to Render

#### Step 2.1: Create Another Web Service
- [ ] Click "New" → "Web Service" again
- [ ] Connect same `financepro` repository
- [ ] Configure:
  - Name: `financepro-ml-api`
  - Region: Singapore
  - Branch: `main`
  - Root Directory: `ml`
  - Runtime: `Python 3`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
  - Plan: **FREE**

#### Step 2.2: Add Environment Variables
- [ ] Add:
  ```
  PORT=10000
  CORS_ORIGINS=https://financepro.life,https://www.financepro.life
  ```

#### Step 2.3: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment
- [ ] **Copy the URL** (e.g., `https://financepro-ml-api.onrender.com`)

---

### Part 3: Deploy Frontend to Vercel

#### Step 3.1: Go to Vercel
- [ ] Visit: https://vercel.com
- [ ] Sign in with GitHub

#### Step 3.2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select your `financepro` repository
- [ ] Configure:
  - Framework Preset: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

#### Step 3.3: Add Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add:
  ```
  VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
  VITE_ML_API_URL=https://YOUR_ML_API_URL.onrender.com
  ```
- [ ] Replace with your actual Render URLs from Steps 1.4 and 2.3

#### Step 3.4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Note your Vercel URL (e.g., `financepro.vercel.app`)

---

### Part 4: Connect Domain (financepro.life)

#### Step 4.1: Add Domain in Vercel
- [ ] Go to your Vercel project
- [ ] Click "Settings" → "Domains"
- [ ] Click "Add Domain"
- [ ] Enter: `financepro.life`
- [ ] Click "Add"
- [ ] Vercel will show DNS records needed

#### Step 4.2: Go to Your Domain Registrar
Where did you buy financepro.life?
- [ ] Namecheap
- [ ] GoDaddy
- [ ] Google Domains
- [ ] Other: ___________

#### Step 4.3: Add DNS Records
**In your registrar's DNS settings, add:**

**Record 1:**
- Type: `A`
- Name: `@` (or leave blank/root)
- Value: `76.76.21.21` (or what Vercel shows)
- TTL: Auto

**Record 2:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com` (or what Vercel shows)
- TTL: Auto

#### Step 4.4: Wait
- [ ] Save DNS records
- [ ] Wait 5-30 minutes
- [ ] Check Vercel dashboard for "Valid Configuration"

---

## 🎉 Verification

- [ ] Visit: `https://financepro.life`
- [ ] Site loads successfully
- [ ] All features work

---

## 📞 Need Help?

**Tell me:**
1. Which step are you on?
2. What error messages do you see?
3. Which registrar did you use?
4. Any specific issues?

I'll help you troubleshoot!

