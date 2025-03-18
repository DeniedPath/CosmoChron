// pages/games/constellation-connect.tsx
import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/ConstellationConnect.module.css';
import { StarPointType, ConnectionType, ConstellationType } from '../../types/game-types';

const ConstellationConnect: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [currentConstellation, setCurrentConstellation] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(240); // 4 minutes in seconds
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [constellations, setConstellations] = useState<ConstellationType[]>([]);
  
  // Mouse position tracking
  const mousePosRef = useRef({ x: 0, y: 0 });
  
  // Initialize constellations data
  const initConstellationsData = (): void => {
    const constellationsData: ConstellationType[] = [
      {
        name: "Big Dipper",
        stars: [
          { id: 0, x: 100, y: 100, isConnected: false },
          { id: 1, x: 150, y: 120, isConnected: false },
          { id: 2, x: 200, y: 140, isConnected: false },
          { id: 3, x: 250, y: 160, isConnected: false },
          { id: 4, x: 275, y: 210, isConnected: false },
          { id: 5, x: 320, y: 180, isConnected: false },
          { id: 6, x: 370, y: 150, isConnected: false }
        ],
        connections: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
          { from: 4, to: 5 },
          { from: 5, to: 6 }
        ],
        completed: false
      },
      {
        name: "Orion",
        stars: [
          { id: 0, x: 200, y: 50, isConnected: false },
          { id: 1, x: 150, y: 100, isConnected: false },
          { id: 2, x: 250, y: 100, isConnected: false },
          { id: 3, x: 200, y: 150, isConnected: false },
          { id: 4, x: 150, y: 200, isConnected: false },
          { id: 5, x: 250, y: 200, isConnected: false },
          { id: 6, x: 180, y: 250, isConnected: false },
          { id: 7, x: 220, y: 250, isConnected: false }
        ],
        connections: [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
          { from: 3, to: 5 },
          { from: 4, to: 6 },
          { from: 5, to: 7 }
        ],
        completed: false
      },
      {
        name: "Cassiopeia",
        stars: [
          { id: 0, x: 100, y: 150, isConnected: false },
          { id: 1, x: 150, y: 100, isConnected: false },
          { id: 2, x: 200, y: 120, isConnected: false },
          { id: 3, x: 250, y: 90, isConnected: false },
          { id: 4, x: 300, y: 140, isConnected: false }
        ],
        connections: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 }
        ],
        completed: false
      }
    ];
    
    setConstellations(constellationsData);
  };
  
  // Draw starry background
  const drawStarryBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000011');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw random stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5;
      const opacity = Math.random() * 0.8 + 0.2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Draw stars
  const drawStars = (ctx: CanvasRenderingContext2D, constellation: ConstellationType): void => {
    constellation.stars.forEach(star => {
      // Draw star glow
      const gradient = ctx.createRadialGradient(star.x, star.y, 2, star.x, star.y, 15);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw star
      ctx.fillStyle = star.isConnected ? '#ffcc00' : '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw star border
      ctx.strokeStyle = star.isConnected ? '#ffcc00' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw selected star highlight
      if (selectedStar === star.id) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  };
  
  // Check if a connection exists in completed connections
  const checkConnectionExists = (constellation: ConstellationType, from: number, to: number): boolean => {
    // In this simplified version, we just check if both stars are connected
    const fromStar = constellation.stars.find(s => s.id === from);
    const toStar = constellation.stars.find(s => s.id === to);
    return !!(fromStar?.isConnected && toStar?.isConnected);
  };
  
  // Draw connections
  const drawConnections = (ctx: CanvasRenderingContext2D, constellation: ConstellationType): void => {
    constellation.connections.forEach(connection => {
      const fromStar = constellation.stars.find(s => s.id === connection.from);
      const toStar = constellation.stars.find(s => s.id === connection.to);
      
      if (fromStar && toStar && fromStar.isConnected && toStar.isConnected) {
        // Check if this connection has been made
        const isConnected = checkConnectionExists(constellation, connection.from, connection.to);
        
        if (isConnected) {
          ctx.strokeStyle = '#ffcc00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fromStar.x, fromStar.y);
          ctx.lineTo(toStar.x, toStar.y);
          ctx.stroke();
          
          // Draw a subtle glow effect
          ctx.strokeStyle = 'rgba(255, 204, 0, 0.3)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(fromStar.x, fromStar.y);
          ctx.lineTo(toStar.x, toStar.y);
          ctx.stroke();
        }
      }
    });
  };
  
  // Draw game
  const drawGame = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw starry background
    drawStarryBackground(ctx, canvas.width, canvas.height);
    
    // Get current constellation
    const constellation = constellations[currentConstellation];
    if (!constellation) return;
    
    // Draw constellation name
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(constellation.name, canvas.width / 2, 30);
    
    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillText('Connect the stars in the correct order to form the constellation', canvas.width / 2, 60);
    
    // Draw connections
    drawConnections(ctx, constellation);
    
    // Draw stars
    drawStars(ctx, constellation);
    
    // Draw selection line if a star is selected
    if (selectedStar !== null) {
      const star = constellation.stars.find(s => s.id === selectedStar);
      if (star) {
        const mouseX = mousePosRef.current.x;
        const mouseY = mousePosRef.current.y;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }
    
    // Continue animation
    if (gameStarted && !gameOver) {
      requestAnimationFrame(drawGame);
    }
  };
  
  // Start game
  const startGame = (): void => {
    initConstellationsData();
    setCurrentConstellation(0);
    setScore(0);
    setTimeLeft(240);
    setGameOver(false);
    setGameStarted(true);
    setSelectedStar(null);
    
    // Start drawing
    requestAnimationFrame(drawGame);
  };
  
  // Canvas click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const constellation = constellations[currentConstellation];
    if (!constellation) return;
    
    // Check if clicking on a star
    const clickedStar = constellation.stars.find(star => {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      return Math.sqrt(dx * dx + dy * dy) <= 15; // 15px radius for click detection
    });
    
    if (clickedStar) {
      if (selectedStar === null) {
        // First star in the constellation is automatically connected
        if (constellation.stars.every(s => !s.isConnected)) {
          // Update this star as connected
          setConstellations(prev => {
            const newConstellations = [...prev];
            const constIndex = newConstellations.findIndex(c => c.name === constellation.name);
            const starIndex = newConstellations[constIndex].stars.findIndex(s => s.id === clickedStar.id);
            
            if (constIndex !== -1 && starIndex !== -1) {
              newConstellations[constIndex].stars[starIndex].isConnected = true;
            }
            
            return newConstellations;
          });
        }
        
        // Select this star
        setSelectedStar(clickedStar.id);
      } else if (selectedStar === clickedStar.id) {
        // Deselect the star if clicking the same one
        setSelectedStar(null);
      } else {
        // Check if this connection is valid
        const isValidConnection = constellation.connections.some(conn => 
          (conn.from === selectedStar && conn.to === clickedStar.id) || 
          (conn.from === clickedStar.id && conn.to === selectedStar)
        );
        
        if (isValidConnection) {
          // Update stars as connected
          setConstellations(prev => {
            const newConstellations = [...prev];
            const constIndex = newConstellations.findIndex(c => c.name === constellation.name);
            
            if (constIndex !== -1) {
              // Mark the clicked star as connected
              const starIndex = newConstellations[constIndex].stars.findIndex(s => s.id === clickedStar.id);
              if (starIndex !== -1) {
                newConstellations[constIndex].stars[starIndex].isConnected = true;
              }
              
              // Check if constellation is complete
              const allStarsConnected = newConstellations[constIndex].stars.every(s => s.isConnected);
              if (allStarsConnected) {
                newConstellations[constIndex].completed = true;
                
                // Award points
                setScore(prev => prev + 1000 + (timeLeft * 10));
                
                // Move to next constellation or end game
                if (currentConstellation < constellations.length - 1) {
                  setCurrentConstellation(currentConstellation + 1);
                } else {
                  // All constellations completed
                  setGameOver(true);
                  setGameStarted(false);
                }
              } else {
                // Award points for correct connection
                setScore(prev => prev + 100);
              }
            }
            
            return newConstellations;
          });
        }
        
        // Clear selection
        setSelectedStar(null);
      }
    }
  };
  
  // Mouse position tracking
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleMouseMove = (e: MouseEvent): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted]);
  
  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setGameOver(true);
          setGameStarted(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted]);
  
  // Initialize game
  useEffect(() => {
    initConstellationsData();
    // Auto-resize canvas
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Constellation Connect - Break Time Mini-games</title>
        <meta name="description" content="Connect stars to recreate famous constellations" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Constellation Connect</h1>
        
        <div className={styles.gameInfo}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.constellation}>
            Constellation: {constellations[currentConstellation]?.name || ''}
          </div>
          <div className={styles.timer}>
            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          className={styles.gameCanvas}
          width="800"
          height="600"
          onClick={handleCanvasClick}
        />
        
        {!gameStarted && (
          <div className={styles.overlay}>
            {gameOver ? (
              <>
                <h2>Game Over!</h2>
                <p>Your Score: {score}</p>
                <p>Constellations Completed: {constellations.filter(c => c.completed).length} of {constellations.length}</p>
                <button className={styles.button} onClick={startGame}>
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h2>Constellation Connect</h2>
                <p>Connect the stars in the right order to form constellations.</p>
                <p>Complete as many as you can before time runs out!</p>
                <button className={styles.button} onClick={startGame}>
                  Start Game
                </button>
              </>
            )}
          </div>
        )}
        
        <Link href="/" className={styles.backButton}>
          Back to Games
        </Link>
      </main>
    </div>
  );
};

export default ConstellationConnect;