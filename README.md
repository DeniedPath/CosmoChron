# CosmoChron

CosmoChron is an AI-powered celestial-themed productivity app that helps users manage their time effectively through immersive space backgrounds, achievement systems, productivity tracking, and interactive features including a personalized AI companion.

<p align="center">
  <img src="./public/CosmoChron.jpeg" alt="CosmoChron Logo" width="200" />
</p>

## 🚀 Features

* **Interactive Space Timer**: Customizable timer with immersive space-themed backgrounds
* **Planetary Visualization**: Explore the solar system while maintaining focus
* **Achievement System**: Unlock achievements and track progress through consistent sessions
* **Advanced Analytics Dashboard**: Visualize your productivity patterns with interactive charts
* **Breathing Guidance**: Follow subtle animations to maintain calm and focus
* **Celestial Events**: Experience special cosmic events during focus sessions
* **Focus Galaxy**: Watch your personal focus universe expand with each session
* **Virtual Space Station**: Build and customize your space station as you progress
* **Mission System**: Complete challenges to earn cosmic rewards
* **Weather Integration**: Enjoy dynamic backgrounds that change with local weather
* **Voice Commands**: Control your timer hands-free
* **Space Facts**: Learn about astronomy during breaks
* **Collaborative Focus**: Connect with friends for shared productivity sessions
* **AI Companion**: Chat with Alex, your space explorer friend who has their own personality and stories

