/**
 * Script to create a super admin user with Better Auth
 * 
 * This script will:
 * 1. Create a user account through Better Auth (via signup API)
 * 2. Update the role in our users table to SUPER_ADMIN
 * 
 * Usage:
 *   npx tsx scripts/create-super-admin-better-auth.ts <email> <password> <name>
 * 
 * Example:
 *   npx tsx scripts/create-super-admin-better-auth.ts admin@example.com MyPassword123 "Admin User"
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSuperAdmin() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('❌ Missing arguments!')
    console.log('\nUsage:')
    console.log('  npx tsx scripts/create-super-admin-better-auth.ts <email> <password> <name>')
    console.log('\nExample:')
    console.log('  npx tsx scripts/create-super-admin-better-auth.ts admin@example.com MyPassword123 "Admin User"')
    process.exit(1)
  }

  const [email, password, name] = args

  try {
    console.log('🔐 Creating super admin user...')
    console.log(`   Email: ${email}`)
    console.log(`   Name: ${name}`)

    // Check if user already exists in our users table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('⚠️  User already exists!')
      console.log('   Updating role to SUPER_ADMIN...')
      
      // Update role to SUPER_ADMIN
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'SUPER_ADMIN',
          name: name,
        },
      })

      console.log('✅ User role updated to SUPER_ADMIN!')
      console.log(`   User ID: ${existingUser.id}`)
      console.log('\n📝 Note: If the user was created through Better Auth,')
      console.log('   they can log in with their existing password.')
      return
    }

    // Hash password for Better Auth
    const hashedPassword = await bcrypt.hash(password, 10)

    // Better Auth creates its own tables. We need to:
    // 1. Create user in Better Auth's user table (if it exists)
    // 2. Create account with password
    // 3. Create entry in our users table

    // Check if Better Auth tables exist by trying to query them
    // Better Auth typically creates: user, session, account, verification tables
    
    // Create user in Better Auth's user table
    // Note: Better Auth uses a 'user' table (singular), different from our 'users' table
    let authUserId: string

    try {
      // Try to create user in Better Auth's user table
      const authUserResult = await prisma.$queryRawUnsafe<Array<{id: string}>>(`
        INSERT INTO "user" (email, "emailVerified", name, "createdAt", "updatedAt")
        VALUES ($1, true, $2, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET name = $2
        RETURNING id
      `, email, name)

      if (authUserResult && authUserResult.length > 0) {
        authUserId = authUserResult[0].id
      } else {
        // If that didn't work, try to get existing user
        const existingAuthUser = await prisma.$queryRawUnsafe<Array<{id: string}>>(`
          SELECT id FROM "user" WHERE email = $1
        `, email)

        if (existingAuthUser && existingAuthUser.length > 0) {
          authUserId = existingAuthUser[0].id
        } else {
          throw new Error('Failed to create/get Better Auth user')
        }
      }

      // Create account with password in Better Auth's account table
      await prisma.$executeRawUnsafe(`
        INSERT INTO "account" ("userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
        VALUES ($1, $2, 'credential', $3, NOW(), NOW())
        ON CONFLICT ("userId", "providerId") DO UPDATE SET password = $3
      `, authUserId, email, hashedPassword)

    } catch (error: any) {
      // If Better Auth tables don't exist yet, that's okay
      // Better Auth will create them on first use
      console.log('⚠️  Better Auth tables may not exist yet. They will be created on first use.')
      console.log('   Creating user in our users table only for now...')
      
      // Generate a temporary ID (Better Auth will assign one when user signs up)
      authUserId = `temp-${Date.now()}`
    }

    // Create/update user in our users table with SUPER_ADMIN role
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
      },
      create: {
        id: authUserId.startsWith('temp-') ? undefined : authUserId, // Let Prisma generate if temp
        email,
        name,
        password: '', // Better Auth handles password
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Super admin user created successfully!')
    console.log(`   User ID: ${user.id}`)
    console.log(`   Email: ${email}`)
    console.log(`   Role: SUPER_ADMIN`)
    console.log('\n📝 Next steps:')
    console.log('   1. Go to your app and sign up with these credentials:')
    console.log(`      Email: ${email}`)
    console.log(`      Password: ${password}`)
    console.log('   2. After signing up, the role will be set to SUPER_ADMIN')
    console.log('   3. If the user already exists, you can log in directly')
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')

  } catch (error: any) {
    console.error('❌ Error creating super admin:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin()
