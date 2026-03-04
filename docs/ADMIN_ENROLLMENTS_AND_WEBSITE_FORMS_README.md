# Admin Enrollments Section & Website Contact Forms

This document describes the desired Admin Panel enrollment section that collects website submissions, and provides a complete inventory of all contact forms across the website.

---

## Admin Panel – Enrollments Section (To Be Implemented)

### Overview
The Admin Panel needs a dedicated **Enrollments** section that displays all enrollment requests and contact form submissions originating from the public website. This allows admins to view, manage, and follow up on leads without needing to access external systems.

### Desired Features
- **Centralized View**: All website enrollments and contact form submissions in one place
- **Data Source**: Submissions from each contact form listed below (once persistence is implemented)
- **Management**: View, filter, search, and mark submissions as contacted/processed
- **Export**: Option to export enrollment data (e.g. CSV) for reporting

### Current State
- **No enrollments section exists** in the Admin Panel at present
- **No persistence**: The main enrollment form (`EnrollmentModal`) only logs to the browser console; data is not saved to the database
- **No API**: There is no API endpoint to receive and store website form submissions

### Implementation Requirements
To support this section, the following would need to be added:

1. **Database Model**: e.g. `WebsiteEnrollment` or `ContactFormSubmission` to store form data
2. **API Routes**: e.g. `POST /api/enrollments` and `GET /api/admin/enrollments` for submitting and listing
3. **Admin UI**: New page at `/admin/enrollments` with table/list of submissions
4. **Frontend Updates**: Connect each website form to the new API instead of console logging

---

## Website Contact Forms – Complete List

Below is an exhaustive list of **every** contact-style form and contact-related UI on the website. For each item, the location, purpose, current behavior, and data captured are documented.

---

### 1. Enrollment Modal (Enquiry Form)
| Field | Value |
|-------|-------|
| **Component** | `EnrollmentModal` |
| **Location** | Home page (`/`) – modal triggered by "Enroll Now", "Get Started", courses modal, header CTA |
| **Purpose** | Primary enrollment/enquiry form for course interest |
| **Current Behavior** | Submits to `console.log` only – **no persistence** |
| **Form Fields** | See below |

**Fields Captured:**
- `enrollmentType`: `'classroom'` \| `'app-only'` – plan choice
- `fullName` – required
- `email` – required
- `howDidYouHear` – optional
- `hasAppliedForTest` – boolean
- `testDate` – optional (if applied)
- `preferredSchedule` – `'flexible'` \| `'morning'` \| `'afternoon'`
- `additionalNotes` – optional

**Triggers:**
- Header "Enroll" / "Get Started"
- Hero CTA
- Courses Modal "Enroll Now"
- How It Works Modal completion CTA
- Platform features "Get Started" buttons

**File:** `src/components/EnrollmentModal.tsx`

---

### 2. Contact Section (Informational Only – No Form)
| Field | Value |
|-------|-------|
| **Location** | Home page (`/`) – section `id="contact"` |
| **Purpose** | Display contact information (location, email) |
| **Form?** | **No** – no input fields; static display only |
| **Data** | Email link (`mailto:info@spsvmastery.ie`), location text |

**Note:** The Courses Modal text refers to "the enquiry form to enroll" – that refers to the **Enrollment Modal** above, not a separate contact form in this section.

**File:** `src/app/page.tsx` (lines ~578–618)

---

### 3. Login Form
| Field | Value |
|-------|-------|
| **Location** | `/login` |
| **Purpose** | User authentication (student/admin sign-in) |
| **Form Type** | Auth form, not a contact/enquiry form |
| **Fields** | Email, Password |
| **API** | `POST /api/auth/login` |

**File:** `src/app/(auth)/login/page.tsx`

---

### 4. Signup Page
| Field | Value |
|-------|-------|
| **Location** | `/signup` |
| **Purpose** | Public registration – **currently disabled** |
| **Form?** | **No** – shows message and redirects to login |
| **Note** | Students are created by admins only; no signup form is shown |

**File:** `src/app/(auth)/signup/page.tsx`

---

### 5. Generic Form Component (Unused)
| Field | Value |
|-------|-------|
| **Component** | `Form` |
| **Location** | Exported from `src/components/Form.tsx`; **not used on any page** |
| **Purpose** | Reusable form with configurable fields |
| **Use Case** | Could be used for future contact forms |

**File:** `src/components/Form.tsx`

---

## Summary: Contact Forms That Capture User Data

| # | Form / UI | Page(s) | Persists Data? | Needs Admin View? |
|---|-----------|---------|----------------|-------------------|
| 1 | Enrollment Modal | `/` | ❌ No | ✅ Yes |
| 2 | Contact Section | `/` | N/A (no form) | N/A |
| 3 | Login Form | `/login` | Via auth | ❌ No |
| 4 | Signup Page | `/signup` | Disabled | ❌ No |
| 5 | Form component | — | Unused | N/A |

---

## Other Website Pages (No Contact Forms)

These pages may reference contact or enrollment but do **not** include input forms:

| Page | Notes |
|------|-------|
| `/success-stories` | Links to `/#contact`; no form |
| `/test-guide` | Informational; no form |
| `/timetable` | Has TimetableModal; "Contact us" text; no form |
| `/spsv-manual` | Reading content; no form |

---

## Quick Reference

### Admin Panel Sections (Current)
- `/admin` – Dashboard
- `/admin/students` – Student management (manual add/edit)
- `/admin/settings` – Settings
- `/admin/analytics` – Analytics
- `/admin/content` – Content management
- `/admin/questions` – Question bank
- `/admin/mcq-builder/create` – MCQ test builder
- **`/admin/enrollments`** – **Not yet implemented** (intended for website form submissions)

### Forms That Should Feed Admin Enrollments (Once Implemented)
1. **Enrollment Modal** – main enquiry form

---

*Last updated: March 2025*
