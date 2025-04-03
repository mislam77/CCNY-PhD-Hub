import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Decorative Side */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-purple-400 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome Back
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Sign in to continue your journey and stay connected with the HIPE PhD community.
          </p>
          
          <div className="text-white/80 mt-auto">
            <p>Don't have an account yet?</p>
            <Link href="/signup" className="text-white font-medium underline hover:text-white/90 transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Sign In Form */}
      <div className="w-full md:w-1/2 bg-neutral-950 flex items-center justify-center p-4 py-12 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400">Welcome back to the HIPE PhD Hub</p>
          </div>
          
          {/* Clerk SignIn Component */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <SignIn />
          </div>
          
          <div className="text-center mt-6 md:hidden">
            <p className="text-gray-400">
              Need an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating decoration elements */}
      <div className="hidden md:block absolute top-10 right-[calc(50%-5rem)] w-10 h-10 bg-white/10 rounded-full"></div>
      <div className="hidden md:block absolute bottom-10 right-[calc(50%-8rem)] w-16 h-16 bg-primary/30 rounded-full"></div>
    </div>
  );
}