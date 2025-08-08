// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const links = [
    { href: "/About", text: "About" },
    { href: "/PrivacyPolicy", text: "Privacy Policy" },
    { href: "/Licensing", text: "Licensing" },
    { href: "/Contact", text: "Contact" }
  ];

  return (
    <footer className="bg-gray-900 shadow-lg mx-4 rounded-lg backdrop-blur-sm bg-opacity-80">
      <div className="w-full max-w-screen-xl mx-auto p-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 hover:scale-105 transition-transform">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              SwiftChat
            </span>
          </Link>
          
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-400">
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:underline me-4 md:me-6 hover:text-white transition-colors">
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        
        <span className="block text-sm sm:text-center text-gray-400">
          © {currentYear}{" "}
          <Link href="/" className="hover:underline text-white">
            SwiftChat
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;