import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  const email = 'rahulbala1799@gmail.com'
  const password = 'Printnpack1'

  console.log('🔍 Testing login credentials...\n')

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('✅ User found:')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`)

    // Test password
    console.log('\n🔐 Testing password...')
    const isValid = await bcrypt.compare(password, user.password)
    
    if (isValid) {
      console.log('✅ Password is CORRECT!')
      console.log('\n📋 Login should work with:')
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
    } else {
      console.log('❌ Password is INCORRECT!')
      console.log('\n⚠️  The password hash in database might be wrong.')
      console.log('   We may need to reset the password.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
