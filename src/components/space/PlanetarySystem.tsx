import React from 'react';

interface PlanetarySystemProps {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  scale?: number;
}

const PlanetarySystem: React.FC<PlanetarySystemProps> = ({ 
  position = { top: '30%', right: '10%' },
  scale = 1 
}) => {
  // Calculate different orbit sizes
  const orbitSizes = [
    150 * scale, // First orbit
    220 * scale, // Second orbit
    300 * scale, // Third orbit
    380 * scale, // Fourth orbit
  ];
  
  // Define planets with their properties
  const planets = [
    {
      // First planet (closest to sun)
      size: 10 * scale,
      color: 'bg-gradient-to-br from-red-400 to-orange-300',
      orbitDuration: '10s',
      shadow: '0 0 8px 2px rgba(255, 160, 100, 0.6)'
    },
    {
      // Second planet
      size: 14 * scale,
      color: 'bg-gradient-to-br from-blue-400 to-teal-300',
      orbitDuration: '18s',
      shadow: '0 0 10px 3px rgba(100, 210, 255, 0.6)'
    },
    {
      // Third planet
      size: 16 * scale,
      color: 'bg-gradient-to-br from-emerald-400 to-green-600',
      orbitDuration: '30s',
      shadow: '0 0 12px 3px rgba(80, 200, 120, 0.6)'
    },
    {
      // Fourth planet
      size: 12 * scale,
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      orbitDuration: '45s',
      shadow: '0 0 10px 3px rgba(250, 200, 50, 0.6)'
    }
  ];
  
  return (
    <div 
      className="absolute pointer-events-none z-0"
      style={{
        ...position,
        width: `${orbitSizes[orbitSizes.length - 1] * 2 + 50}px`,
        height: `${orbitSizes[orbitSizes.length - 1] * 2 + 50}px`,
      }}
    >
      {/* Central star */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400"
        style={{
          width: `${30 * scale}px`,
          height: `${30 * scale}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${20 * scale}px ${10 * scale}px rgba(255, 215, 0, 0.8)`,
          animation: 'cosmic-glow 4s ease-in-out infinite alternate'
        }}
      />
      
      {/* Orbits and planets */}
      {orbitSizes.map((orbitSize, index) => (
        <React.Fragment key={`orbit-${index}`}>
          {/* Orbit Path */}
          <div 
            className="absolute rounded-full border border-white/5"
            style={{
              width: `${orbitSize * 2}px`,
              height: `${orbitSize * 2}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          {/* Planet */}
          <div 
            className="absolute"
            style={{
              width: `${planets[index].size}px`,
              height: `${planets[index].size}px`,
              top: '50%',
              left: '50%',
              animation: `orbit ${planets[index].orbitDuration} linear infinite`,
              transform: `translateX(-50%) translateY(-${orbitSize}px)`,
            }}
          >
            <div 
              className={`w-full h-full rounded-full ${planets[index].color}`}
              style={{
                boxShadow: planets[index].shadow
              }}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PlanetarySystem;
