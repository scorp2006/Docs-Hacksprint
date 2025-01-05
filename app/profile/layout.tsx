'use client';

import { TopNav } from '@/components/TopNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      {children}
    </div>
  );
} 