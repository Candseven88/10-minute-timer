export class AudioManager {
  private audioContext: AudioContext | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBeep(frequency: number = 800, duration: number = 200, volume: number = 0.1) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  playCompletionSound() {
    // Play a series of ascending beeps
    this.playBeep(600, 150, 0.1);
    setTimeout(() => this.playBeep(800, 150, 0.1), 200);
    setTimeout(() => this.playBeep(1000, 200, 0.1), 400);
  }

  playTickSound() {
    this.playBeep(400, 50, 0.05);
  }
}

export const audioManager = new AudioManager();