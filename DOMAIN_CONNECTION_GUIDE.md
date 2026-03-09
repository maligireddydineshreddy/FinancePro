# 🌐 Connect financepro.life Domain - Complete Guide

Step-by-step guide to connect your `financepro.life` domain to your deployed FinancePro app.

---

## ⚠️ Important: Deploy First!

**Before connecting your domain, you must deploy your app to:**
- Frontend → Vercel (for financepro.life)
- Backend → Render (for API)
- ML API → Render (for ML services)

**If you haven't deployed yet**, follow `DEPLOYMENT_STEPS.md` first, then come back here.

---

## 🎯 Step-by-Step Domain Connection

### Step 1: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `financepro` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_ML_API_URL=https://your-ml-api.onrender.com
   ```
7. Click **"Deploy"**
8. Wait for deployment to complete
9. **Note your Vercel deployment URL** (e.g., `financepro.vercel.app`)

---

### Step 2: Add Domain to Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter: `financepro.life`
5. Click **"Add"**
6. Vercel will show you DNS configuration

---

### Step 3: Configure DNS at Your Domain Registrar

You need to add DNS records where you bought `financepro.life` (like Namecheap, GoDaddy, Google Domains, etc.)

#### Option A: Using A Record (Recommended for root domain)

1. Go to your domain registrar's DNS settings
2. Find DNS Management / DNS Records section
3. Add these records:

**For Main Domain (financepro.life):**
```
Type: A
Name: @ (or leave blank/root)
Value: 76.76.21.21
TTL: Auto (or 3600)
```

**For WWW (www.financepro.life):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

#### Option B: Using CNAME (Alternative)

If your registrar supports CNAME for root domain:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**OR** use Vercel's specific CNAME shown in the Vercel dashboard.

---

### Step 4: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours**
- Usually completes within **15-30 minutes**
- You can check status in Vercel dashboard

**Check DNS Status:**
- Vercel will show "Valid Configuration" when DNS is correct
- Use online tools like `whatsmydns.net` to check propagation

---

### Step 5: Verify Domain Connection

1. Wait for Vercel to verify (check Vercel dashboard)
2. Once verified, visit: `https://financepro.life`
3. Your site should load!

---

### Step 6: Configure HTTPS (Automatic)

✅ **Vercel automatically provides HTTPS/SSL certificates**
- No additional setup needed
- SSL certificate is issued automatically
- Your site will be accessible via `https://financepro.life`

---

## 🔧 Optional: Backend Subdomain (api.financepro.life)

If you want a custom subdomain for your backend API:

### Step 1: Deploy Backend to Render

1. Follow deployment guide for backend
2. Get your Render backend URL (e.g., `financepro-backend.onrender.com`)

### Step 2: Add Custom Domain in Render

1. Go to Render dashboard → Your backend service
2. Go to **Settings** → **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter: `api.financepro.life`
5. Render will show DNS configuration

### Step 3: Add DNS Record

At your domain registrar, add:

```
Type: CNAME
Name: api
Value: your-backend-service.onrender.com
TTL: Auto
```

---

## 📋 Common Domain Registrars - Quick Links

### Namecheap
1. Log in → Domain List
2. Click **"Manage"** next to financepro.life
3. Go to **"Advanced DNS"** tab
4. Add DNS records

### GoDaddy
1. Log in → My Products
2. Click **"DNS"** next to financepro.life
3. Click **"Add"** to add records

### Google Domains
1. Log in → My Domains
2. Click financepro.life
3. Go to **"DNS"** section
4. Add records

### Cloudflare
1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Add DNS records in Cloudflare dashboard

---

## ✅ Verification Checklist

- [ ] Frontend deployed to Vercel
- [ ] Domain added in Vercel dashboard
- [ ] DNS records added at registrar
- [ ] DNS propagation completed (check status)
- [ ] Domain verified in Vercel (shows "Valid Configuration")
- [ ] Site accessible at `https://financepro.life`
- [ ] HTTPS working (automatic)

---

## 🔍 Troubleshooting

### Issue: "Domain not verified" in Vercel
**Solution**: 
- Check DNS records are correct
- Wait longer for DNS propagation
- Verify record values match Vercel's requirements

### Issue: "Site not loading"
**Solution**:
- Check DNS propagation status
- Verify Vercel deployment is successful
- Clear browser cache
- Try accessing from different network

### Issue: "Invalid DNS configuration"
**Solution**:
- Double-check DNS record values
- Make sure record types are correct (A or CNAME)
- Remove conflicting DNS records
- Wait 5-10 minutes and check again

### Issue: "SSL Certificate error"
**Solution**:
- Wait for Vercel to automatically issue SSL (can take a few minutes)
- Make sure domain is properly verified
- Check that DNS is pointing to Vercel

---

## 🎯 Quick Summary

1. **Deploy** frontend to Vercel (via GitHub)
2. **Add domain** in Vercel dashboard (financepro.life)
3. **Add DNS records** at your registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
4. **Wait** for DNS propagation (5-30 minutes)
5. **Visit** `https://financepro.life` - it works! 🎉

---

## 💡 Pro Tips

- **Keep Vercel dashboard open** to see domain status in real-time
- **Use `dig` or `nslookup`** to check DNS resolution
- **Test with `whatsmydns.net`** to see global DNS propagation
- **HTTPS is automatic** - no manual SSL setup needed
- **Vercel handles renewals** - SSL certificates auto-renew

---

**Need Help?** Check Vercel's domain documentation or contact support!

