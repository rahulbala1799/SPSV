# Quick Start - Admin Dashboard

## Run These Commands in Order

### 1. Apply Database Migration
```bash
npx prisma migrate dev --name add_roles_and_students
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Set Existing Users as Admins
```bash
npx tsx scripts/set-existing-users-as-admin.ts
```

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Access the Admin Dashboard

1. Open your browser to: **http://localhost:3000/login**
2. Login with your existing credentials
3. You'll be redirected to: **http://localhost:3000/admin**

## What You Can Do Now

✅ View admin dashboard with statistics
✅ Add new students (only admins can do this)
✅ View all students in a table
✅ Search students by name, email, or phone
✅ Delete students
✅ Manage your admin profile

## Important Notes

- **Public signup is DISABLED** - Only admins can add students via the dashboard
- **Only 2 admin users** - Your existing users (as specified)
- **All new students** are created as STUDENT role
- **Students will be able to login** but won't have access to admin features

## Dashboard URLs

- Admin Dashboard: `/admin`
- Student Management: `/admin/students`
- Admin Settings: `/admin/settings`

## Re-enabling Public Signup (When Ready)

If you want to allow students to sign up themselves later:

1. Open: `src/app/api/auth/signup/route.ts`
2. Uncomment the code in the POST function
3. Remove the early return that says "Public registration is currently disabled"

That's it! You're ready to go! 🎉
