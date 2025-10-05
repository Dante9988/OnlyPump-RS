# Netlify Deployment Guide

This guide covers deploying the OnlyPump frontend to Netlify with proper environment variable configuration.

## 📋 Prerequisites

- Netlify account (free tier works)
- GitHub/GitLab repository with your code
- Helius API key for Solana RPC
- Backend deployed separately (Netlify only hosts the frontend)

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the correct structure:
```
backend-rs/
├── frontend/          # This is what Netlify will deploy
│   ├── package.json
│   ├── next.config.js
│   ├── app/
│   ├── components/
│   └── public/
│       └── test_pump.json  # Your 215 vanity addresses
└── ...
```

### 2. Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select your repository
5. Configure build settings:

**Build Settings:**
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

### 3. Configure Environment Variables

Go to **Site settings** → **Environment variables** → **Add a variable**

#### Required Environment Variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://your-backend.com` or `http://localhost:3001` for dev |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Helius RPC endpoint | `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY` |
| `NEXT_PUBLIC_HELIUS_API_KEY` | Helius API key for transaction history | `your-helius-api-key-here` |
| `NEXT_PUBLIC_RPC_ENDPOINT` | (Optional) Custom RPC endpoint | `https://api.mainnet-beta.solana.com` |

#### How to Add Environment Variables in Netlify:

**Method 1: Via Netlify UI**
1. Go to your site dashboard
2. Click **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Enter variable name (e.g., `NEXT_PUBLIC_SOLANA_RPC_URL`)
5. Enter variable value
6. Select scope: **All scopes** or specific deploy contexts
7. Click **Create variable**
8. Repeat for all variables

**Method 2: Via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your site
netlify link

# Set environment variables
netlify env:set NEXT_PUBLIC_API_URL "https://your-backend.com"
netlify env:set NEXT_PUBLIC_SOLANA_RPC_URL "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
netlify env:set NEXT_PUBLIC_HELIUS_API_KEY "your-helius-api-key"
```

**Method 3: Via netlify.toml**
```toml
# netlify.toml in your repository root
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://your-backend.com"
  # Note: Don't put sensitive keys in netlify.toml if it's public!
  # Use Netlify UI for sensitive values
```

### 4. Deploy Context-Specific Variables

You can set different variables for different deploy contexts:

- **Production**: Live site (main branch)
- **Deploy Previews**: Pull request previews
- **Branch deploys**: Specific branch deployments

**Example:**
```bash
# Production only
netlify env:set NEXT_PUBLIC_API_URL "https://api.onlypump.com" --context production

# Deploy previews (for testing)
netlify env:set NEXT_PUBLIC_API_URL "https://staging-api.onlypump.com" --context deploy-preview

# Branch deploys
netlify env:set NEXT_PUBLIC_API_URL "http://localhost:3001" --context branch-deploy
```

### 5. Verify Environment Variables

After adding variables:
1. Go to **Site settings** → **Environment variables**
2. Verify all variables are listed
3. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

## 🔒 Security Best Practices

### ✅ DO:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Store API keys in Netlify environment variables (not in code)
- Use different keys for production vs. development
- Rotate API keys regularly
- Use Netlify's "Sensitive variable" option for secrets

### ❌ DON'T:
- Commit `.env.local` files to Git
- Share API keys in public repositories
- Use production keys in development
- Hardcode sensitive values in code

## 📝 Example .env.local (Local Development)

Create this file locally (it's already in `.gitignore`):

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Solana RPC Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY_HERE

# Helius API Configuration (for transaction history)
NEXT_PUBLIC_HELIUS_API_KEY=YOUR_HELIUS_API_KEY_HERE
```

## 🔧 Build Configuration

### netlify.toml (Recommended)

Create this file in your repository root:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirect rules
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### package.json Scripts

Ensure your `frontend/package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 🌐 Backend Deployment

**Important**: Netlify only hosts static sites and serverless functions. Your Rust backend needs to be deployed separately.

### Backend Hosting Options:

1. **Railway** (Recommended for Rust)
   - Easy Rust deployment
   - Auto-scaling
   - Free tier available
   - https://railway.app

2. **Fly.io**
   - Good for Rust apps
   - Global edge deployment
   - Free tier available
   - https://fly.io

3. **DigitalOcean App Platform**
   - Supports Docker/Rust
   - Managed infrastructure
   - https://www.digitalocean.com/products/app-platform

4. **AWS EC2 / Google Cloud / Azure**
   - Full control
   - More complex setup
   - Higher cost

### Backend Environment Variables:

Your backend also needs environment variables:
```bash
SOLANA_CLUSTER=mainnet
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
HOST=0.0.0.0
PORT=3001
VANITY_SUFFIX=pump
VANITY_POOL_SIZE=120
VANITY_FILE=test_pump.json
```

## 🧪 Testing Your Deployment

### 1. Check Environment Variables
```bash
# In your deployed site, open browser console
console.log(process.env.NEXT_PUBLIC_API_URL)
console.log(process.env.NEXT_PUBLIC_SOLANA_RPC_URL)
```

### 2. Test API Connection
- Open your deployed site
- Try connecting a wallet
- Check browser Network tab for API calls
- Verify RPC connection works

### 3. Common Issues

**Issue**: Environment variables not working
- **Solution**: Ensure variables start with `NEXT_PUBLIC_`
- **Solution**: Redeploy after adding variables

**Issue**: API connection fails
- **Solution**: Check CORS settings on backend
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is correct

**Issue**: Build fails
- **Solution**: Check build logs in Netlify dashboard
- **Solution**: Ensure all dependencies are in `package.json`

## 📊 Monitoring

### Netlify Analytics (Optional)
- Enable in Site settings → Analytics
- Track page views, bandwidth, forms

### Custom Monitoring
- Use Sentry for error tracking
- Add Google Analytics
- Monitor API response times

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to your repository:

1. **Push to main branch** → Production deploy
2. **Open pull request** → Deploy preview
3. **Push to other branches** → Branch deploy (if enabled)

### Deploy Hooks

Create webhook for manual deploys:
1. Go to **Site settings** → **Build & deploy** → **Build hooks**
2. Click **Add build hook**
3. Name it (e.g., "Manual Deploy")
4. Select branch
5. Use the webhook URL to trigger deploys

```bash
# Trigger deploy via webhook
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify CLI Docs](https://cli.netlify.com/)

## 🆘 Support

If you encounter issues:
1. Check Netlify deploy logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test locally with production variables
5. Contact Netlify support or check their community forums
