"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Moon, Sun, Cloud, Thermometer, Bell, Shield, Key, Rocket, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SpaceBackground from '@/components/space/SpaceBackground';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  
  // State for various settings
  const [enhancedStars, setEnhancedStars] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [starDensity, setStarDensity] = useState([75]);
  const [useCelsius, setUseCelsius] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [enabledAnimations, setEnabledAnimations] = useState(true);
  const [apiKey, setApiKey] = useState("");
  
  const handleBackClick = () => {
    router.push('/');
  };

  const handleSaveAllSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleApiKeySave = () => {
    if (apiKey) {
      // Here you would actually save the API key, but for demo we just show a toast
      toast.success("API key saved successfully!");
    } else {
      toast.info("Using demo weather data");
    }
  };

  return (
    <SpaceBackground weatherCondition="weather-clear" enhancedStars={enhancedStars}>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="mr-2 text-cosmic-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-cosmic-white">Space Timer Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* Appearance Settings */}
          <Card className="bg-cosmic-blue/20 border border-cosmic-highlight/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-cosmic-highlight" />
                <span>Space Background</span>
              </CardTitle>
              <CardDescription>Customize your cosmic environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">Enhanced Stars</h3>
                  <p className="text-sm text-cosmic-white/70">Enable high-density star field</p>
                </div>
                <Switch 
                  checked={enhancedStars} 
                  onCheckedChange={setEnhancedStars} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">Show Planets</h3>
                  <p className="text-sm text-cosmic-white/70">Display planetary systems</p>
                </div>
                <Switch 
                  checked={showPlanets} 
                  onCheckedChange={setShowPlanets} 
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-cosmic-white">Star Density</h3>
                <p className="text-sm text-cosmic-white/70 mb-3">Adjust the number of stars visible</p>
                <Slider 
                  value={starDensity} 
                  onValueChange={setStarDensity}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-cosmic-white/60 mt-1">
                  <span>Less</span>
                  <span>More</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">UI Animations</h3>
                  <p className="text-sm text-cosmic-white/70">Enable UI transition effects</p>
                </div>
                <Switch 
                  checked={enabledAnimations} 
                  onCheckedChange={setEnabledAnimations} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Weather Settings */}
          <Card className="bg-cosmic-blue/20 border border-cosmic-highlight/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-cosmic-highlight" />
                <span>Weather Settings</span>
              </CardTitle>
              <CardDescription>Configure your weather preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">Show Weather</h3>
                  <p className="text-sm text-cosmic-white/70">Display current weather information</p>
                </div>
                <Switch 
                  checked={showWeather} 
                  onCheckedChange={setShowWeather} 
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-cosmic-white">Temperature Unit</h3>
                <RadioGroup 
                  value={useCelsius ? "celsius" : "fahrenheit"}
                  onValueChange={(val) => setUseCelsius(val === "celsius")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="celsius" id="celsius" />
                    <Label htmlFor="celsius" className="text-cosmic-white">Celsius (°C)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                    <Label htmlFor="fahrenheit" className="text-cosmic-white">Fahrenheit (°F)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-cosmic-white">OpenWeather API Key</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-cosmic-white/70 mb-2">
                      Enter your OpenWeather API key to get real weather data. 
                      Leave empty to use demo weather data.
                    </p>
                    <div className="flex gap-2 items-center">
                      <Input 
                        placeholder="Enter your OpenWeather API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-cosmic-blue/10 border-cosmic-highlight/20 text-cosmic-white"
                      />
                      <Button 
                        onClick={handleApiKeySave} 
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-cosmic-white/60 mt-1">
                      Get a key at{" "}
                      <a 
                        href="https://openweathermap.org/api" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cosmic-highlight underline flex items-center gap-1 inline-flex"
                      >
                        OpenWeatherMap <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-cosmic-blue/20 border border-cosmic-highlight/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cosmic-highlight" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>General application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">Dark Mode</h3>
                  <p className="text-sm text-cosmic-white/70">Toggle between light and dark themes</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-cosmic-highlight"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cosmic-white">Notifications</h3>
                  <p className="text-sm text-cosmic-white/70">Enable system notifications</p>
                </div>
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <Button variant="outline" onClick={handleBackClick}>
            Cancel
          </Button>
          <Button onClick={handleSaveAllSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </SpaceBackground>
  );
};

export default SettingsPage;