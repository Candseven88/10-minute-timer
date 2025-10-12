/**
 * Timer Core Functionality
 * Handles countdown logic and sliding animations
 */

class Timer {
    constructor() {
        this.currentTime = 600; // 10 minutes default
        this.totalTime = 600;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;
        this.currentValues = { hours: '00', minutes: '10', seconds: '00' };
        this.warningThreshold = 60; // 1 minute
        this.criticalThreshold = 10; // 10 seconds
        this.onTick = null;
        this.onComplete = null;
        this.onWarning = null;
        this.onCritical = null;
        this.animationType = 'changing';
        
        this.initializeElements();
    }
    
    initializeElements() {
        // Flip card elements with modern class names
        this.hoursFlip = document.getElementById('hoursFlip');
        this.minutesFlip = document.getElementById('minutesFlip');
        this.secondsFlip = document.getElementById('secondsFlip');
        
        // Individual card elements
        this.hoursCard = this.hoursFlip;
        this.minutesCard = this.minutesFlip;
        this.secondsCard = this.secondsFlip;
        
        // Front and back elements
        this.hoursFront = this.hoursFlip?.querySelector('.flip-card-front');
        this.hoursBack = this.hoursFlip?.querySelector('.flip-card-back');
        this.minutesFront = this.minutesFlip?.querySelector('.flip-card-front');
        this.minutesBack = this.minutesFlip?.querySelector('.flip-card-back');
        this.secondsFront = this.secondsFlip?.querySelector('.flip-card-front');
        this.secondsBack = this.secondsFlip?.querySelector('.flip-card-back');
        
        // Progress elements
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        
        // Flash overlay
        this.flashOverlay = document.getElementById('flashOverlay');
        
        // Set initial display values
        this.setDisplayValue('hours', '00');
        this.setDisplayValue('minutes', '10');
        this.setDisplayValue('seconds', '00');
        
        this.updateProgress();
    }
    
