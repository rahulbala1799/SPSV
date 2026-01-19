# How to Find Stack Auth Credentials in Neon Console

## 🔍 Where to Look

Since you have Neon Auth enabled (you have the Auth URL and JWKS URL), the Stack Auth credentials should be in one of these places:

### Option 1: Auth → Integrations Tab
1. Go to: https://console.neon.tech
2. Select your project: **ep-calm-river-aburmq62**
3. Click on **"Auth"** in the left sidebar
4. Look for **"Integrations"** or **"Configuration"** tab
5. Find **"Stack Auth"** or **"Neon Auth (Stack)"** section
6. You should see:
   - Project ID
   - Publishable Client Key
   - Secret Server Key

### Option 2: Auth → Quick Start / Setup
1. Go to: https://console.neon.tech
2. Select your project
3. Click **"Auth"** → **"Quick Start"** or **"Setup"**
4. Look for environment variables section
5. Should show the 3 Stack Auth credentials

### Option 3: Settings → Auth
1. Go to: https://console.neon.tech
2. Select your project
3. Click **"Settings"** → **"Auth"** or **"Authentication"**
4. Look for Stack Auth configuration

### Option 4: Project Settings → Environment Variables
1. Go to: https://console.neon.tech
2. Select your project
3. Click **"Settings"** → **"Environment Variables"** or **"Configuration"**
4. Look for Stack Auth section

## ⚠️ If You Still Can't Find Them

If the credentials aren't visible, they might need to be generated. You can:

1. **Check if there's a "Generate Keys" or "Create Integration" button**
2. **Use the Neon API** to generate them (requires API key)
3. **Contact Neon Support** - they can help locate or generate the credentials

## 📝 Alternative: Check Your Email/Export

Sometimes Neon sends these credentials via email when you first enable Neon Auth, or they might be in an export/download option in the console.

## 🔗 Direct Links to Try

- Auth Integrations: `https://console.neon.tech/project/{your-project-id}/auth/integrations`
- Auth Configuration: `https://console.neon.tech/project/{your-project-id}/auth/configuration`
- Auth Setup: `https://console.neon.tech/project/{your-project-id}/auth/setup`

Replace `{your-project-id}` with your actual project ID.
