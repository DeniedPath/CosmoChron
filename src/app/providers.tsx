"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimerProvider } from '@/contexts/TimerContext';
import { ChatProvider } from '@/contexts/ChatContext';
import FloatingTimer from '@/components/timer/FloatingTimer';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TimerProvider>
          <ChatProvider>
            {children}
            {isClient && (
              <div className="floating-element">
                <FloatingTimer />
              </div>
            )}
          </ChatProvider>
        </TimerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
