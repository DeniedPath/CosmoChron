import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Types for our API
type ChatMessage = {
  role: 'user' | 'ai' | 'system';
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
  userData?: {
    name?: string;
    about?: string;
    personality?: string;
    mood?: string;
  };
};

// Rate limiting and usage tracking
type UsageRecord = {
  count: number;
  lastReset: Date;
  tokensUsed: number;
};

// In-memory store for rate limiting (will reset on server restart)
// In a production app, this should be stored in a database
const usageStore: Record<string, UsageRecord> = {};

// Rate limit constants
const RATE_LIMIT_MAX_REQUESTS = 20; // Maximum requests per day per user
const RATE_LIMIT_RESET_HOURS = 24; // Reset period in hours
const MAX_TOKENS_PER_REQUEST = 500; // Maximum tokens per request
const MAX_TOKENS_PER_DAY = 10000; // Maximum tokens per day per user

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userData } = req.body as ChatRequest;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Get user ID from request or use IP as fallback
    const userId = req.headers['x-user-id'] as string ?? 
                   req.socket.remoteAddress ?? 
                   'anonymous';

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        message: {
          role: 'ai',
          content: 'I\'ve reached my daily message limit. Please try again tomorrow to avoid excessive API usage costs.'
        }
      });
    }

    // Prepare system message with user context
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant with a space-themed personality. ${
        userData?.name ? `The user's name is ${userData.name}.` : ''
      } ${
        userData?.about ? `Some information about the user: ${userData.about}.` : ''
      } ${
        userData?.personality ? `Please respond in a ${userData.personality} tone.` : 'Please respond in a friendly and helpful tone.'
      } ${
        userData?.mood ? `The user is currently feeling ${userData.mood}, please keep this in mind when responding.` : ''
      }`
    };

    // Format messages for OpenAI API
    const formattedMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' as const : msg.role === 'user' ? 'user' as const : 'system' as const,
        content: msg.content
      }))
    ];

    // Call OpenAI API with token limits
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      max_tokens: MAX_TOKENS_PER_REQUEST,
    });

    // Update token usage
    updateTokenUsage(userId, completion.usage?.total_tokens ?? 0);

    // Extract response
    const aiResponse = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';
    
    // Format the response to match the expected structure
    const response = {
      choices: [
        {
          message: {
            role: 'ai',
            content: aiResponse
          }
        }
      ]
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      message: {
        role: 'ai',
        content: 'Sorry, there was an error processing your message. Please try again later.'
      }
    });
  }
}

// Check if user has exceeded rate limit
function checkRateLimit(userId: string): boolean {
  const now = new Date();
  
  // Initialize or reset usage record if needed
  if (!usageStore[userId] || isResetDue(usageStore[userId].lastReset)) {
    usageStore[userId] = {
      count: 0,
      lastReset: now,
      tokensUsed: 0
    };
  }
  
  // Check if user has exceeded request count or token limit
  if (usageStore[userId].count >= RATE_LIMIT_MAX_REQUESTS || 
      usageStore[userId].tokensUsed >= MAX_TOKENS_PER_DAY) {
    return false;
  }
  
  // Increment request count
  usageStore[userId].count += 1;
  return true;
}

// Update token usage for a user
function updateTokenUsage(userId: string, tokens: number): void {
  if (usageStore[userId]) {
    usageStore[userId].tokensUsed += tokens;
  }
}

// Check if rate limit reset is due
function isResetDue(lastReset: Date): boolean {
  const now = new Date();
  const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
  return hoursSinceReset >= RATE_LIMIT_RESET_HOURS;
}
