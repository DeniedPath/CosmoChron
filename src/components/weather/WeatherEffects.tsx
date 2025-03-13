
import React from 'react';

interface WeatherEffectsProps {
  weatherCondition: string;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCondition }) => {
  switch (weatherCondition) {
    case 'weather-clouds':
      return (
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-xl"></div>
          <div className="absolute inset-0 bg-[url('/nebula-overlay.png')] bg-cover opacity-50"></div>
        </div>
      );
    case 'weather-rain':
      return (
        <div className="absolute inset-0 opacity-80 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-px h-20 bg-gradient-to-b from-cosmic-highlight/0 via-cosmic-highlight/40 to-cosmic-highlight/0"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
                animation: 'meteor linear infinite',
              }}
            ></div>
          ))}
        </div>
      );
    case 'weather-storm':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[url('/nebula-overlay.png')] bg-cover opacity-60"></div>
          <div className="absolute inset-0 flash-overlay"></div>
        </div>
      );
    case 'weather-snow':
      return (
        <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
          {[...Array(70)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 rounded-full bg-white/90"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fall linear ${5 + Math.random() * 10}s infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
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
};

export default WeatherEffects;
