#!/bin/bash

# Script to set Neon Auth environment variables in Vercel
# Run this after getting values from Neon Auth console

echo "🔐 Setting Neon Auth Environment Variables in Vercel"
echo ""
echo "You'll be prompted to enter each value."
echo "Get these from: https://console.neon.tech → Your Project → Auth tab"
echo ""

# Set for production
echo "📦 Setting PRODUCTION environment variables..."
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production
vercel env add STACK_SECRET_SERVER_KEY production

# Set for preview
echo ""
echo "📦 Setting PREVIEW environment variables..."
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID preview
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY preview
vercel env add STACK_SECRET_SERVER_KEY preview

# Set for development
echo ""
echo "📦 Setting DEVELOPMENT environment variables..."
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID development
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY development
vercel env add STACK_SECRET_SERVER_KEY development

echo ""
echo "✅ Done! Environment variables set for all environments."
echo "🚀 Your next deployment will use these values."
