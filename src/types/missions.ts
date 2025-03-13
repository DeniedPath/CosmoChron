
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement' | 'special';
  progress: number;
  requiredProgress: number;
  unit: string;
  completed: boolean;
  claimed: boolean;
  rewardPoints: number;
  createdAt: string;
  completedAt?: string;
}
