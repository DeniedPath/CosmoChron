import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProductivityScore as ProductivityScoreType } from '@/utils/analytics/dataProcessing';
import { Award, TrendingUp, Clock } from 'lucide-react';

interface ProductivityScoreProps {
  score: ProductivityScoreType;
}

const ProductivityScore: React.FC<ProductivityScoreProps> = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score.score >= 90) return 'text-green-400';
    if (score.score >= 75) return 'text-blue-400';
    if (score.score >= 60) return 'text-purple-400';
    if (score.score >= 40) return 'text-yellow-400';
    if (score.score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };
  
  // Determine progress color based on score
  const getProgressColor = () => {
    if (score.score >= 90) return 'bg-green-400';
    if (score.score >= 75) return 'bg-blue-400';
    if (score.score >= 60) return 'bg-purple-400';
    if (score.score >= 40) return 'bg-yellow-400';
    if (score.score >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };
  
  return (
    <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-cosmic-highlight" />
              Productivity Score
            </CardTitle>
            <CardDescription className="text-cosmic-white/70">
              Your cosmic productivity rating
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {score.score}
            </div>
            <div className="text-cosmic-white/70 text-sm">out of 100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-cosmic-white/70 text-sm">Score Level</span>
              <span className="text-cosmic-white font-medium">{score.level}</span>
            </div>
            <Progress value={score.score} className="h-2 bg-cosmic-blue/30">
              <div className={`h-full ${getProgressColor()}`} style={{ width: `${score.score}%` }} />
            </Progress>
          </div>
          
          <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
            <div className="flex">
              <TrendingUp className="h-5 w-5 mr-2 text-cosmic-highlight/80" />
              <p className="text-cosmic-white/90 text-sm">{score.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cosmic-blue/10 p-2 rounded-md flex flex-col items-center">
              <Clock className="h-4 w-4 mb-1 text-cosmic-highlight/80" />
              <span className="text-xs text-cosmic-white/70">Consistency</span>
              <span className="text-sm text-cosmic-white font-medium">
                {score.score >= 75 ? 'Excellent' : score.score >= 50 ? 'Good' : 'Needs Work'}
              </span>
            </div>
            <div className="bg-cosmic-blue/10 p-2 rounded-md flex flex-col items-center">
              <TrendingUp className="h-4 w-4 mb-1 text-cosmic-highlight/80" />
              <span className="text-xs text-cosmic-white/70">Progress</span>
              <span className="text-sm text-cosmic-white font-medium">
                {score.score >= 60 ? 'On Track' : 'Off Track'}
              </span>
            </div>
            <div className="bg-cosmic-blue/10 p-2 rounded-md flex flex-col items-center">
              <Award className="h-4 w-4 mb-1 text-cosmic-highlight/80" />
              <span className="text-xs text-cosmic-white/70">Rank</span>
              <span className="text-sm text-cosmic-white font-medium">
                {score.level}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityScore;
