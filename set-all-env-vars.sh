#!/bin/bash

# Script to set all Neon Auth and Database environment variables in Vercel
# Run this script and paste values when prompted

echo "🔐 Setting Environment Variables in Vercel"
echo ""
echo "You'll be prompted to enter each value."
echo ""

# Database URL (you provided this)
echo "📦 Setting DATABASE_URL for PRODUCTION..."
echo "Paste: postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
vercel env add DATABASE_URL production

# Stack Auth Credentials (you need to provide the actual values, not masked)
echo ""
echo "📦 Setting Stack Auth credentials for PRODUCTION..."
echo "Enter NEXT_PUBLIC_STACK_PROJECT_ID (replace asterisks with actual value):"
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production

echo ""
echo "Enter NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY (replace asterisks with actual value):"
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production

echo ""
echo "Enter STACK_SECRET_SERVER_KEY (replace asterisks with actual value):"
vercel env add STACK_SECRET_SERVER_KEY production

# Also set for preview and development
echo ""
echo "📦 Setting for PREVIEW environment..."
vercel env add DATABASE_URL preview
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID preview
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY preview
vercel env add STACK_SECRET_SERVER_KEY preview

echo ""
echo "📦 Setting for DEVELOPMENT environment..."
vercel env add DATABASE_URL development
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID development
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY development
vercel env add STACK_SECRET_SERVER_KEY development

echo ""
echo "✅ Done! All environment variables set."
echo "🚀 Your next deployment will use these values."
