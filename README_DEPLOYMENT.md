# 🚀 Quick Start Deployment Guide

## Fastest Way to Deploy FinancePro (FREE)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/financepro.git
git push -u origin main
```

### 2. Deploy Backend (Render - 5 min)
- Go to render.com → New Web Service
- Connect GitHub repo
- Root: `backend`
- Build: `npm install`
- Start: `node server.js`
- Add env vars: `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, `NODE_ENV=production`

### 3. Deploy ML API (Render - 5 min)
- New Web Service, same repo
- Root: `ml`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- Add env vars: `PORT`, `CORS_ORIGINS`

### 4. Deploy Frontend (Vercel - 3 min)
- Go to vercel.com → New Project
- Connect GitHub repo
- Root: `frontend`
- Build: `npm run build`
- Output: `dist`
- Add env vars: `VITE_API_URL`, `VITE_ML_API_URL`

### 5. Add Domain (5 min)
- Vercel → Settings → Domains → Add `financepro.life`
- Update DNS at your registrar
- Wait 5-30 min

### 6. Update CORS
- Update `CORS_ORIGIN` in backend with your domain
- Update `CORS_ORIGINS` in ML API with your domain

**Done!** Your app is live at `https://financepro.life`

📖 **Full detailed guide**: See `DEPLOYMENT_STEPS.md`

