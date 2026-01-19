# Role-Based Access Control Setup Guide

## Role Hierarchy

The system now supports three roles:

1. **SUPER_ADMIN** - Developer/You (Full access, can create all roles)
2. **ADMIN** - Can create Admin and Student users
3. **STUDENT** - Regular users (default)

## Setup Instructions

### Step 1: Update Database Schema

Run the migration to add the SUPER_ADMIN role:

```bash
npx prisma migrate dev --name add_super_admin_role
```

Or for production:

```bash
npx prisma migrate deploy
```

### Step 2: Create Super Admin User

You have two options:

#### Option A: Using the Super Admin Script (Recommended)

```bash
# Set environment variables
export SUPER_ADMIN_EMAIL="your-email@example.com"
export SUPER_ADMIN_PASSWORD="YourSecurePassword123!"
export SUPER_ADMIN_NAME="Your Name"

# Run the script
npx tsx scripts/create-super-admin.ts
```

Or inline:

```bash
SUPER_ADMIN_EMAIL="your-email@example.com" SUPER_ADMIN_PASSWORD="YourSecurePassword123!" npx tsx scripts/create-super-admin.ts
```

#### Option B: Using the Admin Script with Role

```bash
# Set ADMIN_ROLE to SUPER_ADMIN
export ADMIN_EMAIL="your-email@example.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
export ADMIN_NAME="Your Name"
export ADMIN_ROLE="SUPER_ADMIN"

# Run the script
npx tsx scripts/create-admin.ts
```

### Step 3: Create Regular Admin User

After creating your Super Admin, you can create a regular Admin:

```bash
export ADMIN_EMAIL="admin@spsv-dublin.ie"
export ADMIN_PASSWORD="AdminPassword123!"
export ADMIN_NAME="Admin User"
export ADMIN_ROLE="ADMIN"

npx tsx scripts/create-admin.ts
```

Or create an Admin through the dashboard after logging in as Super Admin.

## Permission Matrix

| Action | SUPER_ADMIN | ADMIN | STUDENT |
|--------|-------------|-------|---------|
| View Dashboard | ✅ | ✅ | ✅ |
| Access Admin Panel | ✅ | ✅ | ❌ |
| Create Super Admin | ✅ | ❌ | ❌ |
| Create Admin | ✅ | ✅ | ❌ |
| Create Student | ✅ | ✅ | ❌ |
| View All Users | ✅ | ✅ | ❌ |
| Manage Invitations | ✅ | ✅ | ❌ |
| View Own Progress | ✅ | ✅ | ✅ |
| Answer Questions | ✅ | ✅ | ✅ |

## Role Creation Rules

- **SUPER_ADMIN** can create: SUPER_ADMIN, ADMIN, STUDENT
- **ADMIN** can create: ADMIN, STUDENT
- **STUDENT** cannot create any users (invitation-only)

## API Protection

The invitation API (`/api/invitations`) enforces these rules:

- Only SUPER_ADMIN and ADMIN can create invitations
- Only SUPER_ADMIN can create SUPER_ADMIN invitations
- Only SUPER_ADMIN and ADMIN can create ADMIN invitations
- Anyone with admin access can create STUDENT invitations

## Visual Indicators

- **Super Admin**: Red badge with "Super Admin" label
- **Admin**: Purple badge with "Admin" label  
- **Student**: Blue badge with "Student" label

## Next Steps

1. ✅ Run database migration
2. ✅ Create your Super Admin account
3. ✅ Log in as Super Admin
4. ✅ Create Admin user(s) if needed
5. ✅ Start inviting students

## Security Notes

⚠️ **Important:**
- Change default passwords immediately after first login
- Super Admin has full system access - protect credentials
- Use strong passwords for all admin accounts
- Consider 2FA for admin accounts in the future

---

**Status**: ✅ Ready to use
**Last Updated**: January 2024
