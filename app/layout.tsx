import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FirebaseProvider } from "@/firebase/context/FirebaseContext";
import "./globals.css";
import { Toaster } from '@/components/ui/toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea Board",
  description: "A collaborative project management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FirebaseProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
