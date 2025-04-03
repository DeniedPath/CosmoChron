"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Send, Loader2, Sparkles } from 'lucide-react';
import ChatExample from './ChatExample';

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {messages.length === 0 && <ChatExample />}
      
      <div className="flex flex-col h-[600px] bg-cosmic-blue/10 border border-cosmic-highlight/20 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-cosmic-highlight/30 bg-cosmic-blue/30">
          <h2 className="text-xl font-semibold text-cosmic-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cosmic-purple" />
            Cosmic Companion
          </h2>
          <p className="text-sm text-cosmic-white/70">Your best friend in the cosmos</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-cosmic-white/60">
                <p className="text-lg mb-2">Start a conversation with your cosmic best friend</p>
                <p className="text-sm">Share your thoughts, ask for advice, or just chat about your day!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-cosmic-purple/60 text-white rounded-tr-none'
                      : 'bg-cosmic-blue/30 text-cosmic-white rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-cosmic-white/70' : 'text-cosmic-white/50'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-cosmic-blue/30 text-cosmic-white rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-cosmic-purple" />
                  <span>*typing a message*</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-cosmic-highlight/30 p-4 bg-cosmic-blue/30">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Cosmo..."
              className="flex-1 bg-cosmic-blue/20 text-cosmic-white rounded-lg px-4 py-2 border border-cosmic-highlight/20 focus:outline-none focus:ring-2 focus:ring-cosmic-purple/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80 text-white rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
