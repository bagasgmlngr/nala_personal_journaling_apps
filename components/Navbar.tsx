// components/Navbar.tsx
import React, { useState } from 'react';
import { Calendar, BookOpen, Plus, LogOut, Menu, X, User2Icon } from 'lucide-react';
import type { User } from '@/lib/supabaseClient';

interface NavbarProps {
  user: User;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  handleSignOut: () => void;
}

export default function Navbar({ user, currentPage, setCurrentPage, handleSignOut }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const getFirstName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">NALA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <button
              onClick={() => setCurrentPage('timeline')}
              className={`${
                currentPage === 'timeline' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Timeline
            </button>
            <button
              onClick={() => setCurrentPage('write')}
              className={`${
                currentPage === 'write' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Write
            </button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2">
              <User2Icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">Hello, {getFirstName(user.email)}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation Items */}
            <button
              onClick={() => handleNavigation('timeline')}
              className={`${
                currentPage === 'timeline'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Timeline
            </button>
            <button
              onClick={() => handleNavigation('write')}
              className={`${
                currentPage === 'write'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <Plus className="h-5 w-5 mr-3" />
              Write Story
            </button>
          </div>
          
          {/* Mobile User Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User2Icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {getFirstName(user.email)}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md flex items-center"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}