# 🚀 Vercel Monitor - Quick Reference Card

## ⚡ Super Quick Start

```bash
# 1. Get token from: https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"

# 2. Run setup (interactive)
./scripts/setup-vercel-monitor.sh

# 3. Use it!
npm run monitor:vercel:once
```

---

## 📝 Essential Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run monitor:vercel:once` | Single check | After git push |
| `npm run monitor:vercel` | Continuous monitoring | Active development |
| `./scripts/quick-vercel-check.sh` | Quick shell check | Fast status |
| `./scripts/quick-vercel-check.sh 10` | Check last 10 | See history |
| `./scripts/setup-vercel-monitor.sh` | Setup wizard | First time / reconfigure |

---

## 🔑 Environment Variables

```bash
# Required
export VERCEL_TOKEN="your_token_here"

# Optional (auto-detects)
export VERCEL_PROJECT_ID="prj_xxxxx"
export VERCEL_TEAM_ID="team_xxxxx"  # Teams only
```

**Save permanently:**
```bash
echo 'export VERCEL_TOKEN="your_token"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🎯 Common Workflows

### After Git Push
```bash
git push && npm run monitor:vercel:once
```

### Check Deployment Status
```bash
./scripts/quick-vercel-check.sh
```

### Monitor While Developing
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run monitor:vercel
```

### Reset and Check All
```bash
rm scripts/.git-vercel-monitor-state.json
npm run monitor:vercel:once
```

---

## 📊 Status Meanings

| Symbol | Status | What it Means |
|--------|--------|---------------|
| ✅ | READY | Live and working |
| 🔨 | BUILDING | In progress |
| ❌ | ERROR | Failed |
| ⏳ | QUEUED | Waiting |
| 🚫 | CANCELED | Stopped |

---

## 🐛 Quick Fixes

### No token?
```bash
export VERCEL_TOKEN="token"  # Get from vercel.com/account/tokens
```

### Can't find project?
```bash
npx vercel link  # OR
export VERCEL_PROJECT_ID="prj_xxxxx"
```

### jq not found? (shell script only)
```bash
brew install jq
```

### See no deployments?
```bash
git log origin/main -5  # Check if pushed
rm scripts/.git-vercel-monitor-state.json  # Reset state
```

---

## 📚 Full Documentation

- **This Card:** Quick commands
- **VERCEL_MONITOR_SUMMARY.md** → Overview & getting started
- **MONITOR_SCRIPTS_README.md** → Script comparison
- **GIT_VERCEL_MONITOR_GUIDE.md** → Complete guide
- **scripts/INTEGRATION_EXAMPLES.md** → Advanced integrations

---

## 💡 Pro Tips

```bash
# Git alias
git config --global alias.vcheck '!npm run monitor:vercel:once'
git vcheck

# Shell alias
echo 'alias vcheck="npm run monitor:vercel:once"' >> ~/.zshrc
source ~/.zshrc
vcheck

# After push
gpush() { git push $@ && vcheck; }
```

---

## 🆘 Help

```bash
npm run monitor:vercel -- --help
cat VERCEL_MONITOR_SUMMARY.md
./scripts/setup-vercel-monitor.sh
```

---

**That's it! Start with:** `npm run monitor:vercel:once` 🎉
