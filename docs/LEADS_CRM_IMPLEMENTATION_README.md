# Leads CRM – Convert CTAs to Forms & Store in Backend

This document specifies how to convert all non-form CTAs into form-based lead capture, send data to the backend, and provide a small CRM in the Admin Panel. No email integration required.

---

## Goal

1. **Every lead-capture CTA** opens a form that collects user info
2. **Form submissions** are sent to the backend and stored
3. **Small CRM** in Admin Panel to view, filter, and manage leads

---

## CTAs to Convert (No Form → Form)

| # | Current CTA | Location | Current Action | New Behavior |
|---|-------------|----------|----------------|--------------|
| 1 | **Email Us** | Timetable page | `mailto:info@spsvmastery.ie` | Open lead form modal |
| 2 | **Enquire Now** | Success Stories page | Link to `/#contact` | Open lead form modal |
| 3 | **View Our Courses** | Test Guide page | Link to `/` | Open lead form modal (or redirect to home with modal open) |
| 4 | **Email Us** | Test Guide page | `mailto:info@spsvmastery.ie` | Open lead form modal |
| 5 | **Contact** | Header “More” menu | Link to `/#contact` | Open lead form modal |

**Note:** CTAs that already open the Enrollment form (Book Taxi Test Classes, Enroll Now, etc.) will continue to use the same form – that form will be connected to the backend.

---

## Lead Form – Single Shared Form

**Use the same form** (`EnrollmentModal`) for all lead-capture CTAs. A `source` value is auto-set from the CTA so admins know where each lead came from.

### Required Fields (Must Have)
| Field | Type | Validation |
|-------|------|------------|
| **Full Name** | text | Required, min 2 chars |
| **Email** | email | Required, valid email format |
| **Phone** | tel | Required, valid phone format |

### Optional Fields
| Field | Type | Description |
|-------|------|--------------|
| Days free | date range | When they are available (e.g. “From 1 Feb – To 28 Feb”) |
| Which days | multi-select or text | e.g. “Mon, Wed, Fri” or free text |
| Preferred time | select or text | e.g. “Morning”, “Afternoon”, “Flexible” or specific times |
| Additional notes | textarea | Any other info they want to share |

### Source (Auto-Set)
Set automatically based on which CTA opened the form – not user-facing.

---

## Form UI Design – Pro SaaS Style

The form should match the website’s modern, polished look. Here’s how it should feel:

### Overall Feel
- **Clean & minimal** – No clutter; focus on the fields
- **Confident gradients** – Emerald/cyan accents consistent with the site
- **Smooth interactions** – Subtle hover, focus states, and transitions
- **Trust signals** – Small reassurance text (e.g. “We’ll be in touch within 24 hours”)

### Layout & Components
- **Modal** – Centered overlay with backdrop blur; rounded corners (e.g. `rounded-2xl` or `rounded-3xl`)
- **Steps** – If multi-step: clear progress (dots or stepper) and “Step 2 of 4” text
- **Inputs** – Rounded fields, clear labels, light borders, focus ring in brand color
- **Buttons** – Primary gradient (emerald → cyan), secondary outline; subtle scale on hover
- **Typography** – Bold headings, readable body text; clear hierarchy

### Visual Details
- Inputs: `rounded-xl`, `border-gray-200`, `focus:ring-2 focus:ring-emerald-500`
- Primary button: `bg-gradient-to-r from-emerald-500 to-cyan-500`, `hover:shadow-lg`
- Success state: Check icon, short thank-you message, “We’ll contact you soon”
- Spacing: Generous padding; consistent gaps between sections

### Responsive
- Works on mobile: stacked layout, touch-friendly targets
- Desktop: Modal width ~max-w-lg or max-w-xl for comfort

The goal: when someone clicks “Enquire Now” or “Book Taxi Test Classes”, the form feels like a natural part of the site – professional, trustworthy, and on-brand.

---

## Backend: No Email, Just Storage

- **POST /api/leads** – Accept form submission, validate, insert into database
- **GET /api/admin/leads** – List leads (admin auth required)
- No email sending; data is stored only

---

## Admin CRM UI – Mobile & Desktop

The Admin CRM must work well on **mobile and desktop**, showing leads clearly with all details in a neat, efficient way.

### Admin Route

- `/admin/leads` (or `/admin/enrollments`)

---

### Layout: Mobile vs Desktop

| Screen | Layout | Behaviour |
|--------|--------|-----------|
| **Desktop** | Table layout, side-by-side filters | Full table with visible columns; filters in a toolbar |
| **Mobile** | Card/stack layout | One lead per card; tap to expand for full details |

