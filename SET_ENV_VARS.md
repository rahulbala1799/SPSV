# Setting Stack Auth Environment Variables in Vercel

## ✅ Already Set
- `DATABASE_URL` - ✅ Already configured

## ❌ Need to Set
- `NEXT_PUBLIC_STACK_PROJECT_ID`
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
- `STACK_SECRET_SERVER_KEY`

## Steps to Set

### 1. Get the Actual Values from Neon Console

1. Go to: https://console.neon.tech
2. Select your project (ep-calm-river-aburmq62)
3. Click **Auth** tab
4. Find the Stack Auth section
5. Click **"Show"** or **"Reveal"** next to each masked value:
   - `NEXT_PUBLIC_STACK_PROJECT_ID` (should be a UUID)
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` (long string)
   - `STACK_SECRET_SERVER_KEY` (long string)

### 2. Set in Vercel (Choose One Method)

#### Method A: Interactive (Recommended)
Run these commands and paste values when prompted:

```bash
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production
vercel env add STACK_SECRET_SERVER_KEY production

# Also set for preview and development
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID preview
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY preview
vercel env add STACK_SECRET_SERVER_KEY preview

vercel env add NEXT_PUBLIC_STACK_PROJECT_ID development
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY development
vercel env add STACK_SECRET_SERVER_KEY development
```

#### Method B: Use the Script
```bash
./set-all-env-vars.sh
```

### 3. Verify
```bash
vercel env ls
```

You should see all three Stack Auth variables listed.

## After Setting

Once all environment variables are set:
1. Deploy to Vercel: `vercel --prod`
2. Test login functionality
3. Create super admin user using the script
