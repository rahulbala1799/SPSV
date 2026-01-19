# Fix: Better Auth Role Column Error

## Problem
Better Auth's `user` table in your database still has a `role` column from when we had `additionalFields` configured. This is causing the error:

```
Value 'SUPER_ADMIN' not found in enum 'Role'
```

## Solution
Remove the `role` column from Better Auth's `user` table in your Neon database.

## Steps to Fix

### Option 1: Using Neon Console (Easiest)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click on **SQL Editor**
4. Run this SQL:

```sql
-- Remove role column from Better Auth's user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";
```

5. Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Option 2: Using the SQL Script

I've created a script: `scripts/remove-role-from-better-auth-user.sql`

You can copy the SQL from that file and run it in Neon Console.

## Why This Happened

1. We initially configured Better Auth with `additionalFields: { role }`
2. Better Auth created a `role` column in its `user` table
3. We later removed `role` from the config (since we manage roles in our `users` table)
4. But the database column still exists with data
5. Prisma tries to query it and validates against our `Role` enum, causing the error

## After Fixing

Once you remove the column:
1. ✅ Sign up should work
2. ✅ Better Auth will use its `user` table for authentication only
3. ✅ We'll manage roles in our `users` table (as designed)

## Verify It's Fixed

After running the SQL, try signing up again. The error should be gone!
