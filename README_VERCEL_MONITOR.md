# 🚀 Git Push & Vercel Deployment Monitor

> Automatically track git pushes and monitor Vercel deployments with detailed logs and error detection.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Shell](https://img.shields.io/badge/Shell-4EAA25?style=flat&logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

---

## 📖 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎯 Core Features

- ✅ **Git Integration** - Tracks commits and detects new pushes
- ✅ **Vercel API** - Fetches deployment status and logs
- ✅ **Smart Matching** - Correlates git commits with Vercel deployments
- ✅ **Build Logs** - Shows detailed deployment logs with timestamps
- ✅ **Error Detection** - Highlights errors and warnings in logs
- ✅ **State Management** - Remembers last checked commit
- ✅ **Multiple Modes** - One-time check or continuous monitoring

### 🛠️ Two Tools, One Goal

| TypeScript Script | Shell Script |
|------------------|--------------|
| Full-featured monitoring | Quick status checks |
| Detailed logs & errors | Fast & lightweight |
| Continuous mode | One-time only |
| State persistence | No dependencies* |
| Best for development | Best for quick checks |

*Shell script requires `jq` (install: `brew install jq`)

---

## 🚀 Quick Start

### 1️⃣ Run the Setup Wizard (Easiest)

```bash
./scripts/setup-vercel-monitor.sh
```

The wizard will guide you through:
- Getting your Vercel API token
- Detecting your project ID
- Saving configuration
- Running your first check

### 2️⃣ Manual Setup (Quick)

```bash
# Get your token from: https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"

# Link your project (creates .vercel/project.json)
npx vercel link

# Run your first check
npm run monitor:vercel:once
```

### 3️⃣ Start Using

```bash
# One-time check (after a push)
npm run monitor:vercel:once

# Continuous monitoring (checks every 60s)
npm run monitor:vercel

# Quick shell script (fastest)
./scripts/quick-vercel-check.sh
```

---

## 📚 Usage

### Basic Commands

```bash
# After pushing to git
git push origin main
npm run monitor:vercel:once

# Monitor continuously during development
npm run monitor:vercel

# Quick status check (shell script)
./scripts/quick-vercel-check.sh

# Check last 10 deployments
./scripts/quick-vercel-check.sh 10

# Show help
npm run monitor:vercel -- --help
```

### Advanced Usage

```bash
# Reset state to see all recent commits
rm scripts/.git-vercel-monitor-state.json
npm run monitor:vercel:once

# Run with custom project ID
VERCEL_PROJECT_ID="prj_xxxxx" npm run monitor:vercel:once

# For team projects
VERCEL_TEAM_ID="team_xxxxx" npm run monitor:vercel:once
```

---

## 📋 Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Command cheat sheet | You need a quick reminder |
| **[VERCEL_MONITOR_SUMMARY.md](./VERCEL_MONITOR_SUMMARY.md)** | Complete overview | You're getting started |
| **[MONITOR_SCRIPTS_README.md](./MONITOR_SCRIPTS_README.md)** | Script comparison | Choosing which tool to use |
| **[GIT_VERCEL_MONITOR_GUIDE.md](./GIT_VERCEL_MONITOR_GUIDE.md)** | Detailed guide | You need in-depth info |
| **[INTEGRATION_EXAMPLES.md](./scripts/INTEGRATION_EXAMPLES.md)** | Integration recipes | You want to automate |

### Quick Access

```bash
# Quick reference card
cat QUICK_REFERENCE.md

# Complete summary
cat VERCEL_MONITOR_SUMMARY.md

# Integration examples
cat scripts/INTEGRATION_EXAMPLES.md
```

---

## 🎨 Example Output

### TypeScript Monitor

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

### Shell Script

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

## 💡 Common Workflows

### Workflow 1: After Every Push

```bash
git add .
git commit -m "Your changes"
git push origin main
npm run monitor:vercel:once
```

### Workflow 2: Active Development

```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Continuous monitoring
npm run monitor:vercel
```

### Workflow 3: Quick Status Check

```bash
./scripts/quick-vercel-check.sh
```

### Workflow 4: Combined Git Push

```bash
# Create a shell function
gpush() {
    git push $@ && npm run monitor:vercel:once
}

# Use it
gpush origin main
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Required
VERCEL_TOKEN="your_token_here"        # Get from vercel.com/account/tokens

# Optional (auto-detects if not provided)
VERCEL_PROJECT_ID="prj_xxxxx"         # Your project ID
VERCEL_TEAM_ID="team_xxxxx"           # Only for team projects
```

### Where to Set Variables

**Option 1: `.env.local` (Recommended)**
```bash
echo "VERCEL_TOKEN=your_token_here" >> .env.local
source .env.local
```

**Option 2: Shell Profile (Permanent)**
```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export VERCEL_TOKEN="your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

**Option 3: Current Session Only**
```bash
export VERCEL_TOKEN="your_token_here"
```

---

## 🐛 Troubleshooting

### ❌ "VERCEL_TOKEN is required"

**Solution:**
```bash
export VERCEL_TOKEN="your_token_here"
```
Get your token from: [https://vercel.com/account/tokens](https://vercel.com/account/tokens)

### ❌ "Could not detect project ID"

**Solution 1:** Link your project
```bash
npx vercel link
```

**Solution 2:** Set manually
```bash
export VERCEL_PROJECT_ID="prj_xxxxxxxxxxxxx"
```
Find in: Vercel Dashboard → Project Settings → General

### ❌ "jq: command not found" (Shell Script)

**Solution:**
```bash
brew install jq
```

### ⚠️ No deployments showing

**Check:**
```bash
# 1. Are commits pushed to remote?
git log origin/main -5

# 2. Is Vercel integration active?
# Visit: https://vercel.com/dashboard

# 3. Reset state and try again
rm scripts/.git-vercel-monitor-state.json
npm run monitor:vercel:once
```

### ⚠️ "Failed to fetch deployments"

**Check:**
- Token has correct permissions (at least "Read")
- For team projects, set `VERCEL_TEAM_ID`
- Token hasn't expired (check Vercel dashboard)

---

## 🎯 Integration Examples

### Git Hooks

```bash
# Create .git/hooks/post-push
#!/bin/bash
npm run monitor:vercel:once

chmod +x .git/hooks/post-push
```

### GitHub Actions

```yaml
- name: Monitor Deployment
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  run: npm run monitor:vercel:once
```

### Cron Job

```bash
# Check every 5 minutes
*/5 * * * * cd /path/to/project && npm run monitor:vercel:once
```

**More examples:** See [INTEGRATION_EXAMPLES.md](./scripts/INTEGRATION_EXAMPLES.md)

---

## 📊 Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | READY | Deployment successful and live |
| 🔨 | BUILDING | Currently building |
| ❌ | ERROR | Build or deployment failed |
| ⏳ | QUEUED | Waiting to start |
| 🚫 | CANCELED | Deployment was canceled |
| 🔄 | INITIALIZING | Starting up |

---

## 🔐 Security

- ✅ Never commit `VERCEL_TOKEN` to git
- ✅ `.env.local` is already in `.gitignore`
- ✅ State file is gitignored
- ✅ Use environment variables for tokens
- ✅ Rotate tokens periodically

---

## 📦 What's Included

```
📂 Project Root
├── 📄 README_VERCEL_MONITOR.md         # This file
├── 📄 QUICK_REFERENCE.md               # Quick command reference
├── 📄 VERCEL_MONITOR_SUMMARY.md        # Complete overview
├── 📄 MONITOR_SCRIPTS_README.md        # Script comparison
├── 📄 GIT_VERCEL_MONITOR_GUIDE.md      # Detailed guide
├── 📄 package.json                      # Updated with new scripts
└── 📂 scripts/
    ├── 🔧 monitor-git-vercel.ts        # TypeScript monitor
    ├── 🔧 quick-vercel-check.sh        # Shell script
    ├── 🔧 setup-vercel-monitor.sh      # Setup wizard
    └── 📄 INTEGRATION_EXAMPLES.md      # Integration recipes
```

---

## 🚀 Getting Started Checklist

- [ ] Run setup wizard: `./scripts/setup-vercel-monitor.sh`
- [ ] Get Vercel token from: [vercel.com/account/tokens](https://vercel.com/account/tokens)
- [ ] Set `VERCEL_TOKEN` environment variable
- [ ] Link project: `npx vercel link` (or set `VERCEL_PROJECT_ID`)
- [ ] Test: `npm run monitor:vercel:once`
- [ ] Read: `cat QUICK_REFERENCE.md`
- [ ] Integrate into workflow (optional)

---

## 💬 Tips & Tricks

### Create Aliases

```bash
# Add to ~/.zshrc or ~/.bashrc
alias vcheck='npm run monitor:vercel:once'
alias vwatch='npm run monitor:vercel'
alias vquick='./scripts/quick-vercel-check.sh'

# Now use:
vcheck    # One-time check
vwatch    # Continuous monitoring
vquick    # Quick shell check
```

### Git Alias

```bash
git config --global alias.vcheck '!npm run monitor:vercel:once'

# Now use:
git vcheck
```

### Combined Push & Check

```bash
# Add to ~/.zshrc or ~/.bashrc
gpush() {
    git push $@ && npm run monitor:vercel:once
}

# Now use:
gpush origin main
```

---

## 🆘 Need Help?

### Documentation

- **Quick commands:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Getting started:** [VERCEL_MONITOR_SUMMARY.md](./VERCEL_MONITOR_SUMMARY.md)
- **Full guide:** [GIT_VERCEL_MONITOR_GUIDE.md](./GIT_VERCEL_MONITOR_GUIDE.md)
- **Integrations:** [scripts/INTEGRATION_EXAMPLES.md](./scripts/INTEGRATION_EXAMPLES.md)

### Commands

```bash
# Show help
npm run monitor:vercel -- --help

# Re-run setup
./scripts/setup-vercel-monitor.sh

# Test connection
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
     https://api.vercel.com/v2/user
```

---

## 🎉 Ready to Go!

Start monitoring your deployments now:

```bash
npm run monitor:vercel:once
```

**Happy monitoring! 🚀**

---

*Created: January 26, 2026*  
*Version: 1.0.0*  
*License: MIT*
