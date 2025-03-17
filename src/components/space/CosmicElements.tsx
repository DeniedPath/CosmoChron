"use client";

import React, { useState, useEffect } from 'react';

const CosmicElements: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Return a simple placeholder during server-side rendering
  if (!isClient) {
    return <div className="absolute inset-0"></div>;
  }
  
  return (
    <>
      {/* Enhanced animated overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cosmic-blue/60 via-transparent to-transparent opacity-95"
        style={{ 
          top: '10%',
          left: '30%',
          width: '60%',
          height: '40%',
          animation: 'pulse-subtle 8s ease-in-out infinite alternate',
        }}
      ></div>
      
      {/* Main planets */}
      <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/70 to-blue-500/60 blur-xl"
        style={{
          top: '15%',
          left: '10%',
          animation: 'float 15s ease-in-out infinite',
          boxShadow: '0 0 40px 5px rgba(147, 112, 219, 0.4)'
        }}
      ></div>
      
      <div className="absolute h-80 w-80 rounded-full bg-gradient-to-tr from-pink-500/60 to-yellow-500/50 blur-xl"
        style={{
          bottom: '25%',
          right: '15%',
          animation: 'float 20s ease-in-out infinite reverse',
          boxShadow: '0 0 60px 10px rgba(219, 112, 147, 0.5)'
        }}
      ></div>
      
      {/* Giant gas planet with rings */}
      <div className="absolute h-96 w-96 rounded-full bg-gradient-to-br from-cosmic-blue/80 to-cosmic-purple/70 blur-md"
        style={{
          top: '60%',
          left: '70%',
          animation: 'float 25s ease-in-out infinite',
          boxShadow: '0 0 80px 15px rgba(138, 43, 226, 0.6)'
        }}
      >
        {/* Planet rings */}
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
          style={{
            transform: 'rotate(-20deg)',
            boxShadow: 'inset 0 0 30px 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="absolute w-[140%] h-[20px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              left: '-20%',
              top: 'calc(50% - 10px)'
            }}
          ></div>
        </div>
      </div>
      
      {/* Ice/water planet */}
      <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-teal-400/70 to-blue-500/60 blur-lg"
        style={{
          top: '30%',
          right: '20%',
          animation: 'float 18s ease-in-out infinite alternate',
          boxShadow: '0 0 30px 8px rgba(72, 209, 204, 0.5)'
        }}
      ></div>

      {/* Additional planets */}
      <div className="absolute h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/70 to-red-600/60 blur-lg"
        style={{
          top: '15%',
          right: '35%',
          animation: 'float 22s ease-in-out infinite',
          boxShadow: '0 0 25px 8px rgba(255, 140, 0, 0.5)'
        }}
      ></div>

      <div className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-emerald-500/60 to-teal-700/40 blur-lg"
        style={{
          bottom: '30%',
          left: '20%',
          animation: 'float 28s ease-in-out infinite reverse',
          boxShadow: '0 0 35px 8px rgba(4, 120, 87, 0.4)'
        }}
      ></div>

      <div className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-gray-300/80 to-gray-500/50 blur-md"
        style={{
          top: '40%',
          left: '30%',
          animation: 'float 12s ease-in-out infinite alternate',
          boxShadow: '0 0 15px 3px rgba(220, 220, 220, 0.6)'
        }}
      ></div>
      
      {/* Brighter nebula clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[5%] w-[40%] h-[30%] bg-gradient-to-br from-cosmic-highlight/40 to-cosmic-accent/30 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[25%] bg-gradient-to-br from-blue-500/40 to-purple-500/30 blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-[30%] h-[20%] bg-gradient-to-br from-pink-500/40 to-purple-500/30 blur-3xl"></div>
        <div className="absolute top-[70%] left-[25%] w-[25%] h-[30%] bg-gradient-to-br from-indigo-500/30 to-violet-500/20 blur-3xl"></div>
      </div>

      {/* Distant star/sun */}
      <div className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
        style={{
          top: '12%',
          left: '75%',
          boxShadow: '0 0 60px 20px rgba(255, 215, 0, 0.7), 0 0 120px 40px rgba(255, 215, 0, 0.4)',
          animation: 'pulse-subtle 4s ease-in-out infinite alternate'
        }}
      ></div>
    </>
  );
};

export default CosmicElements;
