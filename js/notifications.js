/**
 * Notifications System
 * Handles audio and visual notifications for timer events
 */

class Notifications {
    constructor() {
        this.audioContext = null;
        this.settings = {
            soundEnabled: true,
            flashEnabled: true,
            volume: 50,
            notificationSound: 'beep',
            warningSound: 'tick',
            criticalSound: 'alarm'
        };
        
        this.lastWarningTime = 0;
        this.lastCriticalTime = 0;
        this.isFlashing = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeAudio();
    }
    
    initializeElements() {
        this.soundEnabledCheckbox = document.getElementById('soundEnabled');
        this.flashEnabledCheckbox = document.getElementById('flashEnabled');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.flashOverlay = document.getElementById('flashOverlay');
    }
    
    bindEvents() {
        if (this.soundEnabledCheckbox) {
            this.soundEnabledCheckbox.addEventListener('change', () => {
                this.settings.soundEnabled = this.soundEnabledCheckbox.checked;
                this.saveSettings();
            });
        }
        
        if (this.flashEnabledCheckbox) {
            this.flashEnabledCheckbox.addEventListener('change', () => {
                this.settings.flashEnabled = this.flashEnabledCheckbox.checked;
                this.saveSettings();
            });
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', () => {
                this.settings.volume = parseInt(this.volumeSlider.value);
                this.saveSettings();
            });
        }
        
        // Request notification permission
        this.requestNotificationPermission();
    }
    
    async initializeAudio() {
        try {
            // Initialize AudioContext on user interaction
            document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
            document.addEventListener('keydown', this.initAudioContext.bind(this), { once: true });
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }
    
    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized');
        } catch (error) {
            console.warn('Failed to create audio context:', error);
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    console.log('Notification permission:', permission);
                });
            }
        }
    }
    
    loadSettings() {
        try {
            const settings = localStorage.getItem('countdownNotifications');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.settings = { ...this.settings, ...parsed };
                this.updateUIFromSettings();
                console.log('Notification settings loaded');
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('countdownNotifications', JSON.stringify(this.settings));
            console.log('Notification settings saved');
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    }
    
    updateUIFromSettings() {
        if (this.soundEnabledCheckbox) {
            this.soundEnabledCheckbox.checked = this.settings.soundEnabled;
        }
        
        if (this.flashEnabledCheckbox) {
            this.flashEnabledCheckbox.checked = this.settings.flashEnabled;
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.value = this.settings.volume;
        }
    }
    
    triggerCompletion() {
        this.playSound('completion');
        this.showFlash();
        this.showBrowserNotification('Timer Completed!', 'Your countdown timer has finished.');
        this.vibrate([200, 100, 200]);
        
        console.log('Timer completion notification triggered');
    }
    
    triggerWarning(timeRemaining) {
        // Throttle warnings to prevent spam
        const now = Date.now();
        if (now - this.lastWarningTime < 2000) return;
        this.lastWarningTime = now;
        
        this.playSound('warning');
        this.showSubtleFlash();
        
        console.log(`Warning notification triggered: ${timeRemaining}s remaining`);
    }
    
    triggerCritical(timeRemaining) {
        // Throttle critical alerts to prevent spam
        const now = Date.now();
        if (now - this.lastCriticalTime < 1000) return;
        this.lastCriticalTime = now;
        
        this.playSound('critical');
        this.showUrgentFlash();
        this.vibrate([100, 50, 100, 50, 100]);
        
        console.log(`Critical notification triggered: ${timeRemaining}s remaining`);
    }
    
    playSound(type) {
        if (!this.settings.soundEnabled || !this.audioContext) return;
        
        try {
            switch (type) {
                case 'completion':
                    this.playBeepSequence([800, 600, 800], [0.3, 0.3, 0.5]);
                    break;
                case 'warning':
                    this.playBeep(400, 0.2);
                    break;
                case 'critical':
                    this.playBeep(800, 0.1);
                    break;
                default:
                    this.playBeep(600, 0.2);
            }
        } catch (error) {
            console.warn('Failed to play sound:', error);
        }
    }
    
    playBeep(frequency = 800, duration = 0.2) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        const volume = (this.settings.volume / 100) * 0.3;
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playBeepSequence(frequencies, durations) {
        let currentTime = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const duration = durations[index] || 0.2;
            this.playBeepAtTime(freq, duration, currentTime);
            currentTime += duration + 0.1; // Small gap between beeps
        });
    }
    
    playBeepAtTime(frequency, duration, startTime) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        const volume = (this.settings.volume / 100) * 0.3;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    showFlash() {
        if (!this.settings.flashEnabled || this.isFlashing) return;
        
        this.isFlashing = true;
        
        if (this.flashOverlay) {
            this.flashOverlay.classList.remove('hidden');
            
            setTimeout(() => {
                if (this.flashOverlay) {
                    this.flashOverlay.classList.add('hidden');
                }
                this.isFlashing = false;
            }, 300);
        }
    }
    
    showSubtleFlash() {
        if (!this.settings.flashEnabled) return;
        
        // Create a subtle flash overlay
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 165, 0, 0.3);
            z-index: 9998;
            pointer-events: none;
            animation: subtleFlash 0.4s ease;
        `;
        
        this.addFlashAnimation();
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), 400);
    }
    
    showUrgentFlash() {
        if (!this.settings.flashEnabled) return;
        
        // Create urgent flash overlay
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.5);
            z-index: 9998;
            pointer-events: none;
            animation: urgentFlash 0.2s ease;
        `;
        
        this.addFlashAnimation();
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), 200);
    }
    
    addFlashAnimation() {
        if (!document.getElementById('flash-animations')) {
            const style = document.createElement('style');
            style.id = 'flash-animations';
            style.textContent = `
                @keyframes subtleFlash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                
                @keyframes urgentFlash {
                    0%, 100% { opacity: 0; }
                    25%, 75% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showBrowserNotification(title, message, icon = null) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        try {
            const notification = new Notification(title, {
                body: message,
                icon: icon || this.getDefaultIcon(),
                badge: icon || this.getDefaultIcon(),
                tag: 'countdown-timer',
                requireInteraction: true,
                silent: false
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            // Auto-close after 10 seconds
            setTimeout(() => notification.close(), 10000);
            
        } catch (error) {
            console.warn('Failed to show browser notification:', error);
        }
    }
    
    getDefaultIcon() {
        // Return a data URL for a simple timer icon
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIHN0cm9rZT0iIzRlY2RjNCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxsaW5lIHgxPSIzMiIgeTE9IjMyIiB4Mj0iMzIiIHkyPSIxNiIgc3Ryb2tlPSIjNGVjZGM0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8bGluZSB4MT0iMzIiIHkxPSIzMiIgeDI9IjQ0IiB5Mj0iMzIiIHN0cm9rZT0iIzRlY2RjNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
    }
    
    vibrate(pattern = [200]) {
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (error) {
                console.warn('Vibration failed:', error);
            }
        }
    }
    
    testNotifications() {
        console.log('Testing notifications...');
        
        // Test sound
        if (this.settings.soundEnabled) {
            this.playSound('completion');
        }
        
        // Test flash
        if (this.settings.flashEnabled) {
            this.showFlash();
        }
        
        // Test browser notification
        this.showBrowserNotification(
            'Test Notification',
            'This is a test notification from Countdown Timer.'
        );
        
        // Test vibration
        this.vibrate([100, 50, 100]);
    }
    
    // Advanced notification methods
    showProgressNotification(progress) {
        if (progress === 25 || progress === 50 || progress === 75) {
            this.showBrowserNotification(
                'Timer Progress',
                `${progress}% complete`
            );
        }
    }
    
    scheduleNotification(delay, title, message) {
        setTimeout(() => {
            this.showBrowserNotification(title, message);
        }, delay);
    }
    
    createCustomSound(frequencies, durations) {
        if (!Array.isArray(frequencies) || !Array.isArray(durations)) {
            console.error('Invalid sound parameters');
            return;
        }
        
        if (frequencies.length !== durations.length) {
            console.error('Frequencies and durations arrays must have same length');
            return;
        }
        
        this.playBeepSequence(frequencies, durations);
    }
    
    // Public API methods
    getSettings() {
        return { ...this.settings };
    }
    
    applySettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.updateUIFromSettings();
        this.saveSettings();
    }
    
    enable() {
        this.settings.soundEnabled = true;
        this.settings.flashEnabled = true;
        this.updateUIFromSettings();
        this.saveSettings();
    }
    
    disable() {
        this.settings.soundEnabled = false;
        this.settings.flashEnabled = false;
        this.updateUIFromSettings();
        this.saveSettings();
    }
    
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(100, volume));
        if (this.volumeSlider) {
            this.volumeSlider.value = this.settings.volume;
        }
        this.saveSettings();
    }
    
    getVolume() {
        return this.settings.volume;
    }
    
    // Cleanup method
    destroy() {
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

// Make Notifications available globally
window.Notifications = Notifications; 