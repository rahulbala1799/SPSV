# Neon Auth Credentials Setup

## What You Have
- **Auth URL**: `https://ep-calm-river-aburmq62.neonauth.eu-west-2.aws.neon.tech/neondb/auth`
- **JWKS URL**: `https://ep-calm-river-aburmq62.neonauth.eu-west-2.aws.neon.tech/neondb/auth/.well-known/jwks.json`

## What You Need for Stack Auth

For the `@stackframe/stack` library to work, you need these 3 values from Neon Console:

1. **NEXT_PUBLIC_STACK_PROJECT_ID** - Project ID (usually a UUID)
2. **NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY** - Publishable Client Key
3. **STACK_SECRET_SERVER_KEY** - Secret Server Key

## Where to Find Them

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project (ep-calm-river-aburmq62)
3. Navigate to **Auth** tab (or **Settings → Auth**)
4. Look for **Stack Auth** configuration section
5. Copy the 3 values listed above

## Alternative: Check Neon Auth Configuration

If you see "Neon Auth" instead of "Stack Auth":
- Neon Auth uses Stack Auth under the hood
- The credentials should still be visible in the Auth configuration
- Look for "Project ID", "Publishable Key", and "Secret Key"

## Once You Have the Values

Run these commands to set them in Vercel:

```bash
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production
vercel env add STACK_SECRET_SERVER_KEY production
```

Or use the script:
```bash
./set-vercel-env.sh
```
