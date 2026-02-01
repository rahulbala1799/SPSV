import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';

export const metadata: Metadata = {
  title: 'Taxi Driver Test Dublin | SPSV Taxi Exam Classes & Training | Pass First Time',
  description: 'Dublin\'s leading Taxi Driver Test preparation classes. Expert tutors help you pass the SPSV Taxi Exam with in-person classes + practice app. Industry Knowledge & Area Knowledge covered. Book your taxi test training today!',
  keywords: [
    'taxi driver test dublin',
    'taxi exam ireland',
    'spsv test',
    'taxi driver exam',
    'taxi test preparation',
    'taxi license test dublin',
    'spsv taxi exam',
    'taxi driver training dublin',
    'how to pass taxi test',
    'taxi test classes dublin',
    'spsv training dublin',
    'taxi driver course',
    'taxi exam preparation',
    'dublin taxi test',
    'taxi driver license ireland',
    'spsv exam classes',
    'taxi test tutor dublin',
    'pass taxi driver test',
    'taxi industry knowledge test',
    'taxi area knowledge test',
    'nta taxi test',
    'taxi driver certification dublin',
  ].join(', '),
  authors: [{ name: 'SPSV Mastery Class Dublin' }],
  creator: 'SPSV Mastery Class Dublin',
  publisher: 'SPSV Mastery Class Dublin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://spsvmastery.ie',
    siteName: 'SPSV Mastery Class Dublin - Taxi Driver Test Training',
    title: 'Taxi Driver Test Dublin | Pass Your SPSV Taxi Exam First Time',
    description: 'Expert taxi driver test preparation in Dublin. In-person classes + practice app. Pass your SPSV taxi exam with confidence. Industry & Area Knowledge training.',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Taxi Driver Test Training Dublin - SPSV Mastery Class',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taxi Driver Test Dublin | SPSV Taxi Exam Classes',
    description: 'Pass your taxi driver test first time with expert training in Dublin. In-person classes + practice app included.',
    images: ['/hero.png'],
  },
  alternates: {
    canonical: 'https://spsvmastery.ie',
  },
  category: 'Education',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'SPSV Mastery Class Dublin',
  description: 'Dublin\'s leading taxi driver test preparation school. Expert tutors, comprehensive SPSV taxi exam training with classes and practice app.',
  url: 'https://spsvmastery.ie',
  logo: 'https://spsvmastery.ie/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Blanchardstown',
    addressRegion: 'Dublin 15',
    addressCountry: 'IE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+353-89-403-4222',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://wa.me/353894034222',
  ],
  offers: {
    '@type': 'Offer',
    name: 'Taxi Driver Test Preparation Course',
    description: 'Comprehensive SPSV taxi exam preparation with classroom instruction and practice app',
    category: 'Taxi Driver Training',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
