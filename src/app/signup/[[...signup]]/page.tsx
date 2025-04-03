import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Decorative Side */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-purple-400 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Community
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Connect with fellow PhD students, share resources, and make the most of your doctoral journey at CUNY.
          </p>
          
          {/* Features list */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="text-white/90">Connect with peers across departments</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <p className="text-white/90">Access exclusive resources and guides</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p className="text-white/90">Stay updated on events and opportunities</p>
            </div>
          </div>
          
          <div className="text-white/80 mt-auto">
            <p>Already have an account?</p>
            <Link href="/signin" className="text-white font-medium underline hover:text-white/90 transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Sign Up Form */}
      <div className="w-full md:w-1/2 bg-neutral-950 flex items-center justify-center p-4 py-12 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join the HIPE PhD community</p>
          </div>
          
          {/* Clerk SignUp Component */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <SignUp />
          </div>
          
          <div className="text-center mt-6 md:hidden">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating decoration elements */}
      <div className="hidden md:block absolute bottom-10 left-[calc(50%-5rem)] w-10 h-10 bg-white/10 rounded-full"></div>
      <div className="hidden md:block absolute top-10 left-[calc(50%-8rem)] w-16 h-16 bg-primary/30 rounded-full"></div>
    </div>
  );
}