/**
 * Script to remove role column from Better Auth's user table
 * Uses DATABASE_URL from environment
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeRoleColumn() {
  try {
    console.log('🔍 Checking for role column in Better Auth user table...')
    
    // Check if role column exists
    const columns = await prisma.$queryRaw<Array<{column_name: string, data_type: string}>>`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name = 'role'
    `
    
    if (columns.length === 0) {
      console.log('✅ No role column found in Better Auth user table - already fixed!')
      return
    }
    
    console.log('⚠️  Found role column in Better Auth user table')
    console.log(`   Column: ${columns[0].column_name}, Type: ${columns[0].data_type}`)
    console.log('\n🗑️  Removing role column...')
    
    // Remove the role column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "user" DROP COLUMN IF EXISTS "role"
    `)
    
    console.log('✅ Role column removed successfully!')
    
    // Verify it's removed
    const remainingColumns = await prisma.$queryRaw<Array<{column_name: string}>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user'
      ORDER BY column_name
    `
    
    console.log('\n📋 Remaining columns in Better Auth user table:')
    remainingColumns.forEach(col => {
      console.log(`   - ${col.column_name}`)
    })
    
    console.log('\n🎉 Done! You can now try signing up again.')
    
  } catch (error: any) {
    console.error('❌ Error removing role column:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

removeRoleColumn()
