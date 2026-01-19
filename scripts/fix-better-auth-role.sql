-- Fix Better Auth user table role issue
-- Run this in your Neon database SQL editor

-- Check if Better Auth's user table has a role column
-- If it does and it's causing enum conflicts, we need to either:
-- 1. Remove the role column from Better Auth's user table
-- 2. Or change it to a text/varchar type instead of enum

-- First, check what columns exist in the user table
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'user' 
AND table_schema = 'public';

-- If there's a role column with enum type, we can:
-- Option 1: Drop the role column (if no data depends on it)
-- ALTER TABLE "user" DROP COLUMN IF EXISTS role;

-- Option 2: Change it to text type (if we need to keep it)
-- ALTER TABLE "user" ALTER COLUMN role TYPE text;

-- Better Auth should manage its own schema, so we shouldn't need role in its user table
-- Our roles are managed in the 'users' table (plural)
