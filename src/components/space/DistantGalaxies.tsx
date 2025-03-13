import React from 'react';

interface GalaxyProps {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  size?: number;
  type?: 'spiral' | 'elliptical' | 'irregular';
  angle?: number;
}

const Galaxy: React.FC<GalaxyProps> = ({
  position = { top: '20%', left: '30%' },
  size = 150,
  type = 'spiral',
  angle = 0
}) => {
  const getGalaxyStyles = () => {
    switch (type) {
      case 'spiral':
        return {
          backgroundImage: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(100, 100, 255, 0.1) 60%, transparent 70%)',
          boxShadow: '0 0 30px 10px rgba(200, 200, 255, 0.2)',
          animation: 'spin 120s linear infinite'
        };
      case 'elliptical':
        return {
          backgroundImage: 'radial-gradient(ellipse at center, rgba(255, 200, 150, 0.5) 0%, rgba(255, 180, 150, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 30px 10px rgba(255, 200, 150, 0.2)',
          animation: 'pulse-subtle 30s ease-in-out infinite alternate'
        };
      case 'irregular':
        return {
          backgroundImage: 'radial-gradient(ellipse at center, rgba(180, 180, 255, 0.5) 0%, rgba(180, 180, 255, 0.2) 40%, transparent 60%)',
          filter: 'blur(3px)',
          boxShadow: '0 0 20px 5px rgba(180, 180, 255, 0.2)',
          animation: 'pulse-subtle 25s ease-in-out infinite alternate'
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...position,
        width: `${size}px`,
        height: `${size * (type === 'elliptical' ? 0.6 : 1)}px`,
        transform: `rotate(${angle}deg)`,
        ...getGalaxyStyles()
      }}
    >
      {/* For spiral galaxies, add spiral arms */}
      {type === 'spiral' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
              transform: 'rotate(0deg)',
              animation: 'spin 80s linear infinite reverse'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
              animation: 'spin 80s linear infinite reverse'
            }}
          />
        </>
      )}
    </div>
  );
};

const DistantGalaxies: React.FC = () => {
  // Define several galaxies with different properties
  const galaxies = [
    { position: { top: '10%', left: '15%' }, size: 200, type: 'spiral', angle: 15 },
    { position: { top: '60%', right: '10%' }, size: 180, type: 'elliptical', angle: 30 },
    { position: { bottom: '20%', left: '25%' }, size: 120, type: 'irregular', angle: 0 },
    { position: { top: '25%', right: '20%' }, size: 250, type: 'spiral', angle: 45 },
    { position: { bottom: '10%', right: '30%' }, size: 160, type: 'elliptical', angle: 10 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {galaxies.map((galaxy, index) => (
        <Galaxy
          key={`galaxy-${index}`}
          position={galaxy.position}
          size={galaxy.size}
          type={galaxy.type as 'spiral' | 'elliptical' | 'irregular'}
          angle={galaxy.angle}
        />
      ))}
    </div>
  );
};

export default DistantGalaxies;
