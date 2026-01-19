/**
 * Script to delete a user from Better Auth and our users table
 * This allows them to sign up fresh
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

async function deleteUser() {
  const databaseUrl = process.env.DATABASE_URL
  const email = process.argv[2] || 'rahulbala1799@gmail.com'
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set!')
    console.log('\nUsage:')
    console.log(`  DATABASE_URL="your-db-url" npx tsx scripts/delete-user.ts "${email}"`)
    process.exit(1)
  }

  if (!email) {
    console.error('❌ Email required!')
    console.log('\nUsage:')
    console.log(`  npx tsx scripts/delete-user.ts "user@example.com"`)
    process.exit(1)
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log(`🗑️  Deleting user: ${email}\n`)
    
    // Find user in Better Auth
    const userResult = await client.query(`
      SELECT id, email, name
      FROM "user"
      WHERE email = $1
    `, [email])
    
    if (userResult.rows.length === 0) {
      console.log('⚠️  User not found in Better Auth user table')
    } else {
      const user = userResult.rows[0]
      console.log('✅ Found user in Better Auth:')
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      
      // Delete from Better Auth (cascade will delete accounts, sessions, etc.)
      await client.query(`DELETE FROM "user" WHERE id = $1`, [user.id])
      console.log('✅ Deleted from Better Auth user table')
    }
    
    // Find and delete from our users table
    const ourUserResult = await client.query(`
      SELECT id, email, name, role
      FROM "users"
      WHERE email = $1
    `, [email])
    
    if (ourUserResult.rows.length === 0) {
      console.log('⚠️  User not found in our users table')
    } else {
      const ourUser = ourUserResult.rows[0]
      console.log('\n✅ Found user in our users table:')
      console.log(`   ID: ${ourUser.id}`)
      console.log(`   Email: ${ourUser.email}`)
      console.log(`   Role: ${ourUser.role}`)
      
      // Delete from our users table (cascade will handle related records)
      await client.query(`DELETE FROM "users" WHERE id = $1`, [ourUser.id])
      console.log('✅ Deleted from our users table')
    }
    
    // Also delete any invitations
    const inviteResult = await client.query(`
      SELECT id, email, role
      FROM "invitations"
      WHERE email = $1
    `, [email])
    
    if (inviteResult.rows.length > 0) {
      console.log(`\n⚠️  Found ${inviteResult.rows.length} invitation(s) for this email`)
      await client.query(`DELETE FROM "invitations" WHERE email = $1`, [email])
      console.log('✅ Deleted invitations')
    }
    
    console.log('\n🎉 User deleted successfully!')
    console.log('   They can now sign up fresh.')
    
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

deleteUser()
