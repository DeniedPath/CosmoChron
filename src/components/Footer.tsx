
import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 text-center text-cosmic-white/40 text-sm">
      <p>Space Timer • Making productivity out of this world</p>
      <div className="flex items-center justify-center mt-4 space-x-4">
        <a 
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cosmic-white transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
