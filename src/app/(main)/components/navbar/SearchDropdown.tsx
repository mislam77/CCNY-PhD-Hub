'use client';

import { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?keywords=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={searchContainerRef}
      className={`absolute left-0 right-0 z-40 bg-primary-dark shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'py-6 opacity-100 max-h-40' : 'max-h-0 opacity-0 py-0'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-white text-xl mb-4">Search HIPE PhD HUB</h2>
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search HIPE PhD HUB"
            className="w-full px-4 py-3 text-gray-dark border-0 focus:ring-2 focus:ring-primary rounded-l"
          />
          <button 
            type="submit" 
            className="px-6 bg-primary text-white rounded-r hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>
        <div className="text-white text-sm mt-2">
          Looking for <a href="/forum" className="underline hover:text-primary-light">Communities</a> or <a href="/events" className="underline hover:text-primary-light">Events</a>?
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;