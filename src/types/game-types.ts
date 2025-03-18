// shared type

export interface GameProps {
    onGameEnd?: (score:number) => void;
}

// Asteroid Dodge types
export interface ShipType {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    color: string;
}

export interface AsteroidVertex {
    x: number;
    y: number;
}

export interface AsteroidType {
 x: number;
 y: number;
 size: number;
 speed: number;
 vertices: AsteroidVertex[];   
}

export interface StarType {
    x: number;
    y: number;
    radius: number;
    speed: number;
    brightness: number;
}

export interface AsteroidGameState {
    ship: ShipType;
    asteroids: AsteroidType[];
    stars: StarType[];
    animationId: number | null;
    lastAsteroidTime: number;
    lastStarTime: number;
}

// space memory types
export interface MemoryCardType {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface MemoryCardProps {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: (id: number) => void;
}

export interface MemoryGameState {
    id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
}

// Constellation Connect types
export interface StarPointType {
    id: number;
    x: number;
    y: number;
    isConnected: boolean;
}

export interface ConnectionType {
    from: number;
    to: number;
}

export interface ConstellationType {
    name: string;
    stars: StarPointType[];
    connections: ConnectionType[];
    completed: boolean;
}
