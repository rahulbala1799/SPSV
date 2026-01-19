# Complete Auth Setup Guide

## 🔍 Where to Find Environment Variables

### In Neon Console (Quickstart Section)

1. **Go to**: https://console.neon.tech
2. **Select your project**: ep-calm-river-aburmq62
3. **Click**: "Auth" tab
4. **Click**: "Open quickstart" (in Configuration tab)
5. **You'll see** the environment variables section with:
   - `NEXT_PUBLIC_STACK_PROJECT_ID=****************************`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=****************************************`
   - `STACK_SECRET_SERVER_KEY=***********************`

### Problem: Eye Button Doesn't Work

Since the eye/reveal button doesn't work, try these methods:

#### Method 1: Browser Inspect Element (Recommended)
1. Right-click on the masked value (asterisks)
2. Select "Inspect" or "Inspect Element"
3. In the HTML, look for:
   - `data-value="actual_value"`
   - `value="actual_value"`
   - Or check the element's attributes in the Elements panel
4. The actual value is often stored in HTML even if hidden

#### Method 2: Select All and Copy
1. Click in the Quickstart code block
2. Select All (Cmd+A / Ctrl+A)
3. Copy (Cmd+C / Ctrl+C)
4. Paste in a text editor - sometimes actual values are copied!

#### Method 3: Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Run:
   ```javascript
   // Find elements with data-value
   document.querySelectorAll('[data-value]').forEach(el => console.log(el.dataset.value))
   
   // Or find all code blocks
   document.querySelectorAll('code, pre').forEach(el => console.log(el.textContent))
   ```

## 📋 Environment Variables Needed

You need these 4 environment variables:

1. **DATABASE_URL** ✅ (Already set in Vercel)
   ```
   postgresql://neondb_owner:npg_Zcfd14VhMRuX@ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```

2. **NEXT_PUBLIC_STACK_PROJECT_ID** ❌ (Need to get from Neon Console)
   - Format: Usually `proj_xxxxxxxxxxxxx` or UUID

3. **NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY** ❌ (Need to get from Neon Console)
   - Format: Usually `pk_xxxxxxxxxxxxx` or `pck_xxxxxxxxxxxxx`

4. **STACK_SECRET_SERVER_KEY** ❌ (Need to get from Neon Console)
   - Format: Usually `sk_xxxxxxxxxxxxx` or `ssk_xxxxxxxxxxxxx`

## 🚀 How to Set Them in Vercel

Once you have the actual values (not asterisks), run:

```bash
# Production
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production
vercel env add STACK_SECRET_SERVER_KEY production

# Preview
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID preview
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY preview
vercel env add STACK_SECRET_SERVER_KEY preview

# Development
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID development
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY development
vercel env add STACK_SECRET_SERVER_KEY development
```

Or use the script:
```bash
./set-all-env-vars.sh
```

## 🔧 Alternative: Use Better Auth Directly

Since Neon Auth uses Better Auth, we could switch to Better Auth SDK instead of Stack Auth. This might be simpler and more direct.

## ✅ After Setting Env Vars

1. Deploy to Vercel: `vercel --prod`
2. Test login functionality
3. Create super admin user
