#!/bin/bash

##############################################################################
# Quick Vercel Deployment Check
# 
# A simple shell script to check recent Vercel deployments
# Requires: jq (brew install jq)
#
# Usage:
#   ./scripts/quick-vercel-check.sh
#   ./scripts/quick-vercel-check.sh [number_of_deployments]
##############################################################################

set -e

# Configuration
LIMIT=${1:-5}  # Default to 5 deployments

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is required but not installed.${NC}"
    echo "Install it with: brew install jq"
    exit 1
fi

# Check for VERCEL_TOKEN
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Error: VERCEL_TOKEN environment variable is required!${NC}"
    echo ""
    echo "Get your token from: https://vercel.com/account/tokens"
    echo ""
    echo "Then run:"
    echo "  export VERCEL_TOKEN='your_token_here'"
    echo "  ./scripts/quick-vercel-check.sh"
    exit 1
fi

# Try to get project ID from .vercel/project.json
PROJECT_ID="$VERCEL_PROJECT_ID"
if [ -z "$PROJECT_ID" ] && [ -f ".vercel/project.json" ]; then
    PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null || echo "")
fi

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Could not determine Vercel project ID${NC}"
    echo ""
    echo "Solutions:"
    echo "  1. Run: npx vercel link"
    echo "  2. Or set: export VERCEL_PROJECT_ID='prj_xxxxx'"
    exit 1
fi

echo -e "${BLUE}🔍 Fetching last $LIMIT Vercel deployments...${NC}"
echo ""

# Fetch deployments
TEAM_QUERY=""
if [ -n "$VERCEL_TEAM_ID" ]; then
    TEAM_QUERY="&teamId=$VERCEL_TEAM_ID"
fi

RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=$LIMIT$TEAM_QUERY")

# Check if request was successful
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error.message')
    echo -e "${RED}❌ Error: $ERROR_MSG${NC}"
    exit 1
fi

# Get latest git commit
LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s" 2>/dev/null || echo "Unable to fetch git info")

echo -e "${GREEN}📝 Latest Local Commit:${NC}"
echo "   $LATEST_COMMIT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Parse and display deployments
echo "$RESPONSE" | jq -r '.deployments[] | 
    "🚀 \(.state | 
        if . == "READY" then "✅ READY" 
        elif . == "BUILDING" then "🔨 BUILDING"
        elif . == "ERROR" then "❌ ERROR"
        elif . == "QUEUED" then "⏳ QUEUED"
        elif . == "CANCELED" then "🚫 CANCELED"
        else "❓ \(.)" 
        end) - \(.meta.githubCommitMessage // "No commit message")
   URL: https://\(.url)
   Commit: \(.meta.githubCommitSha[0:7] // "N/A")
   Target: \(.target // "production")
   Created: \(.created / 1000 | strftime("%Y-%m-%d %H:%M:%S"))
   By: \(.creator.username)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"'

echo ""
echo -e "${GREEN}✅ Done! Showing $LIMIT most recent deployments.${NC}"
echo ""
echo "Tips:"
echo "  • Get more deployments: ./scripts/quick-vercel-check.sh 10"
echo "  • View full logs: https://vercel.com/dashboard"
echo "  • Use advanced monitor: npm run monitor:vercel"
