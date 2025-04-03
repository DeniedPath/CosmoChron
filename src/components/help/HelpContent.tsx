"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, MessageSquare, Star, Settings, Rocket, HelpCircle } from 'lucide-react';

const HelpContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cosmic-white">Help Center</h1>
      <p className="text-cosmic-white/70">
        Find answers to common questions about CosmoChron and learn how to use all its features.
      </p>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <Clock className="h-5 w-5" />
            Timer Features
          </CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Learn how to use the timer effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-cosmic-white">How do I start a timer?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>To start a timer:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Navigate to the Timer tab on the main screen</li>
                  <li>Set your desired focus time using the slider or preset buttons</li>
                  <li>Click the &quot;Start Focus Session&quot; button</li>
                  <li>The timer will begin counting down immediately</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-cosmic-white">Can I pause or reset a timer?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Yes, you can control your timer in several ways:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Click the &quot;Pause&quot; button to temporarily stop the timer</li>
                  <li>Click &quot;Resume&quot; to continue from where you left off</li>
                  <li>Click &quot;Reset&quot; to stop the current session and reset the timer</li>
                  <li>The floating timer can be minimized by clicking the minimize button</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-cosmic-white">What is the Pomodoro technique?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as &quot;pomodoros&quot;.</p>
                <p className="mt-2">Our app supports this technique by allowing you to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Set focus sessions (default 25 minutes)</li>
                  <li>Take short breaks (default 5 minutes)</li>
                  <li>Take longer breaks after completing several focus sessions</li>
                  <li>Track your progress and productivity over time</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <MessageSquare className="h-5 w-5" />
            AI Chat Assistant
          </CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Get help with using the AI chat feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-cosmic-white">How do I use the AI chat?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>To use the AI chat assistant:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Navigate to the Chat tab from the main menu</li>
                  <li>Type your message in the input field at the bottom</li>
                  <li>Press Enter or click the send button</li>
                  <li>The AI will respond to your message</li>
                </ol>
                <p className="mt-2">You can ask the AI for productivity tips, help with tasks, or just have a friendly conversation during your breaks.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-cosmic-white">Is my chat data private?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Yes, your chat data is stored locally on your device and is not shared with third parties. We use the following privacy measures:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Chat history is stored in your browser&apos;s local storage</li>
                  <li>Your conversations are not used to train AI models</li>
                  <li>You can clear your chat history at any time from the settings</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-cosmic-white">How can I personalize the AI assistant?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>You can personalize your AI assistant experience in several ways:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to Settings → Profile</li>
                  <li>Enter your name and some information about yourself</li>
                  <li>Select your preferred AI personality style</li>
                  <li>Update your current mood to get more relevant responses</li>
                </ol>
                <p className="mt-2">These settings help the AI provide more personalized and relevant responses.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <Star className="h-5 w-5" />
            Rank System &amp; Rewards
          </CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Understanding the progression system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-cosmic-white">How does the rank system work?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>The rank system tracks your progress based on your total focus time:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You gain experience for each minute of completed focus time</li>
                  <li>As you accumulate focus time, you&apos;ll progress through different ranks</li>
                  <li>Each rank has a unique space-themed title and icon</li>
                  <li>Higher ranks unlock additional features and customization options</li>
                </ul>
                <p className="mt-2">Your current rank and progress are displayed on the main dashboard.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-cosmic-white">What are Cosmic Points?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Cosmic Points are the reward currency in CosmoChron:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Earn points by completing focus sessions</li>
                  <li>Bonus points are awarded for completing consecutive sessions</li>
                  <li>Points can be used to unlock special themes and features</li>
                  <li>Your total points are displayed in the top right corner</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-cosmic-white">How do I complete missions?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Missions are special challenges that reward you with bonus Cosmic Points:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>View available missions on the Missions tab</li>
                  <li>Each mission has specific requirements (e.g., &quot;Complete 5 focus sessions in a day&quot;)</li>
                  <li>Progress is tracked automatically as you use the app</li>
                  <li>Claim your rewards when a mission is completed</li>
                </ol>
                <p className="mt-2">New missions become available periodically, so check back often!</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <Settings className="h-5 w-5" />
            App Settings
          </CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Customizing your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-cosmic-white">How do I change the app theme?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>To change the app theme:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to Settings → Appearance</li>
                  <li>Choose between Light and Dark themes</li>
                  <li>Adjust star brightness and effects if desired</li>
                  <li>Click &quot;Save Appearance&quot; to apply your changes</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-cosmic-white">Can I customize notification sounds?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Yes, you can customize notification settings:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to Settings → Notifications</li>
                  <li>Toggle timer notifications on/off</li>
                  <li>Enable or disable sound effects</li>
                  <li>Adjust the notification volume</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-cosmic-white">How do I reset my progress?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>If you need to reset your progress:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to Settings → Data Management</li>
                  <li>Click &quot;Reset Progress&quot;</li>
                  <li>Confirm your choice in the dialog</li>
                </ol>
                <p className="mt-2 text-red-400">Warning: This action cannot be undone and will reset all your stats, ranks, and earned points.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <Rocket className="h-5 w-5" />
            Mini-Games
          </CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Taking breaks with fun activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-cosmic-white">What games are available?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>CosmoChron includes several space-themed mini-games for your break time:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Asteroid Dodge</strong> - Navigate through space avoiding asteroids</li>
                  <li><strong>Space Puzzle</strong> - Solve cosmic-themed puzzles</li>
                  <li><strong>Memory Match</strong> - Match pairs of space objects</li>
                  <li>More games are coming in future updates!</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-cosmic-white">Do games affect my focus time?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>No, games are designed for break time only:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Games do not count toward your focus time</li>
                  <li>Each game shows a recommended play time</li>
                  <li>A gentle reminder will appear when your break is ending</li>
                  <li>You can exit games at any time to return to your focus session</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-cosmic-white">Can I earn rewards from games?</AccordionTrigger>
              <AccordionContent className="text-cosmic-white/70">
                <p>Yes, you can earn small rewards from playing games:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Each game has its own high score system</li>
                  <li>Beating your high score earns bonus Cosmic Points</li>
                  <li>Some games have special achievements that award unique badges</li>
                  <li>Game rewards are capped daily to maintain focus on productivity</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="text-center p-6 bg-cosmic-blue/10 rounded-lg">
        <HelpCircle className="h-12 w-12 mx-auto text-cosmic-white/60 mb-4" />
        <h3 className="text-xl font-medium text-cosmic-white mb-2">Still need help?</h3>
        <p className="text-cosmic-white/70 mb-4">
          If you couldn&apos;t find the answer to your question, you can ask our AI assistant directly.
        </p>
        <a 
          href="/chat" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cosmic-purple/60 hover:bg-cosmic-purple/80 text-white"
        >
          <MessageSquare className="h-4 w-4" />
          Chat with AI Assistant
        </a>
      </div>
    </div>
  );
};

export default HelpContent;
