"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, Timer, Cloud, User, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpaceBackground from '@/components/space/SpaceBackground';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage: React.FC = () => {
  return (
    <SpaceBackground weatherCondition="weather-clear">
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-cosmic-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-cosmic-white flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-cosmic-highlight" />
            Help & FAQ
          </h1>
        </div>

        <Card className="bg-cosmic-blue/20 border border-cosmic-highlight/20 mb-6">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-cosmic-white/80">
            <p>
              Welcome to Space Timer - the cosmic focus tool that helps you stay productive while exploring
              the vastness of space! This guide will help you navigate through the various features of the app.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="timer" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <Timer className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Using the Timer</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>Start a focus session by clicking the play button.</li>
                <li>You can pause or reset your session at any time.</li>
                <li>Choose from preset durations (5m, 15m, 25m, 50m) or set a custom time.</li>
                <li>When a session completes, you'll earn cosmic points and progress toward your next rank.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="weather" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <Cloud className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Weather Integration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <p className="mb-2">
                Space Timer adapts to your local weather, creating a unique cosmic experience:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clear weather brings bright stars and cosmic clarity</li>
                <li>Clouds add dreamy nebula effects</li>
                <li>Rain transforms into meteor showers</li>
                <li>Thunderstorms create cosmic energy bursts</li>
                <li>Snow becomes gentle floating stardust</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ranks" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Ranks & Progression</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <p className="mb-2">
                As you focus, you'll climb through cosmic ranks:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Cosmic Novice (0 minutes)</li>
                <li>Stellar Explorer (60 minutes)</li>
                <li>Orbit Keeper (300 minutes)</li>
                <li>Nebula Navigator (600 minutes)</li>
                <li>Galaxy Guardian (1,200 minutes)</li>
                <li>Supernova Sentinel (2,400 minutes)</li>
                <li>Celestial Sovereign (4,800 minutes)</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="station" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Space Station</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <p className="mb-2">
                Your Space Station expands as you focus more:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Core Module (unlocked at start)</li>
                <li>Research Lab (unlocked at 120 minutes)</li>
                <li>Observatory (unlocked at 300 minutes)</li>
                <li>Defense Shield (unlocked at 600 minutes)</li>
              </ul>
              <p className="mt-2">
                Visit your Space Station to see your progress and view available modules.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80">
              <Timer className="mr-2 h-4 w-4" />
              Return to Timer
            </Button>
          </Link>
        </div>
      </div>
    </SpaceBackground>
  );
};

export default HelpPage;