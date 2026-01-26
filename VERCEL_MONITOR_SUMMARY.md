# 📦 Vercel Deployment Monitor - Complete Setup

## 🎉 What Was Created

A complete monitoring solution for tracking git pushes and Vercel deployments with multiple tools and comprehensive documentation.

### 📁 Files Created

```
📂 Project Root
├── 📄 GIT_VERCEL_MONITOR_GUIDE.md          # Comprehensive usage guide
├── 📄 MONITOR_SCRIPTS_README.md            # Quick reference
├── 📄 VERCEL_MONITOR_SUMMARY.md            # This file
├── 📄 package.json                          # Updated with new scripts
└── 📂 scripts/
    ├── 🔧 monitor-git-vercel.ts            # Main TypeScript monitor
    ├── 🔧 quick-vercel-check.sh            # Simple shell script
    ├── 🔧 setup-vercel-monitor.sh          # Interactive setup wizard
    └── 📄 INTEGRATION_EXAMPLES.md          # Integration recipes
```

### ✨ New NPM Scripts

Added to `package.json`:
```json
{
  "monitor:vercel": "tsx scripts/monitor-git-vercel.ts",
  "monitor:vercel:once": "tsx scripts/monitor-git-vercel.ts --once"
}
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run Setup Wizard

```bash
./scripts/setup-vercel-monitor.sh
```

The wizard will:
- ✅ Check dependencies
- ✅ Guide you to get a Vercel token
- ✅ Auto-detect your project ID
- ✅ Save configuration
- ✅ Test the connection
- ✅ Run your first check

### Step 2: Or Manual Setup

```bash
# Get your token from: https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"

# Link your project (creates .vercel/project.json)
npx vercel link
```

### Step 3: Start Monitoring

```bash
# One-time check (after a push)
npm run monitor:vercel:once

# Continuous monitoring (checks every 60s)
npm run monitor:vercel

# Quick shell script (fastest)
./scripts/quick-vercel-check.sh
```

---

## 📊 Tools Comparison

| Tool | Best For | Speed | Features |
|------|----------|-------|----------|
| **TypeScript Script** | Active development | Medium | Full logs, error detection, continuous mode |
| **Shell Script** | Quick checks | ⚡ Fast | Simple status, no dependencies |
| **Setup Wizard** | First-time setup | - | Interactive configuration |

---

## 🎯 Common Workflows

### Workflow 1: After Every Push

```bash
git add .
git commit -m "Your changes"
git push
npm run monitor:vercel:once
```

### Workflow 2: Development Mode

```bash
# Terminal 1: Development
npm run dev

# Terminal 2: Continuous monitoring
npm run monitor:vercel
```

### Workflow 3: Quick Status Check

```bash
./scripts/quick-vercel-check.sh
```

### Workflow 4: Check Last 10 Deployments

```bash
./scripts/quick-vercel-check.sh 10
```

---

## 📖 Documentation Guide

| Document | Purpose | Read If... |
|----------|---------|-----------|
| **MONITOR_SCRIPTS_README.md** | Quick reference | You want a quick overview |
| **GIT_VERCEL_MONITOR_GUIDE.md** | Complete guide | You need detailed documentation |
| **INTEGRATION_EXAMPLES.md** | Integration recipes | You want to automate/integrate |
| **VERCEL_MONITOR_SUMMARY.md** | This file | You're getting started |

---

## 🔧 Configuration

### Required Environment Variables

```bash
VERCEL_TOKEN="your_token_here"  # Required - Get from Vercel dashboard
```

### Optional Environment Variables

```bash
VERCEL_PROJECT_ID="prj_xxxxx"   # Auto-detects if not set
VERCEL_TEAM_ID="team_xxxxx"     # Only for team projects
```

### Where to Set Variables

**Option 1: `.env.local` (Recommended)**
```bash
echo "VERCEL_TOKEN=your_token_here" >> .env.local
source .env.local
```

**Option 2: Shell Profile**
```bash
# Add to ~/.zshrc or ~/.bashrc
export VERCEL_TOKEN="your_token_here"
```

**Option 3: Current Session Only**
```bash
export VERCEL_TOKEN="your_token_here"
```

---

## 📋 Features

### TypeScript Monitor (`monitor-git-vercel.ts`)

✅ **Git Integration**
- Tracks local commits
- Detects new pushes
- Remembers last checked commit (state persistence)

✅ **Vercel Integration**
- Fetches deployments via API
- Matches commits to deployments
- Shows deployment status and URLs

✅ **Build Logs**
- Displays recent build logs
- Highlights errors and warnings
- Shows timestamps

✅ **Modes**
- Continuous monitoring (default)
- One-time check (--once flag)
- Help menu (--help flag)

✅ **Smart Features**
- Auto-detects project ID
- Error detection and highlighting
- State management between runs
- Color-coded output

### Shell Script (`quick-vercel-check.sh`)

✅ **Fast & Simple**
- Quick deployment status
- No Node.js overhead
- Minimal dependencies (just `jq`)

✅ **Flexible**
- Adjustable deployment count
- Color-coded output
- Latest commit comparison

---

## 🎨 Output Examples

### TypeScript Script Output

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

### Shell Script Output

```
🔍 Fetching last 5 Vercel deployments...

