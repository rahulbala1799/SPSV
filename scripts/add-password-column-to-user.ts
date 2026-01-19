/**
 * Script to add optional password column to Better Auth's user table
 * This is a workaround for Better Auth's Prisma adapter expecting this field
 */

import pg from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const envLocalPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
} else {
  dotenv.config()
}

const { Client } = pg

async function addPasswordColumn() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set!')
    process.exit(1)
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('🔧 Adding password column to Better Auth user table...\n')
    
    // Check if column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name = 'password'
      AND table_schema = 'public'
    `)
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Password column already exists')
      return
    }
    
    // Add the column
    await client.query(`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS password TEXT
    `)
    
    console.log('✅ Password column added successfully!')
    console.log('\n📝 Note: This is a workaround for Better Auth adapter.')
    console.log('   Passwords should still be stored in the account table.')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

addPasswordColumn()
