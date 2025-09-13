import React from 'react';
import { Play, Pause, RotateCcw, Plus, Settings } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onAddTime: (seconds: number) => void;
  onOpenSettings: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onAddTime,
  onOpenSettings,
}) => {
  const timeButtons = [
    { label: '+1min', seconds: 60 },
    { label: '+5min', seconds: 300 },
    { label: '+10min', seconds: 600 },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl transition-all duration-200 hover:scale-105"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Time Adjustment Buttons */}
      {(isRunning || isPaused) && (
        <div className="flex items-center space-x-3">
          {timeButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => onAddTime(btn.seconds)}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600 transition-all duration-200 hover:scale-105 backdrop-blur"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">{btn.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};