import React from 'react';
import { FlipCard } from './FlipCard';
import { ProgressBars } from './ProgressBars';
import { TimerState } from '../types/timer';

interface TimerProps {
  timerState: TimerState;
  title: string;
  subtitle: string;
  progressBarType: 'linear' | 'circular' | 'wave';
}

export const Timer: React.FC<TimerProps> = ({ timerState, title, subtitle, progressBarType }) => {
  const { currentTime, totalTime, isFlashing } = timerState;
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(currentTime);
  const progress = totalTime > 0 ? (totalTime - currentTime) / totalTime : 0;

  return (
    <div className={`text-center space-y-8 transition-all duration-300 ${
      isFlashing ? 'animate-pulse' : ''
    }`}>
      {/* Title */}
      {title && (
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
          {title}
        </h1>
      )}

      {/* Flip Cards */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6">
        <FlipCard value={time.hours} label="Hours" />
        <div className="text-white text-4xl sm:text-5xl md:text-6xl font-bold animate-pulse">:</div>
        <FlipCard value={time.minutes} label="Minutes" />
        <div className="text-white text-4xl sm:text-5xl md:text-6xl font-bold animate-pulse">:</div>
        <FlipCard value={time.seconds} label="Seconds" />
      </div>

      {/* Progress Bars */}
      <div className="mt-12">
        <ProgressBars progress={progress} isFlashing={isFlashing} progressBarType={progressBarType} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg sm:text-xl text-slate-300 mt-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};