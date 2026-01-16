# Quick Start Guide

Get your SPSV Taxi License landing page up and running in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your landing page.

### 3. Set Up Figma Code Connect (Optional but Recommended)

```bash
# Get your token from: https://www.figma.com/settings
npx figma connect --token=YOUR_FIGMA_TOKEN
```

Follow the interactive prompts, then publish:

```bash
npm run figma:publish
```

See `FIGMA_SETUP.md` for detailed instructions.

### 4. Deploy to Vercel

**Option A: Via Git (Recommended)**
1. Push to GitHub/GitLab
2. Import in Vercel dashboard
3. Auto-deploy! 🎉

**Option B: Via CLI**
```bash
npm i -g vercel
vercel
```

## 📁 What's Included

- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ 5 reusable components (Button, Input, Hero, Form, TrustBadge)
- ✅ Landing page with conversion funnel
- ✅ Figma Code Connect configuration
- ✅ Vercel deployment ready
- ✅ Responsive design

## 🎨 Customize Your Landing Page

Edit `src/app/page.tsx` to customize:
- Hero section content
- Form fields
- Trust badges
- Call-to-action buttons

## 📚 Documentation

- `README.md` - Full project documentation
- `FIGMA_SETUP.md` - Detailed Figma Code Connect guide

## 🆘 Need Help?

Check the main `README.md` for:
- Component documentation
- Troubleshooting
- Best practices

Happy coding! 🚕
