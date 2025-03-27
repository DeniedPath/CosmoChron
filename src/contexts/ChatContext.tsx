import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

// Types
export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

export type UserData = {
  name: string;
  about: string;
  personality: string;
  mood: string;
};

type ChatContextType = {
  messages: ChatMessage[];
  userData: UserData;
  isLoading: boolean;
  userId: string | null;
  sendMessage: (content: string) => Promise<void>;
  updateUserData: (data: UserData) => Promise<void>;
  clearChat: () => Promise<void>;
};

const defaultUserData: UserData = {
  name: '',
  about: '',
  personality: 'authentic and relatable',
  mood: 'neutral',
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Generate a unique user ID if none exists
  useEffect(() => {
    const storedUserId = localStorage.getItem('cosmochat_userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Date.now()}`;
      localStorage.setItem('cosmochat_userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    if (!userId) return;

    const storedUserData = localStorage.getItem(`cosmochat_userData_${userId}`);
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // If there's an error, set default and save it
        setUserData(defaultUserData);
        localStorage.setItem(`cosmochat_userData_${userId}`, JSON.stringify(defaultUserData));
      }
    } else {
      // Create default user data if none exists
      localStorage.setItem(`cosmochat_userData_${userId}`, JSON.stringify(defaultUserData));
      setUserData(defaultUserData);
    }
  }, [userId]);

  // Load chat messages from localStorage
  useEffect(() => {
    if (!userId) return;

    const storedMessages = localStorage.getItem(`cosmochat_messages_${userId}`);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string timestamps back to Date objects
        const formattedMessages = parsedMessages.map((msg: { id: string; role: 'user' | 'ai'; content: string; timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error parsing messages from localStorage:', error);
        setMessages([]);
        localStorage.setItem(`cosmochat_messages_${userId}`, JSON.stringify([]));
      }
    }
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!userId || messages.length === 0) return;
    localStorage.setItem(`cosmochat_messages_${userId}`, JSON.stringify(messages));
  }, [messages, userId]);

  // Send a message to the AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !userId) return;

    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      setIsLoading(true);

      // Format messages for the API
      const apiMessages = updatedMessages
        .map(({ role, content }) => ({ role, content }));

      // Call our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          userData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract AI response from the API response
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Add AI message to state
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to state
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'ai',
        content: 'Sorry, there was an error processing your message. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, userData, userId]);

  // Update user data
  const updateUserData = useCallback(async (data: UserData) => {
    if (!userId) return;

    try {
      localStorage.setItem(`cosmochat_userData_${userId}`, JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }, [userId]);

  // Clear chat history
  const clearChat = useCallback(async () => {
    if (!userId) return;

    try {
      setMessages([]);
      localStorage.setItem(`cosmochat_messages_${userId}`, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  }, [userId]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    messages,
    userData,
    isLoading,
    userId,
    sendMessage,
    updateUserData,
    clearChat,
  }), [messages, userData, isLoading, userId, sendMessage, updateUserData, clearChat]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
