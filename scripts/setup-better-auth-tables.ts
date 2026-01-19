/**
 * Script to ensure Better Auth tables exist
 * Better Auth should create tables automatically, but this helps verify
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTables() {
  try {
    console.log('🔍 Checking Better Auth tables...')
    
    // Check if Better Auth user table exists
    const tables = await prisma.$queryRaw<Array<{tablename: string}>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('user', 'session', 'account', 'verification')
    `
    
    console.log('📋 Found tables:', tables.map(t => t.tablename))
    
    if (tables.length === 0) {
      console.log('⚠️  Better Auth tables not found!')
      console.log('   Better Auth should create them automatically on first use.')
      console.log('   If you see errors, try signing up again - tables will be created.')
    } else {
      console.log('✅ Better Auth tables exist!')
    }
    
  } catch (error: any) {
    console.error('❌ Error checking tables:', error.message)
    console.log('\n💡 Better Auth will create tables automatically on first use.')
  } finally {
    await prisma.$disconnect()
  }
}

checkTables()
