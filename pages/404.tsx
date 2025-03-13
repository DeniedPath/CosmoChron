import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404 - Lost in Space</h1>
        <p className="text-xl">Houston, we&apos;ve got a problem. This page doesn&apos;t exist!</p>
        <Link 
          href="/" 
          className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Return to Mission Control
        </Link>
      </div>
    </div>
  );
}