    start() {
        if (this.currentTime <= 0) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.interval = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgress();
            this.checkThresholds();
            
            if (this.onTick) this.onTick(this.currentTime);
            
            if (this.currentTime <= 0) {
                this.complete();
            }
        }, 1000);
        
        this.addTimerState('active');
        this.updateControlButtons();
    }
    
    pause() {
        this.isRunning = false;
        this.isPaused = true;
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.removeTimerState('active');
        this.addTimerState('paused');
        this.updateControlButtons();
    }
    
    resume() {
        this.start();
        this.removeTimerState('paused');
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.currentTime = this.totalTime;
        this.updateDisplay();
        this.updateProgress();
        this.removeAllTimerStates();
        this.hideFlash();
        this.updateControlButtons();
    }
    
    setTime(hours, minutes, seconds) {
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        this.totalTime = totalSeconds;
        this.currentTime = totalSeconds;
        this.updateDisplay();
        this.updateProgress();
    }
    
    adjustTime(seconds) {
        if (this.currentTime <= 0 && seconds < 0) return;
        
        this.currentTime = Math.max(0, this.currentTime + seconds);
        this.totalTime = Math.max(this.totalTime, this.currentTime);
        
        this.updateDisplay();
        this.updateProgress();
        this.showAdjustmentFeedback(seconds);
    }
    
    updateDisplay() {
        const hours = Math.floor(this.currentTime / 3600);
        const minutes = Math.floor((this.currentTime % 3600) / 60);
        const seconds = this.currentTime % 60;
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        this.updateTimeUnit('hours', formattedHours);
        this.updateTimeUnit('minutes', formattedMinutes);
        this.updateTimeUnit('seconds', formattedSeconds);
    }
    
    updateTimeUnit(unit, newValue) {
        if (this.currentValues[unit] !== newValue) {
            this.animateToValue(unit, newValue);
        }
    }
    
    animateToValue(unit, newValue) {
        const card = this[`${unit}Card`];
        const front = this[`${unit}Front`];
        const back = this[`${unit}Back`];
        
        if (!card || !front || !back) {
            console.warn(`Missing elements for ${unit} timer unit`);
            return;
        }
        
        // Simple animation with subtle color change
        card.classList.add('changing');
        
        // Immediately update the value with a brief color transition
        setTimeout(() => {
            front.textContent = newValue;
            this.currentValues[unit] = newValue;
            card.classList.remove('changing');
        }, 100);
    }
    
    setDisplayValue(unit, value) {
        const front = this[`${unit}Front`];
        const back = this[`${unit}Back`];
        
        if (front) {
            front.textContent = value;
        }
        if (back) {
            back.textContent = value;
            back.style.opacity = '0';
            back.style.transform = 'scale(0.8)';
        }
        
        this.currentValues[unit] = value;
    }
    
    updateProgress() {
        const progress = this.totalTime > 0 ? (this.totalTime - this.currentTime) / this.totalTime : 0;
        const percentage = Math.min(100, Math.max(0, progress * 100));
        
        // Update horizontal progress bar
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${percentage.toFixed(1)}%`;
        }
    }
    
    checkThresholds() {
        // Remove existing state classes first
        this.removeTimerState('warning');
        this.removeTimerState('critical');
        
        if (this.currentTime <= this.criticalThreshold && this.currentTime > 0) {
            this.addTimerState('critical');
            if (this.onCritical) this.onCritical();
        } else if (this.currentTime <= this.warningThreshold && this.currentTime > 0) {
            this.addTimerState('warning');
            if (this.onWarning) this.onWarning();
        }
    }
    
    complete() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.removeAllTimerStates();
        this.addTimerState('completed');
        this.updateControlButtons();
        
        if (this.onComplete) this.onComplete();
    }
    
    addTimerState(state) {
        this.hoursFlip?.classList.add(`timer-${state}`);
        this.minutesFlip?.classList.add(`timer-${state}`);
        this.secondsFlip?.classList.add(`timer-${state}`);
        
        // Add flash state to progress bar
        if (state === 'warning' || state === 'critical') {
            this.progressFill?.classList.add('animate-pulse');
        }
    }
    
    removeTimerState(state) {
        this.hoursFlip?.classList.remove(`timer-${state}`);
        this.minutesFlip?.classList.remove(`timer-${state}`);
        this.secondsFlip?.classList.remove(`timer-${state}`);
        
        if (state === 'warning' || state === 'critical') {
            this.progressFill?.classList.remove('animate-pulse');
        }
    }
    
    removeAllTimerStates() {
        const states = ['active', 'warning', 'critical', 'paused', 'completed'];
        states.forEach(state => this.removeTimerState(state));
    }
    
    showFlash() {
        if (this.flashOverlay) {
            this.flashOverlay.classList.remove('hidden');
            this.flashOverlay.classList.add('animate-pulse');
        }
    }
    
    hideFlash() {
        if (this.flashOverlay) {
            this.flashOverlay.classList.add('hidden');
            this.flashOverlay.classList.remove('animate-pulse');
        }
    }
    
    showAdjustmentFeedback(seconds) {
        // Create a feedback element
        const feedback = document.createElement('div');
        feedback.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg z-50 animate-scale-in';
        feedback.textContent = `${seconds > 0 ? '+' : ''}${Math.floor(seconds / 60)}:${Math.abs(seconds % 60).toString().padStart(2, '0')}`;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('opacity-0');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }
    
    updateControlButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isRunning && !this.isPaused) {
            startBtn?.classList.add('hidden');
            pauseBtn?.classList.remove('hidden');
        } else {
            startBtn?.classList.remove('hidden');
            pauseBtn?.classList.add('hidden');
        }
        
        // Update pause button text if resumed
        if (this.isPaused && pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }
    
    setAnimationType(type) {
        const validTypes = ['changing', 'pulse', 'pop', 'bounce'];
        if (validTypes.includes(type)) {
            this.animationType = type;
        }
    }
    
    // Event handlers
    setOnTick(callback) {
        this.onTick = callback;
    }
    
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    
    setOnWarning(callback) {
        this.onWarning = callback;
    }
    
    setOnCritical(callback) {
        this.onCritical = callback;
    }
    
    // Public API
    getCurrentTime() {
        return this.currentTime;
    }
    
    getTotalTime() {
        return this.totalTime;
    }
    
    getProgress() {
        return this.totalTime > 0 ? (this.totalTime - this.currentTime) / this.totalTime : 0;
    }
    
    isActive() {
        return this.isRunning;
    }
    
    isPausedState() {
        return this.isPaused;
    }
} 