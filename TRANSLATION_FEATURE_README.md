# Website Translation Feature - Implementation Guide

## Overview

This document outlines the plan for implementing a multi-language translation feature for the SPSV Mastery Class Dublin website. The feature will allow users to translate the entire website content into Hindi, Urdu, Malayalam, and Arabic languages.

## Target Languages

1. **Hindi** (हिंदी) - Devanagari script
2. **Urdu** (اردو) - Arabic script (right-to-left)
3. **Malayalam** (മലയാളം) - Malayalam script
4. **Arabic** (العربية) - Arabic script (right-to-left)

**Default Language:** English (en)

## Feature Requirements

### Core Functionality
- ✅ Translation button/language selector at the top of the page (header)
- ✅ Translate entire website content (all pages)
- ✅ Support for 4 languages: Hindi, Urdu, Malayalam, Arabic
- ✅ Persist language selection (localStorage)
- ✅ Smooth language switching without page reload
- ✅ RTL (Right-to-Left) support for Urdu and Arabic
- ✅ Maintain website functionality in all languages

### UI/UX Requirements
- Language selector dropdown/button in header
- Visual indicator of current language
- Flag icons or language names for easy identification
- Smooth transitions when switching languages
- Responsive design (mobile and desktop)

## Technical Approach

### Option 1: Next.js Internationalization (i18n) with next-intl
**Recommended Approach**

**Pros:**
- Built-in Next.js support
- Server-side and client-side rendering support
- Type-safe translations
- SEO-friendly (separate URLs per language)
- Automatic locale detection
- Built-in RTL support

**Cons:**
- Requires more setup
- More complex routing structure

**Implementation:**
```typescript
// next.config.js
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  // ... existing config
});

// i18n.ts
export const locales = ['en', 'hi', 'ur', 'ml', 'ar'] as const;
export const defaultLocale = 'en' as const;
```

### Option 2: Client-Side Translation with React Context
**Simpler Approach**

**Pros:**
- Easier to implement
- No routing changes
- Works with existing structure
- Faster initial setup

**Cons:**
- Client-side only (no SSR)
- SEO limitations
- Manual translation management

**Implementation:**
```typescript
// TranslationContext.tsx
const TranslationContext = createContext({
  locale: 'en',
  setLocale: (locale: string) => {},
  t: (key: string) => key
});
```

### Option 3: Hybrid Approach (Recommended for this project)
**Best of Both Worlds**

- Use React Context for client-side state management
- Use translation JSON files for content
- Implement RTL support with CSS
- Use localStorage for persistence

## Implementation Strategy

### Phase 1: Setup and Infrastructure

1. **Create Translation Files Structure**
   ```
   src/
   ├── translations/
   │   ├── en.json
   │   ├── hi.json
   │   ├── ur.json
   │   ├── ml.json
   │   └── ar.json
   ```

2. **Translation Context Setup**
   - Create `TranslationContext.tsx`
   - Create `useTranslation` hook
   - Implement language switching logic
   - Add localStorage persistence

3. **RTL Support**
   - Add `dir="rtl"` attribute for Urdu/Arabic
   - Create RTL-specific CSS classes
   - Test layout adjustments

### Phase 2: UI Components

1. **Language Selector Component**
   ```typescript
   // components/LanguageSelector.tsx
   interface Language {
     code: string;
     name: string;
     nativeName: string;
     flag: string;
     rtl?: boolean;
   }
   ```

2. **Header Integration**
   - Add language selector to Header component
   - Position: Top right (desktop), mobile menu (mobile)
   - Visual indicator of current language

3. **Translation Wrapper**
   - Create `TranslatedText` component
   - Create `TranslatedLink` component
   - Create `TranslatedButton` component

### Phase 3: Content Translation

1. **Extract All Text Content**
   - Homepage content
   - Navigation items
   - Buttons and CTAs
   - Form labels and placeholders
   - Modal content
   - Error messages
   - Footer content

2. **Create Translation Keys**
   ```json
   {
     "common": {
       "enrollNow": "Enroll Now",
       "viewCourses": "View Courses",
       "contactUs": "Contact Us"
     },
     "homepage": {
       "hero": {
         "title": "Pass Your SPSV Test in Dublin with Confidence",
         "subtitle": "Join SPSV Mastery Class Dublin..."
       }
     }
   }
   ```

3. **Translate Content**
   - Professional translation for all 4 languages
   - Maintain context and meaning
   - Consider cultural nuances
   - Test with native speakers

### Phase 4: Special Considerations

1. **SPSV Official Manual Page**
   - Decide: Translate full manual or keep English only?
   - If translating: Large content volume (221 pages)
   - Consider: PDF download in multiple languages

2. **Form Fields**
   - Translate labels, placeholders, error messages
   - Maintain form validation in all languages
   - Consider input direction for RTL languages

