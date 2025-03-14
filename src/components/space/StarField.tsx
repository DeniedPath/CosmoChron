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
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>
      
      {/* Bright stars with glow */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              boxShadow: `0 0 ${Math.random() * 5 + 2}px white`,
            }}
          />
        ))}
      </div>

      {/* Extra vibrant colorful stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
              boxShadow: `0 0 ${Math.random() * 8 + 3}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Star clusters */}
      {[...Array(5)].map((_, clusterIndex) => {
        const clusterX = Math.random() * 100;
        const clusterY = Math.random() * 100;
        const clusterSize = Math.random() * 10 + 5; // % of screen
        
        return (
          <div
            key={clusterIndex}
            className="absolute rounded-full"
            style={{
              width: `${clusterSize}%`,
              height: `${clusterSize}%`,
              top: `${clusterY}%`,
              left: `${clusterX}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
              opacity: 0.5,
            }}
          />
        );
      })}
    </>
  );
};

export default StarField;
