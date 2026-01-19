/**
 * Script to remove role column from Better Auth's user table
 * Uses DATABASE_URL directly with pg library
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

async function removeRoleColumn() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set!')
    console.log('\n💡 Set it with:')
    console.log('   export DATABASE_URL="your-database-url"')
    console.log('   Or add it to .env.local')
    process.exit(1)
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')
    
    console.log('\n🔍 Checking for role column in Better Auth user table...')
    
    // First, check what tables exist
    const tablesResult = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('user', 'users')
      AND table_schema = 'public'
    `)
    
    console.log('📋 Found tables:', tablesResult.rows)
    
    // Check if user table exists (Better Auth's table)
    const userTableExists = tablesResult.rows.some(row => row.table_name === 'user')
    
    if (!userTableExists) {
      console.log('⚠️  Better Auth user table does not exist yet.')
      console.log('   It will be created automatically on first signup.')
      console.log('   The error might be from a previous attempt.')
      console.log('\n💡 Try signing up again - Better Auth will create the tables.')
      return
    }
    
    // Check if role column exists in user table
    const checkResult = await client.query(`
      SELECT table_schema, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name = 'role'
      AND table_schema = 'public'
    `)
    
    if (checkResult.rows.length === 0) {
      console.log('✅ No role column found in Better Auth user table - already fixed!')
      return
    }
    
    const foundColumn = checkResult.rows[0]
    console.log('⚠️  Found role column in Better Auth user table')
    console.log(`   Schema: ${foundColumn.table_schema}`)
    console.log(`   Column: ${foundColumn.column_name}, Type: ${foundColumn.data_type}`)
    console.log('\n🗑️  Removing role column...')
    
    // Remove the role column
    await client.query(`
      ALTER TABLE "user" DROP COLUMN IF EXISTS "role"
    `)
    
    console.log('✅ Role column removed successfully!')
    
    // Verify it's removed
    const verifyResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user'
      AND table_schema = 'public'
      ORDER BY column_name
    `)
    
    console.log('\n📋 Remaining columns in Better Auth user table:')
    verifyResult.rows.forEach((row: any) => {
      console.log(`   - ${row.column_name}`)
    })
    
    console.log('\n🎉 Done! You can now try signing up again.')
    
  } catch (error: any) {
    console.error('❌ Error removing role column:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

removeRoleColumn()
