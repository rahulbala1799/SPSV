# Finding Credentials via Quick Start

## 🎯 The Solution

In the **Configuration** tab, you mentioned seeing:
- **"Open quickstart"**

This is the key! The Stack Auth credentials are typically shown in the Quick Start guide.

## Steps

1. **Click "Open quickstart"** (or "Quick Start" button/link)
2. This should open a modal or new section showing:
   - Environment variables for Next.js
   - The 3 Stack Auth credentials:
     - `NEXT_PUBLIC_STACK_PROJECT_ID`
     - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
     - `STACK_SECRET_SERVER_KEY`
3. Click **"Show"** or **"Reveal"** next to each masked value
4. Copy the actual values (not asterisks)

## Alternative: Check for "Claim Project"

If Quick Start doesn't show the credentials, look for:
- **"Claim Project"** button
- This might be needed to generate the Stack Auth credentials

## What to Look For

The Quick Start should show code blocks like:
```bash
NEXT_PUBLIC_STACK_PROJECT_ID=proj_xxxxxxxxxxxxx
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pk_xxxxxxxxxxxxx
STACK_SECRET_SERVER_KEY=sk_xxxxxxxxxxxxx
```

These are the values you need!
