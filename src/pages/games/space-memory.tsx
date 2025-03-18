// pages/games/space-memory.tsx
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/SpaceMemory.module.css';
import { MemoryCardProps, MemoryCardType } from '../../types/game-types';

// Card component
const MemoryCard = ({ id, icon, isFlipped, isMatched, onClick }: MemoryCardProps) => {
  return (
    <div 
      className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${isMatched ? styles.matched : ''}`}
      onClick={() => !isFlipped && !isMatched && onClick(id)}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.cardSymbol}>?</div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.cardSymbol}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

const SpaceMemory: NextPage = () => {
  // Game state
  const [cards, setCards] = useState<MemoryCardType[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes in seconds
  const [score, setScore] = useState<number>(0);
  
  // Space-themed icons for the cards
  const icons = [
    '🚀', '🪐', '🌎', '🌙', '☄️', '⭐', '👾', '🛸'
  ];
  
  // Initialize game
  const initGame = (): void => {
    // Create card pairs and shuffle
    const cardPairs = [...icons, ...icons];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setTimeLeft(180);
    setGameOver(false);
  };
  
  // Start game
  const startGame = (): void => {
    initGame();
    setGameStarted(true);
  };
  
  // Handle card click
  const handleCardClick = (id: number): void => {
    // Don't allow more than 2 cards to be flipped at once
    if (flippedIndexes.length === 2) return;
    
    // Update card to flipped state
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedIndexes(prev => [...prev, id]);
  };
  
  // Check for matches
  useEffect(() => {
    // Only check when we have 2 flipped cards
    if (flippedIndexes.length !== 2) return;
    
    // Increment move counter
    setMoves(prev => prev + 1);
    
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards.find(card => card.id === firstIndex);
    const secondCard = cards.find(card => card.id === secondIndex);
    
    if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
      // It's a match!
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === firstIndex || card.id === secondIndex
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      // Award points - more points for earlier matches
      const newPoints = Math.max(100, 500 - (moves * 10));
      setScore(prev => prev + newPoints);
      
      // Increment matched pairs
      setMatchedPairs(prev => prev + 1);
      
      // Clear flipped indexes
      setFlippedIndexes([]);
    } else {
      // Not a match, flip back after delay
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstIndex || card.id === secondIndex
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedIndexes([]);
      }, 1000);
    }
  }, [flippedIndexes, cards, moves]);
  
  // Check for game completion
  useEffect(() => {
    if (matchedPairs === icons.length && matchedPairs > 0) {
      // All pairs found - game won!
      setGameOver(true);
      setGameStarted(false);
    }
  }, [matchedPairs, icons.length]);
  
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
  
  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Space Memory - Break Time Mini-games</title>
        <meta name="description" content="Match pairs of cosmic objects in this memory challenge" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Space Memory</h1>
        
        <div className={styles.gameInfo}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.moves}>Moves: {moves}</div>
          <div className={styles.timer}>
            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        {gameStarted ? (
          <div className={styles.gameBoard}>
            {cards.map(card => (
              <MemoryCard
                key={card.id}
                id={card.id}
                icon={card.icon}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className={styles.overlay}>
            {gameOver ? (
              <>
                <h2>{matchedPairs === icons.length ? 'Congratulations!' : 'Game Over!'}</h2>
                <p>Your Score: {score}</p>
                <p>Matches Found: {matchedPairs} of {icons.length}</p>
                <button className={styles.button} onClick={startGame}>
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h2>Space Memory</h2>
                <p>Match pairs of cosmic objects in this memory challenge.</p>
                <p>Find all pairs before time runs out!</p>
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

export default SpaceMemory;