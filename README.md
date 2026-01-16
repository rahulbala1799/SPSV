# SPSV Taxi License Training - Landing Page

A high-conversion sales funnel landing page for SPSV (Small Public Service Vehicle) taxi license training and test preparation. This project provides comprehensive information about the SPSV Driver Entry Test, free training resources, and guides users through the process of becoming a licensed taxi driver in Dublin, Ireland.

## 🎯 Project Overview

This is a conversion-optimized landing page designed to:
- **Educate** potential taxi drivers about the SPSV licensing process
- **Convert** visitors into registered users for free SPSV training
- **Guide** users through the complete journey from training to license
- **Provide** comprehensive information about test requirements and procedures

The design is inspired by [Lynk.ie's SPSV training page](https://www.lynk.ie/spsv-training/) and incorporates official information from the [National Transport Authority](https://www.nationaltransport.ie/taxi/driver-licensing/applying-for-an-spsv-driver-licence/the-spsv-driver-entry-test/).

## 🚀 Features

### Core Functionality
- **Hero Section** - Compelling headline with clear call-to-action
- **Requirements Display** - Visual list of what's needed to become a taxi driver
- **Statistics Section** - Social proof with key numbers (8,000+ drivers, pass rates, fees)
- **Test Information** - Comprehensive details about the SPSV Entry Test format
- **Registration Form** - Lead capture form for free training course signup
- **Step-by-Step Guide** - Visual walkthrough of the licensing process
- **Benefits Section** - What users get after passing the test
- **Trust Badges** - Credibility indicators
- **FAQ Section** - Expandable accordion with common questions
- **Contact Section** - Multiple ways to get in touch

### Technical Features
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for responsive, modern styling
- **Component-based architecture** for maintainability
- **Green color scheme** (Irish theme) with professional gradients
- **Fully responsive** design (mobile, tablet, desktop)
- **Accessibility-focused** with proper semantic HTML
- **Vercel-ready** deployment configuration
- **Git integration** for version control and CI/CD

## 📋 What is SPSV?

**SPSV** stands for **Small Public Service Vehicle**, which includes:
- Taxis
- Hackneys
- Limousines

In Ireland, all SPSV drivers must:
1. Pass the SPSV Driver Entry Test (75% in both sections)
2. Obtain an SPSV driver license from the National Transport Authority
3. Complete necessary clearances (Garda, Tax)
4. Meet vehicle requirements

## 🎓 SPSV Driver Entry Test Details

### Test Structure
The SPSV test consists of **two mandatory sections**:

1. **Industry Knowledge Test**
   - Regulations and licensing requirements
   - Fare structures and pricing
   - SPSV business operations
   - Customer service standards
   - Safety and compliance

2. **Area Knowledge Test**
   - Routes and navigation in Dublin
   - One-way streets and traffic patterns
   - Landmarks and places of interest
   - Efficient route planning
   - Local geography

### Test Requirements
- **Passing Score**: 75% or higher in **each** section
- **Test Fee**: €90 (paid when booking)
- **Booking**: Call 0818 064 000
- **Locations**: Five test centers across Ireland
- **Format**: Computer-based test

### After Passing the Test
1. Apply for SPSV license (€250 fee to NTA)
2. Complete PSV15 form at local Garda station
3. Submit 3 recent photographs
4. Wait for license approval (typically 2-3 weeks)

## 🎨 Design System

### Color Palette
- **Primary Green**: `#16A34A` (green-600) - Main brand color
- **Dark Green**: `#15803D` (green-700) - Hover states, gradients
- **Light Green**: `#D1FAE5` (green-100) - Backgrounds, accents
- **White**: `#FFFFFF` - Text on dark backgrounds, cards
- **Gray Scale**: Various shades for text, borders, backgrounds

### Typography
- **Headings**: Bold, large sizes (3xl-6xl)
- **Body Text**: Regular weight, readable sizes (base-lg)
- **Font Family**: System fonts (sans-serif stack)

### Components
All components are built with:
- **TypeScript** for type safety
- **React** functional components with hooks
- **Tailwind CSS** for styling
- **Accessibility** best practices
- **Responsive** design patterns

## 📁 Project Structure

```
Stij/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main landing page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Button.tsx           # Button component (primary, secondary, outline)
│   │   ├── Input.tsx            # Form input with label and validation
│   │   ├── Hero.tsx             # Hero section with CTAs
│   │   ├── Form.tsx             # Dynamic form with validation
│   │   ├── TrustBadge.tsx       # Trust indicator component
│   │   ├── FAQ.tsx              # Accordion FAQ component
│   │   ├── TestInfo.tsx         # Test information display
│   │   ├── Steps.tsx            # Step-by-step guide component
│   │   ├── Stats.tsx            # Statistics display
│   │   ├── Requirements.tsx     # Requirements list component
│   │   └── index.ts             # Component exports
│   └── figma/                   # Figma Code Connect mappings (optional)
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Vercel account** (for deployment)

### Installation

1. **Clone the repository** (or navigate to project directory):
   ```bash
   cd /path/to/Stij
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment to Vercel

### Option 1: Connect via Git (Recommended)

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SPSV Training Landing Page"
   ```

2. **Push to GitHub/GitLab**:
   ```bash
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

### Option 2: Deploy via CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts to deploy.

## 📝 Component Documentation

### Hero Component
Hero section with gradient background, headline, and call-to-action buttons.

```tsx
<Hero
  title="Become a Taxi Driver"
  subtitle="Free online SPSV training..."
  primaryCTA="Register Now"
  secondaryCTA="Contact Us"
/>
```

### Form Component
Dynamic form with validation and error handling.

```tsx
<Form
  title="Register for Free Training"
  fields={formFields}
  submitLabel="Register Now"
  onSubmit={handleSubmit}
/>
```

### FAQ Component
Expandable accordion for frequently asked questions.

```tsx
<FAQ
  title="Frequently Asked Questions"
  items={faqItems}
/>
```

### Steps Component
Visual step-by-step guide with numbered indicators.

```tsx
<Steps
  title="Step by Step Guide"
  steps={stepsArray}
/>
```

### TestInfo Component
Information display about the SPSV test.

```tsx
<TestInfo
  title="SPSV Training Course"
  description="Comprehensive training..."
  sections={testSections}
/>
```

### Stats Component
Statistics display with large numbers and labels.

```tsx
<Stats
  stats={statsArray}
  title="Join Thousands of Drivers"
/>
```

### Requirements Component
List of requirements with icons.

```tsx
<Requirements
  title="What do you need?"
  requirements={requirementsArray}
/>
```

## 🎯 Conversion Funnel Strategy

The landing page is designed as a sales funnel with these key stages:

1. **Awareness** - Hero section introduces the opportunity
2. **Interest** - Requirements and test information build interest
3. **Consideration** - Stats, benefits, and step-by-step guide
4. **Action** - Registration form captures leads
5. **Trust** - FAQ, contact info, and trust badges
6. **Retention** - Clear next steps and additional resources

### Key Conversion Elements
- **Clear value proposition** in hero section
- **Social proof** with statistics (8,000+ drivers)
- **Low barrier to entry** (FREE training)
- **Multiple CTAs** throughout the page
- **Comprehensive information** to reduce friction
- **Trust signals** (contact info, credentials)

## 📊 Content Strategy

### Primary Content Sources
1. **Lynk.ie SPSV Training Page** - Design inspiration and structure
2. **National Transport Authority** - Official test information and requirements
3. **Industry Best Practices** - Conversion optimization techniques

### Content Sections
1. **Hero** - Main value proposition
2. **Requirements** - What's needed to become a driver
3. **Test Information** - Detailed test format and content
4. **Registration** - Lead capture form
5. **Process Guide** - Step-by-step journey
6. **Benefits** - What happens after passing
7. **FAQ** - Common questions and answers
8. **Contact** - Multiple contact methods

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components adapt to screen size with:
- Flexible grid layouts
- Responsive typography
- Mobile-first approach
- Touch-friendly interactions

## ♿ Accessibility

The page follows WCAG 2.1 guidelines:
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## 🔒 Form Handling

Currently, the registration form logs data to console. To implement full functionality:

1. **Add API endpoint** (e.g., `/api/register`)
2. **Connect to database** (e.g., PostgreSQL, MongoDB)
3. **Add email service** (e.g., SendGrid, Mailgun)
4. **Implement validation** (server-side)
5. **Add success/error states**
6. **Redirect to thank you page**

Example implementation:
```typescript
const handleFormSubmit = async (data: Record<string, string>) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      // Redirect to thank you page
      window.location.href = '/thank-you';
    }
  } catch (error) {
    // Handle error
  }
};
```

## 🎨 Customization

### Changing Colors
Update Tailwind classes in components or extend `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-green': '#16A34A',
        // Add custom colors
      },
    },
  },
}
```

### Adding Content
All content is in `src/app/page.tsx`. Update:
- `requirements` array
- `steps` array
- `stats` array
- `faqItems` array
- `testInfoSections` array

### Modifying Components
Components are in `src/components/`. Each component:
- Has TypeScript interfaces
- Is fully typed
- Can be customized via props
- Follows React best practices

## 📈 Performance Optimization

- **Next.js Image Optimization** - Use `next/image` for images
- **Code Splitting** - Automatic with Next.js
- **CSS Optimization** - Tailwind purges unused styles
- **Font Optimization** - System fonts for fast loading
- **Lazy Loading** - Implement for below-fold content

## 🔍 SEO Considerations

The page includes:
- Semantic HTML structure
- Proper heading hierarchy
- Meta tags in `layout.tsx`
- Descriptive alt text (when images added)
- Clean URL structure

To enhance SEO:
1. Add Open Graph tags
2. Implement structured data (JSON-LD)
3. Add sitemap.xml
4. Implement robots.txt
5. Add canonical URLs

## 🧪 Testing

Currently no tests included. To add testing:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

Create test files in `__tests__/` directory.

## 🐛 Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Styling Issues
- Check Tailwind config
- Verify CSS imports in `globals.css`
- Clear browser cache

### TypeScript Errors
- Run `npm run build` to see all errors
- Check `tsconfig.json` settings
- Verify component prop types

## 📚 Resources

### Official Documentation
- [SPSV Driver Entry Test](https://www.nationaltransport.ie/taxi/driver-licensing/applying-for-an-spsv-driver-licence/the-spsv-driver-entry-test/)
- [Lynk SPSV Training](https://www.lynk.ie/spsv-training/)

### Technical Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 🚧 Future Enhancements

Potential improvements:
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Implement A/B testing
- [ ] Add blog section for SEO
- [ ] Create thank you page after registration
- [ ] Add email automation
- [ ] Implement user dashboard
- [ ] Add progress tracking
- [ ] Create admin panel
- [ ] Add multi-language support
- [ ] Implement dark mode

## 📄 License

Private project - All rights reserved

## 👥 Support

For questions or issues:
- **Email**: spsvtraining@lynk.ie
- **Address**: Lynk, Unit 21, Parkmore Industrial Estate, Long Mile Road, D12N268

---

**Built with ❤️ for aspiring taxi drivers in Dublin, Ireland**
