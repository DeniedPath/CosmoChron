"use client";

import '@/styles/index.css'; // Import your index.css file
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimerProvider } from '@/contexts/TimerContext';
import FloatingTimer from '@/components/timer/FloatingTimer';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';

function App({ Component, pageProps = {} }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimerProvider>
          <div className="content-container">
            <Toaster />
            <Sonner />
            <div className="page-container">
              <Component {...pageProps} />
            </div>
            {isClient && (
              <div className="floating-element">
                <FloatingTimer />
              </div>
            )}
          </div>
        </TimerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;