/**
 * Script to run the pause functionality migration on Neon DB
 * 
 * Usage:
 *   DATABASE_URL="your-neon-url" npx tsx scripts/run-pause-migration.ts
 */

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set!')
    console.log('\nUsage:')
    console.log('  DATABASE_URL="your-db-url" npx tsx scripts/run-pause-migration.ts')
    process.exit(1)
  }

  console.log('🔄 Running pause functionality migration...\n')

  try {
    // Run migration SQL
    await prisma.$executeRawUnsafe(`
      -- Add PAUSED to TestSessionStatus enum
      ALTER TYPE "TestSessionStatus" ADD VALUE IF NOT EXISTS 'PAUSED';
    `)
    console.log('✅ Added PAUSED to TestSessionStatus enum')

    await prisma.$executeRawUnsafe(`
      -- Add PAUSED to StudentTestStatus enum
      ALTER TYPE "StudentTestStatus" ADD VALUE IF NOT EXISTS 'PAUSED';
    `)
    console.log('✅ Added PAUSED to StudentTestStatus enum')

    await prisma.$executeRawUnsafe(`
      -- Add pausedAt column to test_sessions table
      ALTER TABLE "test_sessions" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);
    `)
    console.log('✅ Added pausedAt column to test_sessions table')

    await prisma.$executeRawUnsafe(`
      -- Add pausedAt column to assigned_test_attempts table
      ALTER TABLE "assigned_test_attempts" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);
    `)
    console.log('✅ Added pausedAt column to assigned_test_attempts table')

    console.log('\n✅ Migration completed successfully!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runMigration()
