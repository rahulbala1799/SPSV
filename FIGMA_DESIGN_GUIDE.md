# Figma Design Guide for SPSV Landing Page

This guide will help you create your Figma design file with components that match the code components we've built.

## 🎨 Step 1: Create Your Figma File

1. Open Figma (desktop app or web)
2. Create a new file: **"SPSV Taxi License Landing Page"**
3. Save it to your team/project

## 📐 Step 2: Set Up Your Design System

### Create a Component Library Page

1. Create a new page called **"Components"** or **"Design System"**
2. This is where you'll create all your reusable components

### Design Tokens (Optional but Recommended)

Create a style guide with:
- **Colors**: 
  - Primary Blue: `#2563EB` (blue-600)
  - Secondary Gray: `#4B5563` (gray-600)
  - Success Green: `#10B981`
  - Error Red: `#EF4444`
- **Typography**:
  - Headings: Bold, various sizes
  - Body: Regular, 16px base
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px grid

## 🧩 Step 3: Create Components

Create these components in Figma that match your code:

### 1. Button Component

**Create a Button component with variants:**

- **Variants:**
  - Primary (blue background, white text)
  - Secondary (gray background, white text)
  - Outline (transparent, blue border, blue text)

- **Sizes:**
  - Small (height: ~36px)
  - Medium (height: ~44px)
  - Large (height: ~52px)

- **Properties to set:**
  - Text content (make it a text variable)
  - Background color (variant property)
  - Border (variant property)
  - Padding

**Figma Tips:**
- Use Auto Layout for proper spacing
- Create component variants for different states (default, hover, disabled)
- Name it: `Button` or `Button/Primary`, `Button/Secondary`, etc.

### 2. Input Component

**Create an Input component:**

- **Elements:**
  - Label text (optional)
  - Input field (rectangle with border)
  - Placeholder text
  - Error message (optional, hidden by default)

- **Properties:**
  - Label text (text variable)
  - Placeholder text (text variable)
  - Required indicator (boolean)
  - Error state (variant)

**Figma Tips:**
- Use Auto Layout with spacing
- Create variants for: default, focused, error states
- Name it: `Input` or `Input/Text`, `Input/Email`, etc.

### 3. Hero Component

**Create a Hero section:**

- **Elements:**
  - Background (gradient or solid color)
  - Main heading (large text)
  - Subtitle (medium text, optional)
  - Primary CTA button
  - Secondary CTA button (optional)

- **Layout:**
  - Centered content
  - Full-width section
  - Responsive considerations

**Figma Tips:**
- Use a Frame with Auto Layout
- Make buttons instances of your Button component
- Name it: `Hero` or `Hero Section`

### 4. Form Component

**Create a Form component:**

- **Elements:**
  - Form title (optional)
  - Multiple Input components (instances)
  - Submit button
  - Container/card background

- **Layout:**
  - Vertical stack of inputs
  - Consistent spacing
  - Card/container styling

**Figma Tips:**
- Use Auto Layout for spacing
- Make inputs instances of your Input component
- Make submit button an instance of Button component
- Name it: `Form` or `Application Form`

### 5. TrustBadge Component

**Create a TrustBadge component:**

- **Elements:**
  - Icon (emoji or icon)
  - Text label

- **Layout:**
  - Horizontal layout
  - Icon + text side by side

**Figma Tips:**
- Use Auto Layout
- Make icon and text separate elements
- Name it: `TrustBadge` or `Trust Badge`

## 📋 Step 4: Create the Landing Page Layout

1. Create a new page called **"Landing Page"** or **"Home"**
2. Build the full page layout using your components:
   - Hero section (use Hero component)
   - Benefits section
   - Form section (use Form component)
   - Trust badges section (use TrustBadge components)

## 🔗 Step 5: Publish Your Components

1. Select your component library page
2. Click the **"Publish"** button (top right)
3. Publish as a **"Team Library"** or **"File Library"**
4. This makes components available for Code Connect

## 📝 Component Naming Convention

For best Code Connect results, use these naming conventions:

- **Exact match**: `Button` in Figma → `Button` in code
- **Or use slashes**: `Button/Primary` → still maps to `Button` component
- **Keep it simple**: Avoid special characters, use PascalCase

## ✅ Checklist

Before mapping to code, ensure:

- [ ] All 5 components created (Button, Input, Hero, Form, TrustBadge)
- [ ] Components use Auto Layout
- [ ] Variants created for different states
- [ ] Components published to library
- [ ] Landing page layout created
- [ ] Component names match code component names (or close)

## 🚀 Next Steps

Once you've created your Figma file:

1. **Share the file URL** with me
2. I'll help you map components using Figma MCP tools
3. We'll set up Code Connect
4. You'll see your code in Figma Dev Mode!

## 💡 Pro Tips

- **Start simple**: Create basic components first, refine later
- **Use instances**: When building the landing page, use component instances
- **Test variants**: Make sure all variants work properly
- **Document**: Add notes/descriptions to components in Figma
- **Consistency**: Keep spacing, colors, and typography consistent

## 🎨 Design Inspiration

For a conversion-focused landing page, consider:

- **Clear hierarchy**: Most important info first
- **Strong CTAs**: Make buttons prominent and clear
- **Trust signals**: Include badges, testimonials, guarantees
- **Scannable**: Use bullet points, short paragraphs
- **Mobile-first**: Design for mobile, then scale up

---

**Ready to start?** Create your Figma file and share the URL when you're done, or ask me if you need help with any specific component design!
