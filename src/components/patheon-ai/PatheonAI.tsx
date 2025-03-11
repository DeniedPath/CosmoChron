'use client';

import { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatResponse {
  choices: {
    message: Message;
  }[];
}

export default function PatheonAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const options = {
        method: 'POST',
        url: 'https://api.chai-research.com/v1/chat/completions',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API_KEY': process.env.NEXT_PUBLIC_CHAI_API_KEY
        },
        data: {
          model: 'chai_v1',
          messages: [...messages, userMessage]
        }
      };

      const response = await axios.request<ChatResponse>(options);
      const aiMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="h-[400px] overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
            } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button 
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </Card>
  );
}