3. **Images and Media**
   - Text in images: Create translated versions or use alt text
   - Icons: Universal (no translation needed)
   - PDFs: Consider multilingual versions

4. **Dynamic Content**
   - Dates and numbers: Format according to locale
   - Currency: Display in appropriate format
   - Phone numbers: Maintain international format

## Technical Components

### 1. Translation Context Provider

```typescript
// src/contexts/TranslationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem('website-locale');
    if (saved && ['en', 'hi', 'ur', 'ml', 'ar'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    // Load translation file
    import(`@/translations/${locale}.json`)
      .then((module) => setTranslations(module.default))
      .catch(() => setTranslations({}));
  }, [locale]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('website-locale', newLocale);
    // Update HTML dir attribute for RTL
    document.documentElement.dir = ['ur', 'ar'].includes(newLocale) ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    if (typeof value !== 'string') return key;

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(`{{${param}}}`, val),
        value
      );
    }

    return value;
  };

  const isRTL = ['ur', 'ar'].includes(locale);

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};
```

### 2. Language Selector Component

```typescript
// src/components/LanguageSelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Select language"
      >
        <FaGlobe className="text-gray-600" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {currentLanguage.nativeName}
        </span>
        <FaChevronDown className={`text-xs text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
              {locale === lang.code && (
                <span className="text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3. Translation JSON Structure

```json
// src/translations/en.json
{
  "common": {
    "enrollNow": "Enroll Now",
    "viewCourses": "View Courses",
    "contactUs": "Contact Us",
    "callUs": "Call Us",
    "whatsapp": "WhatsApp",
    "close": "Close",
    "submit": "Submit",
    "loading": "Loading..."
  },
  "header": {
    "home": "Home",
    "timetable": "Timetable",
    "testGuide": "Test Guide",
    "officialManual": "Official Manual",
    "whyChooseUs": "Why Choose Us",
    "successStories": "Success Stories",
    "contact": "Contact"
  },
  "homepage": {
    "hero": {
      "title": "Pass Your SPSV Test in Dublin with Confidence",
      "subtitle": "Join SPSV Mastery Class Dublin for expert tutoring, comprehensive materials, and a proven path to success.",
      "primaryCTA": "Enroll Now",
      "secondaryCTA": "View Courses"
    },
    "features": {
      "title": "Why Choose Us",
      "subtitle": "We help you achieve your pass through structured lessons, easy-to-grasp study materials and much more"
    }
  }
}
```

```json
// src/translations/hi.json
{
  "common": {
    "enrollNow": "अभी नामांकन करें",
    "viewCourses": "पाठ्यक्रम देखें",
    "contactUs": "संपर्क करें",
    "callUs": "हमें कॉल करें",
    "whatsapp": "व्हाट्सएप",
    "close": "बंद करें",
    "submit": "जमा करें",
    "loading": "लोड हो रहा है..."
  },
  "header": {
    "home": "होम",
    "timetable": "समय सारणी",
    "testGuide": "टेस्ट गाइड",
    "officialManual": "आधिकारिक मैनुअल",
    "whyChooseUs": "हमें क्यों चुनें",
    "successStories": "सफलता की कहानियां",
    "contact": "संपर्क"
  },
  "homepage": {
    "hero": {
      "title": "आत्मविश्वास के साथ डबलिन में अपना SPSV टेस्ट पास करें",
      "subtitle": "विशेषज्ञ ट्यूशन, व्यापक सामग्री और सफलता के सिद्ध मार्ग के लिए SPSV मास्टरी क्लास डबलिन में शामिल हों।",
      "primaryCTA": "अभी नामांकन करें",
      "secondaryCTA": "पाठ्यक्रम देखें"
    }
  }
}
```

### 4. RTL Support CSS

```css
/* src/app/globals.css */
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .text-left {
  text-align: right;
}

[dir="rtl"] .text-right {
  text-align: left;
}

[dir="rtl"] .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

[dir="rtl"] .mr-auto {
  margin-right: 0;
  margin-left: auto;
}

[dir="rtl"] .flex-row-reverse {
  flex-direction: row-reverse;
}
```

## Implementation Steps

### Step 1: Setup Translation Infrastructure
1. Create `src/contexts/TranslationContext.tsx`
2. Create `src/hooks/useTranslation.ts` (optional wrapper)
3. Create `src/translations/` directory
4. Create translation JSON files for all languages
5. Wrap app with `TranslationProvider` in `layout.tsx`

### Step 2: Create Language Selector
1. Create `src/components/LanguageSelector.tsx`
2. Add to Header component
3. Style for desktop and mobile
4. Test dropdown functionality

### Step 3: Translate Components
1. Update Header component with translation keys
2. Update Homepage components
3. Update Modal components
4. Update Form components
5. Update Footer component

### Step 4: Implement RTL Support
1. Add RTL detection in TranslationContext
2. Update HTML `dir` attribute dynamically
3. Add RTL-specific CSS classes
4. Test layout in Urdu and Arabic

### Step 5: Content Translation
1. Extract all text content
2. Create comprehensive translation keys
3. Get professional translations
4. Review and test translations

### Step 6: Testing
1. Test language switching
2. Test RTL layouts
3. Test localStorage persistence
4. Test on mobile devices
5. Test all pages in all languages

## Translation Management

### Professional Translation Services
- Use professional translators for accuracy
- Consider cultural context and nuances
- Review translations with native speakers
- Maintain consistency across pages

### Translation Keys Organization
```
translations/
├── common.json (shared across all pages)
├── homepage.json
├── timetable.json
├── test-guide.json
├── spsv-manual.json
├── forms.json
└── errors.json
```

### Translation Workflow
1. Extract all English text
2. Create translation keys
3. Send to professional translators
4. Review and edit translations
5. Implement in code
6. Test and refine

## Special Considerations

### 1. SPSV Official Manual
**Option A:** Keep manual in English only
- Add note: "Available in English only"
- Simpler implementation

**Option B:** Translate manual content
- Large volume (221 pages)
- Significant translation cost
- Consider: Translate summaries only

**Recommendation:** Start with English only, add translations later if needed

### 2. Phone Numbers and Contact Info
- Keep in international format: `+353 89 403 4222`
- No translation needed
- Consistent across all languages

### 3. Dates and Numbers
- Use locale-aware formatting
- Consider: `Intl.DateTimeFormat` and `Intl.NumberFormat`
- Maintain consistency

### 4. Images with Text
- Option 1: Create translated versions
- Option 2: Use alt text for translation
- Option 3: Replace text with CSS overlays

### 5. PDF Downloads
- Keep PDFs in English initially
- Consider multilingual PDFs later
- Add note about language availability

## Performance Considerations

1. **Lazy Loading Translations**
   - Load translation files on demand
   - Use dynamic imports
   - Cache translations in memory

2. **Bundle Size**
   - Translation files add to bundle size
   - Consider code splitting
   - Use tree-shaking

3. **Caching**
   - Cache translations in localStorage
   - Reduce API calls if using external translation service

## SEO Considerations

1. **Language Tags**
   - Add `lang` attribute to HTML
   - Use `hreflang` tags for different language versions
   - Consider separate URLs per language (future enhancement)

2. **Meta Tags**
   - Translate meta descriptions
   - Translate Open Graph tags
   - Maintain SEO value in all languages

## Testing Checklist

- [ ] Language selector appears in header
- [ ] All 4 languages available
- [ ] Language switching works smoothly
- [ ] Translations load correctly
- [ ] RTL layout works for Urdu/Arabic
- [ ] localStorage persistence works
- [ ] All pages translate correctly
- [ ] Forms work in all languages
- [ ] Modals translate correctly
- [ ] Navigation items translate
- [ ] Buttons and CTAs translate
- [ ] Error messages translate
- [ ] Mobile responsive
- [ ] No layout breaks in RTL
- [ ] Performance is acceptable

## Future Enhancements

1. **Auto-detect Language**
   - Detect browser language
   - Suggest language on first visit

2. **Separate URLs per Language**
   - `/en/`, `/hi/`, `/ur/`, `/ml/`, `/ar/`
   - Better SEO
   - Shareable language-specific URLs

3. **Translation Management System**
   - Admin panel for translations
   - Easy updates without code changes

4. **More Languages**
   - Add more languages as needed
   - Easy to extend with current structure

## Estimated Timeline

- **Phase 1 (Setup):** 2-3 days
- **Phase 2 (UI Components):** 2-3 days
- **Phase 3 (Content Translation):** 5-7 days (depends on translation service)
- **Phase 4 (Testing & Refinement):** 2-3 days

**Total:** 11-16 days (excluding professional translation time)

## Dependencies

```json
{
  "dependencies": {
    "next-intl": "^3.0.0" // Optional, if using next-intl approach
  }
}
```

## Questions to Consider

1. **SPSV Manual Translation:** Translate full manual or keep English only?
2. **Translation Service:** Use professional service or in-house?
3. **Content Updates:** How to handle new content translations?
4. **PDF Downloads:** Translate PDFs or keep English?
5. **SEO Strategy:** Separate URLs or single URL with language toggle?

## Conclusion

This translation feature will make the SPSV Mastery Class Dublin website accessible to a wider audience, particularly the South Asian and Middle Eastern communities in Dublin. The implementation should be done in phases, starting with the infrastructure and UI, followed by content translation and testing.

The recommended approach is the **Hybrid Approach** using React Context for state management and JSON files for translations, as it provides the best balance of simplicity and functionality for this project.

---

**Last Updated:** January 2024  
**Status:** Planning Phase  
**Priority:** High
