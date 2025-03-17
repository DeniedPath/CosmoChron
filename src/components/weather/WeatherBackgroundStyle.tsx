"use client";

// src/components/weather/WeatherBackgroundStyle.tsx
import React, { ReactNode, useState, useEffect } from 'react';

interface WeatherBackgroundStyleProps {
  weatherCondition: string;
  children: ReactNode;
}

const WeatherBackgroundStyle: React.FC<WeatherBackgroundStyleProps> = ({ 
  weatherCondition = 'weather-clear', // Provide default value
  children 
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate CSS classes based on weather condition
  const getWeatherClassNames = () => {
    try {
      // Base classes
      let classes = "fixed inset-0 -z-10 cosmic-gradient overflow-hidden";
      
      // Add weather-specific classes
      switch (weatherCondition) {
        case 'weather-clear':
          classes += " bg-gradient-to-b from-cosmic-blue via-cosmic-purple to-cosmic-dark";
          break;
        case 'weather-clouds':
          classes += " bg-gradient-to-b from-cosmic-blue/90 via-cosmic-purple/80 to-cosmic-dark opacity-100";
          break;
        case 'weather-rain':
          classes += " bg-gradient-to-b from-cosmic-blue/95 via-cosmic-purple/85 to-cosmic-dark opacity-100";
          break;
        case 'weather-storm':
          classes += " bg-gradient-to-b from-cosmic-blue/98 via-cosmic-purple/95 to-cosmic-dark";
          break;
        case 'weather-snow':
          classes += " bg-gradient-to-b from-cosmic-blue/90 via-cosmic-purple/80 to-cosmic-dark opacity-100";
          break;
        case 'weather-mist':
          classes += " bg-gradient-to-b from-cosmic-blue/85 via-cosmic-purple/75 to-cosmic-dark opacity-95";
          break;
        default:
          classes += " bg-gradient-to-b from-cosmic-blue via-cosmic-purple to-cosmic-dark";
      }
      
      return classes;
    } catch (error) {
      console.error("Error in getWeatherClassNames:", error);
      // Return default class if there's an error
      return "fixed inset-0 -z-10 cosmic-gradient overflow-hidden bg-gradient-to-b from-cosmic-blue via-cosmic-purple to-cosmic-dark";
    }
  };

  // Use a simple background during server-side rendering
  if (!isClient) {
    return (
      <div className="fixed inset-0 -z-10 cosmic-gradient overflow-hidden bg-gradient-to-b from-cosmic-blue via-cosmic-purple to-cosmic-dark">
        {children}
      </div>
    );
  }

  return (
    <div className={getWeatherClassNames()}>
      {children}
    </div>
  );
};

export default WeatherBackgroundStyle;