import React from 'react';

interface ProgressBarsProps {
  progress: number; // 0 to 1
  isFlashing: boolean;
  progressBarType: 'linear' | 'circular' | 'wave';
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({ progress, isFlashing, progressBarType }) => {
  const percentage = Math.max(0, Math.min(100, progress * 100));
  
  const renderLinearProgress = () => (
    <div className="w-full max-w-2xl mx-auto space-y-2">
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
  );

  const renderCircularProgress = () => (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-2">
      <h3 className="text-lg font-semibold text-white">Progress</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#circularGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
            className={`transition-all duration-1000 ease-out ${
              isFlashing ? 'animate-pulse' : ''
            }`}
          />
          <defs>
            <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );

  const renderWaveProgress = () => (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <h3 className="text-lg font-semibold text-white">Wave Progress</h3>
      <div className="relative h-16 bg-slate-800/50 rounded-2xl overflow-hidden backdrop-blur">
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out ${
            isFlashing ? 'animate-pulse' : ''
          }`}
          style={{ height: `${percentage}%` }}
        >
          {/* Wave animation */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div 
              className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10 V20 H0 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 20px',
                backgroundRepeat: 'repeat-x',
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-right text-sm text-slate-300">
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {progressBarType === 'linear' && renderLinearProgress()}
      {progressBarType === 'circular' && renderCircularProgress()}
      {progressBarType === 'wave' && renderWaveProgress()}
    </div>
  );
};