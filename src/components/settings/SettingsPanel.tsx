"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, User, Palette, Bell, Moon, Sun, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SettingsPanel: React.FC = () => {
  // User profile settings
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [mood, setMood] = useState('');
  const [personality, setPersonality] = useState('friendly');

  // Appearance settings
  const [theme, setTheme] = useState('dark');
  const [enhancedStars, setEnhancedStars] = useState(true);
  const [shootingStarBrightness, setShootingStarBrightness] = useState(75);

  // Notification settings
  const [timerNotifications, setTimerNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [notificationVolume, setNotificationVolume] = useState(70);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      // Load user profile
      const savedName = localStorage.getItem('userName');
      if (savedName) setName(savedName);
      
      const savedAbout = localStorage.getItem('userAbout');
      if (savedAbout) setAbout(savedAbout);
      
      const savedMood = localStorage.getItem('userMood');
      if (savedMood) setMood(savedMood);
      
      const savedPersonality = localStorage.getItem('userPersonality');
      if (savedPersonality) setPersonality(savedPersonality);
      
      // Load appearance settings
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) setTheme(savedTheme);
      
      const savedEnhancedStars = localStorage.getItem('enhancedStars');
      if (savedEnhancedStars !== null) setEnhancedStars(savedEnhancedStars === 'true');
      
      const savedBrightness = localStorage.getItem('shootingStarBrightness');
      if (savedBrightness) setShootingStarBrightness(parseInt(savedBrightness));
      
      // Load notification settings
      const savedTimerNotifications = localStorage.getItem('timerNotifications');
      if (savedTimerNotifications !== null) setTimerNotifications(savedTimerNotifications === 'true');
      
      const savedSoundEffects = localStorage.getItem('soundEffects');
      if (savedSoundEffects !== null) setSoundEffects(savedSoundEffects === 'true');
      
      const savedVolume = localStorage.getItem('notificationVolume');
      if (savedVolume) setNotificationVolume(parseInt(savedVolume));
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  // Save user profile settings
  const saveUserProfile = () => {
    try {
      localStorage.setItem('userName', name);
      localStorage.setItem('userAbout', about);
      localStorage.setItem('userMood', mood);
      localStorage.setItem('userPersonality', personality);
      
      toast({
        title: "Profile Saved",
        description: "Your profile settings have been updated.",
      });
    } catch (e) {
      console.error("Error saving profile:", e);
      toast({
        title: "Error",
        description: "Failed to save profile settings.",
        variant: "destructive",
      });
    }
  };

  // Save appearance settings
  const saveAppearanceSettings = () => {
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('enhancedStars', enhancedStars.toString());
      localStorage.setItem('shootingStarBrightness', shootingStarBrightness.toString());
      
      // Apply theme immediately
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      toast({
        title: "Appearance Saved",
        description: "Your appearance settings have been updated.",
      });
    } catch (e) {
      console.error("Error saving appearance settings:", e);
      toast({
        title: "Error",
        description: "Failed to save appearance settings.",
        variant: "destructive",
      });
    }
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    try {
      localStorage.setItem('timerNotifications', timerNotifications.toString());
      localStorage.setItem('soundEffects', soundEffects.toString());
      localStorage.setItem('notificationVolume', notificationVolume.toString());
      
      toast({
        title: "Notifications Saved",
        description: "Your notification settings have been updated.",
      });
    } catch (e) {
      console.error("Error saving notification settings:", e);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cosmic-white">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* User Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cosmic-white">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
              <CardDescription className="text-cosmic-white/70">
                Customize your profile information for a personalized experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cosmic-white">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name"
                  className="bg-cosmic-blue/10 border-cosmic-highlight/30 text-cosmic-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about" className="text-cosmic-white">About You</Label>
                <Textarea 
                  id="about" 
                  value={about} 
                  onChange={(e) => setAbout(e.target.value)} 
                  placeholder="Tell us a bit about yourself"
                  className="bg-cosmic-blue/10 border-cosmic-highlight/30 text-cosmic-white min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mood" className="text-cosmic-white">Current Mood</Label>
                <Input 
                  id="mood" 
                  value={mood} 
                  onChange={(e) => setMood(e.target.value)} 
                  placeholder="How are you feeling today?"
                  className="bg-cosmic-blue/10 border-cosmic-highlight/30 text-cosmic-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personality" className="text-cosmic-white">AI Personality Preference</Label>
                <Select value={personality} onValueChange={setPersonality}>
                  <SelectTrigger className="bg-cosmic-blue/10 border-cosmic-highlight/30 text-cosmic-white">
                    <SelectValue placeholder="Select a personality style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={saveUserProfile}
                className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
              >
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cosmic-white">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-cosmic-white/70">
                Customize the look and feel of your cosmic environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-cosmic-white">Theme</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className={`flex-1 ${theme === 'light' ? 'bg-cosmic-purple/60' : 'bg-cosmic-blue/10 border-cosmic-highlight/30'}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className={`flex-1 ${theme === 'dark' ? 'bg-cosmic-purple/60' : 'bg-cosmic-blue/10 border-cosmic-highlight/30'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enhanced-stars" className="text-cosmic-white">Enhanced Stars</Label>
                  <p className="text-sm text-cosmic-white/70">Enable more detailed star animations</p>
                </div>
                <Switch
                  id="enhanced-stars"
                  checked={enhancedStars}
                  onCheckedChange={setEnhancedStars}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="star-brightness" className="text-cosmic-white">Shooting Star Brightness</Label>
                  <span className="text-sm text-cosmic-white/70">{shootingStarBrightness}%</span>
                </div>
                <Slider
                  id="star-brightness"
                  min={0}
                  max={100}
                  step={1}
                  value={[shootingStarBrightness]}
                  onValueChange={(value) => setShootingStarBrightness(value[0])}
                />
              </div>
              
              <Button 
                onClick={saveAppearanceSettings}
                className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
              >
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cosmic-white">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-cosmic-white/70">
                Configure how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="timer-notifications" className="text-cosmic-white">Timer Notifications</Label>
                  <p className="text-sm text-cosmic-white/70">Receive notifications when timers complete</p>
                </div>
                <Switch
                  id="timer-notifications"
                  checked={timerNotifications}
                  onCheckedChange={setTimerNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="sound-effects" className="text-cosmic-white">Sound Effects</Label>
                  <p className="text-sm text-cosmic-white/70">Play sounds for timer events</p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-volume" className="text-cosmic-white">Notification Volume</Label>
                  <span className="text-sm text-cosmic-white/70">{notificationVolume}%</span>
                </div>
                <Slider
                  id="notification-volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[notificationVolume]}
                  onValueChange={(value) => setNotificationVolume(value[0])}
                  disabled={!soundEffects}
                />
              </div>
              
              <Button 
                onClick={saveNotificationSettings}
                className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
