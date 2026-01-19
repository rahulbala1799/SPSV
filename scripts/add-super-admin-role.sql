-- Add SUPER_ADMIN to Role enum if it doesn't exist
-- Run this on your Neon database first

-- Check if SUPER_ADMIN exists in the enum, if not, add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'Role' 
        AND EXISTS (
            SELECT 1 FROM pg_enum WHERE enumlabel = 'SUPER_ADMIN' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Role')
        )
    ) THEN
        ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
    END IF;
END $$;
