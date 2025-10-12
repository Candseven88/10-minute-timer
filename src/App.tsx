import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { useTimer } from './hooks/useTimer';
import { TimerSettings, Timer as TimerType } from './types/timer';
import { Clock, Settings as SettingsIcon, ChevronUp, ChevronDown, Timer as TimerIcon, Play, Pause, RotateCcw, Info } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<TimerSettings>({
    backgroundColor: '#1e293b',
    backgroundType: 'gradient',
    gradientFrom: '#8B5CF6',
    gradientTo: '#EC4899',
    logoPosition: 'top-left',
    title: '10 Minute Timer',
    subtitle: 'Focus on what matters most',
    soundEnabled: true,
    flashEnabled: true,
  });

  const [timer, setTimer] = useState<TimerType>({
    name: 'Focus Session',
    duration: 600, // 10 minutes default
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [showQuickTimers, setShowQuickTimers] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleTimerComplete = () => {
    console.log('Timer completed!');
  };

  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
    setTimerDuration,
  } = useTimer(
    timer,
    settings.soundEnabled,
    settings.flashEnabled,
    handleTimerComplete
  );

  // Quick timer presets
  const quickTimers = [
    { name: '1 Minute Timer', duration: 60, description: 'Quick tasks and breaks' },
    { name: '2 Minute Timer', duration: 120, description: 'Short focus sessions' },
    { name: '3 Minute Timer', duration: 180, description: 'Perfect for debate time' },
    { name: '5 Minute Timer', duration: 300, description: 'Five minute timer for quick tasks' },
    { name: '7 Minute Timer', duration: 420, description: 'Short workout sessions' },
    { name: '8 Minute Timer', duration: 480, description: 'Reading and study breaks' },
    { name: '10 Minute Timer', duration: 600, description: 'Classic timer 10 minutes for focus' },
    { name: '12 Minute Timer', duration: 720, description: 'Extended focus periods' },
    { name: '14 Minute Timer', duration: 840, description: 'Study session timer' },
    { name: '15 Minute Timer', duration: 900, description: 'Timer 15 minutes for productivity' },
    { name: '18 Minute Timer', duration: 1080, description: 'Presentation practice' },
    { name: '20 Minute Timer', duration: 1200, description: 'Timer 20 minutes for deep work' },
    { name: '25 Minute Timer', duration: 1500, description: 'Pomodoro technique sessions' },
    { name: '30 Minute Timer', duration: 1800, description: 'Half-hour focus blocks' },
    { name: '35 Minute Timer', duration: 2100, description: 'Extended work sessions' },
    { name: '40 Minute Timer', duration: 2400, description: 'Detailed task completion' },
    { name: '50 Minute Timer', duration: 3000, description: 'Long focus sessions' },
    { name: '60 Minute Timer', duration: 3600, description: 'One hour deep work' },
  ];

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'solid':
        return { backgroundColor: settings.backgroundColor };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`,
        };
      case 'image':
        return settings.backgroundImage
          ? {
              backgroundImage: `url(${settings.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: settings.backgroundColor };
      default:
        return { backgroundColor: settings.backgroundColor };
    }
  };

  const getLogoPositionClasses = () => {
    switch (settings.logoPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 left-4';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerSettingsUpdate = (name: string, hours: number, minutes: number, seconds: number) => {
    const newDuration = hours * 3600 + minutes * 60 + seconds;
    const newTimer = { name, duration: newDuration };
    setTimer(newTimer);
    setTimerDuration(newDuration);
    setShowTimerSettings(false);
  };

  const handleQuickTimerSelect = (quickTimer: typeof quickTimers[0]) => {
    const newTimer = { name: quickTimer.name, duration: quickTimer.duration };
    setTimer(newTimer);
    setTimerDuration(quickTimer.duration);
    setShowQuickTimers(false);
  };

  // Full screen flash effect
  const flashOverlay = timerState.isFlashing && (
    <div className="fixed inset-0 bg-red-500/30 animate-pulse pointer-events-none z-40" />
  );

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        timerState.isFlashing ? 'animate-pulse' : ''
      }`}
      style={getBackgroundStyle()}
    >
      {flashOverlay}

      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      {/* About Button - Top Right */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setShowAbout(true)}
          className="bg-white/10 backdrop-blur-md rounded-full p-3 text-white/90 hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
          title="About this timer"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Logo */}
      {settings.logoUrl && (
        <div className={`absolute ${getLogoPositionClasses()} z-30`}>
          <img
            src={settings.logoUrl}
            alt="10 Minute Timer Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
          />
        </div>
      )}

      {/* SEO Content - Hidden but accessible */}
      <div className="sr-only">
        <h1>10 Minute Timer - Free Online Countdown Timer</h1>
        <p>
          Set the timer to 1 minute, 5 minutes, 10 minutes, 15 minutes, 20 minutes, 30 minutes or any duration you need. 
          Perfect for focus sessions, debate time, quizizz time limit, study periods, and productivity tasks. 
          Our timer features beautiful animations, sound alerts, and customizable backgrounds.
        </p>
      </div>

      {/* Quick Access Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={() => setShowQuickTimers(!showQuickTimers)}
          className="bg-white/10 backdrop-blur-md rounded-full px-6 py-2 text-white/90 hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <TimerIcon size={16} />
            <span className="text-sm font-medium">Quick Timer Selection</span>
            <ChevronDown size={14} className={`transform transition-transform ${showQuickTimers ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Quick Timers Dropdown */}
        {showQuickTimers && (
          <div className="absolute top-full mt-2 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 w-96 border border-slate-700/50 shadow-2xl">
            <h3 className="text-white font-semibold mb-3 text-center">Choose Your Timer Duration</h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto mb-4">
              {quickTimers.map((quickTimer) => (
                <button
                  key={quickTimer.duration}
                  onClick={() => handleQuickTimerSelect(quickTimer)}
                  className="text-left p-3 bg-slate-700/50 hover:bg-slate-600/70 rounded-lg transition-colors border border-slate-600/50"
                >
                  <div className="text-white font-medium text-sm">{quickTimer.name}</div>
                  <div className="text-slate-300 text-xs mt-1">{quickTimer.description}</div>
                </button>
              ))}
            </div>
            
            {/* About Link in Dropdown */}
            <div className="border-t border-slate-600/50 pt-3">
              <button
                onClick={() => {
                  setShowAbout(true);
                  setShowQuickTimers(false);
                }}
                className="w-full text-center p-2 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg transition-colors border border-slate-600/30"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Info size={14} />
                  <span className="text-white text-sm">About Timer Features</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
        <Timer
          timerState={timerState}
          title={settings.title}
          subtitle={settings.subtitle}
        />

        <Controls
          isRunning={timerState.isRunning}
          isPaused={timerState.isPaused}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onAddTime={addTime}
          onOpenSettings={() => setShowSettings(true)}
          timer={timer}
          onOpenTimerSettings={() => setShowTimerSettings(true)}
          formatTime={formatTime}
        />
      </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowAbout(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <About onClose={() => setShowAbout(false)} />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          settings={settings}
          onSettingsUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Timer Settings Modal */}
      {showTimerSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowTimerSettings(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TimerSettingsModal
              timer={timer}
              onUpdate={handleTimerSettingsUpdate}
              onClose={() => setShowTimerSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Timer Settings Modal Component
const TimerSettingsModal: React.FC<{
  timer: TimerType;
  onUpdate: (name: string, hours: number, minutes: number, seconds: number) => void;
  onClose: () => void;
}> = ({ timer, onUpdate, onClose }) => {
  const [name, setName] = useState(timer.name);
  const [hours, setHours] = useState(Math.floor(timer.duration / 3600));
  const [minutes, setMinutes] = useState(Math.floor((timer.duration % 3600) / 60));
  const [seconds, setSeconds] = useState(timer.duration % 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours >= 0 && minutes >= 0 && seconds >= 0) {
      onUpdate(name, hours, minutes, Math.max(0, Math.min(59, seconds)));
    }
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Clock size={24} />
            <span>Timer Settings</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Timer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter timer name"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hours
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
  );
};

export default App;