/**
 * Simple script to set a user's role to SUPER_ADMIN
 * 
 * Usage:
 *   npx tsx scripts/set-super-admin.ts <email>
 * 
 * Example:
 *   npx tsx scripts/set-super-admin.ts rahulbala1799@gmail.com
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setSuperAdmin() {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.error('❌ Missing email argument!')
    console.log('\nUsage:')
    console.log('  npx tsx scripts/set-super-admin.ts <email>')
    console.log('\nExample:')
    console.log('  npx tsx scripts/set-super-admin.ts rahulbala1799@gmail.com')
    process.exit(1)
  }

  const email = args[0]

  try {
    console.log(`🔐 Setting ${email} to SUPER_ADMIN...`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found!`)
      console.log('\n💡 Make sure to sign up through the app first:')
      console.log('   1. Go to /signup')
      console.log('   2. Create an account with this email')
      console.log('   3. Then run this script again')
      process.exit(1)
    }

    // Update role to SUPER_ADMIN
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' },
    })

    console.log('✅ User role updated to SUPER_ADMIN!')
    console.log(`   User ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name || 'N/A'}`)
    console.log(`   Role: SUPER_ADMIN`)
    console.log('\n🎉 You can now log in and access admin features!')

  } catch (error: any) {
    console.error('❌ Error updating user role:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setSuperAdmin()
