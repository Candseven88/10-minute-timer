import React from 'react';

interface ProgressBarsProps {
  progress: number; // 0 to 1
  isFlashing: boolean;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({ progress, isFlashing }) => {
  const percentage = Math.max(0, Math.min(100, progress * 100));
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Horizontal Progress Bar */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Progress</h3>
        <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur">
          <div 
            className={`absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out ${
              isFlashing ? 'animate-pulse' : ''
            }`}
            style={{ width: `${percentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="text-right text-sm text-slate-300">
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};