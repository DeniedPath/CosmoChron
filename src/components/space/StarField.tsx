import React from 'react';

const StarField: React.FC = () => {
  return (
    <>
      {/* Star field with increased opacity */}
      <div className="absolute inset-0 star-field opacity-90"></div>
      
      {/* Manual star layer for increased visibility */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(600)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-pulse-subtle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.5,
              boxShadow: Math.random() > 0.3 ? `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 5 + 3}px rgba(255, 255, 255, 0.95)` : 'none',
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Bright stars with glow */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div 
            key={`bright-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 7 + 3}px`,
              height: `${Math.random() * 7 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.98,
              boxShadow: `0 0 ${Math.random() * 15 + 8}px ${Math.random() * 6 + 4}px rgba(255, 255, 255, 0.98)`,
              animation: `pulse-subtle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          ></div>
        ))}
      </div>

      {/* Extra vibrant colorful stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => {
          // Generate random colors for stars
          const colors = [
            'rgba(255, 223, 186, 0.98)', // Yellow/white star
            'rgba(203, 249, 255, 0.98)', // Blue star
            'rgba(255, 180, 180, 0.98)', // Red star
            'rgba(255, 255, 255, 0.98)', // White star
            'rgba(255, 210, 161, 0.98)', // Orange star
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const glowColor = randomColor.replace('0.98', '0.8');
          
          return (
            <div 
              key={`colored-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 8 + 5}px`,
                height: `${Math.random() * 8 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: randomColor,
                boxShadow: `0 0 ${Math.random() * 20 + 10}px ${Math.random() * 8 + 5}px ${glowColor}`,
                animation: `pulse-subtle ${Math.random() * 5 + 3}s ease-in-out infinite alternate`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Star clusters */}
      {[...Array(5)].map((_, clusterIndex) => {
        const clusterX = Math.random() * 100;
        const clusterY = Math.random() * 100;
        const clusterSize = Math.random() * 10 + 5; // % of screen
        
        return (
          <div 
            key={`cluster-${clusterIndex}`}
            className="absolute overflow-hidden"
            style={{
              top: `${clusterY}%`,
              left: `${clusterX}%`,
              width: `${clusterSize}%`,
              height: `${clusterSize}%`,
            }}
          >
            {[...Array(30)].map((_, i) => (
              <div 
                key={`cluster-star-${clusterIndex}-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.9,
                  boxShadow: `0 0 ${Math.random() * 8 + 2}px ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.8)`,
                }}
              ></div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export default StarField;
