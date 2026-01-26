# Admin Dashboard Setup Guide

## Overview

A complete admin dashboard system has been created for managing students in your taxi license training application. The system distinguishes between **Admin** and **Student** users.

## What's Been Created

### 1. Database Changes (Prisma Schema)
- ✅ Added `Role` enum (ADMIN, STUDENT)
- ✅ Added `role` field to User model
- ✅ Created new `Student` model with detailed student information
- ✅ Linked Student model to User model

### 2. Authentication Updates
- ✅ Login now returns user role and sets session cookies
- ✅ Created logout endpoint (`/api/auth/logout`)
- ✅ Created "get current user" endpoint (`/api/auth/me`)
- ✅ Admin users are now redirected to `/admin` after login
- ✅ Student users are redirected to `/` (main site)

### 3. Admin API Routes
All routes are protected and only accessible to ADMIN users:

- **GET `/api/admin/check`** - Check if user is admin
- **GET `/api/admin/students`** - Get all students
- **POST `/api/admin/students`** - Create new student
- **GET `/api/admin/students/[id]`** - Get single student
- **PATCH `/api/admin/students/[id]`** - Update student
- **DELETE `/api/admin/students/[id]`** - Delete student

### 4. Admin Dashboard Pages
- **`/admin`** - Main admin dashboard with statistics
- **`/admin/students`** - Student management page (view, add, delete)
- **`/admin/settings`** - Admin settings page

### 5. UI Components
- **StatsCard** - Display statistics with icons
- **StudentTable** - List all students in a table
- **AddStudentModal** - Modal for adding new students
- **DeleteConfirmModal** - Confirmation modal for deleting students

## Setup Instructions

### Step 1: Run Database Migration

First, you need to apply the schema changes to your database:

```bash
npx prisma migrate dev --name add_roles_and_students
```

This will create the migration and apply it to your database.

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Set Existing Users as Admins

Run the script to make all existing users admins:

```bash
npx tsx scripts/set-existing-users-as-admin.ts
```

This ensures your current 2 users become admin users.

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Login as Admin

1. Go to `http://localhost:3000/login`
2. Login with one of your existing admin accounts
3. You'll be automatically redirected to `/admin`

## Features

### Admin Dashboard (`/admin`)
- View statistics (total students, active, suspended, completed)
- Quick actions panel
- Links to student management and settings

### Student Management (`/admin/students`)
- View all students in a table
- Search students by name, email, or phone
- Add new students with detailed information:
  - Name, email, password (required)
  - Phone number, date of birth, address (optional)
  - Emergency contact (optional)
- Delete students (with confirmation)
- Each student automatically gets a STUDENT role

### Student Information Stored
- **User Account**: email, password, name, role
- **Student Profile**: 
  - Phone number
  - Date of birth
  - Address
  - Emergency contact
  - Enrollment date
  - Status (active, suspended, completed)
  - Progress data (JSON field for future use)

## Security Features

1. **Cookie-based Session** - User ID stored in httpOnly cookie
2. **Admin-only Routes** - All `/api/admin/*` routes require admin role
3. **Auto-redirect** - Non-admin users redirected to login
4. **Password Hashing** - All passwords hashed with bcryptjs

## Future Student Registration

When you're ready to allow students to sign up:

1. The current `/signup` route will create users with STUDENT role by default
2. You can modify the signup route to also create a Student profile
3. Or keep signup disabled and only allow admin-created students

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                     # Main dashboard
│   │   ├── students/
│   │   │   └── page.tsx                 # Student management
│   │   └── settings/
│   │       └── page.tsx                 # Admin settings
│   └── api/
│       └── admin/
│           ├── check/
│           │   └── route.ts             # Check admin status
│           └── students/
│               ├── route.ts             # List/Create students
│               └── [id]/
│                   └── route.ts         # Get/Update/Delete student
├── components/
│   └── admin/
│       ├── StatsCard.tsx                # Statistics card component
│       ├── StudentTable.tsx             # Student table component
│       ├── AddStudentModal.tsx          # Add student modal
│       └── DeleteConfirmModal.tsx       # Delete confirmation modal
└── lib/
    └── auth.ts                          # Auth helper functions

prisma/
└── schema.prisma                        # Updated with Role & Student

scripts/
└── set-existing-users-as-admin.ts       # Script to set existing users as admin
```

## Next Steps

1. **Run the setup steps above** to activate the admin dashboard
2. **Login as admin** to access `/admin`
3. **Add test students** to verify everything works
4. **Customize** the dashboard as needed
5. **Decide** if/when to enable public student registration

## Troubleshooting

### Can't access admin dashboard?
- Make sure you ran the migration (`npx prisma migrate dev`)
- Make sure you ran the admin setup script
- Check if you're logged in
- Clear cookies and login again

### Database errors?
- Run `npx prisma generate` to regenerate the Prisma Client
- Check your DATABASE_URL in `.env`

### Students not showing?
- Check browser console for errors
- Verify API endpoints return data: `curl http://localhost:3000/api/admin/students` (with cookies)

## Additional Notes

- The current setup uses simple cookie-based authentication
- For production, consider implementing JWT tokens or NextAuth
- You can extend the Student model with additional fields as needed
- The `progressData` JSON field can store quiz scores, test results, etc.

## Support

If you encounter any issues, check:
1. Browser console for errors
2. Terminal/server logs
3. Database connection
4. Prisma Client is generated
5. Migration is applied
