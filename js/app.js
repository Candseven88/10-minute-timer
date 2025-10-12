/**
 * Main Application Logic
 * Coordinates all modules and manages global state
 */

class CountdownApp {
    constructor() {
        this.timer = null;
        this.customization = null;
        this.notifications = null;
        
        this.init();
    }
    
    init() {
        // Initialize modules
        this.timer = new Timer();
        this.customization = new Customization();
        this.notifications = new Notifications();
        
        // Make timer globally accessible for other modules
        window.countdownApp = this;
        
        // Set up timer callbacks
        this.timer.setOnTick(() => this.handleTimerTick());
        this.timer.setOnComplete(() => this.handleTimerComplete());
        this.timer.setOnWarning(() => this.handleTimerWarning());
        this.timer.setOnCritical(() => this.handleTimerCritical());
        
        // Bind control events
        this.bindControlEvents();
        
        // Bind settings events
        this.bindSettingsEvents();
        
        console.log('Countdown App initialized');
    }
    
    bindControlEvents() {
        // Main control buttons
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        // Time adjustment buttons
        const minus5Min = document.getElementById('minus5Min');
        const minus1Min = document.getElementById('minus1Min');
        const plus1Min = document.getElementById('plus1Min');
        const plus5Min = document.getElementById('plus5Min');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTimer());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseTimer());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }
        
        // Time adjustments
        if (minus5Min) {
            minus5Min.addEventListener('click', () => this.timer.adjustTime(-300));
        }
        
        if (minus1Min) {
            minus1Min.addEventListener('click', () => this.timer.adjustTime(-60));
        }
        
        if (plus1Min) {
            plus1Min.addEventListener('click', () => this.timer.adjustTime(60));
        }
        
        if (plus5Min) {
            plus5Min.addEventListener('click', () => this.timer.adjustTime(300));
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    bindSettingsEvents() {
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
    }
    
    showSettings() {
        if (this.customization) {
            this.customization.showModal();
        }
    }
    
    startTimer() {
        if (this.timer.isPausedState()) {
            this.timer.resume();
        } else {
            this.timer.start();
        }
    }
    
    pauseTimer() {
        this.timer.pause();
    }
    
    resetTimer() {
        this.timer.reset();
    }
    
    handleTimerTick() {
        // Check if we need to show notification effects
        const currentTime = this.timer.getCurrentTime();
        
        // Show flash for last 10 seconds if flash is enabled
        if (currentTime <= 10 && currentTime > 0 && this.customization.isFlashEnabled()) {
            this.timer.showFlash();
        } else {
            this.timer.hideFlash();
        }
        
        // Update document title with remaining time
        if (this.timer.isActive()) {
            const hours = Math.floor(currentTime / 3600);
            const minutes = Math.floor((currentTime % 3600) / 60);
            const seconds = currentTime % 60;
            
            const timeStr = hours > 0 
                ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                : `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
            document.title = `${timeStr} - Countdown Timer`;
        } else {
            document.title = 'Countdown Timer';
        }
    }
    
    handleTimerComplete() {
        console.log('Timer completed!');
        
        // Reset document title
        document.title = 'Countdown Timer - Completed!';
        
        // Hide flash
        this.timer.hideFlash();
        
        // Play completion sound if enabled
        if (this.notifications && this.customization.isSoundEnabled()) {
            this.notifications.playCompletionSound();
            this.notifications.showCompletionNotification();
        }
        
        // Show completion message
        this.showCompletionMessage();
    }
    
    handleTimerWarning() {
        console.log('Timer warning - 1 minute remaining');
        
        if (this.notifications && this.customization.isSoundEnabled()) {
            this.notifications.playWarningSound();
        }
    }
    
    handleTimerCritical() {
        console.log('Timer critical - 10 seconds remaining');
        
        if (this.notifications && this.customization.isSoundEnabled()) {
            this.notifications.playCriticalSound();
        }
    }
    
    showCompletionMessage() {
        // Create completion overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
        
        const message = document.createElement('div');
        message.className = 'bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-600 p-8 text-center max-w-md mx-4';
        message.innerHTML = `
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-white mb-4">Time's Up!</h2>
            <p class="text-slate-300 mb-6">Your countdown has completed successfully!</p>
            <div class="flex justify-center space-x-4">
                <button id="completionRestart" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <i class="fas fa-redo mr-2"></i>Restart
                </button>
                <button id="completionOk" class="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    Close
                </button>
            </div>
        `;
        
        overlay.appendChild(message);
        document.body.appendChild(overlay);
        
        // Add celebration animation
        message.classList.add('animate-scale-in');
        
        // Handle buttons
        const restartBtn = message.querySelector('#completionRestart');
        const okBtn = message.querySelector('#completionOk');
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.resetTimer();
                document.body.removeChild(overlay);
            });
        }
        
        if (okBtn) {
            okBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        }
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 30000);
    }
    
    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                if (this.timer.isActive()) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
                break;
                
            case 'KeyR':
                e.preventDefault();
                this.resetTimer();
                break;
                
            case 'KeyS':
                e.preventDefault();
                this.showSettings();
                break;
                
            case 'Escape':
                if (this.customization) {
                    this.customization.hideModal();
                }
                break;
                
            // Time adjustments
            case 'ArrowUp':
                e.preventDefault();
                this.timer.adjustTime(60); // +1 minute
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.timer.adjustTime(-60); // -1 minute
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                this.timer.adjustTime(300); // +5 minutes
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                this.timer.adjustTime(-300); // -5 minutes
                break;
                
            // Quick time presets
            case 'Digit1':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.setQuickTime(5, 0, 0); // 5 minutes
                }
                break;
                
            case 'Digit2':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.setQuickTime(10, 0, 0); // 10 minutes
                }
                break;
                
            case 'Digit3':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.setQuickTime(15, 0, 0); // 15 minutes
                }
                break;
                
            case 'Digit4':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.setQuickTime(25, 0, 0); // 25 minutes (Pomodoro)
                }
                break;
                
            case 'Digit5':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.setQuickTime(30, 0, 0); // 30 minutes
                }
                break;
        }
    }
    
    setQuickTime(minutes, seconds = 0, hours = 0) {
        if (!this.timer.isActive()) {
            this.timer.setTime(hours, minutes, seconds);
            
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg z-50 animate-scale-in';
            feedback.innerHTML = `<i class="fas fa-clock mr-2"></i>Timer set to ${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds > 0 ? seconds + 's' : ''}`;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.classList.add('opacity-0');
                setTimeout(() => {
                    if (document.body.contains(feedback)) {
                        document.body.removeChild(feedback);
                    }
                }, 300);
            }, 2000);
        }
    }
    
    // Public API methods
    getTimer() {
        return this.timer;
    }
    
    getCustomization() {
        return this.customization;
    }
    
    getNotifications() {
        return this.notifications;
    }
    
    // Lifecycle methods
    destroy() {
        if (this.timer) {
            this.timer.reset();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        
        console.log('Countdown App destroyed');
    }
}

// App initialization is now handled in HTML

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownApp;
} 