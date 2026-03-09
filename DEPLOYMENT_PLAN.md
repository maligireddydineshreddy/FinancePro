# 🚀 Production Deployment Plan - Finance App

## Overview
This guide will help you deploy your Finance App to production with a custom domain.

## Architecture
- **Frontend**: React/Vite (Static site)
- **Backend**: Node.js/Express API
- **ML API**: Python/FastAPI
- **Database**: MongoDB Atlas (Already cloud-hosted)

## Recommended Deployment Platforms

### Option 1: Vercel + Railway + Railway (Recommended)
- **Frontend**: Vercel (Free tier, excellent for React)
- **Backend**: Railway (Simple Node.js deployment)
- **ML API**: Railway (Python support)
- **Cost**: ~$5-20/month (Free tiers available)

### Option 2: Netlify + Render + Render
- **Frontend**: Netlify (Free tier)
- **Backend**: Render (Free tier with limitations)
- **ML API**: Render
- **Cost**: Free for small traffic, $7+/month for production

### Option 3: All-in-one (DigitalOcean/Railway)
- **Frontend**: Static hosting
- **Backend**: Same platform
- **ML API**: Same platform
- **Cost**: $12-20/month

## Step-by-Step Deployment

### Phase 1: Prepare Code for Production

#### 1.1 Environment Variables Setup
Create `.env` files for each service (see below)

#### 1.2 Update API URLs
Replace all hardcoded `localhost` URLs with environment variables

#### 1.3 Security Updates
- Move MongoDB credentials to environment variables
- Update CORS to use your domain
- Add rate limiting
- Enable HTTPS

### Phase 2: Deploy Services

#### 2.1 Deploy Backend (Railway/Render)
1. Create account on Railway or Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy
5. Get backend URL (e.g., `https://api.yourdomain.com`)

#### 2.2 Deploy ML API (Railway/Render)
1. Same platform or different
2. Connect repository
3. Configure Python build
4. Set environment variables
5. Deploy
6. Get ML API URL (e.g., `https://ml-api.yourdomain.com`)

#### 2.3 Deploy Frontend (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables for API URLs
6. Deploy
7. Get frontend URL

### Phase 3: Domain Configuration

#### 3.1 Point Domain to Services
- **Frontend**: Point `yourdomain.com` and `www.yourdomain.com` to Vercel/Netlify
- **Backend**: Create subdomain `api.yourdomain.com` → Railway/Render
- **ML API**: Create subdomain `ml-api.yourdomain.com` → Railway/Render

#### 3.2 SSL Certificates
- Vercel/Netlify: Automatic SSL
- Railway/Render: Usually automatic, may need to configure

### Phase 4: Final Configuration

#### 4.1 Update CORS
Update backend and ML API CORS to allow your domain

#### 4.2 MongoDB Atlas
- Whitelist deployment server IPs (or use 0.0.0.0/0 for serverless)
- Verify connection string uses environment variable

#### 4.3 Testing
- Test all features on production
- Verify API connections
- Check SSL/HTTPS

## Estimated Costs

### Free Tier (Good for testing)
- Frontend: Free (Vercel/Netlify)
- Backend: Free (Render) or $5/month (Railway)
- ML API: Free (Render) or $5/month (Railway)
- Domain: $10-15/year
- MongoDB Atlas: Free tier available
- **Total: $10-15/year + $0-10/month**

### Production Tier (Recommended)
- Frontend: Free or $20/month (Vercel Pro)
- Backend: $20/month (Railway/Render)
- ML API: $20/month (Railway/Render)
- Domain: $10-15/year
- MongoDB Atlas: Free tier or $9/month
- **Total: ~$50-70/month**

## Next Steps

1. Review and implement the environment variable changes
2. Choose your deployment platform
3. Deploy backend first (test API)
4. Deploy ML API (test endpoints)
5. Deploy frontend (connect to APIs)
6. Configure domain
7. Test everything
8. Monitor and optimize

## Files to Create

1. `.env.example` files for each service
2. `vercel.json` or `netlify.toml` for frontend
3. `railway.json` or `render.yaml` for backend/ML API
4. `Dockerfile` (optional, for containerization)

See implementation steps in the code changes below.

