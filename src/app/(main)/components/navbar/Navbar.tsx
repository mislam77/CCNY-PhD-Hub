'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import UserButton from '../userbutton';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import SearchDropdown from './SearchDropdown';
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <header className="relative">
      <nav className="bg-primary shadow-md relative z-50">
        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            {/* Logo and mobile menu */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6 text-white" aria-hidden="true" />
                )}
              </button>
              
              <div className="flex-shrink-0 font-bold text-xl md:text-2xl text-white ml-2 md:ml-0">
                <Link href="/">CCNY PHD HUB</Link>
              </div>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex md:space-x-1 items-center">
              <Link href="/about" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                ABOUT
              </Link>
              <Link href="/forum" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                FORUM
              </Link>
              <Link href="/research" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                RESEARCH
              </Link>
              <Link href="/events" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                EVENTS
              </Link>
              <Link href="/resources" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                RESOURCES
              </Link>
            </div>

            {/* Search and Auth */}
            <div className="flex items-center">
              {/* Search button */}
              <button 
                onClick={toggleSearch}
                className="text-white p-2 rounded-full hover:bg-primary-dark focus:outline-none overflow-hidden relative w-10 h-10 flex items-center justify-center"
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${searchOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
                  <Search size={20} />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${searchOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
                  <X size={20} />
                </div>
              </button>

              {/* Auth buttons */}
              <div className="ml-4">
                <SignedOut>
                  <div className="hidden sm:flex items-center">
                    <SignUpButton>
                      <button className="text-white px-3 py-1.5 rounded hover:bg-primary-dark transition-colors mr-2 text-sm">
                        Sign Up
                      </button>
                    </SignUpButton>
                    <SignInButton>
                      <button className="bg-white text-primary px-3 py-1.5 rounded hover:bg-gray-light transition-colors text-sm">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                  <div className="sm:hidden">
                    <SignInButton>
                      <button className="bg-white text-primary px-3 py-1.5 rounded hover:bg-gray-light transition-colors text-sm">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search dropdown */}
      <SearchDropdown isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Navbar;