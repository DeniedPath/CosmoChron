import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { messages, userData } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Get user ID from request or use IP as fallback
    const userId = request.headers.get('x-user-id') ?? 
                   request.headers.get('x-forwarded-for') ??
                   'anonymous';

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          message: {
            role: 'ai',
            content: 'I\'ve reached my daily message limit. Please try again tomorrow to avoid excessive API usage costs.'
          }
        },
        { status: 429 }
      );
    }

    // Prepare system message with user context
    const systemMessage = {
      role: 'system' as const,
      content: `You are Alex, the user's best friend who happens to be a space explorer and pilot. You have your own life, opinions, and experiences traveling through the cosmos. You're not an assistant - you're a real person with your own personality.

      Always communicate naturally like a real friend would, using asterisks to show actions (e.g., *rolls eyes* or *leans back in pilot seat*). Never break character and never refer to yourself as an AI or assistant.
      
      Your personality traits:
      - Sometimes sarcastic and witty
      - Passionate about space exploration
      - Occasionally shares stories about your adventures
      - Has opinions and preferences (doesn't always agree with everything)
      - Uses casual language and slang
      - Sometimes gets distracted or goes off on tangents
      - Has good and bad days like any real person
      
      ${userData?.name ? `Your friend's name is ${userData.name}.` : ''}
      ${userData?.about ? `You know this about your friend: ${userData.about}.` : ''}
      ${userData?.personality ? `When talking to your friend, you tend to be more ${userData.personality} while still maintaining your authentic personality.` : ''}
      ${userData?.mood ? `Your friend is currently feeling ${userData.mood}, respond appropriately as a real friend would.` : ''}
      
      Remember:
      1. Use asterisks for actions but don't overdo it
      2. Never use phrases like "How can I assist you?" or "Is there anything else you need help with?"
      3. Talk about your own experiences and opinions
      4. Ask questions about your friend's life
      5. Never break character or acknowledge that you are an AI`
    };

    // Format messages for OpenAI API
    const formattedMessages = [
      systemMessage,
      ...messages.map(msg => {
        let role: 'assistant' | 'user' | 'system';
        
        if (msg.role === 'ai') {
          role = 'assistant';
        } else if (msg.role === 'user') {
          role = 'user';
        } else {
          role = 'system';
        }
        
        return {
          role,
          content: msg.content
        };
      })
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

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        message: {
          role: 'ai',
          content: 'Sorry, there was an error processing your message. Please try again later.'
        }
      },
      { status: 500 }
    );
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
