#!/bin/bash

##############################################################################
# Vercel Monitor Setup Script
#
# Interactive setup for the Vercel deployment monitor
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      🚀 Vercel Deployment Monitor - Setup Wizard         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# Step 1: Check dependencies
echo -e "${BLUE}📦 Step 1: Checking dependencies...${NC}"
echo ""

HAS_NODE=false
HAS_NPM=false
HAS_JQ=false

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "  ${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    HAS_NODE=true
else
    echo -e "  ${RED}❌ Node.js: Not found${NC}"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "  ${GREEN}✅ npm: $NPM_VERSION${NC}"
    HAS_NPM=true
else
    echo -e "  ${RED}❌ npm: Not found${NC}"
fi

if command -v jq &> /dev/null; then
    JQ_VERSION=$(jq --version)
    echo -e "  ${GREEN}✅ jq: $JQ_VERSION${NC}"
    HAS_JQ=true
else
    echo -e "  ${YELLOW}⚠️  jq: Not found (optional, for shell script)${NC}"
fi

echo ""

if [ "$HAS_NODE" = false ] || [ "$HAS_NPM" = false ]; then
    echo -e "${RED}❌ Error: Node.js and npm are required!${NC}"
    echo ""
    echo "Install them from: https://nodejs.org/"
    exit 1
fi

if [ "$HAS_JQ" = false ]; then
    echo -e "${YELLOW}Note: jq is optional but recommended for the shell script.${NC}"
    echo "Install with: ${CYAN}brew install jq${NC}"
    echo ""
    read -p "Continue without jq? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Step 2: Get Vercel Token
echo ""
echo -e "${BLUE}🔑 Step 2: Vercel API Token${NC}"
echo ""

if [ -n "$VERCEL_TOKEN" ]; then
    echo -e "${GREEN}✅ VERCEL_TOKEN is already set!${NC}"
    echo ""
    read -p "Use existing token? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        unset VERCEL_TOKEN
    fi
fi

if [ -z "$VERCEL_TOKEN" ]; then
    echo "You need a Vercel API token to use this monitor."
    echo ""
    echo -e "${CYAN}Steps to get your token:${NC}"
    echo "  1. Visit: https://vercel.com/account/tokens"
    echo "  2. Click 'Create Token'"
    echo "  3. Give it a name (e.g., 'Deployment Monitor')"
    echo "  4. Copy the token"
    echo ""
    
    # Open browser
    read -p "Open Vercel tokens page in browser? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://vercel.com/account/tokens" 2>/dev/null || \
        xdg-open "https://vercel.com/account/tokens" 2>/dev/null || \
        echo "Please visit: https://vercel.com/account/tokens"
    fi
    
    echo ""
    read -p "Enter your Vercel token: " VERCEL_TOKEN
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}❌ No token provided. Exiting.${NC}"
        exit 1
    fi
fi

# Step 3: Detect or set project ID
echo ""
echo -e "${BLUE}🎯 Step 3: Project Configuration${NC}"
echo ""

PROJECT_ID="$VERCEL_PROJECT_ID"

if [ -z "$PROJECT_ID" ] && [ -f ".vercel/project.json" ]; then
    PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null || echo "")
    if [ -n "$PROJECT_ID" ]; then
        echo -e "${GREEN}✅ Auto-detected project ID from .vercel/project.json${NC}"
        echo "   Project ID: $PROJECT_ID"
    fi
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Project ID not found. Attempting to link project..."
    echo ""
    
    read -p "Run 'vercel link' to connect your project? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        VERCEL_TOKEN=$VERCEL_TOKEN npx vercel link
        
        if [ -f ".vercel/project.json" ]; then
            PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null || echo "")
            if [ -n "$PROJECT_ID" ]; then
                echo -e "${GREEN}✅ Project linked successfully!${NC}"
                echo "   Project ID: $PROJECT_ID"
            fi
        fi
    else
        echo ""
        echo "You can set it manually:"
        read -p "Enter Vercel project ID (or press Enter to skip): " PROJECT_ID
    fi
fi

# Step 4: Save to environment
echo ""
echo -e "${BLUE}💾 Step 4: Save Configuration${NC}"
echo ""

ENV_FILE=".env.local"

echo "Where would you like to save the configuration?"
echo "  1. .env.local (recommended)"
echo "  2. Shell profile (~/.zshrc or ~/.bashrc)"
echo "  3. Display only (don't save)"
echo ""

read -p "Choose option (1-3): " -n 1 -r SAVE_OPTION
echo ""
echo ""

