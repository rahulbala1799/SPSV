/**
 * Script to create Better Auth tables with correct schema
 * This ensures tables are created without role column
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

async function createBetterAuthTables() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set!')
    process.exit(1)
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')
    
    // Check if user table exists
    const checkResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'user' 
      AND table_schema = 'public'
    `)
    
    if (checkResult.rows.length > 0) {
      console.log('⚠️  Better Auth user table already exists')
      console.log('   Checking for role column...')
      
      const roleCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user' 
        AND column_name = 'role'
        AND table_schema = 'public'
      `)
      
      if (roleCheck.rows.length > 0) {
        console.log('   Found role column - removing it...')
        await client.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`)
        console.log('   ✅ Role column removed')
      } else {
        console.log('   ✅ No role column found')
      }
      return
    }
    
    console.log('\n📦 Creating Better Auth tables...')
    
    // Create user table (without role column)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        name TEXT,
        image TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    console.log('   ✅ Created user table')
    
    // Create session table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        "expiresAt" TIMESTAMP NOT NULL,
        token TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
      )
    `)
    console.log('   ✅ Created session table')
    
    // Create index on session.userId
    await client.query(`
      CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId")
    `)
    
    // Create account table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "expiresAt" TIMESTAMP,
        password TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE,
        UNIQUE ("providerId", "accountId")
      )
    `)
    console.log('   ✅ Created account table')
    
    // Create indexes on account
    await client.query(`
      CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId")
    `)
    
    // Create verification table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (identifier, value)
      )
    `)
    console.log('   ✅ Created verification table')
    
    console.log('\n🎉 Better Auth tables created successfully!')
    console.log('   You can now try signing up.')
    
  } catch (error: any) {
    console.error('❌ Error creating tables:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

createBetterAuthTables()
