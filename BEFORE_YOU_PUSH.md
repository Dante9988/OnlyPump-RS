# ✅ Before You Push to Remote

Quick checklist before pushing `netlify.toml` and other changes.

## 🔍 What Will Happen When You Push

### Files Being Added:
- ✅ `netlify.toml` - Netlify build configuration
- ✅ `NETLIFY_DEPLOYMENT.md` - Deployment guide
- ✅ `ENVIRONMENT_VARIABLES.md` - Env vars reference
- ✅ `NETLIFY_QUICKSTART.md` - Quick start guide
- ✅ `consolidate-addresses.js` - Address consolidation script
- ✅ Updated `README.md` - With deployment section
- ✅ Updated `.gitignore` - Excludes generated files

### What Won't Be Pushed (Git Ignored):
- ❌ `.env` and `.env.local` - Your local secrets
- ❌ `live_pump_addresses.json` - Generated addresses
- ❌ `consolidated_pump_addresses.json` - Consolidated addresses
- ❌ `*_pump_addresses.json` - Any generated address files
- ❌ `node_modules/` - Dependencies
- ❌ `target/` - Rust build artifacts

## ⚙️ Netlify Configuration Impact

### Current Netlify UI Settings:
Your current settings in Netlify dashboard will be **overridden** by `netlify.toml` for:
- ✅ Base directory
- ✅ Build command
- ✅ Publish directory
- ✅ Node version

### What Stays in Netlify UI:
These will **NOT** be affected:
- ✅ Environment variables (secrets)
- ✅ Domain settings
- ✅ Deploy notifications
- ✅ Build hooks
- ✅ Access control

## 📋 Pre-Push Checklist

### 1. Verify Your Current Netlify Settings

Go to your Netlify site → **Site settings** → **Build & deploy** → **Build settings**

Check if these match `netlify.toml`:
```
Base directory: frontend
Build command: npm run build
Publish directory: .next (or leave empty with Next.js plugin)
```

**If they DON'T match:**
- Option A: Update `netlify.toml` to match your working settings
- Option B: Let `netlify.toml` override (recommended if current settings work)

### 2. Check Environment Variables

Ensure these are set in Netlify UI (they won't be in `netlify.toml`):
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SOLANA_RPC_URL`
- [ ] `NEXT_PUBLIC_HELIUS_API_KEY`

**To verify:**
```
Netlify Dashboard → Site settings → Environment variables
```

### 3. Verify .gitignore

Check that sensitive files are ignored:

```bash
# Run this to see what will be committed
git status

# Should NOT see:
# - .env or .env.local files
# - live_pump_addresses.json
# - consolidated_pump_addresses.json
# - node_modules/
# - target/
```

### 4. Test Locally First (Optional)

```bash
# Test the build command from netlify.toml
cd frontend
npm run build

# Should complete without errors
```

### 5. Review Changes

```bash
# See what's being added
git diff

# See new files
git status
```

## 🚀 Safe Push Process

### Step 1: Stage Your Changes
```bash
# Add all new files
git add netlify.toml
git add NETLIFY_DEPLOYMENT.md
git add ENVIRONMENT_VARIABLES.md
git add NETLIFY_QUICKSTART.md
git add BEFORE_YOU_PUSH.md
git add consolidate-addresses.js
git add README.md
git add .gitignore

# Or add all at once
git add .
```

### Step 2: Verify What's Being Committed
```bash
# Check staged files
git status

# Verify no secrets are included
git diff --cached | grep -i "api.key\|password\|secret"
# Should return nothing!
```

### Step 3: Commit
```bash
git commit -m "Add Netlify deployment configuration and documentation"
```

### Step 4: Push
```bash
git push origin main
# or
git push origin master
```

### Step 5: Monitor Netlify Deploy

1. Go to Netlify Dashboard
2. Watch the deploy logs
3. Check for any errors
4. If successful, test your deployed site

## ⚠️ What If Something Goes Wrong?

### Deploy Fails After Push

**Symptom**: Netlify build fails after pushing `netlify.toml`

**Solution 1**: Check Build Logs
```
Netlify Dashboard → Deploys → Click failed deploy → View logs
```

**Solution 2**: Temporarily Disable netlify.toml
```bash
# Rename the file
git mv netlify.toml netlify.toml.backup
git commit -m "Temporarily disable netlify.toml"
git push
```

**Solution 3**: Revert the Commit
```bash
# Undo last commit (keeps changes locally)
git reset --soft HEAD~1

# Or completely remove changes
git reset --hard HEAD~1
git push --force origin main
```

### Build Works But Site Broken

**Symptom**: Build succeeds but site doesn't work

**Check**:
1. Environment variables are set in Netlify UI
2. Browser console for errors (F12)
3. Network tab for failed API calls
4. Verify `NEXT_PUBLIC_API_URL` is correct

**Quick Fix**:
```bash
# Redeploy without changes (sometimes helps)
Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy site
```

## 🎯 Expected Outcome

After pushing, Netlify will:

1. ✅ Detect the new `netlify.toml`
2. ✅ Use settings from the file
3. ✅ Install Next.js plugin (if not already)
4. ✅ Build using `npm run build` in `frontend/` directory
5. ✅ Deploy the `.next` output
6. ✅ Apply security headers and redirects
7. ✅ Your site should work exactly as before (or better!)

## 📊 Comparison: Before vs After

### Before (UI Only):
```
✓ Manual configuration in Netlify UI
✗ Not version controlled
✗ Hard to reproduce
✗ No security headers
✗ No caching optimization
```

### After (With netlify.toml):
```
✓ Configuration in version control
✓ Easy to reproduce
✓ Security headers enabled
✓ Caching optimized
✓ Consistent across deploys
✓ Team members can see config
```

## 🔐 Security Double-Check

Before pushing, verify:

```bash
# Check for any API keys in files
grep -r "api.key\|helius\|secret" netlify.toml NETLIFY_DEPLOYMENT.md ENVIRONMENT_VARIABLES.md

# Should only show example placeholders like:
# - YOUR_KEY
# - YOUR_HELIUS_KEY
# - abc123 (example)
```

## ✅ Final Checklist

- [ ] Reviewed all new files
- [ ] Verified no secrets in code
- [ ] Environment variables set in Netlify UI
- [ ] `.gitignore` is updated
- [ ] Current Netlify settings noted
- [ ] Tested build locally (optional)
- [ ] Ready to monitor deploy
- [ ] Know how to revert if needed

## 🚀 Ready to Push?

If all checks pass, you're good to go! The `netlify.toml` will only improve your deployment.

```bash
git add .
git commit -m "Add Netlify deployment configuration and documentation"
git push origin main
```

Then watch your Netlify dashboard for the deploy! 🎉

---

**Still unsure?** You can always:
1. Create a new branch first: `git checkout -b add-netlify-config`
2. Push to that branch: `git push origin add-netlify-config`
3. Test the deploy preview in Netlify
4. Merge to main if it works!
