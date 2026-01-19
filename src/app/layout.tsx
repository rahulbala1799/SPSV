import type { Metadata } from 'next';
import './globals.css';
import { StackAuthProvider } from '@/lib/stack-client';
import { ToastProvider } from '@/contexts/ToastContext';

export const metadata: Metadata = {
  title: 'SPSV Mastery Class Dublin | Expert SPSV Test Tutoring & Training',
  description: 'Dublin&apos;s #1 SPSV test tutoring school. Expert tutors, 95% pass rate, comprehensive training. Master the SPSV taxi driver test with proven methods. Enroll today!',
  keywords: 'SPSV training Dublin, SPSV test tutoring, taxi license course, SPSV mastery class, Dublin taxi training, SPSV tutor, pass SPSV test',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StackAuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </StackAuthProvider>
      </body>
    </html>
  );
}