**Desktop:** Table with columns for Date, Name, Email, Phone, Source, Status. Row click or “View” opens a detail drawer/panel.  
**Mobile:** Compact cards showing Name, Email, source badge, status badge. Tap card to expand and see full details inline.

---

### Lead List Display

**Summary (visible without expanding):**
- Date submitted
- Name
- Email
- Phone
- Source (badge: enrolment, timetable, success-stories, test-guide, contact)
- Status (badge: new, contacted, converted, closed)

**Full details (expand / drawer / modal):**
- All summary fields
- Days free (date range if provided)
- Which days (if provided)
- Preferred time (if provided)
- Additional notes (if provided)
- Admin notes (editable)
- Status change dropdown
- Optional: mailto/tel links for quick contact

---

### Responsive Behaviour

| Element | Desktop | Mobile |
|---------|---------|--------|
| **Filters** | Inline toolbar: Source dropdown, Status dropdown, Search input | Collapsible filter section or bottom sheet; search prominent |
| **Table** | Horizontal scroll if needed; sticky header | Replaced by vertical stack of cards |
| **Lead card** | N/A | Card with primary info; chevron or tap area to expand |
| **Detail view** | Slide-in drawer or side panel | Full-width expand below card, or bottom sheet |
| **Touch targets** | Standard | Min 44px for buttons/links |
| **Typography** | Comfortable reading size | Slightly larger for readability on small screens |

---

### Visual Design – Neat & Efficient

- **Clear hierarchy** – Date and name stand out; secondary info (email, phone) slightly muted.
- **Source badges** – Colour by source (e.g. emerald for enrolment, blue for timetable).
- **Status badges** – Colour by status (e.g. amber = new, blue = contacted, green = converted, gray = closed).
- **Scannable** – Consistent spacing; rows/cards easy to distinguish.
- **No clutter** – Hide rarely used fields until detail view.
- **Clickable actions** – Status change, call (tel:), email (mailto:) as clear buttons/links.

---

### Features Checklist

| Feature | Description |
|---------|-------------|
| **Lead list** | Table (desktop) / cards (mobile) with date, name, email, phone, source, status |
| **Filters** | Filter by source, status; works on both layouts |
| **Search** | Search by name, email, or phone; instant or debounced |
| **Detail view** | Expand, drawer, or modal showing all lead fields + admin notes |
| **Status update** | Dropdown or buttons: New → Contacted → Converted → Closed |
| **Admin notes** | Editable in detail view; persisted |
| **Quick actions** | mailto and tel links for one-tap contact |
| **Export** | Optional: CSV export |
| **Empty state** | Friendly message when no leads match filters |

---

## Data Model

```prisma
model WebsiteLead {
  id        String   @id @default(cuid())
  source    String   // "enrollment" | "timetable" | "success-stories" | "test-guide" | "contact"
  
  // Required
  fullName  String
  email     String
  phone     String
  
  // Optional – availability
  daysFreeFrom   DateTime?  // Date range start
  daysFreeTo     DateTime?  // Date range end
  whichDays      String?    // e.g. "Mon, Wed, Fri"
  preferredTime String?    // e.g. "Morning", "Afternoon", "Flexible"
  
  // Optional – enrollment-specific
  enrollmentType    String?
  preferredSchedule String?
  hasAppliedForTest Boolean?
  testDate          DateTime?
  howDidYouHear     String?
  additionalNotes   String?
  
  status    String   @default("new")   // new, contacted, converted, closed
  createdAt DateTime @default(now())
  notes     String?  // Admin notes (internal)
  
  @@index([email])
  @@index([source])
  @@index([status])
  @@index([createdAt])
  @@map("website_leads")
}
```

---

## Implementation Checklist

### 1. Database & API
- [ ] Add `WebsiteLead` model to `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name add_website_leads`
- [ ] Create `POST /api/leads` – public, no auth
- [ ] Create `GET /api/admin/leads` – admin auth required
- [ ] Create `PATCH /api/admin/leads/[id]` – update status/notes (optional)

### 2. Update & Connect Lead Form
- [ ] Add **phone** as required field to `EnrollmentModal.tsx`
- [ ] Add optional fields: **days free** (date range), **which days**, **preferred time**
- [ ] Apply pro SaaS UI (gradients, rounded inputs, clear hierarchy)
- [ ] `handleSubmit` calls `POST /api/leads` with all fields + `source`
- [ ] Add error handling and success state

### 3. Convert CTAs (No Form → Form)
- [ ] **Timetable** – Replace “Email Us” with button that opens EnrollmentModal (or ContactFormModal) with `source: "timetable"`
- [ ] **Success Stories** – Replace “Enquire Now” link with button that opens form with `source: "success-stories"`
- [ ] **Test Guide** – Replace “View Our Courses” and “Email Us” with buttons that open form with `source: "test-guide"`
- [ ] **Header Contact** – Replace “Contact” link with button that opens form with `source: "contact"`

