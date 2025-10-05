# Environment Variables Reference

Quick reference for all environment variables used in OnlyPump.

## 🌐 Frontend Environment Variables

These must be set in Netlify (or `.env.local` for local development):

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://your-backend.com` | Your backend deployment URL |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://mainnet.helius-rpc.com/?api-key=abc123` | [Helius Dashboard](https://dev.helius.xyz/) |
| `NEXT_PUBLIC_HELIUS_API_KEY` | Helius API key | `abc123def456` | [Helius Dashboard](https://dev.helius.xyz/) |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_RPC_ENDPOINT` | Custom RPC endpoint | Uses `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://api.mainnet-beta.solana.com` |

## 🦀 Backend Environment Variables

These should be set on your backend hosting platform (Railway, Fly.io, etc.):

### Required Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `SOLANA_CLUSTER` | Solana network | `mainnet` or `devnet` | `mainnet` |
| `RPC_URL` | Solana RPC endpoint | `https://mainnet.helius-rpc.com/?api-key=abc123` | Required |
| `HOST` | Server host | `0.0.0.0` | `0.0.0.0` |
| `PORT` | Server port | `3001` | `3001` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VANITY_SUFFIX` | Vanity address suffix | `pump` | `pump` |
| `VANITY_POOL_SIZE` | Vanity address pool size | `120` | `120` |
| `VANITY_FILE` | Vanity addresses file | `test_pump.json` | `test_pump.json` |
| `PRIORITY_UNIT_LIMIT` | Priority fee limit | `100000` | `100000` |
| `RUST_LOG` | Logging level | `info` | `debug` |

## 🔑 Getting API Keys

### Helius API Key

1. Go to [Helius Dashboard](https://dev.helius.xyz/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key
5. Use it in both:
   - `NEXT_PUBLIC_SOLANA_RPC_URL`: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
   - `NEXT_PUBLIC_HELIUS_API_KEY`: `YOUR_KEY`

**Free Tier Limits:**
- 100,000 requests/day
- Rate limit: 10 requests/second
- Sufficient for development and small production apps

## 📝 Setting Variables in Netlify

### Via Netlify UI

1. Go to your site dashboard
2. **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Enter variable name and value
5. Select scope (Production, Deploy Previews, Branch deploys)
6. Click **Create variable**

### Via Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Link your site
netlify link

# Set variables
netlify env:set NEXT_PUBLIC_API_URL "https://your-backend.com"
netlify env:set NEXT_PUBLIC_SOLANA_RPC_URL "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
netlify env:set NEXT_PUBLIC_HELIUS_API_KEY "YOUR_KEY"

# List all variables
netlify env:list

# Trigger redeploy
netlify deploy --prod
```

### Via Environment Variables UI (Step-by-Step)

**Step 1: Navigate to Environment Variables**
```
Netlify Dashboard → Your Site → Site settings → Environment variables
```

**Step 2: Add Each Variable**

Click "Add a variable" and enter:

**Variable 1:**
```
Key: NEXT_PUBLIC_API_URL
Value: https://your-backend.com
Scopes: ✓ Production ✓ Deploy previews ✓ Branch deploys
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SOLANA_RPC_URL
Value: https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY
Scopes: ✓ Production ✓ Deploy previews ✓ Branch deploys
Options: ✓ Mark as sensitive (recommended)
```

**Variable 3:**
```
Key: NEXT_PUBLIC_HELIUS_API_KEY
Value: YOUR_HELIUS_KEY
Scopes: ✓ Production ✓ Deploy previews ✓ Branch deploys
Options: ✓ Mark as sensitive (recommended)
```

**Step 3: Trigger Redeploy**
```
Deploys → Trigger deploy → Deploy site
```

## 🧪 Local Development Setup

### Frontend (.env.local)

Create `frontend/.env.local`:

```bash
# Backend API (use localhost for local development)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Solana RPC (Helius mainnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY

# Helius API Key
NEXT_PUBLIC_HELIUS_API_KEY=YOUR_HELIUS_KEY
```

### Backend (.env)

Create `backend-rs/.env`:

```bash
# Solana Configuration
SOLANA_CLUSTER=mainnet
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY

# Server Configuration
HOST=0.0.0.0
PORT=3001

# Vanity Configuration
VANITY_SUFFIX=pump
VANITY_POOL_SIZE=120
VANITY_FILE=test_pump.json

# Logging
RUST_LOG=info
```

## ✅ Verification Checklist

After setting environment variables:

- [ ] All required variables are set
- [ ] Sensitive variables are marked as sensitive
- [ ] Variables are set for correct deploy contexts
- [ ] Backend URL is accessible from frontend
- [ ] RPC URL includes API key
- [ ] Helius API key is valid
- [ ] Triggered a new deploy
- [ ] Tested the deployed site
- [ ] Wallet connection works
- [ ] Token creation works
- [ ] No console errors related to env variables

## 🔒 Security Notes

### ✅ Safe to Expose (Client-Side)

These are prefixed with `NEXT_PUBLIC_` and are bundled into the frontend:
- `NEXT_PUBLIC_API_URL` - Public API endpoint
- `NEXT_PUBLIC_SOLANA_RPC_URL` - RPC endpoint (includes API key, but that's okay)
- `NEXT_PUBLIC_HELIUS_API_KEY` - API key (rate-limited, acceptable to expose)

### ⚠️ Important Security Practices

1. **Use Helius Free Tier for Public Apps**
   - Free tier has rate limits
   - Prevents abuse
   - Upgrade to paid tier for production

2. **Rotate Keys Regularly**
   - Change API keys every 3-6 months
   - Immediately rotate if compromised

3. **Monitor Usage**
   - Check Helius dashboard for usage
   - Set up alerts for unusual activity

4. **Use Different Keys for Environments**
   - Development: Separate Helius project
   - Production: Different Helius project
   - Easier to track and debug

## 🆘 Troubleshooting

### Variables Not Working

**Problem**: Environment variables not available in deployed app

**Solutions**:
1. Ensure variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding variables (old deploys don't get new variables)
3. Check variable names for typos
4. Verify variables are set for the correct deploy context

### RPC Connection Fails

**Problem**: Cannot connect to Solana RPC

**Solutions**:
1. Verify Helius API key is valid
2. Check RPC URL format: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
3. Test RPC endpoint directly in browser
4. Check Helius dashboard for rate limit issues

### Backend Connection Fails

**Problem**: Frontend cannot reach backend API

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is deployed and running
3. Verify CORS is configured on backend
4. Test backend endpoint directly (e.g., `/health`)

## 📚 Additional Resources

- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Helius Documentation](https://docs.helius.dev/)
- [Solana RPC Endpoints](https://docs.solana.com/cluster/rpc-endpoints)
