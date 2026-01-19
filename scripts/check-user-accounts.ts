/**
 * Script to check if a user has a credential account in Better Auth
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

async function checkUserAccounts() {
  const databaseUrl = process.env.DATABASE_URL
  const email = process.argv[2] || 'rahulbala1799@gmail.com'
  
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
    console.log(`🔍 Checking user: ${email}\n`)
    
    // Check Better Auth user table
    const userResult = await client.query(`
      SELECT id, email, name, "emailVerified"
      FROM "user"
      WHERE email = $1
    `, [email])
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found in Better Auth user table')
      return
    }
    
    const user = userResult.rows[0]
    console.log('✅ User found in Better Auth:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email Verified: ${user.emailVerified}\n`)
    
    // Check account table for credential
    const accountResult = await client.query(`
      SELECT id, "userId", "providerId", "accountId", password
      FROM "account"
      WHERE "userId" = $1 AND "providerId" = 'credential'
    `, [user.id])
    
    if (accountResult.rows.length === 0) {
      console.log('❌ No credential account found!')
      console.log('   This is why sign-in fails.')
      console.log('\n💡 Solution: User needs to sign up again or we need to create the account.')
    } else {
      const account = accountResult.rows[0]
      console.log('✅ Credential account found:')
      console.log(`   Account ID: ${account.id}`)
      console.log(`   Provider: ${account.providerId}`)
      console.log(`   Has Password: ${account.password ? 'Yes' : 'No'}`)
    }
    
    // Check our users table
    const ourUserResult = await client.query(`
      SELECT id, email, name, role
      FROM "users"
      WHERE email = $1
    `, [email])
    
    if (ourUserResult.rows.length > 0) {
      const ourUser = ourUserResult.rows[0]
      console.log('\n✅ User found in our users table:')
      console.log(`   ID: ${ourUser.id}`)
      console.log(`   Email: ${ourUser.email}`)
      console.log(`   Role: ${ourUser.role}`)
      
      if (ourUser.id !== user.id) {
        console.log(`\n⚠️  ID Mismatch!`)
        console.log(`   Better Auth ID: ${user.id}`)
        console.log(`   Our users ID: ${ourUser.id}`)
      }
    } else {
      console.log('\n❌ User not found in our users table')
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

checkUserAccounts()
