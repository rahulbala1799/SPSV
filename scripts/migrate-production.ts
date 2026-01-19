/**
 * Migration script to remove role column from Better Auth's user table
 * Can be run with production DATABASE_URL
 * 
 * Usage:
 *   DATABASE_URL="your-production-url" npx tsx scripts/migrate-production.ts
 * 
 * Or set DATABASE_URL in environment and run:
 *   npx tsx scripts/migrate-production.ts
 */

import pg from 'pg'

const { Client } = pg

async function migrateProduction() {
  // Get DATABASE_URL from command line arg or environment
  const databaseUrl = process.argv[2] || process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not provided!')
    console.log('\nUsage:')
    console.log('  DATABASE_URL="your-db-url" npx tsx scripts/migrate-production.ts')
    console.log('  OR')
    console.log('  npx tsx scripts/migrate-production.ts "your-db-url"')
    process.exit(1)
  }

  // Show which database we're connecting to (masked)
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@')
  console.log('🔗 Connecting to database...')
  console.log(`   URL: ${maskedUrl}\n`)

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('✅ Connected\n')
    
    console.log('📋 Migration: Remove role column from Better Auth user table\n')
    
    // Check if user table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user'
      )
    `)
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  User table does not exist yet.')
      console.log('   Better Auth will create it automatically on first signup.')
      return
    }
    
    // Check if role column exists
    const roleExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user' 
        AND column_name = 'role'
      )
    `)
    
    if (!roleExists.rows[0].exists) {
      console.log('✅ Role column does not exist - database is already correct!')
      return
    }
    
    console.log('⚠️  Found role column - removing it...')
    
    // Remove the role column
    await client.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`)
    
    // Verify removal
    const verify = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user' 
        AND column_name = 'role'
      )
    `)
    
    if (verify.rows[0].exists) {
      console.log('❌ Error: Role column still exists!')
      process.exit(1)
    }
    
    console.log('✅ Role column removed successfully!')
    console.log('\n🎉 Migration completed!')
    console.log('   The database is now ready for Better Auth signup.')
    
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrateProduction()
