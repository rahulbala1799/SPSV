-- Remove role column from Better Auth's user table if it exists
-- This column was added by Better Auth's additionalFields but we don't need it
-- We manage roles in our own users table (plural)

ALTER TABLE "user" DROP COLUMN IF EXISTS "role";
