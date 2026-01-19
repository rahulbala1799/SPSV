import { stackServerApp } from '../src/lib/stack'

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'rahulbala1799@gmail.com'
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Printnpack1'
  const name = process.env.SUPER_ADMIN_NAME || 'Rahul Bala'

  console.log('🔐 Creating Super Admin in Neon Auth...\n')

  try {
    // Check if user already exists
    const existingUser = await stackServerApp.listUsers({
      filter: { primaryEmail: email },
    })

    if (existingUser.length > 0) {
      console.log('✅ User already exists:', email)
      // Update role to SUPER_ADMIN
      await stackServerApp.updateUser(existingUser[0].id, {
        clientMetadata: { role: 'SUPER_ADMIN' },
        serverMetadata: { role: 'SUPER_ADMIN' },
      })
      console.log('✅ Updated user role to SUPER_ADMIN')
      return
    }

    // Create new user
    const user = await stackServerApp.createUser({
      primaryEmail: email,
      displayName: name,
      password,
      clientMetadata: {
        role: 'SUPER_ADMIN',
      },
      serverMetadata: {
        role: 'SUPER_ADMIN',
      },
    })

    console.log('✅ Super Admin created successfully!')
    console.log('   Email:', email)
    console.log('   Name:', name)
    console.log('   Role: SUPER_ADMIN')
    console.log('   User ID:', user.id)
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')
  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  }
}

main()
