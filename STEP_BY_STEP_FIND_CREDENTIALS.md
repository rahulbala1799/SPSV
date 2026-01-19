# Step-by-Step: Finding Stack Auth Credentials

## Exact Steps in Neon Console

### Step 1: Navigate to Your Project
1. Go to: **https://console.neon.tech**
2. Log in
3. Find and click on your project: **ep-calm-river-aburmq62**

### Step 2: Find the Auth Section
Look for one of these in the left sidebar or top navigation:
- **"Auth"** (most common)
- **"Authentication"**
- **"Neon Auth"**
- **"Integrations"**

### Step 3: Open Configuration Tab
Once in the Auth section, look for tabs at the top:
- **"Configuration"** ← This is where they should be
- **"Setup"**
- **"Quick Start"**
- **"Environment Variables"**
- **"Keys"**

### Step 4: Look for Stack Auth Section
In the Configuration/Setup tab, you should see:
- A section titled **"Stack Auth"** or **"Neon Auth (Stack)"**
- Or environment variables listed like:
  ```
  NEXT_PUBLIC_STACK_PROJECT_ID=****************
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=****************
  STACK_SECRET_SERVER_KEY=****************
  ```

### Step 5: Reveal the Values
- Click **"Show"** or **"Reveal"** button next to each masked value
- Or click an **"Eye" icon** 👁️
- Or click **"Copy"** button to copy the value

## 🆘 If You Still Can't Find Them

### Alternative 1: Check Project Overview
1. Go to your project's main page
2. Look for a **"Neon Auth"** card or widget
3. Click **"View Configuration"** or **"Setup"**

### Alternative 2: Use Search
1. In Neon Console, use the search bar (if available)
2. Search for: **"Stack Auth"** or **"NEXT_PUBLIC_STACK_PROJECT_ID"**

### Alternative 3: Check Different Views
- Try **"Table View"** vs **"Card View"**
- Check if there's a **"Show All"** or **"Expand"** option

### Alternative 4: Contact Support
If you still can't find them, the credentials might need to be generated. Contact Neon support or check if there's a **"Generate Keys"** button.

## 📸 What to Look For

The credentials should look like:
- **Project ID**: Usually a UUID like `proj_xxxxxxxxxxxxx` or similar
- **Publishable Key**: A long string starting with something like `pk_` or `pub_`
- **Secret Key**: A long string starting with `sk_` or `secret_`

## ✅ Quick Test

If you find ANY section that shows environment variables (even if masked), that's likely the right place. Just click "Show" to reveal them.
