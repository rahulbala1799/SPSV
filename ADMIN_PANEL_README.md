# Admin Panel Overview

## What It Looks Like

The admin panel is a clean, modern dashboard with a professional interface featuring:

- **Header Bar**: Shows admin name/email, "View Site" link, and logout button
- **Statistics Cards**: Four colorful metric cards displaying:
  - Total Students (blue)
  - Active Students (green)
  - Suspended Students (red)
  - Completed Students (purple)
- **Quick Actions Panel**: Three clickable cards for:
  - Manage Students
  - Settings
  - View Course (preview)
- **System Information**: Displays admin role, access level, and registration status

## How It Functions

### Access Control
- **Admin-only access**: Only users with `ADMIN` role can access `/admin`
- **Automatic redirects**: Non-admin users are redirected to login
- **Session-based**: Uses cookie-based authentication

### Main Dashboard (`/admin`)
- Displays real-time statistics about all students
- Shows welcome message with admin name
- Provides quick navigation to key sections
- Updates automatically when students are added/removed

### Student Management (`/admin/students`)
- **View All Students**: Table showing:
  - Student name and email
  - Contact information (phone, date of birth)
  - Status badge (active/suspended/completed)
  - Enrollment date
  - Action buttons (edit/delete)
- **Search Functionality**: Real-time search by name, email, or phone number
- **Empty State**: Helpful message when no students exist

### Settings Page (`/admin/settings`)
- View admin profile information
- Display name, email, and role
- Placeholder for future settings

## How to Add Students

### Step-by-Step Process

1. **Navigate to Student Management**
   - From the admin dashboard, click "Manage Students" card
   - Or go directly to `/admin/students`

2. **Click "Add Student" Button**
   - Located in the top-right corner of the student management page
   - Opens a modal form

3. **Fill Out the Form**
   
   **Required Fields:**
   - **Full Name**: Student's full name (minimum 2 characters)
   - **Email Address**: Used as username for login (must be unique)
   - **Password**: Minimum 8 characters (student will use this to login)
   
   **Optional Fields:**
   - Phone Number
   - Date of Birth
   - Address
   - Emergency Contact

4. **Submit the Form**
   - Click "Create Student" button
   - System validates the data
   - Checks if email already exists
   - Creates user account with `STUDENT` role
   - Creates student profile with enrollment date

5. **Success Confirmation**
   - Modal displays the student's login credentials (email and password)
   - Credentials are shown for 5 seconds (or until you close manually)
   - **Important**: Save these credentials to share with the student
   - Student table automatically refreshes

### What Happens Behind the Scenes

1. **User Account Created**: 
   - Email (lowercased) and hashed password stored
   - Role set to `STUDENT`
   - Name stored

2. **Student Profile Created**:
   - Linked to the user account
   - Status set to `active` by default
   - Enrollment date set to current date
   - Optional fields stored if provided

3. **Login Credentials**:
   - Student can immediately login at `/login`
   - Uses email as username
   - Uses the password you set

## Important Notes

- **Public Signup is Disabled**: Students cannot create their own accounts. Only admins can add students.
- **Email Uniqueness**: Each student must have a unique email address.
- **Password Security**: Passwords are hashed using bcrypt before storage.
- **Student Access**: Once created, students can login and access the course content, but cannot access admin features.

## Student Status Types

- **Active**: Currently enrolled and can access the course
- **Suspended**: Temporarily blocked from accessing the course
- **Completed**: Finished the course

## Additional Features

- **Search**: Filter students by name, email, or phone number
- **Delete**: Remove students with confirmation dialog
- **Edit**: Edit functionality coming soon (currently shows alert)

## Security

- All admin routes are protected
- Admin access is verified on every request
- Passwords are never stored in plain text
- Session cookies are httpOnly

## Quick Reference

| Action | Location | URL |
|--------|----------|-----|
| View Dashboard | Admin Dashboard | `/admin` |
| Manage Students | Quick Actions → Manage Students | `/admin/students` |
| Add Student | Student Management → Add Student Button | Modal |
| View Settings | Quick Actions → Settings | `/admin/settings` |
| Logout | Header → Logout Button | Redirects to `/login` |

---

**Note**: The admin panel is designed to be intuitive and requires minimal training. All student management operations are performed through the web interface - no database access needed.
