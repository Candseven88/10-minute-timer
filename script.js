// 10分钟倒计时器 - 核心功能
// 专注于简洁、高效、易用的倒计时体验

class Timer {
    constructor() {
        // 计时器状态
        this.totalSeconds = 600; // 默认10分钟
        this.remainingSeconds = 600;
        this.originalSeconds = 600;
        this.isRunning = false;
        this.timerInterval = null;
        
        // 同步计时器实例
        this.syncTimer = null;
        this.isSyncMode = false;
        
        // 任务队列管理
        this.taskQueue = [];
        this.currentTaskIndex = -1;
        this.isQueueMode = false;
        this.queuePaused = false;
        
        // 设置
        this.settings = {
            soundEnabled: true,
            notificationEnabled: true,
            taskTitle: 'Focus Time',
            taskName: 'Focus Time',
            taskMotto: 'Stay focused, be productive',
            theme: 'orange',
            background: {
                type: 'color',
                color: '#1a1a1a',
                gradient: {
                    type: 'linear',
                    color1: '#1a1a1a',
                    color2: '#3d3d3d'
                },
                image: null
            },
            logo: {
                image: null,
                position: 'top-left'
            }
        };
        
        // DOM 元素
        this.initElements();
        
        // 调试信息
        console.log('浮动面板元素:', this.floatingPresets);
        console.log('浮动按钮元素:', this.toggleFloatingBtn);
        
        // 初始化
        this.loadSettings();
        this.bindEvents();
        this.updateDisplay();
        
        // 请求通知权限
        this.requestNotificationPermission();
        
        // 页面加载后短暂显示浮动面板提示用户
        setTimeout(() => {
            this.showFloatingPanel();
            setTimeout(() => {
                this.hideFloatingPanel();
            }, 2000);
        }, 1500);
        
        console.log('Timer initialized successfully');
    }
    
    initElements() {
        // 时间显示
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.taskTitleEl = document.getElementById('taskTitle');
        this.taskNameEl = document.getElementById('taskName');
        this.taskMottoEl = document.getElementById('taskMotto');
        this.progressFillEl = document.getElementById('progressFill');
        this.progressTextEl = document.getElementById('progressText');
        this.logoContainerEl = document.getElementById('logoContainer');
        
        // 控制按钮
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseIcon = this.playPauseBtn.querySelector('.icon');
        this.resetBtn = document.getElementById('resetBtn');
        this.timerFullscreenBtn = document.getElementById('timerFullscreenBtn');
        
        // 预设按钮
        this.presetBtns = document.querySelectorAll('.preset-btn');
        
        // 自定义输入
        this.customMinutes = document.getElementById('customMinutes');
        this.customSeconds = document.getElementById('customSeconds');
        this.applyCustomBtn = document.getElementById('applyCustomBtn');
        
        // 浮动快捷设置
        this.floatingPresets = document.querySelector('.floating-presets');
        this.toggleFloatingBtn = document.getElementById('toggleFloatingBtn');
        this.closeFloatingBtn = document.getElementById('closeFloatingBtn');
        this.floatingPresetBtns = document.querySelectorAll('.floating-preset-btn');
        this.floatingMinutes = document.getElementById('floatingMinutes');
        this.floatingSeconds = document.getElementById('floatingSeconds');
        this.floatingApplyBtn = document.getElementById('floatingApplyBtn');
        
        // 设置相关
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.soundEnabledCb = document.getElementById('soundEnabled');
        this.notificationEnabledCb = document.getElementById('notificationEnabled');
        this.taskTitleInput = document.getElementById('taskTitleInput');
        this.taskNameInput = document.getElementById('taskNameInput');
        this.taskMottoInput = document.getElementById('taskMottoInput');
        this.themeBtns = document.querySelectorAll('.theme-btn');
        
        // 背景设置
        this.bgColorRadio = document.getElementById('bgColor');
        this.bgGradientRadio = document.getElementById('bgGradient');
        this.bgImageRadio = document.getElementById('bgImage');
        this.colorSettings = document.getElementById('colorSettings');
        this.gradientSettings = document.getElementById('gradientSettings');
        this.imageSettings = document.getElementById('imageSettings');
        this.bgColorPicker = document.getElementById('bgColorPicker');
        this.gradientType = document.getElementById('gradientType');
        this.gradientColor1 = document.getElementById('gradientColor1');
        this.gradientColor2 = document.getElementById('gradientColor2');
        this.bgImageUpload = document.getElementById('bgImageUpload');
        this.imagePreview = document.getElementById('imagePreview');
        
        // Logo设置
        this.logoUpload = document.getElementById('logoUpload');
        this.logoPreview = document.getElementById('logoPreview');
        this.logoPositionRadios = document.querySelectorAll('input[name="logoPosition"]');
        
        // 其他功能
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.fullscreenTip = document.getElementById('fullscreenTip');
        this.timerSection = document.querySelector('.timer-section');
        
        // 设置选项卡
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // 同步计时器相关元素
        this.syncStatus = document.getElementById('syncStatus');
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        this.sessionInfo = document.getElementById('sessionInfo');
        
        // 同步计时器按钮
        this.createSessionBtn = document.getElementById('createSessionBtn');
        this.joinSessionBtn = document.getElementById('joinSessionBtn');
        this.sessionCodeInput = document.getElementById('sessionCodeInput');
        
        // 模态框元素
        this.createSessionModal = document.getElementById('createSessionModal');
        this.joinSessionModal = document.getElementById('joinSessionModal');
        this.sessionInfoModal = document.getElementById('sessionInfoModal');
        
        // 创建会话模态框
        this.closeCreateSessionBtn = document.getElementById('closeCreateSessionBtn');
        this.cancelCreateSessionBtn = document.getElementById('cancelCreateSessionBtn');
        this.confirmCreateSessionBtn = document.getElementById('confirmCreateSessionBtn');
        this.hostNameInput = document.getElementById('hostNameInput');
        this.sessionNameInput = document.getElementById('sessionNameInput');
        
        // 加入会话模态框
        this.closeJoinSessionBtn = document.getElementById('closeJoinSessionBtn');
        this.cancelJoinSessionBtn = document.getElementById('cancelJoinSessionBtn');
        this.confirmJoinSessionBtn = document.getElementById('confirmJoinSessionBtn');
        this.participantNameInput = document.getElementById('participantNameInput');
        this.joinSessionCodeInput = document.getElementById('joinSessionCodeInput');
        
        // 会话信息模态框
        this.closeSessionInfoBtn = document.getElementById('closeSessionInfoBtn');
        this.displaySessionCode = document.getElementById('displaySessionCode');
        this.hostUrlDisplay = document.getElementById('hostUrlDisplay');
        this.participantUrlDisplay = document.getElementById('participantUrlDisplay');
        this.copyHostUrlBtn = document.getElementById('copyHostUrlBtn');
        this.copyParticipantUrlBtn = document.getElementById('copyParticipantUrlBtn');
        this.hostDisplayName = document.getElementById('hostDisplayName');
        this.usersList = document.getElementById('usersList');
        
        // 任务队列管理元素
        this.sessionPanel = document.getElementById('sessionPanel');
        this.sessionTitle = document.getElementById('sessionTitle');
        this.sessionCodeDisplay = document.getElementById('sessionCodeDisplay');
        this.sessionRole = document.getElementById('sessionRole');
        this.sessionParticipants = document.getElementById('sessionParticipants');
        this.leaveSessionBtn = document.getElementById('leaveSessionBtn');
        
        // 任务队列元素
        this.taskQueue = document.getElementById('taskQueue');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.startQueueBtn = document.getElementById('startQueueBtn');
        this.pauseQueueBtn = document.getElementById('pauseQueueBtn');
        this.skipTaskBtn = document.getElementById('skipTaskBtn');
        
        // 当前任务显示
        this.currentTask = document.getElementById('currentTask');
        this.currentTaskName = document.getElementById('currentTaskName');
        this.currentTaskDescription = document.getElementById('currentTaskDescription');
        this.taskTimer = document.getElementById('taskTimer');
        this.taskProgressFill = document.getElementById('taskProgressFill');
        
        // 任务管理模态框
        this.addTaskModal = document.getElementById('addTaskModal');
        this.closeAddTaskBtn = document.getElementById('closeAddTaskBtn');
        this.cancelAddTaskBtn = document.getElementById('cancelAddTaskBtn');
        this.confirmAddTaskBtn = document.getElementById('confirmAddTaskBtn');
        this.taskNameInput = document.getElementById('taskNameInput');
        this.taskDescriptionInput = document.getElementById('taskDescriptionInput');
        this.taskMinutesInput = document.getElementById('taskMinutesInput');
        this.taskSecondsInput = document.getElementById('taskSecondsInput');
        
        // 编辑任务模态框
        this.editTaskModal = document.getElementById('editTaskModal');
        this.closeEditTaskBtn = document.getElementById('closeEditTaskBtn');
        this.cancelEditTaskBtn = document.getElementById('cancelEditTaskBtn');
        this.confirmEditTaskBtn = document.getElementById('confirmEditTaskBtn');
        this.deleteTaskBtn = document.getElementById('deleteTaskBtn');
        this.editTaskNameInput = document.getElementById('editTaskNameInput');
        this.editTaskDescriptionInput = document.getElementById('editTaskDescriptionInput');
        this.editTaskMinutesInput = document.getElementById('editTaskMinutesInput');
        this.editTaskSecondsInput = document.getElementById('editTaskSecondsInput');
        
        this.currentEditingTaskIndex = -1;
    }
    
