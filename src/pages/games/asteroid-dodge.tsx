// pages/games/asteroid-dodge.tsx
import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/AsteroidDodge.module.css';
import { AsteroidGameState, AsteroidType, StarType, ShipType } from '../../types/game-types';

const AsteroidDodge: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  
  // Game objects and animation references
  const gameRef = useRef<AsteroidGameState>({
    ship: null as unknown as ShipType,
    asteroids: [],
    stars: [],
    animationId: null,
    lastAsteroidTime: 0,
    lastStarTime: 0,
  });
  
  // Initialize game
  const initGame = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Create spaceship
    const ship: ShipType = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 40,
      height: 50,
      speed: 6,
      color: '#00ffff'
    };
    
    // Create initial stars
    const stars: StarType[] = Array(50).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 2 + 1,
      brightness: Math.random() * 0.5 + 0.5
    }));
    
    // Set game objects
    gameRef.current = {
      ...gameRef.current,
      ship,
      asteroids: [],
      stars,
      lastAsteroidTime: 0,
      lastStarTime: 0
    };
    
    // Reset game state
    setScore(0);
    setLives(3);
    setTimeLeft(300);
    setGameOver(false);
  };
  
  // Start game
  const startGame = (): void => {
    initGame();
    setGameStarted(true);
    
    // Start game loop
    gameLoop();
  };
  
  // Game loop
  const gameLoop = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const game = gameRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawStars(ctx, game.stars);
    
    // Move and draw ship
    drawShip(ctx, game.ship);
    
    // Generate new asteroid
    if (Date.now() - game.lastAsteroidTime > 1200) {
      generateAsteroid();
      game.lastAsteroidTime = Date.now();
    }
    
    // Move and draw asteroids
    moveAndDrawAsteroids(ctx, game.asteroids);
    
    // Check for collisions
    checkCollisions();
    
    // Request next frame
    game.animationId = requestAnimationFrame(gameLoop);
  };
  
  // Draw stars
  const drawStars = (ctx: CanvasRenderingContext2D, stars: StarType[]): void => {
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
      
      // Move star down
      star.y += star.speed;
      
      // Reset star position if it goes off screen
      if (star.y > (canvasRef.current?.height || 0)) {
        star.y = 0;
        star.x = Math.random() * (canvasRef.current?.width || 0);
      }
    });
  };
  
  // Draw ship
  const drawShip = (ctx: CanvasRenderingContext2D, ship: ShipType): void => {
    ctx.fillStyle = ship.color;
    
    // Draw ship body (triangle)
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - ship.height / 2);
    ctx.lineTo(ship.x - ship.width / 2, ship.y + ship.height / 2);
    ctx.lineTo(ship.x + ship.width / 2, ship.y + ship.height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw engine flames
    ctx.fillStyle = '#ff5722';
    ctx.beginPath();
    ctx.moveTo(ship.x - ship.width / 4, ship.y + ship.height / 2);
    ctx.lineTo(ship.x, ship.y + ship.height / 2 + 15);
    ctx.lineTo(ship.x + ship.width / 4, ship.y + ship.height / 2);
    ctx.closePath();
    ctx.fill();
  };
  
  // Generate asteroid
  const generateAsteroid = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const size = Math.random() * 30 + 20;
    
    const asteroid: AsteroidType = {
      x: Math.random() * (canvas.width - size),
      y: -size,
      size: size,
      speed: Math.random() * 2 + 2,
      vertices: []
    };
    
    // Generate random vertices for asteroid shape
    const verticesCount = Math.floor(Math.random() * 3) + 6;
    for (let i = 0; i < verticesCount; i++) {
      const angle = (i / verticesCount) * Math.PI * 2;
      const distance = size * (0.8 + Math.random() * 0.4);
      asteroid.vertices.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    }
    
    gameRef.current.asteroids.push(asteroid);
  };
  
  // Move and draw asteroids
  const moveAndDrawAsteroids = (ctx: CanvasRenderingContext2D, asteroids: AsteroidType[]): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];
      
      // Move asteroid
      asteroid.y += asteroid.speed;
      
      // Remove asteroid if it goes off screen
      if (asteroid.y > canvas.height + asteroid.size) {
        asteroids.splice(i, 1);
        setScore(prev => prev + 10); // Award points for successful dodge
        continue;
      }
      
      // Draw asteroid
      ctx.fillStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(
        asteroid.x + asteroid.vertices[0].x,
        asteroid.y + asteroid.vertices[0].y
      );
      
      for (let j = 1; j < asteroid.vertices.length; j++) {
        ctx.lineTo(
          asteroid.x + asteroid.vertices[j].x,
          asteroid.y + asteroid.vertices[j].y
        );
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Add a subtle stroke
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add crater details
      const craters = Math.floor(Math.random() * 3) + 2;
      for (let k = 0; k < craters; k++) {
        const craterX = asteroid.x - asteroid.size / 3 + Math.random() * asteroid.size;
        const craterY = asteroid.y - asteroid.size / 3 + Math.random() * asteroid.size;
        const craterSize = asteroid.size / 6 + Math.random() * (asteroid.size / 10);
        
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };
  
  // Check for collisions
  const checkCollisions = (): void => {
    const ship = gameRef.current.ship;
    const asteroids = gameRef.current.asteroids;
    
    // Check collision with each asteroid
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];
      
      // Simple circle collision test
      const dx = ship.x - asteroid.x;
      const dy = ship.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (asteroid.size / 2 + ship.width / 3)) {
        // Collision detected
        asteroids.splice(i, 1);
        handleCollision();
        break;
      }
    }
  };
  
  // Handle collision
  const handleCollision = (): void => {
    setLives(prev => {
      const newLives = prev - 1;
      
      if (newLives <= 0) {
        endGame();
      }
      
      return newLives;
    });
  };
  
  // End game
  const endGame = (): void => {
    if (gameRef.current.animationId !== null) {
      cancelAnimationFrame(gameRef.current.animationId);
    }
    setGameOver(true);
    setGameStarted(false);
  };
  
  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e: KeyboardEvent): void => {
      const ship = gameRef.current.ship;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          ship.x = Math.max(ship.width / 2, ship.x - ship.speed);
          break;
        case 'ArrowRight':
          ship.x = Math.min(canvas.width - ship.width / 2, ship.x + ship.speed);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);
  
  // Handle timer
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [gameStarted]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameRef.current.animationId !== null) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Asteroid Dodge - Break Time Mini-games</title>
        <meta name="description" content="Dodge asteroids in this arcade-style game" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Asteroid Dodge</h1>
        
        <div className={styles.gameInfo}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.lives}>
            Lives: {Array(lives).fill('❤️').join(' ')}
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
        />
        
        {!gameStarted && (
          <div className={styles.overlay}>
            {gameOver ? (
              <>
                <h2>Game Over!</h2>
                <p>Your Score: {score}</p>
                <button className={styles.button} onClick={startGame}>
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h2>Asteroid Dodge</h2>
                <p>Navigate through an asteroid field using the arrow keys.</p>
                <p>Avoid collisions and survive for 5 minutes!</p>
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

export default AsteroidDodge;