📝 Latest Local Commit:
   a1b2c3d - Add new feature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 ✅ READY - Add new feature
   URL: https://your-app.vercel.app
   Commit: a1b2c3d
   Target: production
   Created: 2026-01-26 10:31:05
   By: johndoe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔔 Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | READY | Deployment successful and live |
| 🔨 | BUILDING | Currently building |
| ❌ | ERROR | Build or deployment failed |
| ⏳ | QUEUED | Waiting to start |
| 🚫 | CANCELED | Deployment was canceled |
| 🔄 | INITIALIZING | Starting up |

---

## 🐛 Troubleshooting

### Issue: "VERCEL_TOKEN is required"

**Solution:**
```bash
export VERCEL_TOKEN="your_token_here"
# Get token from: https://vercel.com/account/tokens
```

### Issue: "Could not detect project ID"

**Solution 1:** Link your project
```bash
npx vercel link
```

**Solution 2:** Set manually
```bash
export VERCEL_PROJECT_ID="prj_xxxxxxxxxxxxx"
# Find in: Vercel Dashboard → Project Settings → General
```

### Issue: "jq: command not found" (Shell Script)

**Solution:**
```bash
brew install jq
```

### Issue: No deployments showing

**Check these:**
```bash
# 1. Are commits pushed?
git log origin/main -5

# 2. Is Vercel integration active?
open https://vercel.com/dashboard

# 3. Is token valid?
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user

# 4. Reset state and try again
rm scripts/.git-vercel-monitor-state.json
npm run monitor:vercel:once
```

---

## 🎓 Learn More

### Interactive Tutorial

```bash
# 1. Run setup wizard
./scripts/setup-vercel-monitor.sh

# 2. Read quick reference
cat MONITOR_SCRIPTS_README.md

# 3. Try one-time check
npm run monitor:vercel:once

# 4. Try continuous mode (Ctrl+C to stop)
npm run monitor:vercel
```

### Advanced Usage

For advanced integrations and automation:
```bash
cat scripts/INTEGRATION_EXAMPLES.md
```

Topics covered:
- Git hooks integration
- CI/CD pipeline setup
- Cron jobs
- Notification systems (Slack, Discord, Email)
- Custom dashboards

---

## 🔐 Security Best Practices

1. **Never commit tokens**
   ```bash
   # .gitignore already includes:
   .env*.local
   .env
   scripts/.git-vercel-monitor-state.json
   ```

2. **Use environment variables**
   ```bash
   # Good
   export VERCEL_TOKEN="token"
   
   # Bad (hardcoded in scripts)
   VERCEL_TOKEN="token"
   ```

3. **Rotate tokens regularly**
   - Create new token in Vercel dashboard
   - Update environment variable
   - Delete old token

4. **Limit token scope**
   - Use tokens with minimum required permissions
   - For read-only monitoring, use read-only tokens

---

## 🚀 Next Steps

### Immediate Actions

1. ✅ Run the setup wizard
   ```bash
   ./scripts/setup-vercel-monitor.sh
   ```

2. ✅ Try your first check
   ```bash
   npm run monitor:vercel:once
   ```

3. ✅ Add to your workflow
   ```bash
   git push && npm run monitor:vercel:once
   ```

### Optional Enhancements

- 📌 Set up git hooks (see INTEGRATION_EXAMPLES.md)
- 🔔 Add notifications (Slack, Discord, Email)
- ⏰ Schedule periodic checks (cron jobs)
- 🤖 Integrate with CI/CD pipeline
- 📊 Create custom dashboard

---

## 💬 Tips & Tricks

### Create a Git Alias

```bash
# Add to git config
git config --global alias.vcheck '!npm run monitor:vercel:once'

# Now use:
git vcheck
```

### Add to Shell Alias

```bash
# Add to ~/.zshrc or ~/.bashrc
alias vcheck='npm run monitor:vercel:once'
alias vwatch='npm run monitor:vercel'

# Now use:
vcheck    # One-time check
vwatch    # Continuous monitoring
```

### Combine with Git Push

```bash
# Add to ~/.zshrc or ~/.bashrc
gpush() {
    git push $@ && npm run monitor:vercel:once
}

# Now use:
gpush origin main
```

---

## 📞 Getting Help

### Documentation

- **Quick Reference:** `MONITOR_SCRIPTS_README.md`
- **Full Guide:** `GIT_VERCEL_MONITOR_GUIDE.md`
- **Integrations:** `scripts/INTEGRATION_EXAMPLES.md`

### Commands

```bash
# Show help
npm run monitor:vercel -- --help

# Check dependencies
./scripts/setup-vercel-monitor.sh

# Test connection
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
     https://api.vercel.com/v2/user
```

---

## 🎉 Success!

You now have a complete monitoring solution for your Vercel deployments!

**Your scripts are ready to use:**

```bash
npm run monitor:vercel:once          # ← Start here
npm run monitor:vercel               # Continuous mode
./scripts/quick-vercel-check.sh      # Quick check
./scripts/setup-vercel-monitor.sh    # Re-run setup
```

**Happy monitoring! 🚀**

---

*Created: January 26, 2026*  
*Version: 1.0.0*