case $SAVE_OPTION in
    1)
        # Save to .env.local
        if [ -f "$ENV_FILE" ]; then
            # Remove old entries
            sed -i.bak '/^VERCEL_TOKEN=/d' "$ENV_FILE" 2>/dev/null || true
            sed -i.bak '/^VERCEL_PROJECT_ID=/d' "$ENV_FILE" 2>/dev/null || true
        fi
        
        echo "VERCEL_TOKEN=\"$VERCEL_TOKEN\"" >> "$ENV_FILE"
        if [ -n "$PROJECT_ID" ]; then
            echo "VERCEL_PROJECT_ID=\"$PROJECT_ID\"" >> "$ENV_FILE"
        fi
        
        echo -e "${GREEN}✅ Saved to $ENV_FILE${NC}"
        echo ""
        echo "Note: Load variables with:"
        echo -e "  ${CYAN}source $ENV_FILE${NC}"
        ;;
    
    2)
        # Determine shell profile
        if [ -n "$ZSH_VERSION" ]; then
            PROFILE="$HOME/.zshrc"
        else
            PROFILE="$HOME/.bashrc"
        fi
        
        echo "" >> "$PROFILE"
        echo "# Vercel Monitor Configuration (added $(date))" >> "$PROFILE"
        echo "export VERCEL_TOKEN=\"$VERCEL_TOKEN\"" >> "$PROFILE"
        if [ -n "$PROJECT_ID" ]; then
            echo "export VERCEL_PROJECT_ID=\"$PROJECT_ID\"" >> "$PROFILE"
        fi
        
        echo -e "${GREEN}✅ Saved to $PROFILE${NC}"
        echo ""
        echo "Reload your shell or run:"
        echo -e "  ${CYAN}source $PROFILE${NC}"
        ;;
    
    3)
        # Just display
        echo -e "${YELLOW}Copy and paste these into your terminal:${NC}"
        echo ""
        echo -e "${CYAN}export VERCEL_TOKEN=\"$VERCEL_TOKEN\"${NC}"
        if [ -n "$PROJECT_ID" ]; then
            echo -e "${CYAN}export VERCEL_PROJECT_ID=\"$PROJECT_ID\"${NC}"
        fi
        ;;
esac

# Export for current session
export VERCEL_TOKEN="$VERCEL_TOKEN"
if [ -n "$PROJECT_ID" ]; then
    export VERCEL_PROJECT_ID="$PROJECT_ID"
fi

# Step 5: Test connection
echo ""
echo -e "${BLUE}🧪 Step 5: Testing Connection${NC}"
echo ""

echo "Testing Vercel API connection..."

TEST_RESULT=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v2/user" 2>&1)

if echo "$TEST_RESULT" | grep -q "username"; then
    USERNAME=$(echo "$TEST_RESULT" | jq -r '.user.username' 2>/dev/null || echo "Unknown")
    echo -e "${GREEN}✅ Connection successful!${NC}"
    echo "   Logged in as: $USERNAME"
else
    echo -e "${RED}❌ Connection failed!${NC}"
    echo "   Please check your token and try again."
    exit 1
fi

# Step 6: Run first check
echo ""
echo -e "${BLUE}🚀 Step 6: First Run${NC}"
echo ""

echo "Setup complete! Ready to run the monitor."
echo ""
echo "Choose what to do:"
echo "  1. Run quick check (shell script)"
echo "  2. Run full check (TypeScript script)"
echo "  3. Start continuous monitoring"
echo "  4. Exit (run manually later)"
echo ""

read -p "Choose option (1-4): " -n 1 -r RUN_OPTION
echo ""
echo ""

case $RUN_OPTION in
    1)
        if [ "$HAS_JQ" = true ]; then
            ./scripts/quick-vercel-check.sh
        else
            echo -e "${RED}❌ jq is required for the shell script${NC}"
            echo "Install with: brew install jq"
        fi
        ;;
    
    2)
        npm run monitor:vercel:once
        ;;
    
    3)
        echo -e "${YELLOW}Starting continuous monitoring...${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        npm run monitor:vercel
        ;;
    
    4)
        echo -e "${GREEN}Setup complete!${NC}"
        ;;
esac

# Final instructions
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   ✅ Setup Complete!                      ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Available commands:"
echo -e "  ${CYAN}npm run monitor:vercel:once${NC}      # One-time check"
echo -e "  ${CYAN}npm run monitor:vercel${NC}           # Continuous monitoring"
echo -e "  ${CYAN}./scripts/quick-vercel-check.sh${NC}  # Quick shell check"
echo ""
echo "Documentation:"
echo -e "  ${CYAN}cat GIT_VERCEL_MONITOR_GUIDE.md${NC}  # Full guide"
echo -e "  ${CYAN}cat MONITOR_SCRIPTS_README.md${NC}    # Quick reference"
echo ""
echo -e "${YELLOW}Happy monitoring! 🎉${NC}"
