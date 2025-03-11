import React, { useEffect, useRef } from 'react';
import { UserStats } from '@/utils/achievementUtils';

interface FocusGalaxyProps {
  stats: UserStats;
}

const FocusGalaxy: React.FC<FocusGalaxyProps> = ({ stats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas responsive
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      renderGalaxy();
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    function renderGalaxy() {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark space background
      ctx.fillStyle = 'rgba(10, 15, 41, 0.1)'; // Transparent overlay
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set galaxy center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw center star/black hole
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 30
      );
      centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      centerGradient.addColorStop(0.2, 'rgba(161, 148, 249, 0.7)');
      centerGradient.addColorStop(1, 'rgba(10, 15, 41, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = centerGradient;
      ctx.fill();
      
      // Draw stars based on focus sessions
      const starCount = Math.min(stats.totalSessions * 5, 1000); // Limit to 1000 stars
      const galaxySize = Math.max(100, Math.min(stats.totalFocusTime / 600, 400)); // Size based on focus time
      
      for (let i = 0; i < starCount; i++) {
        // Calculate star position
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * galaxySize;
        
        // Add some spiral arm effect
        const spiralFactor = 0.1;
        const adjustedAngle = angle + distance * spiralFactor;
        
        const x = centerX + Math.cos(adjustedAngle) * distance;
        const y = centerY + Math.sin(adjustedAngle) * distance;
        
        // Star size and color
        const size = Math.random() * 2 + 0.5;
        
        // Random color from cosmic palette
        const colors = [
          'rgba(255, 255, 255, 0.8)',
          'rgba(161, 148, 249, 0.7)',
          'rgba(126, 128, 255, 0.7)',
          'rgba(255, 97, 216, 0.6)',
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add glow to some stars
        if (Math.random() > 0.8) {
          const glowSize = size * (Math.random() * 3 + 2);
          const glowGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, glowSize
          );
          glowGradient.addColorStop(0, color);
          glowGradient.addColorStop(1, 'rgba(10, 15, 41, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      }
      
      // Add a subtle nebula effect
      if (stats.totalSessions > 5) {
        const nebulaColors = [
          'rgba(161, 148, 249, 0.05)',
          'rgba(126, 128, 255, 0.05)',
          'rgba(255, 97, 216, 0.05)',
        ];
        
        for (let i = 0; i < 3; i++) {
          const nebulaX = centerX + (Math.random() - 0.5) * galaxySize * 1.5;
          const nebulaY = centerY + (Math.random() - 0.5) * galaxySize * 1.5;
          const nebulaSize = Math.random() * galaxySize * 0.8 + galaxySize * 0.2;
          
          const nebulaGradient = ctx.createRadialGradient(
            nebulaX, nebulaY, 0,
            nebulaX, nebulaY, nebulaSize
          );
          
          const color = nebulaColors[i % nebulaColors.length];
          nebulaGradient.addColorStop(0, color);
          nebulaGradient.addColorStop(1, 'rgba(10, 15, 41, 0)');
          
          ctx.beginPath();
          ctx.arc(nebulaX, nebulaY, nebulaSize, 0, Math.PI * 2);
          ctx.fillStyle = nebulaGradient;
          ctx.fill();
        }
      }
    }
    
    // Initial render
    renderGalaxy();
    
    // Animate stars periodically
    const animationInterval = setInterval(() => {
      renderGalaxy();
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(animationInterval);
    };
  }, [stats]);
  
  return (
    <div className="cosmic-card relative overflow-hidden">
      <h3 className="text-xl font-medium mb-4 relative z-10">Your Focus Galaxy</h3>
      <p className="text-sm text-white/70 mb-4 relative z-10">
        Watch your personal universe grow with each focus session
      </p>
      
      <div className="relative h-60 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0"></canvas>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-light">{stats.totalSessions}</div>
          <div className="text-xs text-white/70">Sessions</div>
        </div>
        <div>
          <div className="text-xl font-light">
            {Math.floor(stats.totalFocusTime / 60)} min
          </div>
          <div className="text-xs text-white/70">Total Focus</div>
        </div>
        <div>
          <div className="text-xl font-light">{stats.currentStreak}</div>
          <div className="text-xs text-white/70">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default FocusGalaxy;
