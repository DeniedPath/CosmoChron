import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChatProvider } from '../contexts/ChatContext';
import ChatInterface from '../components/chat/ChatInterface';
import UserProfileSetup from '../components/chat/UserProfileSetup';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ChatPage: NextPage = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <Head>
          <title>CosmoChat - Your AI Companion</title>
          <meta name="description" content="Talk with your personalized AI companion" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-4xl flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-cosmic-white/80 hover:text-cosmic-white hover:bg-cosmic-blue/20"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Timer
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex-grow">
              CosmoChat
            </h1>
            <div className="w-[105px]"></div> {/* Spacer to balance the layout */}
          </div>
          
          <div className="w-full max-w-4xl bg-slate-800/50 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700">
            <div className="grid md:grid-cols-3 min-h-[600px]">
              {/* User Profile Section */}
              <div className="md:col-span-1 border-r border-slate-700">
                <UserProfileSetup />
              </div>
              
              {/* Chat Interface Section */}
              <div className="md:col-span-2">
                <ChatInterface />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
