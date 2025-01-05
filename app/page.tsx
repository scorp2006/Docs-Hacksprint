'use client'

import { useAuth } from '@/firebase/hooks/useAuth';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { TopNav } from '@/components/TopNav';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center px-4 border-b">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Idea Board
            </span>
          </div>
        </header>

        <main className="flex-1">
          <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-center gap-2">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Collaborate, Plan, and Create
              </h1>
              <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
                Your all-in-one project management solution. Organize tasks, share ideas, and work together in real-time.
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" onClick={signInWithGoogle}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Brainstorm Ideas</h3>
                <p className="text-muted-foreground">
                  Collaborate on a shared whiteboard to visualize and develop ideas together.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="8" rx="2" width="6" x="4" y="12" />
                    <rect height="12" rx="2" width="6" x="14" y="8" />
                    <rect height="16" rx="2" width="6" x="9" y="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Manage tasks with an intuitive board and real-time updates.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 19a6 6 0 0 0-12 0" />
                    <circle cx="8" cy="9" r="4" />
                    <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together seamlessly with real-time collaboration features.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      <main className="container mx-auto px-4 py-8">
        <ProjectGrid emptyMessage="Ready to bring your ideas to life? Create your first project and start collaborating with your team!" />
      </main>
    </div>
  );
}
