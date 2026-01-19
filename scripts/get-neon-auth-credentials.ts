/**
 * Script to get Neon Auth credentials via API
 * 
 * Usage:
 * 1. Get your Neon API key from: https://console.neon.tech → Account Settings → API Keys
 * 2. Set NEON_API_KEY environment variable
 * 3. Run: npx tsx scripts/get-neon-auth-credentials.ts
 */

import https from 'https'

const NEON_API_KEY = process.env.NEON_API_KEY
const PROJECT_ID = process.env.NEON_PROJECT_ID || 'ep-calm-river-aburmq62'

if (!NEON_API_KEY) {
  console.error('❌ Error: NEON_API_KEY environment variable is required')
  console.log('\nTo get your API key:')
  console.log('1. Go to: https://console.neon.tech')
  console.log('2. Click your profile → Account Settings → API Keys')
  console.log('3. Create a new API key')
  console.log('4. Run: NEON_API_KEY=your_key npx tsx scripts/get-neon-auth-credentials.ts')
  process.exit(1)
}

async function getAuthCredentials() {
  try {
    console.log('🔐 Fetching Neon Auth credentials via API...\n')

    // Option 1: List auth integrations
    const integrationsUrl = `https://console.neon.tech/api/v2/projects/${PROJECT_ID}/auth/integrations`
    
    const response = await fetch(integrationsUrl, {
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ API Error:', error)
      console.log('\nTrying alternative endpoint...\n')
      
      // Option 2: Generate SDK keys
      const keysUrl = 'https://console.neon.tech/api/v2/projects/auth/keys'
      const keysResponse = await fetch(keysUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NEON_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: PROJECT_ID,
          auth_provider: 'stack',
        }),
      })

      if (!keysResponse.ok) {
        const keysError = await keysResponse.text()
        console.error('❌ Keys API Error:', keysError)
        process.exit(1)
      }

      const keysData = await keysResponse.json()
      console.log('✅ Credentials retrieved:\n')
      console.log('NEXT_PUBLIC_STACK_PROJECT_ID=', keysData.auth_provider_project_id)
      console.log('NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=', keysData.pub_client_key)
      console.log('STACK_SECRET_SERVER_KEY=', keysData.secret_server_key)
      return
    }

    const data = await response.json()
    console.log('✅ Auth Integrations:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

getAuthCredentials()
