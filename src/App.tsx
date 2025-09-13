import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { Settings } from './components/Settings';
import { TaskManager } from './components/TaskManager';
import { useTimer } from './hooks/useTimer';
import { TimerSettings, TimerTask } from './types/timer';
import { List } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<TimerSettings>({
    backgroundColor: '#1e293b',
    backgroundType: 'gradient',
    gradientFrom: '#4F46E5',
    gradientTo: '#06B6D4',
    logoPosition: 'top-left',
    title: '10 Minute Timer',
    subtitle: 'Focus on what matters most',
    soundEnabled: true,
    flashEnabled: true,
  });

  const [tasks, setTasks] = useState<TimerTask[]>([
    { id: '1', name: '1 Minute', duration: 60 },
    { id: '2', name: '5 Minutes', duration: 300 },
    { id: '3', name: '10 Minutes', duration: 600 },
    { id: '4', name: '15 Minutes', duration: 900 },
    { id: '5', name: '20 Minutes', duration: 1200 },
    { id: '6', name: '30 Minutes', duration: 1800 },
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const handleTaskComplete = (taskId: string) => {
    console.log(`Task ${taskId} completed`);
  };

  const handleAllTasksComplete = () => {
    console.log('All tasks completed!');
  };

  const handleTimeSet = (totalSeconds: number) => {
    // Update the current task duration
    if (tasks.length > 0) {
      const updatedTasks = [...tasks];
      updatedTasks[currentTaskIndex] = {
        ...updatedTasks[currentTaskIndex],
        duration: totalSeconds,
      };
      setTasks(updatedTasks);
    }
  };

  const {
    timerState,
    currentTask,
    currentTaskIndex,
    totalTasks,
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
  } = useTimer(
    tasks,
    settings.soundEnabled,
    settings.flashEnabled,
    handleTaskComplete,
    handleAllTasksComplete
  );

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

      {/* Logo */}
      {settings.logoUrl && (
        <div className={`absolute ${getLogoPositionClasses()} z-30`}>
          <img
            src={settings.logoUrl}
            alt="Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
          />
        </div>
      )}

      {/* Task Manager Button */}
      <button
        onClick={() => setShowTaskManager(true)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-lg backdrop-blur transition-all duration-200 hover:scale-105 z-30"
      >
        <List size={20} />
        <span className="text-sm font-medium">
          Task {currentTaskIndex + 1} of {totalTasks}
          {currentTask && `: ${currentTask.name}`}
        </span>
      </button>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 space-y-12">
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
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          settings={settings}
          onSettingsUpdate={setSettings}
          onClose={() => setShowSettings(false)}
          onTimeSet={handleTimeSet}
        />
      )}

      {/* Task Manager Modal */}
      {showTaskManager && (
        <TaskManager
          tasks={tasks}
          currentTaskIndex={currentTaskIndex}
          onTasksUpdate={setTasks}
          onClose={() => setShowTaskManager(false)}
        />
      )}
    </div>
  );
}

export default App;