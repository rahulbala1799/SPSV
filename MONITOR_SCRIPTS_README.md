# Vercel Deployment Monitoring Scripts

Two scripts are available to monitor git pushes and Vercel deployments:

## 🚀 Quick Start (Choose One)

### Option 1: TypeScript Script (Recommended)
Full-featured monitoring with continuous mode and detailed logs.

```bash
# Setup
export VERCEL_TOKEN="your_token_here"

# One-time check
npm run monitor:vercel:once

# Continuous monitoring
npm run monitor:vercel
```

### Option 2: Shell Script (Quick & Simple)
Fast deployment status check without installation.

```bash
# Setup
export VERCEL_TOKEN="your_token_here"

# Run
./scripts/quick-vercel-check.sh

# Check last 10 deployments
./scripts/quick-vercel-check.sh 10
```

## 📊 Comparison

| Feature | TypeScript Script | Shell Script |
|---------|------------------|--------------|
| **Continuous Monitoring** | ✅ Yes | ❌ No |
| **Git Commit Matching** | ✅ Yes | ⚠️ Basic |
| **Deployment Logs** | ✅ Detailed | ❌ No |
| **Error Detection** | ✅ Yes | ❌ No |
| **State Persistence** | ✅ Yes | ❌ No |
| **Dependencies** | Node.js + tsx | jq only |
| **Speed** | Medium | ⚡ Fast |
| **Best For** | Development & CI | Quick checks |

## 🔑 Getting Your Vercel Token

1. Visit: [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "Deployment Monitor")
4. Copy the token
5. Set environment variable:
   ```bash
   export VERCEL_TOKEN="your_token_here"
   ```

## 📖 Full Documentation

See [GIT_VERCEL_MONITOR_GUIDE.md](./GIT_VERCEL_MONITOR_GUIDE.md) for:
- Detailed setup instructions
- Advanced configuration
- Troubleshooting guide
- Integration examples
- Customization options

## 🎯 Common Use Cases

### After Git Push
```bash
git push origin main
npm run monitor:vercel:once
```

### Daily Development
```bash
# Run once in the morning
npm run monitor:vercel:once
```

### Background Monitoring
```bash
# Keep running in terminal
npm run monitor:vercel
```

### CI/CD Integration
```bash
# In your pipeline
npm run monitor:vercel:once
```

### Quick Status Check
```bash
# Fastest way
./scripts/quick-vercel-check.sh
```

## 🔧 Configuration

Both scripts use these environment variables:

```bash
# Required
export VERCEL_TOKEN="your_token_here"

# Optional (auto-detects)
export VERCEL_PROJECT_ID="prj_xxxxx"
export VERCEL_TEAM_ID="team_xxxxx"  # Only for team projects
```

## 🆘 Troubleshooting

### "VERCEL_TOKEN is required"
```bash
export VERCEL_TOKEN="your_token_here"
```

### "Could not detect project ID"
```bash
# Link your project
npx vercel link

# OR set manually
export VERCEL_PROJECT_ID="prj_xxxxx"
```

### Shell script: "jq not found"
```bash
brew install jq
```

### No deployments showing
1. Check if commits are pushed: `git log origin/main -5`
2. Verify Vercel integration is active
3. Check token permissions in Vercel dashboard

## 📝 Files Created

- `scripts/monitor-git-vercel.ts` - Full TypeScript monitoring script
- `scripts/quick-vercel-check.sh` - Simple shell script for quick checks
- `scripts/.git-vercel-monitor-state.json` - State file (auto-generated, gitignored)
- `GIT_VERCEL_MONITOR_GUIDE.md` - Comprehensive documentation

## 💡 Tips

- Use the shell script for quick status checks
- Use the TypeScript script during active development
- Run continuous mode in a separate terminal window
- Add `VERCEL_TOKEN` to your shell profile (`.zshrc` or `.bashrc`)
- Create a git alias for quick checks:
  ```bash
  git config --global alias.vcheck '!npm run monitor:vercel:once'
  ```

## 🎨 Example Output

```
📊 GIT PUSH & VERCEL DEPLOYMENT REPORT
================================================================================

🔍 Found 2 new commit(s):

📝 Commit: a1b2c3d
   Author: John Doe
   Date: 2026-01-26 10:30:00
   Message: Add new feature

   🚀 Vercel Deployment:
      Status: ✅ READY
      URL: https://your-app.vercel.app
      Deployment ID: dpl_xxxxxxxxxxxxx
      Created: 1/26/2026, 10:31:05 AM
      Target: production

   📋 Recent Logs (last 10):
      ℹ️  [10:31:05] Installing dependencies
      💻 [10:31:15] Running build command
      📤 [10:31:45] Build successful
      ✅ [10:32:00] Deployment ready

--------------------------------------------------------------------------------
```

---

**Need help?** Check the [full guide](./GIT_VERCEL_MONITOR_GUIDE.md) or run `npm run monitor:vercel -- --help`
