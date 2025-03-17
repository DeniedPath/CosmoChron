"use client";

// src/components/weather/WeatherEffects.tsx
import React, { useState, useEffect } from 'react';

interface WeatherEffectsProps {
  weatherCondition: string;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCondition = 'weather-clear' }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }
  
  // Helper function to safely render weather-specific components
  const renderWeatherEffect = () => {
    try {
      switch (weatherCondition) {
        case 'weather-clouds':
          return (
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-xl"></div>
              {/* Replace nebula-overlay.png with gradient backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-purple-500/5 opacity-50"></div>
            </div>
          );
        case 'weather-rain':
          return (
            <div className="absolute inset-0 opacity-80 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => {
                const animationDuration = `${0.5 + Math.random() * 1}s`;
                const animationDelay = `${Math.random() * 5}s`;
                
                return (
                  <div 
                    key={i} 
                    className="absolute w-px h-20 bg-gradient-to-b from-cosmic-highlight/0 via-cosmic-highlight/40 to-cosmic-highlight/0"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `meteor linear infinite ${animationDuration}`,
                      animationDelay: animationDelay
                    }}
                  ></div>
                );
              })}
            </div>
          );
        case 'weather-storm':
          return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Replace nebula-overlay.png with gradient backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-800/10 opacity-60"></div>
              <div className="absolute inset-0 flash-overlay"></div>
            </div>
          );
        case 'weather-snow':
          return (
            <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
              {[...Array(70)].map((_, i) => {
                const animationDuration = `${5 + Math.random() * 10}s`;
                const animationDelay = `${Math.random() * 5}s`;
                
                return (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 rounded-full bg-white/90"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `fall linear infinite ${animationDuration}`,
                      animationDelay: animationDelay
                    }}
                  ></div>
                );
              })}
            </div>
          );
        case 'weather-mist':
          return (
            <div className="absolute inset-0 opacity-70 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/15 to-transparent backdrop-blur-sm"></div>
            </div>
          );
        default:
          return null;
      }
    } catch (e) {
      console.error("Error rendering weather effect:", e);
      return null;
    }
  };

  return renderWeatherEffect();
};

export default WeatherEffects;