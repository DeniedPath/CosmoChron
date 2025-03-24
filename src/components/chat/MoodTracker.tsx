import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { SmilePlus, Frown, Meh, Smile, Heart, Star, Coffee, Moon } from 'lucide-react';

const MoodTracker: React.FC = () => {
  const { userData, updateUserData } = useChat();

  // Function to update only the mood
  const updateMood = (mood: string) => {
    updateUserData({
      ...userData,
      mood
    });
  };

  // Mood options with icons and colors
  const moods = [
    { name: 'happy', icon: <Smile className="w-5 h-5" />, color: 'bg-yellow-500' },
    { name: 'excited', icon: <Star className="w-5 h-5" />, color: 'bg-purple-500' },
    { name: 'calm', icon: <Moon className="w-5 h-5" />, color: 'bg-blue-500' },
    { name: 'relaxed', icon: <Heart className="w-5 h-5" />, color: 'bg-pink-500' },
    { name: 'focused', icon: <Coffee className="w-5 h-5" />, color: 'bg-orange-500' },
    { name: 'tired', icon: <Moon className="w-5 h-5" />, color: 'bg-indigo-500' },
    { name: 'stressed', icon: <Frown className="w-5 h-5" />, color: 'bg-red-500' },
    { name: 'anxious', icon: <Meh className="w-5 h-5" />, color: 'bg-amber-500' },
    { name: 'sad', icon: <Frown className="w-5 h-5" />, color: 'bg-blue-700' },
    { name: 'neutral', icon: <Meh className="w-5 h-5" />, color: 'bg-gray-500' },
  ];

  return (
    <div className="p-4 border-t border-slate-700">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <SmilePlus className="w-4 h-4 mr-1" /> How are you feeling now?
      </h3>
      
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => updateMood(mood.name)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              userData.mood === mood.name
                ? `${mood.color} text-white ring-2 ring-white`
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title={mood.name}
          >
            {mood.icon}
            <span className="text-xs mt-1 capitalize">{mood.name}</span>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-slate-400 mt-2">
        Your AI companion will adapt to your current mood.
      </p>
    </div>
  );
};

export default MoodTracker;
