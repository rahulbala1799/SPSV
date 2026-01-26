# Git & Vercel Deployment Monitor

This script monitors your git repository for new pushes and automatically checks Vercel for corresponding deployment logs.

## 🚀 Quick Start

### 1. Get Your Vercel API Token

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "Git Monitor")
4. Copy the token (you'll only see it once!)

### 2. Set Environment Variable

```bash
# Add to your ~/.zshrc or ~/.bashrc
export VERCEL_TOKEN="your_token_here"

# Or create a .env.local file
echo "VERCEL_TOKEN=your_token_here" >> .env.local
```

### 3. Run the Monitor

```bash
# Continuous monitoring (checks every 60 seconds)
npm run monitor:vercel

# One-time check
npm run monitor:vercel:once

# Show help
npm run monitor:vercel -- --help
```

## 📋 Features

- ✅ **Automatic Git Tracking**: Monitors git commits and pushes
- 🔍 **Smart Matching**: Correlates git commits with Vercel deployments
- 📊 **Deployment Status**: Shows build status, URLs, and timestamps
- 📋 **Build Logs**: Displays recent build logs for each deployment
- ⚠️ **Error Detection**: Highlights errors in deployment logs
- 💾 **State Persistence**: Remembers last checked commit
- 🔄 **Continuous Mode**: Runs in the background, checking periodically
- 🎯 **One-time Mode**: Quick status check and exit

## 🔧 Advanced Configuration

### Optional Environment Variables

```bash
# Auto-detects if not provided
export VERCEL_PROJECT_ID="prj_xxxxxxxxxxxxx"

# Only needed for team projects
export VERCEL_TEAM_ID="team_xxxxxxxxxxxxx"
```

### Finding Your Project ID

The script auto-detects your project ID from:
1. `.vercel/project.json` file
2. Vercel API using your project name from `package.json`

If auto-detection fails, you can manually set it:

```bash
# Find it in Vercel dashboard -> Project Settings -> General
export VERCEL_PROJECT_ID="prj_xxxxxxxxxxxxx"
```

## 📖 Usage Examples

### Example 1: Monitor After Push

```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# Check deployment status
npm run monitor:vercel:once
```

### Example 2: Continuous Monitoring

```bash
# Start monitoring in background
npm run monitor:vercel &

# Continue working...
# The script will notify you of new deployments
```

### Example 3: Check Last 10 Deployments

```bash
# First run shows last 10 commits/deployments
npm run monitor:vercel:once
```

## 📊 Output Explanation

The script provides detailed information:

```
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
```

### Status Indicators

- ✅ **READY**: Deployment successful and live
- 🔨 **BUILDING**: Currently building
- ❌ **ERROR**: Build or deployment failed
- ⏳ **QUEUED**: Waiting to start
- 🚫 **CANCELED**: Deployment was canceled
- 🔄 **INITIALIZING**: Starting up

### Log Types

- ❌ Error messages
- ⚠️ Warnings
- ℹ️ Information
- 💻 Commands executed
- 📤 Standard output
- 📛 Error output

## 🔄 State Management

The script maintains state in `.git-vercel-monitor-state.json`:

```json
{
  "lastCheckedCommit": "a1b2c3d4e5f6...",
  "timestamp": "2026-01-26T10:30:00.000Z"
}
```

This ensures you only see new commits on subsequent runs.

To reset and see all recent commits:

```bash
rm scripts/.git-vercel-monitor-state.json
npm run monitor:vercel:once
```

## 🐛 Troubleshooting

### Error: "VERCEL_TOKEN environment variable is required"

**Solution**: Set your Vercel token:
```bash
export VERCEL_TOKEN="your_token_here"
```

### Error: "Could not detect Vercel project ID"

**Solution 1**: Link your project to Vercel:
```bash
npx vercel link
```

**Solution 2**: Manually set project ID:
```bash
export VERCEL_PROJECT_ID="prj_xxxxxxxxxxxxx"
```

### No deployments showing up

**Possible causes**:
1. Commits haven't been pushed to the remote repository
2. Vercel hasn't triggered a deployment yet (check your Vercel dashboard)
3. Project ID is incorrect
4. Token doesn't have access to the project

**Solution**: 
```bash
# Check if commits are pushed
git log origin/main -5

# Verify Vercel integration in dashboard
open https://vercel.com/dashboard
```

### "Failed to fetch deployments" error

**Solution**: Check your token has the correct permissions:
1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Ensure token has "Read" access at minimum
3. For team projects, set `VERCEL_TEAM_ID`

## 🔐 Security Notes

- Never commit your `VERCEL_TOKEN` to git
- Add `.env.local` to `.gitignore` (already done in most Next.js projects)
- The state file (`.git-vercel-monitor-state.json`) is safe to commit
- Tokens can be revoked at any time in Vercel dashboard

## 🎯 Integration Ideas

### Use with CI/CD

```bash
# In your CI pipeline
- name: Check Deployment Status
  run: |
    export VERCEL_TOKEN=${{ secrets.VERCEL_TOKEN }}
    npm run monitor:vercel:once
```

### Use with Git Hooks

Create `.git/hooks/post-push`:

```bash
#!/bin/bash
export VERCEL_TOKEN="your_token_here"
npm run monitor:vercel:once
```

### Use with Cron

```bash
# Check every 5 minutes
*/5 * * * * cd /path/to/project && npm run monitor:vercel:once >> /var/log/vercel-monitor.log
```

## 📝 Customization

You can modify the script at `scripts/monitor-git-vercel.ts`:

- Change `checkInterval` (default: 60000ms = 60 seconds)
- Adjust number of commits/deployments to fetch
- Customize log output format
- Add notification integrations (Slack, Discord, email, etc.)

## 🤝 Contributing

Found a bug or have a feature request? Feel free to:
1. Modify the script directly
2. Add more integrations
3. Improve error handling
4. Add more detailed log parsing

---

**Happy monitoring! 🚀**
