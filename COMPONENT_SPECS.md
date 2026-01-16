# Component Specifications for Figma Design

This document provides detailed specifications for each component to help you design them accurately in Figma.

## Button Component

### Variants

**Primary Button:**
- Background: `#2563EB` (blue-600)
- Text Color: `#FFFFFF` (white)
- Border: None
- Hover: `#1D4ED8` (blue-700)
- Focus Ring: `#3B82F6` (blue-500), 2px offset

**Secondary Button:**
- Background: `#4B5563` (gray-600)
- Text Color: `#FFFFFF` (white)
- Border: None
- Hover: `#374151` (gray-700)

**Outline Button:**
- Background: Transparent
- Text Color: `#2563EB` (blue-600)
- Border: 2px solid `#2563EB`
- Hover: Background `#EFF6FF` (blue-50)

### Sizes

- **Small**: Padding `16px 16px`, Font Size `14px`, Height `36px`
- **Medium**: Padding `12px 24px`, Font Size `16px`, Height `44px`
- **Large**: Padding `16px 32px`, Font Size `18px`, Height `52px`

### Typography
- Font Weight: `600` (semibold)
- Border Radius: `8px` (rounded-lg)
- Transition: `200ms` ease

---

## Input Component

### Structure
- Label (optional): Font Size `14px`, Font Weight `500`, Color `#374151` (gray-700)
- Required Indicator: Red asterisk `*`, Color `#EF4444`
- Input Field:
  - Padding: `12px 16px`
  - Border: `1px solid #D1D5DB` (gray-300)
  - Border Radius: `8px`
  - Font Size: `16px`
  - Focus: Border `#3B82F6` (blue-500), Ring `2px`
- Error Message: Font Size `14px`, Color `#EF4444`, Margin Top `4px`

### States
- **Default**: Gray border
- **Focused**: Blue border + ring
- **Error**: Red border, show error message

---

## Hero Component

### Layout
- Full width section
- Background: Gradient from `#2563EB` to `#1E40AF` (blue-600 to blue-800)
- Padding: `80px 16px` (vertical/horizontal)
- Max Width: `1024px` (centered)
- Text Alignment: Center

### Typography
- **Title**: 
  - Font Size: `48px` (mobile) / `60px` (desktop)
  - Font Weight: `700` (bold)
  - Color: `#FFFFFF`
  - Line Height: `1.2`
  - Margin Bottom: `24px`

- **Subtitle**:
  - Font Size: `20px` (mobile) / `24px` (desktop)
  - Font Weight: `400` (regular)
  - Color: `#BFDBFE` (blue-100)
  - Margin Bottom: `32px`

### Buttons
- Primary CTA: White background, blue text
- Secondary CTA: Outline style, white border
- Gap: `16px`
- Flex direction: Column (mobile) / Row (desktop)

---

## Form Component

### Container
- Background: `#FFFFFF`
- Padding: `32px`
- Border Radius: `8px`
- Box Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### Title
- Font Size: `24px`
- Font Weight: `700` (bold)
- Color: `#111827` (gray-900)
- Margin Bottom: `24px`

### Inputs
- Spacing between inputs: `16px`
- All inputs full width

### Submit Button
- Full width
- Large size
- Primary variant

---

## TrustBadge Component

### Layout
- Horizontal flex layout
- Gap: `12px`
- Alignment: Center

### Icon
- Size: `24px × 24px` (or emoji/text)
- Font Size: `24px`

### Text
- Font Size: `16px`
- Font Weight: `500` (medium)
- Color: `#374151` (gray-700)

---

## Color Palette

```
Primary Blue:
  - blue-50:  #EFF6FF
  - blue-500: #3B82F6
  - blue-600: #2563EB
  - blue-700: #1D4ED8
  - blue-800: #1E40AF

Gray Scale:
  - gray-100: #F3F4F6
  - gray-300: #D1D5DB
  - gray-600: #4B5563
  - gray-700: #374151
  - gray-900: #111827

Status Colors:
  - green-500: #10B981
  - red-500:   #EF4444
```

## Spacing Scale

```
4px   → 0.25rem
8px   → 0.5rem
12px  → 0.75rem
16px  → 1rem
24px  → 1.5rem
32px  → 2rem
48px  → 3rem
64px  → 4rem
80px  → 5rem
```

## Typography Scale

```
14px → 0.875rem (small text)
16px → 1rem (base)
18px → 1.125rem
20px → 1.25rem
24px → 1.5rem
30px → 1.875rem
36px → 2.25rem
48px → 3rem
60px → 3.75rem
```

---

Use these specs as a reference when creating your Figma components. They match the Tailwind CSS classes used in the code components.
