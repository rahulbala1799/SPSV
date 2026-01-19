/**
 * Script to fix users who exist in Better Auth but don't have credential accounts
 * This happens when signup partially fails
 */

import pg from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import bcrypt from 'bcryptjs'

const envLocalPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
} else {
  dotenv.config()
}

const { Client } = pg

async function fixMissingCredentialAccount() {
  const databaseUrl = process.env.DATABASE_URL
  const email = process.argv[2] || 'rahulbala1799@gmail.com'
  const password = process.argv[3]
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set!')
    process.exit(1)
  }

  if (!password) {
    console.error('❌ Password required!')
    console.log('\nUsage:')
    console.log(`  npx tsx scripts/fix-missing-credential-account.ts "${email}" "password"`)
    process.exit(1)
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log(`🔧 Fixing credential account for: ${email}\n`)
    
    // Check if user exists in Better Auth
    const userResult = await client.query(`
      SELECT id, email, name
      FROM "user"
      WHERE email = $1
    `, [email])
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found in Better Auth user table')
      console.log('   They need to sign up first.')
      return
    }
    
    const user = userResult.rows[0]
    console.log('✅ User found in Better Auth:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}\n`)
    
    // Check if credential account exists
    const accountResult = await client.query(`
      SELECT id, "userId", "providerId", password
      FROM "account"
      WHERE "userId" = $1 AND "providerId" = 'credential'
    `, [user.id])
    
    if (accountResult.rows.length > 0) {
      console.log('✅ Credential account already exists!')
      console.log('   No action needed.')
      return
    }
    
    console.log('⚠️  No credential account found - creating one...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create credential account
    await client.query(`
      INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, 'credential', $3, NOW(), NOW())
      ON CONFLICT ("providerId", "accountId") DO UPDATE SET password = $3
    `, [user.id, email, hashedPassword])
    
    console.log('✅ Credential account created!')
    console.log('\n🎉 User can now sign in with:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
  } finally {
    await client.end()
  }
}

fixMissingCredentialAccount()
