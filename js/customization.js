/**
 * Customization System
 * Handles background customization, logo management, and UI theming
 */

class Customization {
    constructor() {
        this.settings = {
            backgroundColor: '#1e293b',
            backgroundType: 'gradient',
            gradientFrom: '#8B5CF6',
            gradientTo: '#EC4899',
            backgroundImage: null,
            logoUrl: null,
            logoPosition: 'top-left',
            title: 'Countdown Timer',
            subtitle: 'Stay focused and productive!',
            soundEnabled: true,
            flashEnabled: true
        };
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }
    
    initializeElements() {
        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.cancelSettings = document.getElementById('cancelSettings');
        this.saveSettings = document.getElementById('saveSettings');
        
        // Timer setting elements
        this.timerHours = document.getElementById('timerHours');
        this.timerMinutes = document.getElementById('timerMinutes');
        this.timerSeconds = document.getElementById('timerSeconds');
        this.setTimerBtn = document.getElementById('setTimerBtn');
        this.timerDisplay = document.getElementById('timerDisplay');
        
        // Critical error checking for main functionality
        if (!this.saveSettings) {
            console.error('Critical: Save Settings button not found! ID: saveSettings');
        }
        
        if (!this.settingsModal) {
            console.error('Critical: Settings modal not found! ID: settingsModal');
        }
        
        // Background type buttons
        this.bgTypeSolid = document.getElementById('bgTypeSolid');
        this.bgTypeGradient = document.getElementById('bgTypeGradient');
        this.bgTypeImage = document.getElementById('bgTypeImage');
        
        // Background options containers
        this.solidColorOptions = document.getElementById('solidColorOptions');
        this.gradientOptions = document.getElementById('gradientOptions');
        this.imageOptions = document.getElementById('imageOptions');
        
        // Background specific elements
        this.colorOptions = document.querySelectorAll('.color-option');
        this.gradientOptionButtons = document.querySelectorAll('.gradient-option');
        this.bgImageUpload = document.getElementById('bgImageUpload');
        this.imagePreview = document.getElementById('imagePreview');
        this.backgroundPreviewImg = document.getElementById('backgroundPreviewImg');
        
        // Logo elements
        this.logoUpload = document.getElementById('logoUpload');
        this.logoPreview = document.getElementById('logoPreview');
        this.logoPreviewImg = document.getElementById('logoPreviewImg');
        this.logoPosition = document.getElementById('logoPosition');
        
        // Text elements
        this.titleInput = document.getElementById('titleInput');
        this.subtitleInput = document.getElementById('subtitleInput');
        
        // Audio & Effects elements
        this.soundToggle = document.getElementById('soundToggle');
        this.flashToggle = document.getElementById('flashToggle');
        
        // Display elements
        this.backgroundContainer = document.getElementById('backgroundContainer');
        this.logoContainer = document.getElementById('logoContainer');
        this.logoImage = document.getElementById('logoImage');
        this.titleText = document.getElementById('titleText');
        this.taglineText = document.getElementById('taglineText');
    }
    
