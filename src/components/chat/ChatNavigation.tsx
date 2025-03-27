"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Home, Settings } from 'lucide-react';

const ChatNavigation: React.FC = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-2 z-10">
      <div className="container mx-auto flex justify-around items-center">
        <Link href="/" passHref>
          <div className={`flex flex-col items-center p-2 rounded-lg ${isActive('/') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        
        <Link href="/chat" passHref>
          <div className={`flex flex-col items-center p-2 rounded-lg ${isActive('/chat') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </div>
        </Link>
        
        <Link href="/settings" passHref>
          <div className={`flex flex-col items-center p-2 rounded-lg ${isActive('/settings') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChatNavigation;
