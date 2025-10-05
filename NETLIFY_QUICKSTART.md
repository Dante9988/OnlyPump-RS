# 🚀 Netlify Quick Start

**5-Minute Setup Guide for OnlyPump on Netlify**

## Step 1: Get Your Helius API Key (2 min)

1. Go to https://dev.helius.xyz/
2. Sign up (free)
3. Create a new project
4. Copy your API key

## Step 2: Connect to Netlify (1 min)

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`

## Step 3: Set Environment Variables (2 min)

Go to **Site settings** → **Environment variables** → **Add a variable**

Add these 3 variables:

### Variable 1: Backend API
```
Key: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.com
(or http://localhost:3001 for testing)
```

### Variable 2: Solana RPC
```
Key: NEXT_PUBLIC_SOLANA_RPC_URL
Value: https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY
✓ Mark as sensitive
```

### Variable 3: Helius API Key
```
Key: NEXT_PUBLIC_HELIUS_API_KEY
Value: YOUR_HELIUS_KEY
✓ Mark as sensitive
```

## Step 4: Deploy! (30 sec)

Click **Deploy site** and wait for build to complete.

---

## ✅ Verification

After deployment:
1. Open your site URL
2. Open browser console (F12)
3. Try connecting a wallet
4. Create a test token

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Netlify dashboard
- Verify `frontend/package.json` exists
- Ensure base directory is set to `frontend`

**Environment variables not working?**
- Redeploy after adding variables
- Check variable names (must start with `NEXT_PUBLIC_`)
- Verify no typos in variable names

**Can't connect wallet?**
- Check browser console for errors
- Verify Helius API key is valid
- Test RPC endpoint directly

---

## 📚 Full Documentation

- [Complete Netlify Guide](./NETLIFY_DEPLOYMENT.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Main README](./README.md)

---

## 🎯 Next Steps

1. **Deploy Backend**: Use Railway, Fly.io, or DigitalOcean
2. **Update API URL**: Set `NEXT_PUBLIC_API_URL` to your backend
3. **Test Production**: Create a token on mainnet
4. **Monitor**: Check Helius dashboard for usage

---

**Need help?** Check the [full deployment guide](./NETLIFY_DEPLOYMENT.md)