    bindEvents() {
        // 主控制按钮
        this.playPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.timerFullscreenBtn.addEventListener('click', () => this.toggleTimerFullscreen());
        
        // 预设按钮
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setTime(minutes * 60);
                this.updatePresetButtons(minutes);
                this.updateFloatingPresetButtons(minutes);
            });
        });
        
        // 自定义时间
        this.applyCustomBtn.addEventListener('click', () => this.applyCustomTime());
        
        // 浮动快捷设置
        this.toggleFloatingBtn.addEventListener('click', () => this.toggleFloatingPanel());
        this.closeFloatingBtn.addEventListener('click', () => this.hideFloatingPanel());
        
        // 浮动预设按钮
        this.floatingPresetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setTime(minutes * 60);
                this.updatePresetButtons(minutes);
                this.updateFloatingPresetButtons(minutes);
            });
        });
        
        // 浮动自定义时间
        this.floatingApplyBtn.addEventListener('click', () => this.applyFloatingCustomTime());
        
        // 设置
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.hideSettings();
        });
        
        // 设置项事件
        this.soundEnabledCb.addEventListener('change', () => this.saveSettings());
        this.notificationEnabledCb.addEventListener('change', () => this.saveSettings());
        
        // 文本设置
        this.taskTitleInput.addEventListener('input', () => {
            this.settings.taskTitle = this.taskTitleInput.value || 'Focus Time';
            this.taskTitleEl.textContent = this.settings.taskTitle;
            this.saveSettings();
        });
        
        this.taskNameInput.addEventListener('input', () => {
            this.settings.taskName = this.taskNameInput.value || 'Focus Time';
            this.taskNameEl.textContent = this.settings.taskName;
            this.saveSettings();
        });
        
        this.taskMottoInput.addEventListener('input', () => {
            this.settings.taskMotto = this.taskMottoInput.value || 'Stay focused, be productive';
            this.taskMottoEl.textContent = this.settings.taskMotto;
            this.saveSettings();
        });
        
        // 背景设置
        this.bgColorRadio.addEventListener('change', () => this.toggleBackgroundSettings('color'));
        this.bgGradientRadio.addEventListener('change', () => this.toggleBackgroundSettings('gradient'));
        this.bgImageRadio.addEventListener('change', () => this.toggleBackgroundSettings('image'));
        
        this.bgColorPicker.addEventListener('input', () => {
            this.settings.background.color = this.bgColorPicker.value;
            this.applyBackground();
            this.saveSettings();
        });
        
        this.gradientType.addEventListener('change', () => {
            this.settings.background.gradient.type = this.gradientType.value;
            this.applyBackground();
            this.saveSettings();
        });
        
        this.gradientColor1.addEventListener('input', () => {
            this.settings.background.gradient.color1 = this.gradientColor1.value;
            this.applyBackground();
            this.saveSettings();
        });
        
        this.gradientColor2.addEventListener('input', () => {
            this.settings.background.gradient.color2 = this.gradientColor2.value;
            this.applyBackground();
            this.saveSettings();
        });
        
        this.bgImageUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.settings.background.image = event.target.result;
                    this.imagePreview.style.backgroundImage = `url(${event.target.result})`;
                    this.imagePreview.textContent = '';
                    this.applyBackground();
                    this.saveSettings();
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        // Logo设置
        this.logoUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.settings.logo.image = event.target.result;
                    this.logoPreview.style.backgroundImage = `url(${event.target.result})`;
                    this.logoPreview.textContent = '';
                    this.applyLogo();
                    this.saveSettings();
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        this.logoPositionRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.logo.position = e.target.value;
                this.applyLogo();
                this.saveSettings();
            });
        });
        
        // 主题切换
        this.themeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
                this.updateThemeButtons(theme);
            });
        });
        
        // 其他功能
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.shareBtn.addEventListener('click', () => this.shareApp());
        
        // 设置选项卡切换
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.code === 'Escape') {
                this.hideSettings();
                this.hideFloatingPanel();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        });
        
        // 点击外部关闭浮动面板
        document.addEventListener('click', (e) => {
            if (this.floatingPresets.classList.contains('active') && 
                !this.floatingPresets.contains(e.target)) {
                this.hideFloatingPanel();
            }
        });
        
        // 全屏状态变化
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.showFullscreenTip();
            }
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                // 页面隐藏时继续计时
                console.log('Page hidden, timer continues running');
            }
        });
        
        // 同步计时器事件绑定
        this.bindSyncTimerEvents();
        
        // 任务队列事件绑定
        this.bindTaskQueueEvents();
    }
    
    toggleTimer() {
        if (this.isSyncMode && this.syncTimer) {
            // 同步模式下通过WebSocket控制
            if (this.isRunning) {
                this.syncTimer.pauseTimer();
            } else {
                this.syncTimer.startTimer();
            }
        } else {
            // 本地模式
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        }
    }
    
    startTimer() {
        if (this.remainingSeconds <= 0) {
            this.resetTimer();
            return;
        }
        
        this.isRunning = true;
        this.timerInterval = setInterval(() => this.tick(), 1000);
        
        // 更新UI
        this.playPauseIcon.textContent = '⏸️';
        this.playPauseBtn.classList.add('running');
        this.progressTextEl.textContent = 'Running...';
        
        console.log('Timer started');
    }
    
    pauseTimer() {
        this.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 更新UI
        this.playPauseIcon.textContent = '▶️';
        this.playPauseBtn.classList.remove('running');
        this.progressTextEl.textContent = 'Paused';
        
        console.log('Timer paused');
    }
    
    resetTimer() {
        if (this.isSyncMode && this.syncTimer) {
            // 同步模式下通过WebSocket控制
            this.syncTimer.resetTimer();
        } else {
            // 本地模式
            this.pauseTimer();
            this.remainingSeconds = this.originalSeconds;
            
            // 重置UI
            this.playPauseIcon.textContent = '▶️';
            this.playPauseBtn.classList.remove('running');
            this.progressTextEl.textContent = 'Ready to start';
            
            this.updateDisplay();
            console.log('Timer reset');
        }
    }
    
    tick() {
        this.remainingSeconds--;
        
        // 检查结束
        if (this.remainingSeconds <= 0) {
            this.timerComplete();
            return;
        }
        
        this.updateDisplay();
    }
    
    timerComplete() {
        this.pauseTimer();
        this.remainingSeconds = 0;
        this.updateDisplay();
        
        // 播放提醒
        this.playNotificationSound();
        this.showNotification();
        this.flashWarning();
        
        // 更新UI
        this.progressTextEl.textContent = 'Completed! 🎉';
        this.playPauseIcon.textContent = '🔄';
        
        console.log('Timer completed');
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        
        // 更新时间显示
        this.minutesEl.textContent = String(minutes).padStart(2, '0');
        this.secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // 更新进度条
        const progress = ((this.originalSeconds - this.remainingSeconds) / this.originalSeconds) * 100;
        this.progressFillEl.style.width = `${Math.min(progress, 100)}%`;
        
        // 更新页面标题
        if (this.isRunning) {
            document.title = `${minutes}:${String(seconds).padStart(2, '0')} - ${this.settings.taskName}`;
        } else {
            document.title = '10 Minute Timer - Simple & Elegant Countdown Timer';
        }
    }
    
    setTime(seconds) {
        if (this.isSyncMode && this.syncTimer) {
            // 同步模式下通过WebSocket控制
            this.syncTimer.setTime(seconds);
        } else {
            // 本地模式
            if (!this.isRunning) {
                this.totalSeconds = seconds;
                this.remainingSeconds = seconds;
                this.originalSeconds = seconds;
                this.updateDisplay();
                this.progressTextEl.textContent = 'Ready to start';
                
                // 重置按钮状态
                this.playPauseIcon.textContent = '▶️';
                this.playPauseBtn.classList.remove('running');
            }
        }
    }
    
    updatePresetButtons(activeMinutes) {
        this.presetBtns.forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            btn.classList.toggle('active', minutes === activeMinutes);
        });
    }
    
    updateFloatingPresetButtons(activeMinutes) {
        this.floatingPresetBtns.forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            btn.classList.toggle('active', minutes === activeMinutes);
        });
    }
    
    applyCustomTime() {
        const minutes = parseInt(this.customMinutes.value) || 0;
        const seconds = parseInt(this.customSeconds.value) || 0;
        const totalSeconds = minutes * 60 + seconds;
        
        if (totalSeconds > 0) {
            this.setTime(totalSeconds);
            // 清除预设按钮选中状态
            this.presetBtns.forEach(btn => btn.classList.remove('active'));
            this.floatingPresetBtns.forEach(btn => btn.classList.remove('active'));
            
            // 同步浮动输入框
            this.floatingMinutes.value = minutes;
            this.floatingSeconds.value = seconds;
        }
    }
    
    applyFloatingCustomTime() {
        const minutes = parseInt(this.floatingMinutes.value) || 0;
        const seconds = parseInt(this.floatingSeconds.value) || 0;
        const totalSeconds = minutes * 60 + seconds;
        
        if (totalSeconds > 0) {
            this.setTime(totalSeconds);
            // 清除预设按钮选中状态
            this.presetBtns.forEach(btn => btn.classList.remove('active'));
            this.floatingPresetBtns.forEach(btn => btn.classList.remove('active'));
            
            // 同步主输入框
            this.customMinutes.value = minutes;
            this.customSeconds.value = seconds;
            
            // 自动隐藏浮动面板
            this.hideFloatingPanel();
        }
    }
    
    toggleFloatingPanel() {
        if (this.floatingPresets.classList.contains('active')) {
            this.hideFloatingPanel();
        } else {
            this.showFloatingPanel();
        }
    }
    
    showFloatingPanel() {
        this.floatingPresets.classList.add('active');
        
        // 同步当前时间到浮动面板
        const minutes = parseInt(this.customMinutes.value) || 0;
        const seconds = parseInt(this.customSeconds.value) || 0;
        this.floatingMinutes.value = minutes;
        this.floatingSeconds.value = seconds;
        
        // 同步预设按钮状态
        const activePreset = document.querySelector('.preset-btn.active');
        if (activePreset) {
            const minutes = parseInt(activePreset.dataset.minutes);
            this.updateFloatingPresetButtons(minutes);
        }
    }
    
    hideFloatingPanel() {
        this.floatingPresets.classList.remove('active');
    }
    
    // 音效和通知
    playNotificationSound() {
        if (!this.settings.soundEnabled) return;
        
        try {
            // 使用 Web Audio API 生成提醒音
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 播放三个音符的和弦
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    // 音量包络
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                }, index * 150);
            });
        } catch (e) {
            console.log('Could not play notification sound:', e);
        }
    }
    
    showNotification() {
        if (!this.settings.notificationEnabled) return;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Completed! 🎉', {
                body: `${this.settings.taskName} session is finished. Time for a break!`,
                icon: '/facicon.png',
                tag: 'timer-complete'
            });
        }
    }
    
    flashWarning() {
        document.body.classList.add('warning-flash');
        setTimeout(() => {
            document.body.classList.remove('warning-flash');
        }, 1500);
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    }
    
    // 设置管理
    showSettings() {
        this.settingsModal.classList.add('show');
        this.loadSettingsToForm();
    }
    
    hideSettings() {
        this.settingsModal.classList.remove('show');
    }
    
    loadSettingsToForm() {
        this.soundEnabledCb.checked = this.settings.soundEnabled;
        this.notificationEnabledCb.checked = this.settings.notificationEnabled;
        this.taskTitleInput.value = this.settings.taskTitle;
        this.taskNameInput.value = this.settings.taskName;
        this.taskMottoInput.value = this.settings.taskMotto;
        this.updateThemeButtons(this.settings.theme);
        
        // Logo设置
        if (this.settings.logo.image) {
            this.logoPreview.style.backgroundImage = `url(${this.settings.logo.image})`;
            this.logoPreview.textContent = '';
        } else {
            this.logoPreview.style.backgroundImage = '';
            this.logoPreview.textContent = 'No logo selected';
        }
        
        // 设置logo位置单选按钮
        const logoPositionRadio = document.querySelector(`input[name="logoPosition"][value="${this.settings.logo.position}"]`);
        if (logoPositionRadio) {
            logoPositionRadio.checked = true;
        }
        
        // 背景设置
        switch (this.settings.background.type) {
            case 'color':
                this.bgColorRadio.checked = true;
                break;
            case 'gradient':
                this.bgGradientRadio.checked = true;
                break;
            case 'image':
                this.bgImageRadio.checked = true;
                break;
        }
        
        this.toggleBackgroundSettings(this.settings.background.type);
        
        this.bgColorPicker.value = this.settings.background.color;
        this.gradientType.value = this.settings.background.gradient.type;
        this.gradientColor1.value = this.settings.background.gradient.color1;
        this.gradientColor2.value = this.settings.background.gradient.color2;
        
        if (this.settings.background.image) {
            this.imagePreview.style.backgroundImage = `url(${this.settings.background.image})`;
            this.imagePreview.textContent = '';
        } else {
            this.imagePreview.style.backgroundImage = '';
            this.imagePreview.textContent = 'No image selected';
        }
    }
    
    saveSettings() {
        this.settings = {
            soundEnabled: this.soundEnabledCb.checked,
            notificationEnabled: this.notificationEnabledCb.checked,
            taskTitle: this.taskTitleInput?.value || this.settings.taskTitle,
            taskName: this.taskNameInput?.value || this.settings.taskName,
            taskMotto: this.taskMottoInput?.value || this.settings.taskMotto,
            theme: this.settings.theme,
            background: this.settings.background,
            logo: this.settings.logo
        };
        
        // 更新显示
        this.taskTitleEl.textContent = this.settings.taskTitle;
        this.taskNameEl.textContent = this.settings.taskName;
        this.taskMottoEl.textContent = this.settings.taskMotto;
        
        // 保存到本地存储
        localStorage.setItem('timerSettings', JSON.stringify(this.settings));
        console.log('Settings saved');
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('timerSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                
                // 应用设置
                this.taskTitleEl.textContent = this.settings.taskTitle;
                this.taskNameEl.textContent = this.settings.taskName;
                this.taskMottoEl.textContent = this.settings.taskMotto;
                this.setTheme(this.settings.theme);
                this.applyBackground();
                this.applyLogo();
            }
        } catch (e) {
            console.log('Could not load settings:', e);
        }
    }
    
    // 主题管理
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.settings.theme = theme;
        this.saveSettings();
    }
    
    updateThemeButtons(activeTheme) {
        this.themeBtns.forEach(btn => {
            const theme = btn.dataset.theme;
            btn.classList.toggle('active', theme === activeTheme);
        });
    }
    
    // 背景设置
    toggleBackgroundSettings(type) {
        this.settings.background.type = type;
        
        this.colorSettings.style.display = 'none';
        this.gradientSettings.style.display = 'none';
        this.imageSettings.style.display = 'none';
        
        switch (type) {
            case 'color':
                this.colorSettings.style.display = 'block';
                break;
            case 'gradient':
                this.gradientSettings.style.display = 'block';
                break;
            case 'image':
                this.imageSettings.style.display = 'block';
                break;
        }
        
        this.applyBackground();
        this.saveSettings();
    }
    
    applyBackground() {
        const timerDisplay = document.querySelector('.timer-display');
        
        switch (this.settings.background.type) {
            case 'color':
                timerDisplay.style.background = this.settings.background.color;
                break;
            case 'gradient':
                const { type, color1, color2 } = this.settings.background.gradient;
                if (type === 'linear') {
                    timerDisplay.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
                } else {
                    timerDisplay.style.background = `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;
                }
                break;
            case 'image':
                if (this.settings.background.image) {
                    timerDisplay.style.background = `url(${this.settings.background.image}) no-repeat center center`;
                    timerDisplay.style.backgroundSize = 'cover';
                }
                break;
        }
    }
    
    // Logo设置
    applyLogo() {
        if (this.settings.logo.image) {
            // 清除所有位置类
            this.logoContainerEl.className = 'logo-container';
            
            // 添加新的位置类
            this.logoContainerEl.classList.add(`logo-${this.settings.logo.position}`);
            
            // 设置logo图片
            this.logoContainerEl.style.backgroundImage = `url(${this.settings.logo.image})`;
            this.logoContainerEl.style.display = 'block';
            
            // 处理特殊位置
            if (this.settings.logo.position === 'bottom-center') {
                // 确保logo在底部显示
                this.taskMottoEl.style.marginBottom = '70px';
            } else {
                this.taskMottoEl.style.marginBottom = '';
            }
        } else {
            // 如果没有logo，则隐藏容器
            this.logoContainerEl.style.display = 'none';
            this.taskMottoEl.style.marginBottom = '';
        }
    }
    
    // 全屏功能
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => {
                console.log('Cannot enter fullscreen:', e);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // 倒计时全屏
    toggleTimerFullscreen() {
        if (!document.fullscreenElement) {
            if (this.timerSection.requestFullscreen) {
                this.timerSection.requestFullscreen().catch(e => {
                    console.log('Cannot enter fullscreen:', e);
                });
            } else if (this.timerSection.webkitRequestFullscreen) { /* Safari */
                this.timerSection.webkitRequestFullscreen();
            } else if (this.timerSection.msRequestFullscreen) { /* IE11 */
                this.timerSection.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    }
    
    showFullscreenTip() {
        this.fullscreenTip.style.display = 'block';
        setTimeout(() => {
            this.fullscreenTip.style.display = 'none';
        }, 3000);
    }
    
    // 分享功能
    shareApp() {
        const shareData = {
            title: '10 Minute Timer - Simple & Elegant Countdown Timer',
            text: 'Check out this beautiful and simple countdown timer for productivity!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(e => {
                console.log('Error sharing:', e);
                this.fallbackShare();
            });
        } else {
            this.fallbackShare();
        }
    }
    
    fallbackShare() {
        const url = window.location.href;
        const text = 'Check out this beautiful countdown timer!';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                this.showTemporaryMessage('Link copied to clipboard!');
            }).catch(() => {
                this.showUrlPrompt(url);
            });
        } else {
            this.showUrlPrompt(url);
        }
    }
    
    showUrlPrompt(url) {
        const copied = prompt('Copy this link to share:', url);
    }
    
    showTemporaryMessage(message) {
        const msgEl = document.createElement('div');
        msgEl.textContent = message;
        msgEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 2000;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(msgEl);
        
        setTimeout(() => {
            msgEl.style.opacity = '0';
            msgEl.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                document.body.removeChild(msgEl);
            }, 300);
        }, 2000);
    }

    // 切换设置选项卡
    switchTab(tabName) {
        // 更新按钮状态
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // 更新内容显示
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });
    }
    
    // 绑定同步计时器事件
    bindSyncTimerEvents() {
        // 创建会话按钮
        this.createSessionBtn.addEventListener('click', () => this.showCreateSessionModal());
        
        // 加入会话按钮
        this.joinSessionBtn.addEventListener('click', () => this.showJoinSessionModal());
        this.sessionCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.showJoinSessionModal();
            }
        });
        
        // 创建会话模态框事件
        this.closeCreateSessionBtn.addEventListener('click', () => this.hideCreateSessionModal());
        this.cancelCreateSessionBtn.addEventListener('click', () => this.hideCreateSessionModal());
        this.confirmCreateSessionBtn.addEventListener('click', () => this.createSyncSession());
        this.createSessionModal.addEventListener('click', (e) => {
            if (e.target === this.createSessionModal) this.hideCreateSessionModal();
        });
        
        // 加入会话模态框事件
        this.closeJoinSessionBtn.addEventListener('click', () => this.hideJoinSessionModal());
        this.cancelJoinSessionBtn.addEventListener('click', () => this.hideJoinSessionModal());
        this.confirmJoinSessionBtn.addEventListener('click', () => this.joinSyncSession());
        this.joinSessionModal.addEventListener('click', (e) => {
            if (e.target === this.joinSessionModal) this.hideJoinSessionModal();
        });
        
        // 会话信息模态框事件
        this.closeSessionInfoBtn.addEventListener('click', () => this.hideSessionInfoModal());
        this.sessionInfoModal.addEventListener('click', (e) => {
            if (e.target === this.sessionInfoModal) this.hideSessionInfoModal();
        });
        
        // 复制链接按钮
        this.copyHostUrlBtn.addEventListener('click', () => this.copyToClipboard(this.hostUrlDisplay.value));
        this.copyParticipantUrlBtn.addEventListener('click', () => this.copyToClipboard(this.participantUrlDisplay.value));
        
        // 输入框回车事件
        this.hostNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createSyncSession();
        });
        this.sessionNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createSyncSession();
        });
        this.participantNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinSyncSession();
        });
        this.joinSessionCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinSyncSession();
        });
    }
    
    // 显示创建会话模态框
    showCreateSessionModal() {
        this.createSessionModal.classList.add('show');
        this.hostNameInput.focus();
    }
    
    // 隐藏创建会话模态框
    hideCreateSessionModal() {
        this.createSessionModal.classList.remove('show');
        this.hostNameInput.value = '';
        this.sessionNameInput.value = '';
    }
    
    // 显示加入会话模态框
    showJoinSessionModal() {
        this.joinSessionModal.classList.add('show');
        
        // 如果主界面有输入的会话代码，自动填入
        if (this.sessionCodeInput.value.trim()) {
            this.joinSessionCodeInput.value = this.sessionCodeInput.value.trim();
        }
        
        this.participantNameInput.focus();
    }
    
    // 隐藏加入会话模态框
    hideJoinSessionModal() {
        this.joinSessionModal.classList.remove('show');
        this.participantNameInput.value = '';
        this.joinSessionCodeInput.value = '';
    }
    
    // 显示会话信息模态框
    showSessionInfoModal() {
        this.sessionInfoModal.classList.add('show');
    }
    
    // 隐藏会话信息模态框
    hideSessionInfoModal() {
        this.sessionInfoModal.classList.remove('show');
    }
    
    // 创建同步会话
    async createSyncSession() {
        const hostName = this.hostNameInput.value.trim();
        const sessionName = this.sessionNameInput.value.trim();
        
        if (!hostName) {
            alert('Please enter your name');
            this.hostNameInput.focus();
            return;
        }
        
        if (!sessionName) {
            alert('Please enter a session name');
            this.sessionNameInput.focus();
            return;
        }
        
        try {
            // 禁用按钮，显示加载状态
            this.confirmCreateSessionBtn.disabled = true;
            this.confirmCreateSessionBtn.innerHTML = '<span class="icon">⏳</span><span class="text">Creating...</span>';
            
            // 创建同步计时器实例
            if (!this.syncTimer) {
                this.syncTimer = new SyncTimer();
                this.setupSyncTimerEvents();
            }
            
            // 创建会话
            const result = await this.syncTimer.createSession(hostName, sessionName);
            
            // 隐藏创建模态框
            this.hideCreateSessionModal();
            
            // 显示会话信息
            this.displaySessionCode.textContent = result.sessionId;
            this.hostUrlDisplay.value = window.location.origin + result.hostUrl;
            this.participantUrlDisplay.value = window.location.origin + result.participantUrl;
            this.hostDisplayName.textContent = hostName;
            
            this.showSessionInfoModal();
            
            // 启用同步模式
            this.enableSyncMode();
            
        } catch (error) {
            console.error('Failed to create session:', error);
            alert('Failed to create session: ' + error.message);
        } finally {
            // 恢复按钮状态
            this.confirmCreateSessionBtn.disabled = false;
            this.confirmCreateSessionBtn.innerHTML = '<span class="icon">👑</span><span class="text">Create Session</span>';
        }
    }
    
    // 加入同步会话
    async joinSyncSession() {
        const participantName = this.participantNameInput.value.trim();
        const sessionCode = this.joinSessionCodeInput.value.trim().toUpperCase();
        
        if (!participantName) {
            alert('Please enter your name');
            this.participantNameInput.focus();
            return;
        }
        
        if (!sessionCode) {
            alert('Please enter a session code');
            this.joinSessionCodeInput.focus();
            return;
        }
        
        try {
            // 禁用按钮，显示加载状态
            this.confirmJoinSessionBtn.disabled = true;
            this.confirmJoinSessionBtn.innerHTML = '<span class="icon">⏳</span><span class="text">Joining...</span>';
            
            // 创建同步计时器实例
            if (!this.syncTimer) {
                this.syncTimer = new SyncTimer();
                this.setupSyncTimerEvents();
            }
            
            // 加入会话
            await this.syncTimer.joinSession(sessionCode, participantName);
            
            // 隐藏加入模态框
            this.hideJoinSessionModal();
            
            // 启用同步模式
            this.enableSyncMode();
            
            this.showTemporaryMessage(`Successfully joined session: ${sessionCode}`);
            
        } catch (error) {
            console.error('Failed to join session:', error);
            alert('Failed to join session: ' + error.message);
        } finally {
            // 恢复按钮状态
            this.confirmJoinSessionBtn.disabled = false;
            this.confirmJoinSessionBtn.innerHTML = '<span class="icon">🚀</span><span class="text">Join</span>';
        }
    }
    
    // 设置同步计时器事件监听
    setupSyncTimerEvents() {
        if (!this.syncTimer) return;
        
        // 连接状态事件
        this.syncTimer.on('connected', (data) => {
            this.updateSyncStatus('connected', `Connected to session: ${data.sessionId}`);
        });
        
        this.syncTimer.on('disconnected', (data) => {
            this.updateSyncStatus('disconnected', 'Disconnected from session');
        });
        
        this.syncTimer.on('error', (data) => {
            this.updateSyncStatus('error', `Error: ${data.message}`);
            console.error('Sync timer error:', data.message);
        });
        
        // 状态同步事件
        this.syncTimer.on('initialState', (data) => {
            this.syncTimerState(data.timerState);
            this.updateConnectionsList(data.connections);
        });
        
        this.syncTimer.on('timerUpdate', (timerState) => {
            this.syncTimerState(timerState);
        });
        
        this.syncTimer.on('timerComplete', (timerState) => {
            this.syncTimerState(timerState);
            this.playNotificationSound();
            this.showNotification();
            this.flashWarning();
        });
        
        this.syncTimer.on('connectionUpdate', (connections) => {
            this.updateConnectionsList(connections);
        });
    }
    
    // 启用同步模式
    enableSyncMode() {
        this.isSyncMode = true;
        this.syncStatus.style.display = 'block';
        
        // 显示会话管理面板
        if (this.syncTimer) {
            this.showSessionPanel(this.syncTimer.sessionData, this.syncTimer.userType);
        }
        
        // 如果不是主持人，禁用控制按钮
        if (this.syncTimer && this.syncTimer.userType !== 'host') {
            this.disableHostControls();
        }
    }
    
    // 禁用同步模式
    disableSyncMode() {
        this.isSyncMode = false;
        this.syncStatus.style.display = 'none';
        this.enableHostControls();
        
        // 隐藏会话管理面板
        this.hideSessionPanel();
        
        if (this.syncTimer) {
            this.syncTimer.disconnect();
            this.syncTimer = null;
        }
    }
    
    // 禁用主持人控制
    disableHostControls() {
        this.playPauseBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.presetBtns.forEach(btn => btn.disabled = true);
        this.floatingPresetBtns.forEach(btn => btn.disabled = true);
        this.applyCustomBtn.disabled = true;
        this.floatingApplyBtn.disabled = true;
        this.customMinutes.disabled = true;
        this.customSeconds.disabled = true;
        this.floatingMinutes.disabled = true;
        this.floatingSeconds.disabled = true;
    }
    
    // 启用主持人控制
    enableHostControls() {
        this.playPauseBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.presetBtns.forEach(btn => btn.disabled = false);
        this.floatingPresetBtns.forEach(btn => btn.disabled = false);
        this.applyCustomBtn.disabled = false;
        this.floatingApplyBtn.disabled = false;
        this.customMinutes.disabled = false;
        this.customSeconds.disabled = false;
        this.floatingMinutes.disabled = false;
        this.floatingSeconds.disabled = false;
    }
    
    // 更新同步状态显示
    updateSyncStatus(status, message) {
        this.statusDot.className = `status-dot ${status}`;
        this.statusText.textContent = message;
        
        if (this.syncTimer) {
            const state = this.syncTimer.getState();
            this.sessionInfo.textContent = `${state.userType === 'host' ? '👑 Host' : '👥 Participant'} | ${state.sessionId || ''}`;
        }
    }
    
    // 同步计时器状态
    syncTimerState(timerState) {
        if (!timerState) return;
        
        // 更新本地状态
        this.totalSeconds = timerState.totalSeconds;
        this.remainingSeconds = timerState.remainingSeconds;
        this.originalSeconds = timerState.originalSeconds;
        this.isRunning = timerState.isRunning;
        
        // 更新任务信息
        if (timerState.currentTask) {
            this.settings.taskTitle = timerState.currentTask.title;
            this.settings.taskName = timerState.currentTask.name;
            this.settings.taskMotto = timerState.currentTask.motto;
            
            this.taskTitleEl.textContent = this.settings.taskTitle;
            this.taskNameEl.textContent = this.settings.taskName;
            this.taskMottoEl.textContent = this.settings.taskMotto;
        }
        
        // 更新显示
        this.updateDisplay();
        
        // 更新按钮状态
        if (timerState.isRunning) {
            this.playPauseIcon.textContent = '⏸️';
            this.playPauseBtn.classList.add('running');
            this.progressTextEl.textContent = 'Running...';
        } else {
            this.playPauseIcon.textContent = '▶️';
            this.playPauseBtn.classList.remove('running');
            this.progressTextEl.textContent = timerState.remainingSeconds <= 0 ? 'Completed! 🎉' : 
                                              timerState.isPaused ? 'Paused' : 'Ready to start';
        }
    }
    
    // 更新连接列表
    updateConnectionsList(connections) {
        if (!this.usersList) return;
        
        // 清空现有列表（保留主持人）
        const hostItem = this.usersList.querySelector('.user-item.host');
        this.usersList.innerHTML = '';
        if (hostItem) {
            this.usersList.appendChild(hostItem);
        }
        
        // 添加参与者
        connections.forEach(conn => {
            if (conn.type === 'participant') {
                const userItem = document.createElement('div');
                userItem.className = 'user-item participant';
                userItem.innerHTML = `
                    <span class="user-icon">👤</span>
                    <span class="user-name">${conn.name}</span>
                    <span class="user-type">Participant</span>
                `;
                this.usersList.appendChild(userItem);
            }
        });
    }
    
    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showTemporaryMessage('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showTemporaryMessage('Link copied to clipboard!');
        }
    }
    
    // ==================== 任务队列管理 ====================
    
    bindTaskQueueEvents() {
        // 任务队列控制按钮
        if (this.addTaskBtn) {
            this.addTaskBtn.addEventListener('click', () => this.showAddTaskModal());
        }
        
        if (this.startQueueBtn) {
            this.startQueueBtn.addEventListener('click', () => this.startQueue());
        }
        
        if (this.pauseQueueBtn) {
            this.pauseQueueBtn.addEventListener('click', () => this.pauseQueue());
        }
        
        if (this.skipTaskBtn) {
            this.skipTaskBtn.addEventListener('click', () => this.skipCurrentTask());
        }
        
        if (this.leaveSessionBtn) {
            this.leaveSessionBtn.addEventListener('click', () => this.leaveSession());
        }
        
        // 添加任务模态框事件
        if (this.closeAddTaskBtn) {
            this.closeAddTaskBtn.addEventListener('click', () => this.hideAddTaskModal());
        }
        
        if (this.cancelAddTaskBtn) {
            this.cancelAddTaskBtn.addEventListener('click', () => this.hideAddTaskModal());
        }
        
        if (this.confirmAddTaskBtn) {
            this.confirmAddTaskBtn.addEventListener('click', () => this.addTask());
        }
        
        // 编辑任务模态框事件
        if (this.closeEditTaskBtn) {
            this.closeEditTaskBtn.addEventListener('click', () => this.hideEditTaskModal());
        }
        
        if (this.cancelEditTaskBtn) {
            this.cancelEditTaskBtn.addEventListener('click', () => this.hideEditTaskModal());
        }
        
        if (this.confirmEditTaskBtn) {
            this.confirmEditTaskBtn.addEventListener('click', () => this.saveTaskEdit());
        }
        
        if (this.deleteTaskBtn) {
            this.deleteTaskBtn.addEventListener('click', () => this.deleteTask());
        }
        
        // 任务预设按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.matches('.task-presets .preset-btn.small')) {
                const minutes = parseInt(e.target.dataset.minutes);
                if (this.addTaskModal.style.display !== 'none') {
                    this.taskMinutesInput.value = minutes;
                    this.taskSecondsInput.value = 0;
                }
            }
        });
        
        // 模态框点击外部关闭
        if (this.addTaskModal) {
            this.addTaskModal.addEventListener('click', (e) => {
                if (e.target === this.addTaskModal) {
                    this.hideAddTaskModal();
                }
            });
        }
        
        if (this.editTaskModal) {
            this.editTaskModal.addEventListener('click', (e) => {
                if (e.target === this.editTaskModal) {
                    this.hideEditTaskModal();
                }
            });
        }
    }
    
    // 显示会话管理面板
    showSessionPanel(sessionData, userType) {
        if (!this.sessionPanel) return;
        
        this.sessionPanel.style.display = 'block';
        
        // 更新会话信息
        if (this.sessionTitle) {
            this.sessionTitle.textContent = `Session: ${sessionData.sessionName}`;
        }
        
        if (this.sessionCodeDisplay) {
            this.sessionCodeDisplay.textContent = `CODE: ${sessionData.sessionId}`;
        }
        
        if (this.sessionRole) {
            this.sessionRole.textContent = `Role: ${userType === 'host' ? 'Host' : 'Participant'}`;
        }
        
        // 显示任务队列（仅主持人）
        if (this.taskQueue) {
            this.taskQueue.style.display = userType === 'host' ? 'block' : 'none';
        }
        
        // 初始化任务队列
        if (userType === 'host') {
            this.initializeDefaultTasks();
            this.renderTaskList();
            this.updateQueueControls();
        }
        
        this.updateCurrentTaskDisplay();
    }
    
    // 隐藏会话管理面板
    hideSessionPanel() {
        if (this.sessionPanel) {
            this.sessionPanel.style.display = 'none';
        }
        
        // 重置任务队列状态
        this.taskQueue = [];
        this.currentTaskIndex = -1;
        this.isQueueMode = false;
        this.queuePaused = false;
    }
    
    // 初始化默认任务
    initializeDefaultTasks() {
        if (this.taskQueue.length === 0) {
            this.taskQueue = [
                {
                    id: Date.now() + 1,
                    name: 'Welcome & Introduction',
                    description: 'Welcome participants and introduce the session agenda',
                    duration: 300, // 5 minutes
                    completed: false
                },
                {
                    id: Date.now() + 2,
                    name: 'Main Presentation',
                    description: 'Core content presentation and demonstration',
                    duration: 900, // 15 minutes
                    completed: false
                },
                {
                    id: Date.now() + 3,
                    name: 'Q&A Session',
                    description: 'Questions and answers from participants',
                    duration: 600, // 10 minutes
                    completed: false
                }
            ];
        }
    }
    
    // 渲染任务列表
    renderTaskList() {
        if (!this.taskList) return;
        
        this.taskList.innerHTML = '';
        
        if (this.taskQueue.length === 0) {
            this.taskList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #64748b;">
                    <p>No tasks added yet</p>
                    <p>Click "Add Task" to create your first timer task</p>
                </div>
            `;
            return;
        }
        
        this.taskQueue.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${index === this.currentTaskIndex ? 'active' : ''} ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-duration">${this.formatDuration(task.duration)}</div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-secondary btn-small" onclick="timer.editTask(${index})">
                        <span class="icon">✏️</span>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="timer.removeTask(${index})">
                        <span class="icon">🗑️</span>
                    </button>
                </div>
            `;
            this.taskList.appendChild(taskItem);
        });
    }
    
    // 格式化持续时间
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        }
        return `${remainingSeconds}s`;
    }
    
    // 显示添加任务模态框
    showAddTaskModal() {
        if (!this.addTaskModal) return;
        
        // 重置表单
        this.taskNameInput.value = '';
        this.taskDescriptionInput.value = '';
        this.taskMinutesInput.value = 5;
        this.taskSecondsInput.value = 0;
        
        this.addTaskModal.style.display = 'flex';
        this.taskNameInput.focus();
    }
    
    // 隐藏添加任务模态框
    hideAddTaskModal() {
        if (this.addTaskModal) {
            this.addTaskModal.style.display = 'none';
        }
    }
    
    // 添加任务
    addTask() {
        const name = this.taskNameInput.value.trim();
        const description = this.taskDescriptionInput.value.trim();
        const minutes = parseInt(this.taskMinutesInput.value) || 0;
        const seconds = parseInt(this.taskSecondsInput.value) || 0;
        
        if (!name) {
            alert('Please enter a task name');
            return;
        }
        
        const duration = minutes * 60 + seconds;
        if (duration <= 0) {
            alert('Please set a valid duration');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            name,
            description: description || 'No description',
            duration,
            completed: false
        };
        
        this.taskQueue.push(newTask);
        this.renderTaskList();
        this.updateQueueControls();
        this.hideAddTaskModal();
        
        // 如果是同步模式，广播任务队列更新
        if (this.isSyncMode && this.syncTimer) {
            this.syncTimer.updateTaskQueue(this.taskQueue);
        }
    }
    
    // 编辑任务
    editTask(index) {
        if (index < 0 || index >= this.taskQueue.length) return;
        
        const task = this.taskQueue[index];
        this.currentEditingTaskIndex = index;
        
        // 填充表单
        this.editTaskNameInput.value = task.name;
        this.editTaskDescriptionInput.value = task.description;
        this.editTaskMinutesInput.value = Math.floor(task.duration / 60);
        this.editTaskSecondsInput.value = task.duration % 60;
        
        this.editTaskModal.style.display = 'flex';
        this.editTaskNameInput.focus();
    }
    
    // 隐藏编辑任务模态框
    hideEditTaskModal() {
        if (this.editTaskModal) {
            this.editTaskModal.style.display = 'none';
        }
        this.currentEditingTaskIndex = -1;
    }
    
    // 保存任务编辑
    saveTaskEdit() {
        if (this.currentEditingTaskIndex < 0) return;
        
        const name = this.editTaskNameInput.value.trim();
        const description = this.editTaskDescriptionInput.value.trim();
        const minutes = parseInt(this.editTaskMinutesInput.value) || 0;
        const seconds = parseInt(this.editTaskSecondsInput.value) || 0;
        
        if (!name) {
            alert('Please enter a task name');
            return;
        }
        
        const duration = minutes * 60 + seconds;
        if (duration <= 0) {
            alert('Please set a valid duration');
            return;
        }
        
        // 更新任务
        this.taskQueue[this.currentEditingTaskIndex] = {
            ...this.taskQueue[this.currentEditingTaskIndex],
            name,
            description: description || 'No description',
            duration
        };
        
        this.renderTaskList();
        this.updateCurrentTaskDisplay();
        this.hideEditTaskModal();
        
        // 如果是同步模式，广播任务队列更新
        if (this.isSyncMode && this.syncTimer) {
            this.syncTimer.updateTaskQueue(this.taskQueue);
        }
    }
    
    // 删除任务
    deleteTask() {
        if (this.currentEditingTaskIndex < 0) return;
        
        if (confirm('Are you sure you want to delete this task?')) {
            // 如果删除的是当前正在运行的任务
            if (this.currentEditingTaskIndex === this.currentTaskIndex) {
                this.pauseTimer();
                this.currentTaskIndex = -1;
            } else if (this.currentEditingTaskIndex < this.currentTaskIndex) {
                this.currentTaskIndex--;
            }
            
            this.taskQueue.splice(this.currentEditingTaskIndex, 1);
            this.renderTaskList();
            this.updateQueueControls();
            this.updateCurrentTaskDisplay();
            this.hideEditTaskModal();
            
            // 如果是同步模式，广播任务队列更新
            if (this.isSyncMode && this.syncTimer) {
                this.syncTimer.updateTaskQueue(this.taskQueue);
            }
        }
    }
    
    // 移除任务
    removeTask(index) {
        if (confirm('Are you sure you want to remove this task?')) {
            // 如果删除的是当前正在运行的任务
            if (index === this.currentTaskIndex) {
                this.pauseTimer();
                this.currentTaskIndex = -1;
            } else if (index < this.currentTaskIndex) {
                this.currentTaskIndex--;
            }
            
            this.taskQueue.splice(index, 1);
            this.renderTaskList();
            this.updateQueueControls();
            this.updateCurrentTaskDisplay();
            
            // 如果是同步模式，广播任务队列更新
            if (this.isSyncMode && this.syncTimer) {
                this.syncTimer.updateTaskQueue(this.taskQueue);
            }
        }
    }
    
    // 开始队列
    startQueue() {
        if (this.taskQueue.length === 0) {
            alert('Please add some tasks first');
            return;
        }
        
        this.isQueueMode = true;
        this.queuePaused = false;
        
        // 如果没有当前任务，从第一个开始
        if (this.currentTaskIndex < 0) {
            this.currentTaskIndex = 0;
        }
        
        this.startCurrentTask();
        this.updateQueueControls();
    }
    
    // 暂停队列
    pauseQueue() {
        this.queuePaused = true;
        this.pauseTimer();
        this.updateQueueControls();
    }
    
    // 跳过当前任务
    skipCurrentTask() {
        if (this.currentTaskIndex >= 0) {
            this.taskQueue[this.currentTaskIndex].completed = true;
            this.nextTask();
        }
    }
    
    // 开始当前任务
    startCurrentTask() {
        if (this.currentTaskIndex < 0 || this.currentTaskIndex >= this.taskQueue.length) {
            this.completeQueue();
            return;
        }
        
        const currentTask = this.taskQueue[this.currentTaskIndex];
        
        // 设置计时器时间
        this.setTime(currentTask.duration);
        
        // 更新显示
        this.updateCurrentTaskDisplay();
        this.renderTaskList();
        
        // 开始计时
        if (!this.queuePaused) {
            this.startTimer();
        }
        
        // 如果是同步模式，广播当前任务更新
        if (this.isSyncMode && this.syncTimer) {
            this.syncTimer.updateCurrentTask(this.currentTaskIndex, currentTask);
        }
    }
    
    // 下一个任务
    nextTask() {
        this.currentTaskIndex++;
        
        if (this.currentTaskIndex >= this.taskQueue.length) {
            this.completeQueue();
        } else {
            this.startCurrentTask();
        }
    }
    
    // 完成队列
    completeQueue() {
        this.isQueueMode = false;
        this.queuePaused = false;
        this.currentTaskIndex = -1;
        
        // 标记所有任务为完成
        this.taskQueue.forEach(task => task.completed = true);
        
        this.updateCurrentTaskDisplay();
        this.updateQueueControls();
        this.renderTaskList();
        
        // 播放完成提醒
        this.playNotificationSound();
        this.showNotification('All tasks completed! 🎉', 'Great job! All timer tasks have been completed.');
        
        // 如果是同步模式，广播队列完成
        if (this.isSyncMode && this.syncTimer) {
            this.syncTimer.updateQueueComplete();
        }
    }
    
    // 更新队列控制按钮状态
    updateQueueControls() {
        if (!this.startQueueBtn || !this.pauseQueueBtn || !this.skipTaskBtn) return;
        
        const hasActiveTasks = this.taskQueue.some(task => !task.completed);
        const isRunning = this.isQueueMode && !this.queuePaused;
        
        this.startQueueBtn.disabled = !hasActiveTasks || isRunning;
        this.pauseQueueBtn.disabled = !isRunning;
        this.skipTaskBtn.disabled = !isRunning || this.currentTaskIndex < 0;
        
        // 更新按钮文字
        if (this.isQueueMode) {
            this.startQueueBtn.querySelector('.text').textContent = this.queuePaused ? 'Resume Queue' : 'Queue Running';
            this.pauseQueueBtn.querySelector('.text').textContent = 'Pause Queue';
        } else {
            this.startQueueBtn.querySelector('.text').textContent = 'Start Queue';
            this.pauseQueueBtn.querySelector('.text').textContent = 'Pause';
        }
    }
    
    // 更新当前任务显示
    updateCurrentTaskDisplay() {
        if (!this.currentTask) return;
        
        if (this.currentTaskIndex >= 0 && this.currentTaskIndex < this.taskQueue.length) {
            const task = this.taskQueue[this.currentTaskIndex];
            
            if (this.currentTaskName) {
                this.currentTaskName.textContent = task.name;
            }
            
            if (this.currentTaskDescription) {
                this.currentTaskDescription.textContent = task.description;
            }
            
            this.updateTaskTimer();
            this.updateTaskProgress();
        } else {
            if (this.currentTaskName) {
                this.currentTaskName.textContent = this.taskQueue.length === 0 ? 'No tasks added' : 'All tasks completed';
            }
            
            if (this.currentTaskDescription) {
                this.currentTaskDescription.textContent = this.taskQueue.length === 0 ? 
                    'Add some timer tasks to get started' : 
                    'Great job! All timer tasks have been completed 🎉';
            }
            
            if (this.taskTimer) {
                this.taskTimer.textContent = '00:00';
            }
            
            if (this.taskProgressFill) {
                this.taskProgressFill.style.width = '0%';
            }
        }
    }
    
    // 更新任务计时器显示
    updateTaskTimer() {
        if (!this.taskTimer) return;
        
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        this.taskTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 更新任务进度条
    updateTaskProgress() {
        if (!this.taskProgressFill || this.currentTaskIndex < 0) return;
        
        const task = this.taskQueue[this.currentTaskIndex];
        const progress = ((task.duration - this.remainingSeconds) / task.duration) * 100;
        this.taskProgressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
    
    // 离开会话
    leaveSession() {
        if (confirm('Are you sure you want to leave this session?')) {
            // 停止计时器
            this.pauseTimer();
            
            // 断开同步连接
            if (this.syncTimer) {
                this.syncTimer.disconnect();
                this.syncTimer = null;
            }
            
            // 重置状态
            this.isSyncMode = false;
            this.isQueueMode = false;
            this.queuePaused = false;
            this.currentTaskIndex = -1;
            this.taskQueue = [];
            
            // 隐藏面板
            this.hideSessionPanel();
            this.disableSyncMode();
        }
    }
    
    // 重写tick方法以支持任务队列
    tick() {
        if (this.remainingSeconds > 0) {
            this.remainingSeconds--;
            this.updateDisplay();
            
            // 如果是队列模式，更新任务显示
            if (this.isQueueMode) {
                this.updateTaskTimer();
                this.updateTaskProgress();
            }
        } else {
            // 计时结束
            this.isRunning = false;
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            
            if (this.isQueueMode && this.currentTaskIndex >= 0) {
                // 队列模式：完成当前任务，进入下一个
                this.taskQueue[this.currentTaskIndex].completed = true;
                this.playNotificationSound();
                this.showNotification(`Task Completed: ${this.taskQueue[this.currentTaskIndex].name}`, 'Moving to next task...');
                
                setTimeout(() => {
                    this.nextTask();
                }, 2000); // 2秒后自动进入下一个任务
            } else {
                // 普通模式：计时结束
                this.timerComplete();
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new Timer();
}); 