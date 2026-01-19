import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@spsv-dublin.ie'
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!ChangeThis'
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin'

  const hashedPassword = await bcrypt.hash(password, 12)

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'SUPER_ADMIN', // Ensure role is SUPER_ADMIN
    },
    create: {
      email,
      name,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('✅ Super Admin user created:', {
    id: superAdmin.id,
    email: superAdmin.email,
    role: superAdmin.role,
  })
  console.log('\n⚠️  IMPORTANT: Change the default password after first login!')
  console.log(`\n📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
