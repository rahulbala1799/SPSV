import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@spsv-dublin.ie'
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  const name = process.env.ADMIN_NAME || 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('Admin user created:', {
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
