import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SubscriberPortal } from '@/components/subscriber-portal';

export const metadata: Metadata = {
  title: 'Verify your email',
  description: 'Verify your RoPulse account email and sign in to continue.',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<section className="container content-section"><p>Loading your account…</p></section>}>
      <SubscriberPortal page="signup" />
    </Suspense>
  );
}
