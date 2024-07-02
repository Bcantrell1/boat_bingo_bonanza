'use client';

import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function NavBar() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Boat Bingo Bonanza
        </Link>
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <Link href="/lobby" className="text-white hover:text-blue-200">
                Lobby
              </Link>
              <button
                onClick={() => auth.signOut()}
                className="text-white hover:text-blue-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-blue-200">
              Sign In
            </Link>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  href="/lobby"
                  className="block text-white hover:bg-blue-700 rounded px-3 py-2"
                  onClick={toggleMenu}
                >
                  Lobby
                </Link>
                <button
                  onClick={() => {
                    auth.signOut();
                    toggleMenu();
                  }}
                  className="block text-white hover:bg-blue-700 rounded px-3 py-2 w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-white hover:bg-blue-700 rounded px-3 py-2"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}