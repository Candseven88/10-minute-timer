import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerState, TimerTask } from '../types/timer';
import { audioManager } from '../utils/audio';

export const useTimer = (
  tasks: TimerTask[],
  soundEnabled: boolean,
  flashEnabled: boolean,
  onTaskComplete: (taskId: string) => void,
  onAllTasksComplete: () => void
) => {
  const [timerState, setTimerState] = useState<TimerState>({
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    isPaused: false,
    isFlashing: false,
  });

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTask = tasks[currentTaskIndex];

  const startFlashing = useCallback(() => {
    if (!flashEnabled) return;
    
    setTimerState(prev => ({ ...prev, isFlashing: true }));
    
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    
    flashTimeoutRef.current = setTimeout(() => {
      setTimerState(prev => ({ ...prev, isFlashing: false }));
    }, 10000);
  }, [flashEnabled]);

  const tick = useCallback(() => {
    setTimerState(prev => {
      const newTime = prev.currentTime - 1;
      
      if (newTime <= 0) {
        // Task completed
        if (soundEnabled) {
          audioManager.playCompletionSound();
        }
        
        onTaskComplete(currentTask?.id || '');
        
        // Move to next task
        const nextTaskIndex = currentTaskIndex + 1;
        if (nextTaskIndex < tasks.length) {
          setCurrentTaskIndex(nextTaskIndex);
          return {
            ...prev,
            currentTime: tasks[nextTaskIndex].duration,
            totalTime: tasks[nextTaskIndex].duration,
            isFlashing: false,
          };
        } else {
          // All tasks completed
          onAllTasksComplete();
          return {
            ...prev,
            currentTime: 0,
            isRunning: false,
            isFlashing: false,
          };
        }
      }
      
      // Flash warning in last 10 seconds
      if (newTime === 10) {
        startFlashing();
      }
      
      // Tick sound for last 10 seconds
      if (newTime <= 10 && soundEnabled) {
        audioManager.playTickSound();
      }
      
      return { ...prev, currentTime: newTime };
    });
  }, [currentTaskIndex, tasks, soundEnabled, onTaskComplete, onAllTasksComplete, currentTask?.id, startFlashing]);

  const startTimer = useCallback(() => {
    if (!currentTask) return;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentTime: prev.currentTime || currentTask.duration,
      totalTime: currentTask.duration,
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(tick, 1000);
  }, [currentTask, tick]);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false, isPaused: true }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      currentTime: currentTask?.duration || 0,
      totalTime: currentTask?.duration || 0,
      isRunning: false,
      isPaused: false,
      isFlashing: false,
    });
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [currentTask]);

  const addTime = useCallback((seconds: number) => {
    setTimerState(prev => ({
      ...prev,
      currentTime: prev.currentTime + seconds,
      totalTime: prev.totalTime + seconds,
    }));
  }, []);

  // Initialize timer when tasks change
  useEffect(() => {
    if (tasks.length > 0 && currentTaskIndex < tasks.length) {
      const task = tasks[currentTaskIndex];
      setTimerState(prev => ({
        ...prev,
        currentTime: task.duration,
        totalTime: task.duration,
      }));
    }
  }, [tasks, currentTaskIndex]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  return {
    timerState,
    currentTask,
    currentTaskIndex,
    totalTasks: tasks.length,
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
  };
};