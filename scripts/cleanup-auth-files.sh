#!/bin/bash

# Script to remove all auth-related files
# WARNING: This will delete files!

echo "🗑️  Cleaning up auth-related files..."

# Auth API routes
echo "Deleting auth API routes..."
rm -rf src/app/api/auth

# Auth pages
echo "Deleting auth pages..."
rm -rf src/app/\(auth\)

# Auth lib files
echo "Deleting auth lib files..."
rm -f src/lib/auth.ts
rm -f src/lib/auth-client.tsx
rm -f src/lib/auth-utils.ts
rm -f src/lib/stack.ts
rm -f src/lib/stack-client.tsx

# Auth components
echo "Deleting auth components..."
rm -rf src/components/auth

# Dashboard (uses auth)
echo "Deleting dashboard..."
rm -rf src/app/\(dashboard\)

# Admin components
echo "Deleting admin components..."
rm -rf src/components/admin

# Dashboard components
echo "Deleting dashboard components..."
rm -rf src/components/dashboard

# Progress API
echo "Deleting progress API..."
rm -f src/app/api/progress/route.ts

# Users API
echo "Deleting users API..."
rm -rf src/app/api/users

# Invitations API
echo "Deleting invitations API..."
rm -rf src/app/api/invitations

# Questions API
echo "Deleting questions API..."
rm -f src/app/api/questions/route.ts

echo ""
echo "✅ Auth files cleaned up!"
echo ""
echo "📝 Next steps:"
echo "   1. Reset Prisma schema to basic models"
echo "   2. Run: npx prisma migrate reset (or drop tables manually)"
echo "   3. Start fresh with a new auth setup"
