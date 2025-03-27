import React from 'react';
// Using a different icon to avoid the deprecated Github icon
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 text-center border border-cosmic-gold rounded-lg p-4 shadow-md">
      <p className="text-cosmic-white text-sm font-medium">CosmoChron • Making productivity out of this world</p>
      <div className="flex items-center justify-center mt-4 space-x-4">
        <a 
          href="https://github.com/DeniedPath"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cosmic-gold hover:text-cosmic-white transition-colors border border-cosmic-gold rounded-full p-2"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
