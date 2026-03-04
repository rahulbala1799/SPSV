# Website Contact Forms – Lead Persistence in Backend

This document lists **all** lead-capture CTAs and contact forms across the website, which are currently not connected to any backend. It specifies how to save all leads.

---

## Requirement: Save All Leads in Backend

Every contact form and enquiry CTA on the website must capture and persist leads to the database so that:
- Admins can view and manage leads in the Admin Panel
- No leads are lost
- Follow-up can be tracked

---

## Complete List: Lead-Capture CTAs & Forms

### CTAs That Open the Enrollment Form (Same Modal, Multiple Entry Points)

All of these buttons open the **EnrollmentModal** – the main contact/enquiry form. The form exists and works, but submissions are **not saved** (only `console.log`).

| # | Button Label | Location | Component / File | Connected to Form? | Saves to Backend? |
|---|--------------|----------|------------------|--------------------|-------------------|
| 1 | **Book Taxi Test Classes** | Home – Hero | `SaaSHero.tsx` | ✅ Yes | ❌ No |
| 2 | **Enroll Now** | Header (desktop + mobile) | `Header.tsx` | ✅ Yes | ❌ No |
| 3 | **Start Learning** | Home – Flagging section | `page.tsx` | ✅ Yes | ❌ No |
| 4 | **Enquire About Taxi Test Classes** | Home – Final CTA | `page.tsx` | ✅ Yes | ❌ No |
| 5 | **Enroll Now** | Courses Modal | `CoursesModal.tsx` | ✅ Yes | ❌ No |
| 6 | **Get Started / Enroll** | How It Works Modal (final step) | `HowItWorksModal.tsx` | ✅ Yes | ❌ No |

**Note:** `CoursesModal` is currently **never opened** – there is no button that calls `setIsCoursesModalOpen(true)` on the home page. If “View Courses” or similar exists elsewhere, it should open CoursesModal, which then has “Enroll Now” → EnrollmentModal.

---

### CTAs That Do NOT Have Forms (Mailto or Links Only)

These buttons/links encourage contact but have **no form** – users go to mailto or an anchor. No leads are captured.

| # | Button/Link Label | Location | Action | Has Form? | Captures Lead? |
|---|------------------|----------|--------|-----------|----------------|
| 7 | **Email Us** | Timetable page CTA | `mailto:info@spsvmastery.ie` | ❌ No | ❌ No |
| 8 | **Enquire Now** | Success Stories CTA | Link to `/#contact` | ❌ No | ❌ No |
| 9 | **View Our Courses** | Test Guide CTA | Link to `/` | ❌ No | ❌ No |
| 10 | **Email Us** | Test Guide CTA | `mailto:info@spsvmastery.ie` | ❌ No | ❌ No |
| 11 | **Contact** | Header “More” menu | Link to `/#contact` | ❌ No | ❌ No |

**Recommendation:** Replace mailto/link CTAs with forms, or open the Enrollment modal from these pages so leads are captured before sending email.

---

### Modals / Sections With “Contact” or “Enrol” But No Form

| Item | Location | Content | Has Form? |
|------|----------|---------|-----------|
| **Contact Section** | Home `#contact` | Email + location only | ❌ No |
| **TimetableModal** | Timetable page | “Contact us to enroll” text | ❌ No – no input fields |
| **CoursesModal** | Home (not currently opened) | “Enroll Now” → opens EnrollmentModal | Contains CTA to form, no form itself |

---

### The One Actual Contact Form: Enrollment Modal

| Item | Details |
|------|---------|
| **Component** | `EnrollmentModal` |
| **File** | `src/components/EnrollmentModal.tsx` |
| **Lead Type** | Course enrolment interest |
| **Current State** | ❌ **Not saved** – only `console.log` on submit |

**Fields to Persist:**
| Field | Type | Required |
|------|------|----------|
| `enrollmentType` | `'classroom' \| 'app-only'` | Yes |
| `fullName` | string | Yes |
| `email` | string | Yes |
| `howDidYouHear` | string | No |
| `hasAppliedForTest` | boolean | No |
| `testDate` | string (date) | No |
| `preferredSchedule` | `'flexible' \| 'morning' \| 'afternoon'` | No |
| `additionalNotes` | string | No |

**Submit Handler:** `handleSubmit` in `EnrollmentModal.tsx` (line ~115) – replace `console.log` with API call.

