import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Settings, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { Timer } from '../types/timer';

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onAddTime: (seconds: number) => void;
  onOpenSettings: () => void;
  timer: Timer;
  onOpenTimerSettings: () => void;
  formatTime: (seconds: number) => string;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onAddTime,
  onOpenSettings,
  timer,
  onOpenTimerSettings,
  formatTime,
}) => {
  const [showFocusPanel, setShowFocusPanel] = useState(false);
  const [showQuickAdjust, setShowQuickAdjust] = useState(false);

  const timeButtons = [
    { label: '+10s', seconds: 10 },
    { label: '+30s', seconds: 30 },
    { label: '+1m', seconds: 60 },
    { label: '+5m', seconds: 300 },
    { label: '+10m', seconds: 600 },
    { label: '+15m', seconds: 900 },
  ];

  const negativeTimeButtons = [
    { label: '-10s', seconds: -10 },
    { label: '-30s', seconds: -30 },
    { label: '-1m', seconds: -60 },
    { label: '-5m', seconds: -300 },
    { label: '-10m', seconds: -600 },
    { label: '-15m', seconds: -900 },
  ];

  return (
    <div className="relative">
      {/* Focus Session Panel */}
      {showFocusPanel && (
        <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-6 w-80 border border-slate-700/50 shadow-2xl z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Focus Session</h3>
            <button
              onClick={() => setShowFocusPanel(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-slate-300 text-sm mb-1">Current Timer</div>
              <div className="text-white font-medium">{timer.name}</div>
              <div className="text-slate-400 text-sm mt-1">{formatTime(timer.duration)}</div>
            </div>
            
            <button
              onClick={() => {
                onOpenTimerSettings();
                setShowFocusPanel(false);
              }}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Clock size={16} />
              <span>Edit Timer</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Adjust Panel */}
      {showQuickAdjust && isRunning && (
        <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-6 w-80 border border-slate-700/50 shadow-2xl z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Quick Adjust</h3>
            <button
              onClick={() => setShowQuickAdjust(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-slate-300 text-sm mb-2">Add Time</div>
              <div className="grid grid-cols-3 gap-2">
                {timeButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => onAddTime(btn.seconds)}
                    className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg transition-colors text-sm"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-slate-300 text-sm mb-2">Remove Time</div>
              <div className="grid grid-cols-3 gap-2">
                {negativeTimeButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => onAddTime(btn.seconds)}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-600/30">
              <div className="text-slate-400 text-xs">Current Timer: {formatTime(timer.duration)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Focus Session Button */}
        <button
          onClick={() => setShowFocusPanel(!showFocusPanel)}
          className="p-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-full transition-all duration-200 hover:scale-105 border border-slate-600/50"
          title="Focus Session"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={isRunning ? onPause : onStart}
          className="p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-full transition-all duration-200 hover:scale-105 border border-slate-600/50"
          title="Reset Timer"
        >
          <RotateCcw size={20} />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-full transition-all duration-200 hover:scale-105 border border-slate-600/50"
          title="Visual Settings"
        >
          <Settings size={20} />
        </button>

        {/* Quick Adjust Button - Only show when timer is running */}
        {isRunning && (
          <button
            onClick={() => setShowQuickAdjust(!showQuickAdjust)}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-full transition-all duration-200 hover:scale-105 border border-slate-600/50"
            title="Quick Adjust"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};