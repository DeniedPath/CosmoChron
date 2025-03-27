"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  readonly href?: string;
  readonly label?: string;
}

export function BackButton({ 
  href = "/", 
  label = "Back to Home" 
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="mb-4 text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-blue/20"
    >
      <Link href={href} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
