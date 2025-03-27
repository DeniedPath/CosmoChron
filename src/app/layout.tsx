import '@/styles/index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CosmoChron - AI Timer',
  description: 'Space-themed productivity timer with AI chat integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cosmic-dark">
        <Providers>
          <TooltipProvider>
            <div className="content-container">
              <Toaster />
              <Sonner />
              <div className="page-container">
                {children}
              </div>
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
