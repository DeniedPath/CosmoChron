import React, { useState } from 'react';
import { useChat, UserData } from '../../contexts/ChatContext';
import { Save, Trash2, User, Info, Sparkles, SmilePlus } from 'lucide-react';
import MoodTracker from './MoodTracker';

const UserProfileSetup: React.FC = () => {
  const { userData, updateUserData, clearChat } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);

  // Predefined mood options
  const moodOptions = [
    'happy', 'excited', 'calm', 'relaxed', 'focused',
    'tired', 'stressed', 'anxious', 'sad', 'neutral'
  ];

  // Predefined personality options
  const personalityOptions = [
    'friendly and helpful',
    'professional and formal',
    'casual and funny',
    'encouraging and motivational',
    'wise and thoughtful',
    'creative and imaginative'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserData(formData);
    setIsEditing(false);
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      await clearChat();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <p className="text-sm text-slate-400">Customize your AI companion</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 flex items-center">
                <User className="w-4 h-4 mr-1" /> Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center">
                <Info className="w-4 h-4 mr-1" /> About You
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Share a bit about yourself, your interests, hobbies, etc."
                rows={3}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" /> AI Personality
              </label>
              <select
                name="personality"
                value={formData.personality}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {personalityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center">
                <SmilePlus className="w-4 h-4 mr-1" /> Current Mood
              </label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {moodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
              >
                <Save className="w-4 h-4 mr-1" /> Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-slate-400 flex items-center">
                  <User className="w-4 h-4 mr-1" /> Your Name
                </h3>
                <p className="text-white">{userData.name || 'Not set'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 flex items-center">
                  <Info className="w-4 h-4 mr-1" /> About You
                </h3>
                <p className="text-white">{userData.about || 'Not set'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" /> AI Personality
                </h3>
                <p className="text-white">{userData.personality}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 flex items-center">
                  <SmilePlus className="w-4 h-4 mr-1" /> Current Mood
                </h3>
                <p className="text-white">{userData.mood}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleClearChat}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Clear Chat
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 mt-auto">
        <div className="text-xs text-slate-400">
          <p>Your profile helps personalize your AI companion&apos;s responses.</p>
          <p>All data is stored locally in your browser.</p>
        </div>
        
        {!isEditing && <MoodTracker />}
      </div>
    </div>
  );
};

export default UserProfileSetup;
