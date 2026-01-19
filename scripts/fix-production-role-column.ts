/**
 * Script to fix role column issue in production database
 * Run this to check and remove role column from Better Auth's user table
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

async function fixRoleColumn() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set!')
    console.log('\n💡 For production, you can set it:')
    console.log('   export DATABASE_URL="your-production-database-url"')
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
    
    // Check if user table exists and has role column
    console.log('🔍 Checking Better Auth user table...')
    const checkResult = await client.query(`
      SELECT 
        c.column_name,
        c.data_type,
        c.udt_name
      FROM information_schema.columns c
      WHERE c.table_name = 'user' 
      AND c.table_schema = 'public'
      AND c.column_name = 'role'
    `)
    
    if (checkResult.rows.length === 0) {
      console.log('✅ No role column found - table is correct!')
      
      // Show all columns for verification
      const allColumns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'user'
        AND table_schema = 'public'
        ORDER BY column_name
      `)
      
      console.log('\n📋 Columns in user table:')
      allColumns.rows.forEach((row: any) => {
        console.log(`   - ${row.column_name} (${row.data_type})`)
      })
      
      return
    }
    
    console.log('⚠️  Found role column in user table!')
    console.log(`   Type: ${checkResult.rows[0].data_type}`)
    console.log(`   UDT: ${checkResult.rows[0].udt_name}`)
    
    // Check if there's any data with role values
    const dataCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM "user"
      WHERE role IS NOT NULL
    `)
    
    const rowCount = parseInt(dataCheck.rows[0].count)
    if (rowCount > 0) {
      console.log(`\n⚠️  Found ${rowCount} rows with role values`)
      console.log('   Removing role column (data will be lost for this column only)...')
    }
    
    console.log('\n🗑️  Removing role column...')
    await client.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`)
    console.log('✅ Role column removed successfully!')
    
    // Verify
    const verifyResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND table_schema = 'public'
      AND column_name = 'role'
    `)
    
    if (verifyResult.rows.length === 0) {
      console.log('\n✅ Verified: Role column is removed')
    } else {
      console.log('\n⚠️  Warning: Role column still exists')
    }
    
    // Show final columns
    const finalColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND table_schema = 'public'
      ORDER BY column_name
    `)
    
    console.log('\n📋 Final columns in user table:')
    finalColumns.rows.forEach((row: any) => {
      console.log(`   - ${row.column_name} (${row.data_type})`)
    })
    
    console.log('\n🎉 Done! Try signing up again.')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixRoleColumn()
