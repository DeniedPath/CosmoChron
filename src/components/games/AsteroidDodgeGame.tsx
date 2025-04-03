"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Asteroid {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AsteroidDodgeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Game state refs to avoid dependency issues in animation loop
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  
  // Game objects
  const [spaceship, setSpaceship] = useState<Spaceship>({
    x: 0,
    y: 0,
    width: 30,
    height: 40
  });
  const asteroidsRef = useRef<Asteroid[]>([]);
  const animationFrameRef = useRef<number>(0);
  
  // Initialize game
  useEffect(() => {
    // Load high score from localStorage
    try {
      const savedHighScore = localStorage.getItem('asteroidDodgeHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
      }
    } catch (e) {
      console.error("Error loading high score:", e);
    }
    
    // Set up canvas and initial spaceship position
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas dimensions
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // Initialize spaceship position
        setSpaceship(prev => ({
          ...prev,
          x: canvas.width / 2 - 15,
          y: canvas.height - 60
        }));
      }
    }
    
    // Clean up animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Update refs when state changes
  useEffect(() => {
    gameStartedRef.current = gameStarted;
    gameOverRef.current = gameOver;
    scoreRef.current = score;
  }, [gameStarted, gameOver, score]);
  
  // Handle mouse/touch movement
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      // Update spaceship position
      setSpaceship(prev => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, x - prev.width / 2))
      }));
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      
      // Update spaceship position
      setSpaceship(prev => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, x - prev.width / 2))
      }));
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStarted, gameOver, spaceship.height, spaceship.width, spaceship.x, spaceship.y]);
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastAsteroidTime = Date.now();
    const asteroidInterval = 1000; // Time between asteroid spawns in ms
    
    const gameLoop = () => {
      if (!gameStartedRef.current || gameOverRef.current) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw space background
      ctx.fillStyle = '#0a0e1f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Spawn new asteroids
      const currentTime = Date.now();
      if (currentTime - lastAsteroidTime > asteroidInterval) {
        const newAsteroid: Asteroid = {
          x: Math.random() * (canvas.width - 20),
          y: -20,
          size: 10 + Math.random() * 20,
          speed: 2 + Math.random() * 3
        };
        
        asteroidsRef.current.push(newAsteroid);
        lastAsteroidTime = currentTime;
      }
      
      // Update and draw asteroids
      const remainingAsteroids: Asteroid[] = [];
      
      for (const asteroid of asteroidsRef.current) {
        // Update position
        asteroid.y += asteroid.speed;
        
        // Check if asteroid is still on screen
        if (asteroid.y < canvas.height + asteroid.size) {
          // Draw asteroid
          ctx.fillStyle = '#777';
          ctx.beginPath();
          ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Check collision with spaceship
          if (
            asteroid.x + asteroid.size > spaceship.x &&
            asteroid.x - asteroid.size < spaceship.x + spaceship.width &&
            asteroid.y + asteroid.size > spaceship.y &&
            asteroid.y - asteroid.size < spaceship.y + spaceship.height
          ) {
            // Collision detected
            gameOverRef.current = true;
            setGameOver(true);
            
            // Update high score if needed
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              try {
                localStorage.setItem('asteroidDodgeHighScore', scoreRef.current.toString());
              } catch (e) {
                console.error("Error saving high score:", e);
              }
            }
            
            return;
          }
          
          remainingAsteroids.push(asteroid);
        } else {
          // Asteroid passed, increment score
          setScore(prev => prev + 1);
        }
      }
      
      asteroidsRef.current = remainingAsteroids;
      
      // Draw spaceship
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y);
      ctx.lineTo(spaceship.x, spaceship.y + spaceship.height);
      ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);
      
      // Continue game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, highScore, spaceship.height, spaceship.width, spaceship.x, spaceship.y]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    asteroidsRef.current = [];
  };
  
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    asteroidsRef.current = [];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-cosmic-white/70 hover:text-cosmic-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="text-cosmic-white">High Score: {highScore}</div>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cosmic-white">
            <Rocket className="h-5 w-5" />
            Asteroid Dodge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className="w-full h-[400px] bg-cosmic-dark rounded-lg"
            />
            
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-cosmic-dark/80 rounded-lg">
                <div className="text-2xl text-cosmic-white mb-4">Asteroid Dodge</div>
                <p className="text-cosmic-white/70 mb-6 text-center max-w-md">
                  Navigate through space avoiding asteroids. Move your spaceship with your mouse or touch.
                </p>
                <Button 
                  onClick={startGame}
                  className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
                >
                  Start Game
                </Button>
              </div>
            )}
            
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-cosmic-dark/80 rounded-lg">
                <div className="text-2xl text-cosmic-white mb-2">Game Over</div>
                <div className="text-xl text-cosmic-white mb-4">Score: {score}</div>
                <Button 
                  onClick={restartGame}
                  className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-cosmic-white/70 p-4 bg-cosmic-blue/10 rounded-lg">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Game Instructions
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Move your spaceship with your mouse or touch</li>
          <li>Avoid the incoming asteroids</li>
          <li>Each asteroid you avoid gives you 1 point</li>
          <li>Try to beat your high score!</li>
        </ul>
      </div>
    </div>
  );
};

export default AsteroidDodgeGame;
