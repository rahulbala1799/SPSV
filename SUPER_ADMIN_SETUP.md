# Super Admin Setup Guide

## Option 1: Using the Script (Recommended)

### Step 1: Install dependencies (if not already installed)
```bash
npm install
```

### Step 2: Run the script
```bash
npx tsx scripts/create-super-admin-better-auth.ts <email> <password> <name>
```

**Example:**
```bash
npx tsx scripts/create-super-admin-better-auth.ts rahulbala1799@gmail.com Printnpack1 "Rahul Bala"
```

### Step 3: Sign up through the app
1. Go to your app's signup page: `https://your-domain.com/signup`
2. Use the email and password you provided to the script
3. After signing up, the role will already be set to `SUPER_ADMIN`

### Step 4: Log in
1. Go to the login page: `https://your-domain.com/login`
2. Log in with your credentials
3. You should now have super admin access!

---

## Option 2: Manual Setup (Alternative)

### Step 1: Sign up through the app
1. Go to your app's signup page
2. Create an account with your desired email and password

### Step 2: Update role in database
Run this SQL query in your Neon database (or use Prisma Studio):

```sql
UPDATE users 
SET role = 'SUPER_ADMIN' 
WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```
Then navigate to the `users` table and update the role field to `SUPER_ADMIN`.

---

## Option 3: Using Prisma directly

Create a simple script:

```typescript
// scripts/set-super-admin.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'your-email@example.com'
  
  await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' }
  })
  
  console.log('✅ Role updated to SUPER_ADMIN')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
npx tsx scripts/set-super-admin.ts
```

---

## Verify Super Admin Access

After setup, you should be able to:
1. ✅ Log in to the dashboard
2. ✅ Access the `/dashboard/admin` page
3. ✅ See the "Invite User" button
4. ✅ Create invitations for other users

---

## Troubleshooting

### User not found
- Make sure you've signed up through the app first
- Check that the email matches exactly (case-sensitive)

### Role not updating
- Check your database connection
- Verify the `users` table exists and has a `role` column
- Check that the role value is exactly `SUPER_ADMIN` (case-sensitive)

### Can't access admin page
- Make sure you're logged in
- Check that your role is set to `SUPER_ADMIN` in the database
- Try logging out and logging back in

---

## Security Notes

⚠️ **IMPORTANT:**
- Change the default password after first login
- Don't commit credentials to Git
- Use strong passwords
- Consider using environment variables for sensitive data
