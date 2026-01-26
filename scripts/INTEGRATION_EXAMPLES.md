# Integration Examples for Vercel Monitor

This document provides practical examples for integrating the Vercel deployment monitor into your workflow.

## 📌 Table of Contents

1. [Git Hooks](#git-hooks)
2. [Package.json Scripts](#packagejson-scripts)
3. [CI/CD Pipelines](#cicd-pipelines)
4. [Cron Jobs](#cron-jobs)
5. [Watch Mode](#watch-mode)
6. [Notification Integration](#notification-integration)

---

## 🪝 Git Hooks

### Post-Push Hook

Automatically check deployment status after pushing to GitHub:

**Create `.git/hooks/post-push`:**

```bash
#!/bin/bash

echo "📦 Checking Vercel deployment status..."
npm run monitor:vercel:once
```

**Make it executable:**

```bash
chmod +x .git/hooks/post-push
```

### Pre-Push Hook (with confirmation)

Check status before pushing:

**Create `.git/hooks/pre-push`:**

```bash
#!/bin/bash

echo "🔍 Checking recent Vercel deployments..."
npm run monitor:vercel:once

read -p "Proceed with push? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi
```

### Using Husky

If you're using Husky for git hooks:

```bash
# Install Husky
npm install --save-dev husky

# Initialize
npx husky init

# Add post-push hook
echo "npm run monitor:vercel:once" > .husky/post-push
chmod +x .husky/post-push
```

---

## 📦 Package.json Scripts

Add convenient npm scripts for common workflows:

```json
{
  "scripts": {
    "deploy": "git push && npm run monitor:vercel:once",
    "deploy:watch": "git push && npm run monitor:vercel",
    "status": "npm run monitor:vercel:once",
    "status:quick": "./scripts/quick-vercel-check.sh",
    "vercel:logs": "npm run monitor:vercel:once | grep -i error",
    "vercel:errors": "npm run monitor:vercel:once | grep -i -A 5 'error\\|failed'"
  }
}
```

**Usage:**

```bash
npm run deploy          # Push and check once
npm run deploy:watch    # Push and monitor continuously
npm run status          # Check current status
npm run status:quick    # Quick status with shell script
npm run vercel:logs     # Show only errors
```

---

## 🔄 CI/CD Pipelines

### GitHub Actions

**`.github/workflows/deploy-monitor.yml`:**

```yaml
name: Monitor Vercel Deployment

on:
  push:
    branches: [main, production]

jobs:
  monitor:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Get all history for git log
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Wait for deployment
        run: sleep 60  # Wait for Vercel to start deployment
      
      - name: Check Vercel deployment
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: npm run monitor:vercel:once
      
      - name: Check for deployment errors
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm run monitor:vercel:once | grep -q "ERROR" && exit 1 || exit 0
```

**Add secrets in GitHub:**
- Go to Settings → Secrets and variables → Actions
- Add `VERCEL_TOKEN` and `VERCEL_PROJECT_ID`

### GitLab CI

**`.gitlab-ci.yml`:**

```yaml
stages:
  - deploy
  - monitor

monitor-deployment:
  stage: monitor
  image: node:18
  only:
    - main
    - production
  script:
    - npm ci
    - npm run monitor:vercel:once
  variables:
    VERCEL_TOKEN: $VERCEL_TOKEN
    VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID
  allow_failure: true
```

### Bitbucket Pipelines

**`bitbucket-pipelines.yml`:**

```yaml
pipelines:
  branches:
    main:
      - step:
          name: Monitor Vercel Deployment
          image: node:18
          script:
            - npm ci
            - npm run monitor:vercel:once
          after-script:
            - if npm run monitor:vercel:once | grep -q "ERROR"; then exit 1; fi
```

---

## ⏰ Cron Jobs

### Linux/Mac Cron

Monitor deployments every 5 minutes:

```bash
# Edit crontab
crontab -e

# Add this line (adjust path to your project)
*/5 * * * * cd /Users/rahul/Documents/1\ New\ Apps/Inv\ App/Stij && /usr/local/bin/npm run monitor:vercel:once >> /var/log/vercel-monitor.log 2>&1

# Or use the shell script for faster execution
*/5 * * * * cd /Users/rahul/Documents/1\ New\ Apps/Inv\ App/Stij && ./scripts/quick-vercel-check.sh >> /var/log/vercel-monitor.log 2>&1
```

### Launchd (Mac - Recommended)

**Create `~/Library/LaunchAgents/com.vercel.monitor.plist`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vercel.monitor</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>run</string>
        <string>monitor:vercel:once</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>/Users/rahul/Documents/1 New Apps/Inv App/Stij</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>VERCEL_TOKEN</key>
        <string>your_token_here</string>
    </dict>
    
    <key>StartInterval</key>
    <integer>300</integer>
    
    <key>StandardOutPath</key>
    <string>/tmp/vercel-monitor.log</string>
    
    <key>StandardErrorPath</key>
    <string>/tmp/vercel-monitor.error.log</string>
</dict>
</plist>
```

**Load the service:**

```bash
launchctl load ~/Library/LaunchAgents/com.vercel.monitor.plist
launchctl start com.vercel.monitor
```

---

## 👁️ Watch Mode

### Using fswatch (Mac)

Watch for file changes and check deployments:

```bash
# Install fswatch
brew install fswatch

# Watch for changes and check
fswatch -o . | xargs -n1 -I{} npm run monitor:vercel:once
```

### Using nodemon

```bash
# Install nodemon
npm install -g nodemon

# Watch package.json for changes (after git push)
nodemon --watch package.json --exec "npm run monitor:vercel:once"
```

### Custom Watch Script

**Create `scripts/watch-and-monitor.sh`:**

```bash
#!/bin/bash

LAST_COMMIT=$(git rev-parse HEAD)

while true; do
    CURRENT_COMMIT=$(git rev-parse HEAD)
    
    if [ "$LAST_COMMIT" != "$CURRENT_COMMIT" ]; then
        echo "🔍 New commit detected, checking deployment..."
        npm run monitor:vercel:once
        LAST_COMMIT=$CURRENT_COMMIT
    fi
    
    sleep 30
done
```

---

## 🔔 Notification Integration

### Slack Webhook

**Modify the TypeScript script or create wrapper:**

```bash
#!/bin/bash

# Run monitor and capture output
OUTPUT=$(npm run monitor:vercel:once)

# Check for errors
if echo "$OUTPUT" | grep -q "ERROR"; then
    # Send to Slack
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"⚠️ Vercel Deployment Error\\n\`\`\`$OUTPUT\`\`\`\"}" \
        $SLACK_WEBHOOK_URL
fi
```

### Discord Webhook

```bash
#!/bin/bash

OUTPUT=$(npm run monitor:vercel:once)

curl -X POST -H 'Content-type: application/json' \
    --data "{\"content\":\"📦 Vercel Deployment Status\\n\`\`\`$OUTPUT\`\`\`\"}" \
    $DISCORD_WEBHOOK_URL
```

### macOS Notification

```bash
#!/bin/bash

OUTPUT=$(npm run monitor:vercel:once)

if echo "$OUTPUT" | grep -q "READY"; then
    osascript -e 'display notification "✅ Deployment successful!" with title "Vercel Monitor"'
elif echo "$OUTPUT" | grep -q "ERROR"; then
    osascript -e 'display notification "❌ Deployment failed!" with title "Vercel Monitor" sound name "Basso"'
fi
```

### Email Notification

**Using `mail` command:**

```bash
#!/bin/bash

OUTPUT=$(npm run monitor:vercel:once)

if echo "$OUTPUT" | grep -q "ERROR"; then
    echo "$OUTPUT" | mail -s "Vercel Deployment Error" your-email@example.com
fi
```

---

## 🧪 Testing & Development

### Test Mode Script

**Create `scripts/test-monitor.sh`:**

```bash
#!/bin/bash

echo "🧪 Testing Vercel Monitor..."
echo ""

# Test 1: Check dependencies
echo "1. Checking dependencies..."
command -v node >/dev/null 2>&1 && echo "  ✅ Node.js" || echo "  ❌ Node.js"
command -v npm >/dev/null 2>&1 && echo "  ✅ npm" || echo "  ❌ npm"
command -v git >/dev/null 2>&1 && echo "  ✅ git" || echo "  ❌ git"

# Test 2: Check environment variables
echo ""
echo "2. Checking environment..."
[ -n "$VERCEL_TOKEN" ] && echo "  ✅ VERCEL_TOKEN set" || echo "  ❌ VERCEL_TOKEN not set"
[ -n "$VERCEL_PROJECT_ID" ] && echo "  ✅ VERCEL_PROJECT_ID set" || echo "  ⚠️  VERCEL_PROJECT_ID not set (will auto-detect)"

# Test 3: Run quick check
echo ""
echo "3. Running quick check..."
npm run monitor:vercel:once

echo ""
echo "✅ Test complete!"
```

---

## 📱 Mobile Notifications (Advanced)

### Using Pushover

```bash
#!/bin/bash

OUTPUT=$(npm run monitor:vercel:once)

if echo "$OUTPUT" | grep -q "READY"; then
    curl -s \
        --form-string "token=YOUR_APP_TOKEN" \
        --form-string "user=YOUR_USER_KEY" \
        --form-string "message=Deployment successful!" \
        https://api.pushover.net/1/messages.json
fi
```

### Using Telegram Bot

```bash
#!/bin/bash

OUTPUT=$(npm run monitor:vercel:once)
BOT_TOKEN="your_bot_token"
CHAT_ID="your_chat_id"

curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
    -d chat_id=$CHAT_ID \
    -d text="📦 Vercel Status: $OUTPUT"
```

---

## 🎛️ Advanced Custom Integration

### Create Custom Dashboard

**`scripts/deployment-dashboard.html`:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Vercel Deployment Dashboard</title>
    <meta http-equiv="refresh" content="60">
    <style>
        body { font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; }
        .status { padding: 10px; margin: 10px 0; border: 1px solid #00ff00; }
        .ready { border-color: #00ff00; }
        .error { border-color: #ff0000; color: #ff0000; }
    </style>
</head>
<body>
    <h1>🚀 Vercel Deployment Dashboard</h1>
    <div id="status">Loading...</div>
    
    <script>
        async function updateStatus() {
            // Call your monitoring API or parse output
            const response = await fetch('/api/deployment-status');
            const data = await response.json();
            document.getElementById('status').innerHTML = data.html;
        }
        
        updateStatus();
        setInterval(updateStatus, 60000);
    </script>
</body>
</html>
```

---

## 💡 Best Practices

1. **Use the right tool for the job:**
   - One-time checks: Shell script (fast)
   - Continuous monitoring: TypeScript script (detailed)
   - CI/CD: TypeScript script (structured output)

2. **Secure your tokens:**
   - Never commit tokens to git
   - Use environment variables or secrets managers
   - Rotate tokens periodically

3. **Monitor appropriately:**
   - Don't spam the API (respect rate limits)
   - Use continuous mode during active development
   - Use cron jobs for passive monitoring

4. **Handle failures gracefully:**
   - Don't fail builds for monitoring errors
   - Log errors for debugging
   - Set up alerts for critical failures

---

**Happy integrating! 🎉**

For more information, see:
- [MONITOR_SCRIPTS_README.md](./MONITOR_SCRIPTS_README.md)
- [GIT_VERCEL_MONITOR_GUIDE.md](./GIT_VERCEL_MONITOR_GUIDE.md)
