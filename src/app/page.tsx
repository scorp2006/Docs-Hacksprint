"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4">
        {/* Left side - Branding */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TaskFlow
          </h1>
          <p className="text-lg text-gray-600 max-w-md mb-6">
            Collaborate, manage tasks, and boost productivity with our real-time task management platform.
          </p>
          <div className="hidden md:block">
            <Image
              src="/login-illustration.svg"
              alt="Task Management Illustration"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-2xl font-bold text-gray-900",
                  headerSubtitle: "text-gray-600",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
