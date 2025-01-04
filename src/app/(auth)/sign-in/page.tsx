"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4">
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
              afterSignInUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
