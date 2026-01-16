# Figma AI Prompt - Complete Design System

Copy and paste this entire prompt into Figma AI to generate your complete design system and landing page.

---

## PROMPT FOR FIGMA AI:

Create a complete design system and landing page for an SPSV taxi license conversion funnel. Follow these exact specifications:

### DESIGN SYSTEM SETUP

**Create a page called "Design System" with:**

1. **Color Styles:**
   - Primary Blue: #2563EB (blue-600)
   - Primary Blue Dark: #1D4ED8 (blue-700)
   - Primary Blue Light: #3B82F6 (blue-500)
   - Primary Blue Darker: #1E40AF (blue-800)
   - Primary Blue Lightest: #EFF6FF (blue-50)
   - Primary Blue Text: #BFDBFE (blue-100)
   - Gray 600: #4B5563
   - Gray 700: #374151
   - Gray 900: #111827
   - Gray 300: #D1D5DB
   - Gray 100: #F3F4F6
   - White: #FFFFFF
   - Red Error: #EF4444
   - Green Success: #10B981

2. **Text Styles:**
   - Heading 1: 60px, Bold (700), #FFFFFF
   - Heading 2: 48px, Bold (700), #111827
   - Heading 3: 24px, Bold (700), #111827
   - Body Large: 24px, Regular (400), #BFDBFE
   - Body: 16px, Regular (400), #374151
   - Body Small: 14px, Medium (500), #374151
   - Label: 14px, Medium (500), #374151

### COMPONENT 1: BUTTON

**Create a component named exactly "Button" with:**

- **Variants:**
  - Primary: Background #2563EB, Text #FFFFFF, No border, Border radius 8px
  - Secondary: Background #4B5563, Text #FFFFFF, No border, Border radius 8px
  - Outline: Background transparent, Text #2563EB, Border 2px solid #2563EB, Border radius 8px

- **Sizes:**
  - Small: Padding 16px horizontal, 8px vertical, Font size 14px, Height 36px
  - Medium: Padding 24px horizontal, 12px vertical, Font size 16px, Height 44px
  - Large: Padding 32px horizontal, 16px vertical, Font size 18px, Height 52px

- **Properties:**
  - Font weight: 600 (Semibold)
  - Use Auto Layout with proper padding
  - Create component variants for all combinations (Primary/Small, Primary/Medium, Primary/Large, Secondary/Small, etc.)
  - Text should be editable (instance swap)

- **States (optional but recommended):**
  - Default, Hover (darker background), Focus (ring), Disabled

### COMPONENT 2: INPUT

**Create a component named exactly "Input" with:**