---

### Other Forms (Not Lead Forms)

| Form | Location | Purpose |
|------|----------|---------|
| Login | `/login` | Auth only |
| Signup | `/signup` | Disabled |

---

## Summary

| Type | Count | Saves to Backend? |
|------|-------|-------------------|
| CTAs that open EnrollmentModal | 6 | ❌ No (form not connected) |
| CTAs that use mailto/link only | 5 | ❌ No (no form) |
| Contact form with inputs | 1 (EnrollmentModal) | ❌ No |

**All leads from the enrollment form must be saved to the backend. CTAs that currently use mailto/links should be replaced or augmented with the enrollment form so leads are captured.**

---

## Wiring Recommendations

1. **Connect mailto / link CTAs to EnrollmentModal** – On Timetable, Success Stories, and Test Guide, change “Email Us” / “Enquire Now” to open the Enrollment modal (or a lightweight contact form) instead of `mailto:` or `/#contact`, so leads are captured before any email is sent.
2. **Wire up CoursesModal** – Add a “View Courses” or similar CTA that opens `CoursesModal` (e.g. from FeatureShowcase or a courses section); it already has “Enroll Now” → EnrollmentModal.
3. **Add EnrollmentModal to other pages** – Success Stories, Timetable, and Test Guide use `Header` (which has Enroll), but their page-specific CTAs do not. Pass `onEnroll`/`openEnrollment` and render `EnrollmentModal` on those pages so local CTAs can open it.

---

## Implementation Guide: Saving Leads in Backend

### 1. Database Model

Add to `prisma/schema.prisma`:

```prisma
// Website lead / contact form submission
model WebsiteLead {
  id        String   @id @default(cuid())
  source    String   // "enrollment" | "contact" etc.
  fullName  String?
  email     String
  phone     String?
  
  // Enrollment-specific
  enrollmentType    String?   // "classroom" | "app-only"
  preferredSchedule String?
  hasAppliedForTest Boolean?
  testDate          DateTime?
  howDidYouHear     String?
  additionalNotes   String?
  
  status     String   @default("new")   // new, contacted, converted, closed
  createdAt  DateTime @default(now())
  
  @@index([email])
  @@index([source])
  @@index([createdAt])
  @@map("website_leads")
}
```

Run: `npx prisma migrate dev --name add_website_leads`

---

### 2. API Route: Submit Lead (Public)

Create `src/app/api/leads/route.ts`:

```ts
// POST /api/leads – public endpoint, no auth
// Body: { source, fullName, email, ... }
```

- Validate required fields (email, source)
- Insert into `WebsiteLead`
- Return success/error

---

### 3. API Route: List Leads (Admin Only)

Create `src/app/api/admin/leads/route.ts`:

```ts
// GET /api/admin/leads – admin auth required
// Query: ?source=enrollment&status=new
```

- Verify admin session
- Return leads with pagination/filtering

---

### 4. Frontend: Connect Enrollment Modal

In `src/components/EnrollmentModal.tsx`, replace:

```ts
// Current (line ~115)
console.log('Enrollment submitted:', formData);
```

With:

```ts
const res = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source: 'enrollment',
    fullName: formData.fullName,
    email: formData.email,
    enrollmentType: formData.enrollmentType,
    preferredSchedule: formData.preferredSchedule,
    hasAppliedForTest: formData.hasAppliedForTest,
    testDate: formData.testDate || null,
    howDidYouHear: formData.howDidYouHear,
    additionalNotes: formData.additionalNotes,
  }),
});
if (!res.ok) throw new Error('Failed to submit');
```

---

### 5. Admin Panel: Leads/Enrollments Page

Create `src/app/admin/leads/page.tsx` (or `/admin/enrollments`):

- Table of leads: date, name, email, source, status
- Filter by source, status
- Search by name/email
- Mark as contacted/converted

---

## File Checklist

| Task | File / Location |
|------|-----------------|
| Add model | `prisma/schema.prisma` |
| Migration | `npx prisma migrate dev` |
| Submit API | `src/app/api/leads/route.ts` |
| Admin list API | `src/app/api/admin/leads/route.ts` |
| Update form | `src/components/EnrollmentModal.tsx` |
| Admin UI | `src/app/admin/leads/page.tsx` |
| Nav link | Admin sidebar/layout |

---

*Last updated: March 2025*
