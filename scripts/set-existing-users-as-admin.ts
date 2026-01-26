import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setExistingUsersAsAdmin() {
  try {
    console.log('Setting all existing users as ADMIN...')
    
    // Update all existing users to be ADMIN
    const result = await prisma.user.updateMany({
      data: {
        role: 'ADMIN'
      }
    })
    
    console.log(`✅ Successfully updated ${result.count} user(s) to ADMIN role`)
    
    // List all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    console.log('\nCurrent users:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name || 'No name'}) - ${user.role}`)
    })
    
  } catch (error) {
    console.error('Error setting users as admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setExistingUsersAsAdmin()