- **Structure:**
  - Label text (optional, 14px, Medium, #374151)
  - Required asterisk (*) in red (#EF4444) when needed
  - Input field: Rectangle with border 1px solid #D1D5DB, Border radius 8px, Padding 12px horizontal 16px vertical
  - Placeholder text: 16px, Regular, Gray color
  - Error message (hidden by default): 14px, #EF4444, Margin top 4px

- **Variants:**
  - Default: Gray border (#D1D5DB)
  - Focused: Blue border (#3B82F6) with 2px ring
  - Error: Red border (#EF4444) with error message visible

- **Properties:**
  - Label text (editable)
  - Placeholder text (editable)
  - Required (boolean - shows/hides asterisk)
  - Error state (boolean - shows/hides error)
  - Use Auto Layout with vertical spacing

### COMPONENT 3: HERO

**Create a component named exactly "Hero" with:**

- **Layout:**
  - Full width frame
  - Background: Linear gradient from #2563EB to #1E40AF (top to bottom)
  - Padding: 80px vertical, 16px horizontal
  - Max width: 1024px (centered)
  - Text alignment: Center

- **Content:**
  - Main heading: 60px (desktop) / 48px (mobile), Bold, #FFFFFF, Line height 1.2, Margin bottom 24px
  - Subtitle (optional): 24px (desktop) / 20px (mobile), Regular, #BFDBFE, Margin bottom 32px
  - Primary CTA button: Instance of Button component (Primary variant, Large size, white background override)
  - Secondary CTA button (optional): Instance of Button component (Outline variant, Large size, white border override)
  - Button gap: 16px
  - Buttons in row (desktop) or column (mobile)

- **Properties:**
  - Title text (editable)
  - Subtitle text (editable, optional)
  - Primary CTA text (editable)
  - Secondary CTA text (editable, optional)
  - Use Auto Layout with proper spacing

### COMPONENT 4: FORM

**Create a component named exactly "Form" with:**

- **Container:**
  - Background: #FFFFFF
  - Padding: 32px all sides
  - Border radius: 8px
  - Shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1)

- **Content:**
  - Title (optional): 24px, Bold, #111827, Margin bottom 24px
  - Multiple Input instances (vertical stack)
  - Spacing between inputs: 16px
  - All inputs full width
  - Submit button: Instance of Button component (Primary variant, Large size, full width)

- **Properties:**
  - Form title (editable, optional)
  - Submit button text (editable)
  - Number of input fields (make it flexible)
  - Use Auto Layout with vertical spacing

### COMPONENT 5: TRUSTBADGE

**Create a component named exactly "TrustBadge" with:**

- **Layout:**
  - Horizontal Auto Layout
  - Gap: 12px
  - Alignment: Center

- **Content:**
  - Icon/Emoji: 24px × 24px (or text size 24px)
  - Text label: 16px, Medium (500), #374151

- **Properties:**
  - Icon (editable - can be emoji or icon)
  - Text (editable)
  - Use Auto Layout

### LANDING PAGE LAYOUT

**Create a page called "Landing Page" with:**

1. **Hero Section:**
   - Use Hero component instance
   - Title: "Get Your SPSV Taxi License"
   - Subtitle: "Start your journey to becoming a licensed taxi driver. Fast, easy, and secure application process."
   - Primary CTA: "Apply Now"
   - Secondary CTA: "Learn More"

2. **Benefits Section:**
   - Background: #F3F4F6 (gray-100)
   - Padding: 64px vertical, 16px horizontal
   - Two-column layout (desktop) / single column (mobile)
   - Left side: Heading "Why Choose Our Service?" with bullet points:
     * Fast and efficient application process
     * Expert guidance throughout the process
     * Secure and confidential handling
     * Support from application to approval
   - Right side: Form component instance with:
     * Title: "Start Your Application"
     * Fields: Full Name, Email Address, Phone Number (all required)
     * Submit: "Submit Application"

3. **Trust Badges Section:**
   - Background: #FFFFFF
   - Padding: 48px vertical, 16px horizontal
   - Centered heading: "Trusted by Thousands of Drivers"
   - Three TrustBadge instances in a row:
     * 🔒 "Secure & Confidential"
     * ⚡ "Fast Processing"
     * ✅ "High Success Rate"

### TECHNICAL REQUIREMENTS

- **Component Naming:** Use EXACT names: "Button", "Input", "Hero", "Form", "TrustBadge" (case-sensitive)
- **Auto Layout:** Use Auto Layout for all components for proper spacing and responsiveness
- **Variants:** Create proper component variants for all states and sizes
- **Instances:** Use component instances when building the landing page (not copies)
- **Publishing:** After creation, publish all components as a library
- **Responsive:** Consider mobile (375px) and desktop (1440px) breakpoints

### FINAL CHECKLIST

After generation, verify:
- [ ] All 5 components created with exact names
- [ ] Components use Auto Layout
- [ ] Variants work correctly
- [ ] Landing page uses component instances
- [ ] Colors match specifications
- [ ] Typography matches specifications
- [ ] Components are published to library
- [ ] File is saved and shareable

---

**IMPORTANT FOR CODE CONNECT:**
- Component names MUST match exactly: Button, Input, Hero, Form, TrustBadge
- Components should be published as a library
- Use proper component structure (not just frames)
- Make sure components are reusable (not one-off designs)

---

**After creating in Figma:**
1. Share the file URL
2. We'll map components to code using Figma Code Connect
3. You'll see your React code in Figma Dev Mode!
