"use client";

import React from 'react';
import Link from 'next/link';
import SpaceBackground from '@/components/space/SpaceBackground';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="h-screen w-screen overflow-auto">
      <SpaceBackground weatherCondition="weather-clear" enhancedStars={true}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white">404 - Lost in Space</h1>
            <p className="text-xl text-gray-300">
              Houston, we have a problem. The page you&#39;re looking for has drifted into deep space.
            </p>
            <div className="mt-8">
              <Button asChild variant="default">
                <Link href="/">
                  Return to Mission Control
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SpaceBackground>
    </div>
  );
}
