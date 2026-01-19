/**
 * Script to drop ALL tables from the database
 * WARNING: This will delete all data!
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

async function dropAllTables() {
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
    console.log('🗑️  Dropping all tables...\n')
    
    // Get all table names
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)
    
    const tables = tablesResult.rows.map(row => row.tablename)
    
    if (tables.length === 0) {
      console.log('✅ No tables found - database is already empty')
      return
    }
    
    console.log(`Found ${tables.length} table(s):`)
    tables.forEach(table => console.log(`   - ${table}`))
    console.log('')
    
    // Disable foreign key checks temporarily (PostgreSQL doesn't have this, but we'll drop in order)
    // Drop tables with CASCADE to handle foreign keys
    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
        console.log(`✅ Dropped table: ${table}`)
      } catch (error: any) {
        console.error(`⚠️  Error dropping ${table}: ${error.message}`)
      }
    }
    
    // Also drop any sequences
    const sequencesResult = await client.query(`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `)
    
    if (sequencesResult.rows.length > 0) {
      console.log('\n🗑️  Dropping sequences...')
      for (const seq of sequencesResult.rows) {
        try {
          await client.query(`DROP SEQUENCE IF EXISTS "${seq.sequence_name}" CASCADE`)
          console.log(`✅ Dropped sequence: ${seq.sequence_name}`)
        } catch (error: any) {
          console.error(`⚠️  Error dropping sequence ${seq.sequence_name}: ${error.message}`)
        }
      }
    }
    
    console.log('\n🎉 All tables and sequences dropped!')
    console.log('   Database is now clean and ready for a fresh start.')
    
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

dropAllTables()