## 📋 Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Features in Detail](#features-in-detail)
* [Technologies](#technologies)
* [Project Structure](#project-structure)
* [Development Notes](#development-notes)
* [Future Enhancements](#future-enhancements)
* [About CosmoChron](#about-cosmochron)
* [License](#license)
* [Acknowledgements](#acknowledgements)

## 🔧 Installation

### Prerequisites
* Node.js (v16.0.0 or higher)
* npm (v8.0.0 or higher)
* OpenAI API key (for the chatbot feature)
* Weather API key (for weather integration)

### Setup Instructions
Clone the repository:

```sh
git clone https://github.com/yourusername/CosmoChron.git
cd CosmoChron
```

Install dependencies:

```
npm install
```

### Environment Setup
Create a `.env.local` file in the root directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

Replace the placeholder values with your actual API keys.

Start the development server:

```
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

## 📱 Usage

### Timer Functionality
1. **Set Timer**: Configure your preferred focus duration (default: 25 minutes)
2. **Start Focus Session**: Click the "Start" button to begin counting down
3. **Pause/Continue**: Control your session with pause and continue buttons
4. **Reset**: Start fresh with a new timer session
5. **Complete Session**: Receive visual notification when your session completes

### Chat with Alex
1. **Open Chat**: Navigate to the chat section to interact with Alex
2. **Personalize Experience**: Update your profile in settings to make conversations more relevant
3. **Share Experiences**: Talk to Alex about your day, ask for advice, or just chat
4. **Track Mood**: Set your current mood to receive appropriate responses

### Space Station
1. **Visit Your Station**: Track your progress and achievements
2. **View Stats**: See your focus time, completion rate, and current streak
3. **Unlock Features**: Gain access to new station modules as you progress

### Mini-Games
1. **Asteroid Dodge**: Take a break with this fun mini-game
2. **More Games**: Unlock additional games as you complete focus sessions

## 🌟 Features in Detail

### AI Companion - Alex
Alex is your space explorer friend who has their own personality, stories, and experiences. Unlike typical AI assistants, Alex:
* Has a distinct personality with opinions and preferences
* Shares stories about space exploration adventures
* Uses natural conversation with roleplay actions
* Adapts to your mood and personality preferences
* Remembers details about your conversations
* Never breaks character or acts like an assistant

### Weather Integration
The app integrates with weather APIs to:
* Adapt the space background based on local weather conditions
* Create dynamic visual experiences that change throughout the day
* Provide subtle weather information without disrupting focus

### Achievement System
Track your progress and stay motivated with:
* Tiered achievements for consistent usage
* Special badges for milestone accomplishments
* Secret achievements that can be discovered through exploration
* Visual representation of progress in your space station

### Analytics Dashboard
Understand your productivity patterns with:
* Daily, weekly, and monthly focus time tracking
* Session completion rates and streaks
* Productivity score based on multiple factors
* Exportable reports for personal review

## 💻 Technologies

* **Next.js 14**: React framework with App Router architecture
* **TypeScript**: For type-safe code
* **Tailwind CSS**: For responsive styling
* **Framer Motion**: For smooth animations
* **OpenAI API**: For AI companion functionality
* **Weather API**: For dynamic backgrounds
* **React Context API**: For state management
* **localStorage**: For data persistence
* **shadcn/ui**: For UI components

## 📂 Project Structure

```
src/
├── app/                      # App Router structure
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── chat/                 # Chat with Alex
│   ├── settings/             # User settings
│   ├── help/                 # Help documentation
│   ├── station/              # Space station
│   ├── games/                # Mini-games
│   └── api/                  # API routes
│       ├── chat/             # AI chat endpoint
│       └── weather/          # Weather data endpoint
├── components/
│   ├── ui/                   # UI components
│   ├── timer/                # Timer functionality
│   ├── chat/                 # Chat interface
│   ├── settings/             # Settings panel
│   ├── help/                 # Help content
│   ├── station/              # Space station content
│   ├── games/                # Game components
│   ├── MiniGames/            # Mini-game components
│   └── tabs/                 # Tab navigation
├── contexts/
│   ├── ChatContext.tsx       # Chat state management
│   ├── TimerContext.tsx      # Timer state management
│   ├── ThemeContext.tsx      # Theme preferences
│   └── UserContext.tsx       # User data management
├── hooks/
│   ├── useTimer.ts           # Timer functionality
│   ├── useChat.ts            # Chat functionality
│   └── use-toast.ts          # Toast notifications
├── services/
│   ├── weatherService.ts     # Weather API integration
│   └── aiService.ts          # AI API integration
├── styles/
│   └── globals.css           # Global styles
└── providers.tsx             # Client-side providers
```

## 🛠️ Development Notes

### App Router Migration
The project has been migrated from Next.js Pages Router to the App Router architecture, which provides:
* Improved performance through server components
* More intuitive routing structure
* Better code organization
* Enhanced SEO capabilities
* Simplified API routes

### AI Implementation
The AI companion (Alex) is implemented using:
* OpenAI's API for natural language processing
* Custom system prompts to define Alex's personality
* Context management to maintain conversation history
* User data integration for personalized interactions

### State Management
The application uses React Context API for state management:
* ChatContext for managing conversations with Alex
* TimerContext for timer functionality
* UserContext for user preferences and data
* ThemeContext for visual customization

### Data Persistence
User data is stored locally using:
* localStorage for session data, user preferences, and chat history
* Structured data format for analytics and achievements
* Efficient retrieval mechanisms for performance

## 🔮 Future Enhancements

Based on our development roadmap and user feedback, future versions may include:

* Cloud synchronization for cross-device usage
* Additional celestial themes and animations
* Social sharing of achievements
* Custom sound design for different planets
* Task integration for specific focus sessions
* Progressive Web App (PWA) implementation
* Mobile applications for iOS and Android
* Full virtual space station customization
* Expanded mission system with rewards
* Community challenges and group goals
* Enhanced AI capabilities for Alex
* Voice interaction with Alex
* Collaborative focus sessions with friends

## 🌟 About CosmoChron

CosmoChron was created to transform the way people approach focused work. By combining the science of productivity with the wonder of space exploration and the companionship of an AI friend, we've designed a tool that makes time management both effective and enjoyable.

Our mission is to help users develop better focus habits while providing a momentary escape into the cosmos during their productivity sessions.

## 📄 License

CosmoChron is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

* Space imagery courtesy of NASA
* Planet facts from various astronomy resources
* OpenAI for AI capabilities
* Weather API for dynamic backgrounds
* Special thanks to all our beta testers who provided valuable feedback

---

<p align="center">
  <i>Focus among the stars with CosmoChron</i>
</p>