    bindEvents() {
        // Modal controls
        if (this.closeSettings) {
            this.closeSettings.addEventListener('click', () => this.hideModal());
        }
        
        if (this.cancelSettings) {
            this.cancelSettings.addEventListener('click', () => this.hideModal());
        }
        
        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any default action
                this.saveChanges();
            });
        } else {
            console.error('Cannot bind Save Settings button - element not found!');
        }
        
        // Timer setting events
        if (this.setTimerBtn) {
            this.setTimerBtn.addEventListener('click', () => this.setTimerTime());
        }
        
        // Update timer display when inputs change
        [this.timerHours, this.timerMinutes, this.timerSeconds].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.updateTimerDisplay());
            }
        });
        
        // Background type buttons
        if (this.bgTypeSolid) {
            this.bgTypeSolid.addEventListener('click', () => this.setBackgroundType('solid'));
        }
        
        if (this.bgTypeGradient) {
            this.bgTypeGradient.addEventListener('click', () => this.setBackgroundType('gradient'));
        }
        
        if (this.bgTypeImage) {
            this.bgTypeImage.addEventListener('click', () => this.setBackgroundType('image'));
        }
        
        // Color options
        this.colorOptions.forEach(button => {
            button.addEventListener('click', () => {
                const color = button.dataset.color;
                this.setBackgroundColor(color);
                this.updateColorSelection(button);
            });
        });
        
        // Gradient options
        this.gradientOptionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const from = button.dataset.from;
                const to = button.dataset.to;
                this.setGradientColors(from, to);
                this.updateGradientSelection(button);
            });
        });
        
        // Image upload
        if (this.bgImageUpload) {
            this.bgImageUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'background'));
        }
        
        // Logo upload
        if (this.logoUpload) {
            this.logoUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'logo'));
        }
        
        // Logo position
        if (this.logoPosition) {
            this.logoPosition.addEventListener('change', () => {
                this.settings.logoPosition = this.logoPosition.value;
                this.applyLogoPosition();
            });
        }
        
        // Text inputs with real-time updates
        if (this.titleInput) {
            this.titleInput.addEventListener('input', () => {
                this.settings.title = this.titleInput.value;
                this.applyTitle();
            });
        }
        
        if (this.subtitleInput) {
            this.subtitleInput.addEventListener('input', () => {
                this.settings.subtitle = this.subtitleInput.value;
                this.applySubtitle();
            });
        }
        
        // Audio & Effects toggles
        if (this.soundToggle) {
            this.soundToggle.addEventListener('click', () => this.toggleSound());
        }
        
        if (this.flashToggle) {
            this.flashToggle.addEventListener('click', () => this.toggleFlash());
        }
        
        // Close modal when clicking outside
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) {
                    this.hideModal();
                }
            });
        }
    }
    
    showModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('hidden');
            // Update UI to reflect current settings
            this.updateUIFromSettings();
        }
    }
    
    hideModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('hidden');
        }
    }
    
    setBackgroundType(type) {
        this.settings.backgroundType = type;
        this.updateBackgroundTypeButtons();
        this.showBackgroundOptions(type);
        this.applyBackground();
    }
    
    updateBackgroundTypeButtons() {
        // Reset all buttons
        [this.bgTypeSolid, this.bgTypeGradient, this.bgTypeImage].forEach(btn => {
            if (btn) {
                btn.className = 'px-4 py-2 rounded-lg transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600';
            }
        });
        
        // Highlight active button
        const activeButton = {
            'solid': this.bgTypeSolid,
            'gradient': this.bgTypeGradient,
            'image': this.bgTypeImage
        }[this.settings.backgroundType];
        
        if (activeButton) {
            activeButton.className = 'px-4 py-2 rounded-lg transition-colors bg-purple-600 text-white';
        }
    }
    
    showBackgroundOptions(type) {
        // Hide all options
        [this.solidColorOptions, this.gradientOptions, this.imageOptions].forEach(container => {
            if (container) container.classList.add('hidden');
        });
        
        // Show relevant options
        const containers = {
            'solid': this.solidColorOptions,
            'gradient': this.gradientOptions,
            'image': this.imageOptions
        };
        
        const activeContainer = containers[type];
        if (activeContainer) {
            activeContainer.classList.remove('hidden');
        }
    }
    
    setBackgroundColor(color) {
        this.settings.backgroundColor = color;
        this.applyBackground();
    }
    
    setGradientColors(from, to) {
        this.settings.gradientFrom = from;
        this.settings.gradientTo = to;
        this.applyBackground();
    }
    
    updateColorSelection(selectedButton) {
        this.colorOptions.forEach(btn => {
            btn.classList.remove('border-white', 'scale-110');
            btn.classList.add('border-transparent');
        });
        
        selectedButton.classList.remove('border-transparent');
        selectedButton.classList.add('border-white', 'scale-110');
    }
    
    updateGradientSelection(selectedButton) {
        this.gradientOptionButtons.forEach(btn => {
            btn.classList.remove('border-white', 'scale-105');
            btn.classList.add('border-transparent');
        });
        
        selectedButton.classList.remove('border-transparent');
        selectedButton.classList.add('border-white', 'scale-105');
    }
    
    handleImageUpload(event, type) {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            
            if (type === 'background') {
                this.settings.backgroundImage = result;
                this.showImagePreview(result);
                this.applyBackground();
            } else if (type === 'logo') {
                this.settings.logoUrl = result;
                this.showLogoPreview(result);
                this.applyLogo();
            }
        };
        reader.readAsDataURL(file);
    }
    
    showImagePreview(imageUrl) {
        if (this.imagePreview && this.backgroundPreviewImg) {
            this.backgroundPreviewImg.src = imageUrl;
            this.imagePreview.classList.remove('hidden');
        }
    }
    
    showLogoPreview(imageUrl) {
        if (this.logoPreview && this.logoPreviewImg) {
            this.logoPreviewImg.src = imageUrl;
            this.logoPreview.classList.remove('hidden');
        }
    }
    
    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.updateSoundButton();
    }
    
    toggleFlash() {
        this.settings.flashEnabled = !this.settings.flashEnabled;
        this.updateFlashButton();
    }
    
    updateSoundButton() {
        if (!this.soundToggle) return;
        
        const icon = this.soundToggle.querySelector('i');
        
        if (this.settings.soundEnabled) {
            this.soundToggle.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white';
            if (icon) icon.className = 'fas fa-volume-up';
        } else {
            this.soundToggle.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-slate-700 hover:bg-slate-600 text-slate-300';
            if (icon) icon.className = 'fas fa-volume-mute';
        }
    }
    
    updateFlashButton() {
        if (!this.flashToggle) return;
        
        const icon = this.flashToggle.querySelector('i');
        
        if (this.settings.flashEnabled) {
            this.flashToggle.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-yellow-600 hover:bg-yellow-700 text-white';
            if (icon) icon.className = 'fas fa-bolt';
        } else {
            this.flashToggle.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-slate-700 hover:bg-slate-600 text-slate-300';
            if (icon) icon.className = 'fas fa-bolt-slash';
        }
    }
    
    applyBackground() {
        if (!this.backgroundContainer) return;
        
        let backgroundStyle = '';
        
        switch (this.settings.backgroundType) {
            case 'solid':
                backgroundStyle = this.settings.backgroundColor;
                this.backgroundContainer.style.background = backgroundStyle;
                this.backgroundContainer.style.backgroundImage = '';
                break;
                
            case 'gradient':
                backgroundStyle = `linear-gradient(135deg, ${this.settings.gradientFrom}, ${this.settings.gradientTo})`;
                this.backgroundContainer.style.background = backgroundStyle;
                this.backgroundContainer.style.backgroundImage = '';
                break;
                
            case 'image':
                if (this.settings.backgroundImage) {
                    this.backgroundContainer.style.backgroundImage = `url(${this.settings.backgroundImage})`;
                    this.backgroundContainer.style.backgroundSize = 'cover';
                    this.backgroundContainer.style.backgroundPosition = 'center';
                    this.backgroundContainer.style.backgroundRepeat = 'no-repeat';
                    // Clear any previous solid/gradient background
                    this.backgroundContainer.style.background = '';
                } else {
                    // Fallback to gradient without recursive call
                    const fallbackGradient = `linear-gradient(135deg, ${this.settings.gradientFrom}, ${this.settings.gradientTo})`;
                    this.backgroundContainer.style.background = fallbackGradient;
                    this.backgroundContainer.style.backgroundImage = '';
                }
                break;
        }
    }
    
    applyLogo() {
        if (!this.logoContainer || !this.logoImage) return;
        
        if (this.settings.logoUrl) {
            this.logoImage.src = this.settings.logoUrl;
            this.logoContainer.classList.remove('hidden');
            this.applyLogoPosition();
        } else {
            this.logoContainer.classList.add('hidden');
        }
    }
    
    applyLogoPosition() {
        if (!this.logoContainer) return;
        
        // Remove all position classes
        this.logoContainer.className = 'logo-container absolute z-30';
        
        // Add specific position class
        switch (this.settings.logoPosition) {
            case 'top-left':
                this.logoContainer.classList.add('top-4', 'left-4');
                break;
            case 'top-right':
                this.logoContainer.classList.add('top-4', 'right-4');
                break;
            case 'bottom-left':
                this.logoContainer.classList.add('bottom-4', 'left-4');
                break;
            case 'bottom-right':
                this.logoContainer.classList.add('bottom-4', 'right-4');
                break;
            case 'center':
                this.logoContainer.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
                break;
        }
        
        if (this.settings.logoUrl) {
            this.logoContainer.classList.remove('hidden');
        }
    }
    
    applyTitle() {
        if (this.titleText) {
            this.titleText.textContent = this.settings.title;
        }
    }
    
    applySubtitle() {
        if (this.taglineText) {
            this.taglineText.textContent = this.settings.subtitle;
        }
    }
    
    updateUIFromSettings() {
        // Update background type buttons
        this.updateBackgroundTypeButtons();
        this.showBackgroundOptions(this.settings.backgroundType);
        
        // Update color selection
        this.colorOptions.forEach(btn => {
            btn.classList.remove('border-white', 'scale-110');
            btn.classList.add('border-transparent');
            
            if (btn.dataset.color === this.settings.backgroundColor) {
                btn.classList.remove('border-transparent');
                btn.classList.add('border-white', 'scale-110');
            }
        });
        
        // Update gradient selection
        this.gradientOptionButtons.forEach(btn => {
            btn.classList.remove('border-white', 'scale-105');
            btn.classList.add('border-transparent');
            
            if (btn.dataset.from === this.settings.gradientFrom && btn.dataset.to === this.settings.gradientTo) {
                btn.classList.remove('border-transparent');
                btn.classList.add('border-white', 'scale-105');
            }
        });
        
        // Update image preview
        if (this.settings.backgroundImage) {
            this.showImagePreview(this.settings.backgroundImage);
        }
        
        // Update logo preview and position
        if (this.settings.logoUrl) {
            this.showLogoPreview(this.settings.logoUrl);
        }
        
        if (this.logoPosition) {
            this.logoPosition.value = this.settings.logoPosition;
        }
        
        // Update text inputs
        if (this.titleInput) {
            this.titleInput.value = this.settings.title;
        }
        
        if (this.subtitleInput) {
            this.subtitleInput.value = this.settings.subtitle;
        }
        
        // Update toggle buttons
        this.updateSoundButton();
        this.updateFlashButton();
    }
    
    saveChanges() {
        try {
            this.saveSettings();
            this.hideModal();
            
            // Show success feedback
            this.showSaveNotification();
        } catch (error) {
            console.error('Error saving settings:', error);
            
            // Show error notification
            this.showErrorNotification(error.message);
        }
    }
    
    setTimerTime() {
        const hours = parseInt(this.timerHours?.value || '0');
        const minutes = parseInt(this.timerMinutes?.value || '0');
        const seconds = parseInt(this.timerSeconds?.value || '0');
        
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds > 0 && window.countdownApp?.timer) {
            window.countdownApp.timer.setTime(hours, minutes, seconds);
            this.showTimerSetNotification(totalSeconds);
        }
    }
    
    updateTimerDisplay() {
        const hours = parseInt(this.timerHours?.value || '0');
        const minutes = parseInt(this.timerMinutes?.value || '0');
        const seconds = parseInt(this.timerSeconds?.value || '0');
        
        let displayText = 'Total time: ';
        
        if (hours > 0) displayText += `${hours}h `;
        if (minutes > 0) displayText += `${minutes}m `;
        if (seconds > 0) displayText += `${seconds}s`;
        if (hours === 0 && minutes === 0 && seconds === 0) displayText += 'Please set a time';
        
        if (this.timerDisplay) {
            this.timerDisplay.textContent = displayText;
        }
    }
    
    showTimerSetNotification(totalSeconds) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-down';
        
        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            
            let result = '';
            if (h > 0) result += `${h}h `;
            if (m > 0) result += `${m}m `;
            if (s > 0) result += `${s}s`;
            
            return result.trim();
        };
        
        notification.textContent = `Timer set to ${formatTime(totalSeconds)}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showSaveNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-scale-in';
        notification.innerHTML = '<i class="fas fa-check mr-2"></i>Settings saved!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-scale-in';
        notification.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>Error: ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    saveSettings() {
        try {
            localStorage.setItem('countdownCustomization', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('countdownCustomization');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
        
        // Apply loaded settings
        this.applyAllSettings();
    }
    
    applyAllSettings() {
        this.applyBackground();
        this.applyLogo();
        this.applyTitle();
        this.applySubtitle();
    }
    
    // Public API
    getSettings() {
        return { ...this.settings };
    }
    
    // Debug method to help troubleshoot issues
    debugSettings() {
        console.log('=== SETTINGS DEBUG ===');
        console.log('Current settings:', JSON.stringify(this.settings, null, 2));
        console.log('Save button element:', this.saveSettings);
        console.log('Settings modal element:', this.settingsModal);
        console.log('Background container element:', this.backgroundContainer);
        console.log('LocalStorage contents:', localStorage.getItem('countdownCustomization'));
        console.log('Event listeners bound:', {
            saveSettings: !!this.saveSettings?.onclick || !!this.saveSettings?._listeners,
            closeSettings: !!this.closeSettings?.onclick || !!this.closeSettings?._listeners
        });
        console.log('=== END DEBUG ===');
        
        // Test if elements are properly accessible
        const testSaveButton = document.getElementById('saveSettings');
        console.log('Direct saveSettings lookup:', testSaveButton);
        
        return {
            settings: this.settings,
            elements: {
                saveSettings: !!this.saveSettings,
                settingsModal: !!this.settingsModal,
                backgroundContainer: !!this.backgroundContainer
            }
        };
    }
    
    isSoundEnabled() {
        return this.settings.soundEnabled;
    }
    
    isFlashEnabled() {
        return this.settings.flashEnabled;
    }
    
    resetToDefaults() {
        this.settings = {
            backgroundColor: '#1e293b',
            backgroundType: 'gradient',
            gradientFrom: '#8B5CF6',
            gradientTo: '#EC4899',
            backgroundImage: null,
            logoUrl: null,
            logoPosition: 'top-left',
            title: 'Countdown Timer',
            subtitle: 'Stay focused and productive!',
            soundEnabled: true,
            flashEnabled: true
        };
        
        this.applyAllSettings();
        this.saveSettings();
    }
}

// Global debug helper for browser console
window.debugCountdownSettings = function() {
    if (window.countdownApp && window.countdownApp.customization) {
        return window.countdownApp.customization.debugSettings();
    } else {
        console.error('Countdown app not found or customization not initialized');
        return null;
    }
};

// Global helper to test save functionality
window.testSaveSettings = function() {
    if (window.countdownApp && window.countdownApp.customization) {
        console.log('Testing save settings...');
        window.countdownApp.customization.saveChanges();
    } else {
        console.error('Countdown app not found or customization not initialized');
    }
}; 