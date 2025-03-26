'use client';

import Link from 'next/link';
import { SignUpButton, SignedOut } from '@clerk/nextjs';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`absolute md:hidden left-0 right-0 z-40 transition-all duration-300 ease-in-out bg-primary-dark overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          href="/about" 
          className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary"
          onClick={onClose}
        >
          ABOUT
        </Link>
        <Link 
          href="/forum" 
          className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary"
          onClick={onClose}
        >
          FORUM
        </Link>
        <Link 
          href="/research" 
          className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary"
          onClick={onClose}
        >
          RESEARCH
        </Link>
        <Link 
          href="/events" 
          className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary"
          onClick={onClose}
        >
          EVENTS
        </Link>
        <Link 
          href="/resources" 
          className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary"
          onClick={onClose}
        >
          RESOURCES
        </Link>
        
        <div className="pt-4 pb-3 border-t border-primary-light sm:hidden">
          <SignedOut>
            <SignUpButton>
              <button className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;