### 4. Add Form to Other Pages
- [ ] Add `EnrollmentModal` (or shared form component) to Timetable, Success Stories, Test Guide
- [ ] Use `window.dispatchEvent(new CustomEvent('openEnrollment', { detail: { source } }))` or pass `source` via context/props

### 5. Admin CRM UI (Mobile & Desktop)
- [ ] Create `/admin/leads` page
- [ ] Add “Leads” or “Enrollments” link to Admin sidebar
- [ ] **Desktop:** Table layout – Date, Name, Email, Phone, Source, Status, View
- [ ] **Mobile:** Card layout – compact cards, tap to expand for full details
- [ ] Detail view (drawer/expand/panel): all fields, admin notes, status update
- [ ] Filters: Source, Status (responsive: inline on desktop, collapsible on mobile)
- [ ] Search: name, email, phone
- [ ] Source & status badges with clear colours
- [ ] Quick actions: mailto and tel links for one-tap contact

---

## Files to Create or Modify

| Task | File |
|------|------|
| Schema | `prisma/schema.prisma` |
| Submit API | `src/app/api/leads/route.ts` (create) |
| List API | `src/app/api/admin/leads/route.ts` (create) |
| Update API | `src/app/api/admin/leads/[id]/route.ts` (create, optional) |
| Form submit | `src/components/EnrollmentModal.tsx` |
| Timetable CTA | `src/app/timetable/page.tsx` |
| Success Stories CTA | `src/app/success-stories/page.tsx` |
| Test Guide CTAs | `src/app/test-guide/page.tsx` |
| Header Contact | `src/components/Header.tsx` |
| Admin CRM | `src/app/admin/leads/page.tsx` (create) |
| Admin nav | `src/components/admin/AdminLayout.tsx` (or equivalent) |

---

## Source Values for Leads

| Source | When Used |
|--------|-----------|
| `enrollment` | EnrollmentModal (Book Taxi Classes, Enroll Now, etc.) |
| `timetable` | Timetable “Email Us” CTA |
| `success-stories` | Success Stories “Enquire Now” CTA |
| `test-guide` | Test Guide “View Our Courses” / “Email Us” CTAs |
| `contact` | Header “Contact” link |

---

## CRM UI Mockups (Conceptual)

### Desktop

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Leads / Enrollments                                                       [Export]  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Source: [All ▼]  Status: [All ▼]  Search: [____________________] 🔍                  │
├────────┬──────────────┬─────────────────────┬─────────────┬────────────┬───────────┤
│ Date   │ Name         │ Email               │ Phone       │ Source     │ Status    │
├────────┼──────────────┼─────────────────────┼─────────────┼────────────┼───────────┤
│ 4 Mar  │ John Doe     │ john@example.com    │ 087 123 456 │ enrolment  │ New       │
│ 3 Mar  │ Jane Smith   │ jane@example.com    │ 086 987 654 │ timetable  │ Contacted │
└────────┴──────────────┴─────────────────────┴─────────────┴────────────┴───────────┘
                                                                          [View →]
```

*Row click or “View” opens detail drawer with full info.*

### Mobile (Card Stack)

```
┌─────────────────────────────────┐
│ Search: [________________]  🔍  │
│ Source [All ▼]  Status [All ▼]   │
├─────────────────────────────────┤
│ John Doe                    [New]│
│ john@example.com                 │
│ enrolment              [View ▼]  │
├─────────────────────────────────┤
│ Jane Smith            [Contacted]│
│ jane@example.com                 │
│ timetable               [View ▼] │
├─────────────────────────────────┤
│ ...                              │
└─────────────────────────────────┘
```

*Tap “View” expands card to show phone, dates, notes, actions.*

---

## Deployment

### Live DB config (`.env.live`)

Production DB credentials go in `.env.live` (gitignored). Copy from `.env.live.example`:

```bash
cp .env.live.example .env.live
# Edit .env.live with your real DATABASE_URL
```

### Migrations (live DB)

```bash
# Apply pending migrations to live DB
npm run migrate:live

# Create a new migration against live DB (interactive)
npm run migrate:live:dev
```

Uses `dotenv -e .env.live` so migrations run against the live Neon database without touching local `.env`.

### Build & deploy

```bash
npm run build
# Deploy to Vercel, Railway, or your hosting platform
```

Ensure `DATABASE_URL` is set in your hosting env vars (Vercel, etc.).

---

*Last updated: March 2025*
