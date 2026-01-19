/**
 * Migration script to remove role column from Better Auth's user table
 * Uses DATABASE_URL from environment
 */

import pg from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load .env.local if it exists
const envLocalPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
} else {
  dotenv.config()
}

const { Client } = pg

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set!')
    console.log('\n💡 Set it with:')
    console.log('   export DATABASE_URL="your-database-url"')
    process.exit(1)
  }

  console.log('🔗 Connecting to database...')
  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')
    
    console.log('📋 Running migration: Remove role column from Better Auth user table\n')
    
    // Step 1: Check if user table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'user' 
      AND table_schema = 'public'
    `)
    
    if (tableCheck.rows.length === 0) {
      console.log('⚠️  Better Auth user table does not exist yet.')
      console.log('   It will be created automatically on first signup.')
      console.log('   No migration needed.')
      return
    }
    
    console.log('✅ User table exists')
    
    // Step 2: Check if role column exists
    const columnCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name = 'role'
      AND table_schema = 'public'
    `)
    
    if (columnCheck.rows.length === 0) {
      console.log('✅ Role column does not exist - migration not needed')
      return
    }
    
    console.log(`⚠️  Found role column (type: ${columnCheck.rows[0].data_type})`)
    
    // Step 3: Check for any data in role column
    const dataCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM "user"
      WHERE role IS NOT NULL
    `)
    
    const rowCount = parseInt(dataCheck.rows[0].count)
    if (rowCount > 0) {
      console.log(`⚠️  Found ${rowCount} rows with role values`)
      console.log('   These will be lost when we remove the column')
    }
    
    // Step 4: Remove the role column
    console.log('\n🗑️  Removing role column...')
    await client.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`)
    console.log('✅ Role column removed successfully!')
    
    // Step 5: Verify
    const verifyCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND table_schema = 'public'
      AND column_name = 'role'
    `)
    
    if (verifyCheck.rows.length === 0) {
      console.log('✅ Verified: Role column has been removed')
    } else {
      console.log('❌ Error: Role column still exists!')
      process.exit(1)
    }
    
    // Show final schema
    const finalSchema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND table_schema = 'public'
      ORDER BY column_name
    `)
    
    console.log('\n📋 Final user table schema:')
    finalSchema.rows.forEach((row: any) => {
      console.log(`   - ${row.column_name} (${row.data_type})`)
    })
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('   You can now try signing up again.')
    
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected from database')
  }
}

runMigration()
