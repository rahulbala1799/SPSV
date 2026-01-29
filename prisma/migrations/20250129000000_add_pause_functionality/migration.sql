-- AlterEnum
-- Add PAUSED to TestSessionStatus enum
ALTER TYPE "TestSessionStatus" ADD VALUE IF NOT EXISTS 'PAUSED';

-- AlterEnum
-- Add PAUSED to StudentTestStatus enum
ALTER TYPE "StudentTestStatus" ADD VALUE IF NOT EXISTS 'PAUSED';

-- AlterTable
-- Add pausedAt column to test_sessions table
ALTER TABLE "test_sessions" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);

-- AlterTable
-- Add pausedAt column to assigned_test_attempts table
ALTER TABLE "assigned_test_attempts" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);
