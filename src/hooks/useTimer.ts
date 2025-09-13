import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerState, Timer } from '../types/timer';
import { audioManager } from '../utils/audio';

export const useTimer = (
  timer: Timer,
  soundEnabled: boolean,
  flashEnabled: boolean,
  onTimerComplete: () => void
) => {
  const [timerState, setTimerState] = useState<TimerState>({
    currentTime: timer.duration,
    totalTime: timer.duration,
    isRunning: false,
    isPaused: false,
    isFlashing: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        // Timer completed - clear interval immediately
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        if (soundEnabled) {
          audioManager.playCompletionSound();
        }
        
        onTimerComplete();
        
        return {
          ...prev,
          currentTime: 0,
          isRunning: false,
          isFlashing: false,
        };
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
  }, [soundEnabled, onTimerComplete, startFlashing]);

  const startTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentTime: prev.currentTime || timer.duration,
      totalTime: timer.duration,
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(tick, 1000);
  }, [timer.duration, tick]);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false, isPaused: true }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      currentTime: timer.duration,
      totalTime: timer.duration,
      isRunning: false,
      isPaused: false,
      isFlashing: false,
    });
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer.duration]);

  const addTime = useCallback((seconds: number) => {
    setTimerState(prev => ({
      ...prev,
      currentTime: prev.currentTime + seconds,
      totalTime: prev.totalTime + seconds,
    }));
  }, []);

  const setTimerDuration = useCallback((duration: number) => {
    setTimerState(prev => ({
      ...prev,
      currentTime: duration,
      totalTime: duration,
    }));
  }, []);

  // Initialize timer when timer object changes
  useEffect(() => {
    setTimerState(prev => ({
      ...prev,
      currentTime: timer.duration,
      totalTime: timer.duration,
    }));
  }, [timer.duration]);

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
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
    setTimerDuration,
  };
};