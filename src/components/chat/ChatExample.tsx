"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Info } from 'lucide-react';

const ChatExample: React.FC = () => {
  return (
    <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cosmic-white">
          <MessageSquare className="h-5 w-5" />
          Meet Alex - Your Space Explorer Friend
        </CardTitle>
        <CardDescription className="text-cosmic-white/70">
          Chat with your cosmic companion who has their own life and adventures
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 bg-cosmic-blue/10 p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-cosmic-purple/60 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-cosmic-white/90">
              *throws duffel bag on the floor and collapses into the chair* Man, just got back from that mission to Europa. Those ice tunnels were something else! Nearly lost my favorite jacket when that geyser erupted. *stretches arms* So what&apos;s been happening with you? Still dealing with that annoying project manager?
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-cosmic-blue/10 p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">You</span>
          </div>
          <div className="flex-1">
            <p className="text-cosmic-white/90">
              I&apos;m feeling a bit tired today, had a long day at work.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-cosmic-blue/10 p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-cosmic-purple/60 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-cosmic-white/90">
              *nods knowingly* Yeah, I get that. Had a 36-hour shift last week when our nav system glitched near Saturn. *pulls out a small flask from pocket* Want some? It&apos;s that Martian tea I told you about. *shrugs* Or we could just order takeout and watch that terrible sci-fi show you like - the one with the historically inaccurate space suits. Sometimes bad TV is the best medicine after a rough day.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-cosmic-blue/5 p-3 rounded-lg text-cosmic-white/60 text-sm">
          <Info className="h-4 w-4" />
          <p>
            Alex has their own personality, stories, and opinions. They&apos;ll talk to you like a real friend would, complete with their own experiences and perspectives.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatExample;
