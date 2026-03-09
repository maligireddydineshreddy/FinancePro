# 🚀 Complete Deployment Guide - Finance App

## Overview
This guide will walk you through deploying your Finance App to production with a custom domain.

## Prerequisites
- ✅ Domain name purchased
- ✅ GitHub account
- ✅ MongoDB Atlas account (already configured)
- ✅ Accounts on deployment platforms (Vercel/Netlify, Railway/Render)

---

## Step 1: Prepare Environment Variables

### Frontend (.env file in `frontend/` directory)
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_ML_API_URL=https://ml-api.yourdomain.com
```

### Backend (.env file in `backend/` directory)
```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://someshrocks144:somesh2004@cluster0.gs6wg.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### ML API (.env file in `ml/` directory)
```env
PORT=8001
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SENTIMENT_MODEL_SIZE=small
```

---

## Step 2: Deploy Backend API (Railway or Render)

### Option A: Railway (Recommended)

1. **Create Account**: Go to [railway.app](https://railway.app) and sign up
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your finance app repository
4. **Configure Service**:
   - Root Directory: `backend`
   - Build Command: (leave empty, Railway auto-detects Node.js)
   - Start Command: `npm start` (update package.json to use `node server.js` in production)
5. **Environment Variables**:
   - Click on the service → Variables
   - Add all variables from `backend/env.example`
   - Update `CORS_ORIGIN` with your domain
6. **Deploy**: Railway will automatically deploy
7. **Get URL**: Copy the generated URL (e.g., `https://your-backend.railway.app`)
8. **Custom Domain** (Optional): Add custom domain `api.yourdomain.com`

### Option B: Render

1. **Create Account**: Go to [render.com](https://render.com) and sign up
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repository**: Connect your GitHub repository
4. **Configure**:
   - Name: `finance-app-backend`
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. **Environment Variables**: Add all from `backend/env.example`
6. **Deploy**: Click "Create Web Service"
7. **Custom Domain**: Add `api.yourdomain.com` in Settings → Custom Domain

**Update package.json for production:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## Step 3: Deploy ML API (Railway or Render)

### Railway

1. **Add Service**: In your Railway project, click "+ New" → "GitHub Repo"
2. **Configure**:
   - Root Directory: `ml`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**: Add from `ml/env.example`
4. **Python Version**: Railway auto-detects, but set `PYTHON_VERSION=3.13` if needed
5. **Deploy**: Auto-deploys on push
6. **Get URL**: Copy the URL (e.g., `https://ml-api.railway.app`)
7. **Custom Domain**: Add `ml-api.yourdomain.com`

### Render

1. **New Web Service**: Similar to backend setup
2. **Configure**:
   - Root Directory: `ml`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**: Add from `ml/env.example`
4. **Deploy**: Create and deploy
5. **Custom Domain**: Add `ml-api.yourdomain.com`

---

## Step 4: Deploy Frontend (Vercel - Recommended)

1. **Create Account**: Go to [vercel.com](https://vercel.com) and sign up
2. **New Project**: Click "Add New" → "Project"
3. **Import Repository**: Select your GitHub repository
4. **Configure Project**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://api.yourdomain.com/api` (or your backend URL)
   - `VITE_ML_API_URL`: `https://ml-api.yourdomain.com` (or your ML API URL)
6. **Deploy**: Click "Deploy"
7. **Custom Domain**:
   - Go to Project Settings → Domains
   - Add `yourdomain.com` and `www.yourdomain.com`
   - Update DNS records as instructed

### Alternative: Netlify

1. **Create Account**: Go to [netlify.com](https://netlify.com)
2. **New Site**: "Add new site" → "Import an existing project"
3. **Configure**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables**: Add the same variables as Vercel
5. **Custom Domain**: Add domain in Site settings → Domain management

---

## Step 5: Configure DNS Records

In your domain registrar's DNS settings, add:

### For Vercel/Netlify (Frontend)
- **Type**: A or CNAME
- **Name**: `@` (or root)
- **Value**: Vercel/Netlify provided IP or domain
- **Name**: `www`
- **Value**: Vercel/Netlify provided domain

### For Railway/Render (Backend & ML API)
- **Type**: CNAME
- **Name**: `api`
- **Value**: Your backend service URL
- **Name**: `ml-api`
- **Value**: Your ML API service URL

**Wait 5-30 minutes** for DNS propagation.

---

## Step 6: Update Environment Variables

After getting your actual deployment URLs:

1. **Update Frontend**:
   - Go to Vercel/Netlify dashboard
   - Update `VITE_API_URL` and `VITE_ML_API_URL` with actual URLs
   - Redeploy

2. **Update Backend**:
   - Update `CORS_ORIGIN` with your frontend domain
   - Restart service

3. **Update ML API**:
   - Update `CORS_ORIGINS` with your frontend domain
   - Restart service

---

## Step 7: MongoDB Atlas Configuration

1. **Network Access**: 
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is whitelisted (allows all IPs - OK for serverless)

2. **Database User**: Verify credentials are correct

---

## Step 8: Test Everything

1. **Frontend**: Visit `https://yourdomain.com`
2. **Register**: Create a test account
3. **Login**: Test authentication
4. **Features**: Test all features (expenses, bills, stocks, etc.)
5. **APIs**: Check browser console for any CORS or API errors

---

## Step 9: Production Checklist

- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] MongoDB Atlas accessible
- [ ] SSL/HTTPS enabled (automatic on Vercel/Netlify/Railway/Render)
- [ ] Custom domains configured
- [ ] All features tested
- [ ] Error handling working
- [ ] Performance optimized

---

## Troubleshooting

### CORS Errors
- Check CORS_ORIGIN/CORS_ORIGINS includes your frontend domain
- Ensure no trailing slashes
- Check browser console for exact error

### API Not Responding
- Check service logs in deployment platform
- Verify environment variables
- Check service status

### MongoDB Connection Issues
- Verify MongoDB Atlas Network Access allows all IPs
- Check connection string in environment variables
- Check service logs for connection errors

### Build Failures
- Check build logs in deployment platform
- Verify all dependencies in package.json/requirements.txt
- Check for missing environment variables

---

## Cost Estimation

### Free Tier (Good for testing)
- Frontend (Vercel): Free
- Backend (Render): Free (with limitations)
- ML API (Render): Free (with limitations)
- MongoDB Atlas: Free tier
- Domain: $10-15/year
- **Total: ~$10-15/year**

### Production Tier
- Frontend (Vercel): Free or $20/month (Pro)
- Backend (Railway): $5-20/month
- ML API (Railway): $5-20/month
- MongoDB Atlas: Free or $9/month
- Domain: $10-15/year
- **Total: ~$20-70/month**

---

## Next Steps

1. Set up monitoring (Sentry, LogRocket, etc.)
2. Add analytics (Google Analytics, Plausible)
3. Set up CI/CD for automatic deployments
4. Add rate limiting to APIs
5. Implement caching
6. Set up backup strategy for MongoDB

---

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test API endpoints directly (curl/Postman)
4. Check browser console for frontend errors
5. Review this guide step-by-step

Good luck with your deployment! 🚀

