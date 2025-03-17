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
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 text-cosmic-white"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
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
                <li>When a session completes, you&apos;ll earn cosmic points and progress toward your next rank.</li>
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
              <ul className="list-disc pl-5 space-y-2">
                <li>The app integrates with real-world weather data to change the background effects.</li>
                <li>Allow location access when prompted for the best experience.</li>
                <li>You can toggle between Celsius and Fahrenheit in the weather tab.</li>
                <li>Weather updates automatically every 30 minutes.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ranks" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Ranks & Progress</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>Earn cosmic points by completing focus sessions.</li>
                <li>Progress through space ranks from Cadet to Cosmic Admiral.</li>
                <li>Each rank unlocks new features and space station modules.</li>
                <li>View your progress in the Rank tab.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="missions" className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-cosmic-white hover:text-cosmic-white hover:no-underline">
              <div className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-cosmic-highlight" />
                <span>Missions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-cosmic-white/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>Complete daily and weekly missions to earn bonus cosmic points.</li>
                <li>Missions range from simple tasks to challenging focus marathons.</li>
                <li>Track your mission progress in the Missions tab.</li>
                <li>New missions are available daily and weekly.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 text-center">
          <Button 
            variant="default" 
            className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
            asChild
          >
            <Link href="/">
              Return to Timer
            </Link>
          </Button>
        </div>
      </div>
    </SpaceBackground>
  );
};

export default HelpPage;