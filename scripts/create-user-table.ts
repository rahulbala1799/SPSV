/**
 * Script to create the User table in Neon database
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

async function createUserTable() {
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
    console.log('🔗 Connected to database\n')
    
    // Check if table already exists
    const checkResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
    `)
    
    if (checkResult.rows.length > 0) {
      console.log('⚠️  Users table already exists')
      return
    }
    
    console.log('📦 Creating users table...\n')
    
    // Create users table
    await client.query(`
      CREATE TABLE "users" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT NOT NULL,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX "users_email_idx" ON "users"(email)
    `)
    
    console.log('✅ Users table created successfully!')
    console.log('\n📋 Table structure:')
    console.log('   - id (TEXT, PRIMARY KEY)')
    console.log('   - email (TEXT, UNIQUE, NOT NULL)')
    console.log('   - name (TEXT, nullable)')
    console.log('   - password (TEXT, NOT NULL) - hashed')
    console.log('   - emailVerified (BOOLEAN, default false)')
    console.log('   - createdAt (TIMESTAMP)')
    console.log('   - updatedAt (TIMESTAMP)')
    
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

createUserTable()
