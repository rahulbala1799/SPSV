import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
  console.log('')

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Count users
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}\n`)

    if (userCount === 0) {
      console.log('⚠️  No users found in database!')
      console.log('   You may need to create a super admin user.')
      return
    }

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('👥 Users in database:')
    console.log('─'.repeat(80))
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Name: ${user.name || 'N/A'}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`)
      console.log(`   Created: ${user.createdAt.toISOString()}`)
    })
    console.log('\n' + '─'.repeat(80))
  } catch (error) {
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
