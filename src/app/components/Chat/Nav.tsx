"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/authContext';
import { useState } from 'react';

interface NavProps {
  connectionStatus?: 'disconnected' | 'connecting' | 'connected';
  onMobileMenuToggle?: () => void;
}

const Nav: React.FC<NavProps> = ({ connectionStatus, onMobileMenuToggle }) => {
  const { logout, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const navItems = [
    { href: '/Profile', icon: 'profile', text: 'Profile' },
    { href: '/chathome', icon: 'chat', text: 'Chats' }
  ];

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      if (onMobileMenuToggle) onMobileMenuToggle();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-2">
      {/* Logo/Brand */}
      <Link 
        href="/" 
        className="flex items-center space-x-3 px-4 py-6 hover:opacity-90 transition-opacity"
        onClick={onMobileMenuToggle}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </div>
        <span className="text-xl font-bold text-white">SwiftChat</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={onMobileMenuToggle}
          >
            <span className="text-lg">
              {item.icon === 'profile' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </span>
            <span className="font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Connection Status */}
      {connectionStatus && (
        <div className="px-4 py-2 text-sm text-gray-400 flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></span>
          Status: {connectionStatus}
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={logoutLoading || authLoading}
        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </span>
      </button>
    </div>
  );
};

export default Nav;