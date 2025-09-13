export interface TimerTask {
  id: string;
  name: string;
  duration: number; // in seconds
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface TimerSettings {
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  gradientFrom: string;
  gradientTo: string;
  backgroundImage?: string;
  logoUrl?: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  title: string;
  subtitle: string;
  soundEnabled: boolean;
  flashEnabled: boolean;
}

export interface TimerState {
  currentTime: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isFlashing: boolean;
}