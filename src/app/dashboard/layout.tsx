"use client";

import { SideNav } from "../components/dashboard/side-nav";
import { TopNav } from "../components/dashboard/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex dark:bg-background">
      <SideNav />
      <main className="flex-1 flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}