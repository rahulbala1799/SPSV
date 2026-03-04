'use client';

import React, { useState, useEffect } from 'react';
import { EnrollmentModal } from '@/components/EnrollmentModal';

type LeadSource = 'enrollment' | 'timetable' | 'success-stories' | 'test-guide' | 'contact';

export function EnrollmentModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<LeadSource>('enrollment');

  useEffect(() => {
    const handleOpen = (e?: CustomEvent<{ source?: LeadSource }>) => {
      setSource(e?.detail?.source || 'enrollment');
      setIsOpen(true);
    };
    const handleOpenFromHeader = () => {
      setSource('enrollment');
      setIsOpen(true);
    };
    const handleOpenContact = () => {
      setSource('contact');
      setIsOpen(true);
    };
    window.addEventListener('openEnrollment', handleOpen as EventListener);
    window.addEventListener('openEnrollmentFromHeader', handleOpenFromHeader);
    window.addEventListener('openEnrollmentContact', handleOpenContact);
    return () => {
      window.removeEventListener('openEnrollment', handleOpen as EventListener);
      window.removeEventListener('openEnrollmentFromHeader', handleOpenFromHeader);
      window.removeEventListener('openEnrollmentContact', handleOpenContact);
    };
  }, []);

  return (
    <>
      {children}
      <EnrollmentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source={source}
      />
    </>
  );
}
