/**
 * Script to fix the production database on Vercel
 * This removes the role column from Better Auth's user table
 * 
 * Usage: Set DATABASE_URL environment variable to your production database
 * Then run: npx tsx scripts/fix-vercel-database.ts
 */

import pg from 'pg'

const { Client } = pg

async function fixVercelDatabase() {
  // Get DATABASE_URL from environment (should be production URL)
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set!')
    console.log('\n💡 Set it with:')
    console.log('   export DATABASE_URL="your-production-database-url"')
    console.log('\n⚠️  Make sure this is your PRODUCTION database URL!')
    process.exit(1)
  }

  // Warn if it looks like local database
  if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    console.warn('⚠️  WARNING: DATABASE_URL looks like a local database!')
    console.warn('   Make sure you\'re using the PRODUCTION database URL')
    console.log('\nContinue? (This script will modify the database)')
  }

  console.log('🔗 Connecting to database...')
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('✅ Connected\n')
    
    // Check and remove role column
    console.log('🔍 Checking for role column...')
    const check = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name = 'role'
      AND table_schema = 'public'
    `)
    
    if (check.rows.length === 0) {
      console.log('✅ No role column found - database is correct!')
      return
    }
    
    console.log('⚠️  Found role column - removing it...')
    await client.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`)
    console.log('✅ Role column removed!')
    console.log('\n🎉 Database fixed! Try signing up again.')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixVercelDatabase()
