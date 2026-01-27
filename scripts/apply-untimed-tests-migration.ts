/**
 * Script to apply the untimed tests migration directly to production database
 * 
 * Usage:
 *   DATABASE_URL="your-db-url" npx tsx scripts/apply-untimed-tests-migration.ts
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

const { Client } = pg

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not provided!')
    console.log('\nUsage:')
    console.log('  DATABASE_URL="your-db-url" npx tsx scripts/apply-untimed-tests-migration.ts')
    process.exit(1)
  }

  // Mask password in URL for logging
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

    // Read the migration SQL file
    const migrationPath = join(
      process.cwd(),
      'prisma/migrations/20260127124137_add_untimed_tests_system/migration.sql'
    )
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('📋 Applying migration: add_untimed_tests_system\n')

    // Check if enums already exist (will check individually in the loop)

    // Apply migration with error handling for existing objects
    const statements = migrationSQL.split(';').filter((s) => s.trim())

    for (const statement of statements) {
      const trimmed = statement.trim()
      if (!trimmed) continue

      try {
        // Skip if it's a CREATE TYPE and it already exists
        if (trimmed.includes('CREATE TYPE "TestState"')) {
          const exists = await client.query(`
            SELECT EXISTS (
              SELECT 1 FROM pg_type WHERE typname = 'TestState'
            )
          `)
          if (exists.rows[0].exists) {
            console.log('⏭️  TestState enum already exists, skipping...')
            continue
          }
        }

        if (trimmed.includes('CREATE TYPE "QuestionCategory"')) {
          const exists = await client.query(`
            SELECT EXISTS (
              SELECT 1 FROM pg_type WHERE typname = 'QuestionCategory'
            )
          `)
          if (exists.rows[0].exists) {
            console.log('⏭️  QuestionCategory enum already exists, skipping...')
            continue
          }
        }

        // Check for table existence
        if (trimmed.includes('CREATE TABLE "untimed_test_attempts"')) {
          const exists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'untimed_test_attempts'
            )
          `)
          if (exists.rows[0].exists) {
            console.log('⏭️  untimed_test_attempts table already exists, skipping...')
            continue
          }
        }

        if (trimmed.includes('CREATE TABLE "test_questions"')) {
          const exists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'test_questions'
            )
          `)
          if (exists.rows[0].exists) {
            console.log('⏭️  test_questions table already exists, skipping...')
            continue
          }
        }

        // Check for column existence
        if (trimmed.includes('ADD COLUMN "category"')) {
          const tableMatch = trimmed.match(/ALTER TABLE "(\w+)" ADD COLUMN "category"/)
          if (tableMatch) {
            const tableName = tableMatch[1]
            const exists = await client.query(`
              SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = $1
                AND column_name = 'category'
              )
            `, [tableName])
            if (exists.rows[0].exists) {
              console.log(`⏭️  category column already exists in ${tableName}, skipping...`)
              continue
            }
          }
        }

        // Execute the statement
        await client.query(trimmed)
        console.log(`✅ Executed: ${trimmed.substring(0, 60)}...`)
      } catch (error: any) {
        // If it's a "already exists" error, skip it
        if (
          error.message.includes('already exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('relation already exists')
        ) {
          console.log(`⏭️  Skipped (already exists): ${trimmed.substring(0, 60)}...`)
          continue
        }
        throw error
      }
    }

    // Verify the migration
    console.log('\n🔍 Verifying migration...')

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('untimed_test_attempts', 'test_questions')
    `)

    const enums = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname IN ('TestState', 'QuestionCategory')
    `)

    console.log(`✅ Tables created: ${tables.rows.length}/2`)
    console.log(`✅ Enums created: ${enums.rows.length}/2`)

    console.log('\n🎉 Migration completed successfully!')

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

applyMigration()
