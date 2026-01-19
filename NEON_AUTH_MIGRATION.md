# Neon Auth Migration Plan

## Overview
Switching from NextAuth.js to Neon Auth for simpler, more reliable authentication.

## Steps

### 1. Enable Neon Auth in Neon Console
- Go to Neon Dashboard → Your Project → Auth tab
- Enable Neon Auth
- Get your credentials:
  - `NEXT_PUBLIC_STACK_PROJECT_ID`
  - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
  - `STACK_SECRET_SERVER_KEY`

### 2. Install Dependencies
```bash
npm install @stackframe/stack
```

### 3. Set Environment Variables
Add to `.env.local` and Vercel:
```
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key
DATABASE_URL=your_neon_connection_string
```

### 4. Files to Replace
- `src/lib/auth.ts` → Use Neon Auth SDK
- `src/app/api/auth/[...nextauth]/route.ts` → Remove (Neon Auth handles this)
- `src/lib/auth-utils.ts` → Update to use Neon Auth
- `src/app/(auth)/login/page.tsx` → Update to use Neon Auth
- `src/components/auth/LoginForm.tsx` → Update for Neon Auth

### 5. User Migration
- Existing users in `users` table need to be migrated to Neon Auth
- Roles (SUPER_ADMIN, ADMIN, STUDENT) stored in Neon Auth metadata

### 6. Benefits
- ✅ Managed authentication service
- ✅ Built-in signup/login flows
- ✅ Email verification
- ✅ Password reset
- ✅ OAuth providers
- ✅ No custom auth code to maintain
