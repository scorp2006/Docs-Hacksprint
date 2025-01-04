"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-7xl mx-auto">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to IdeaBoard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Collaborate, manage tasks, and boost productivity with our real-time task management platform.
            </p>
            <Link href="/sign-in">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-10 px-8 py-2 hover:from-indigo-600 hover:to-purple-600">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
