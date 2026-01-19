import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@spsv-dublin.ie'
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  const name = process.env.ADMIN_NAME || 'Admin User'
  const role = (process.env.ADMIN_ROLE || 'ADMIN').toUpperCase() as 'SUPER_ADMIN' | 'ADMIN'

  // Validate role
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    console.error('❌ Invalid role. Must be SUPER_ADMIN or ADMIN')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role, // Update role if user exists
    },
    create: {
      email,
      name,
      password: hashedPassword,
      role,
      emailVerified: new Date(),
    }
  })

  console.log(`✅ ${role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} user created:`, {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  })
  console.log('\n⚠️  IMPORTANT: Change the default password after first login!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
