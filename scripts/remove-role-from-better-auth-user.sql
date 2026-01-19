-- Run this SQL in your Neon database to remove the role column from Better Auth's user table
-- This fixes the enum conflict error

-- Check if the role column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user' 
AND column_name = 'role';

-- Remove the role column if it exists
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";

-- Verify it's removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user';
