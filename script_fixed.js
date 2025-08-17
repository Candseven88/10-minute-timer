document.addEventListener('DOMContentLoaded', () => {
    // DOM elements - 窗口切换按钮
    const timerWindowBtn = document.getElementById('timer-window-btn');
    const adminWindowBtn = document.getElementById('admin-window-btn');
    const monitorWindowBtn = document.getElementById('monitor-window-btn');
    
    // 窗口元素
    const timerWindow = document.getElementById('timer-window');
    const adminWindow = document.getElementById('admin-window');
    const monitorWindow = document.getElementById('monitor-window');
    
    // 控制按钮
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const fullscreenBtn = document.getElementById('fullscreen');
    
    // 设置按钮
    const saveSettingsButton = document.getElementById('save-settings');
    const resetSettingsButton = document.getElementById('reset-settings');
    const addTaskBtn = document.getElementById('add-task-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // 模板选择器
    const templateButtons = document.querySelectorAll('.template-btn');
    const timerContainers = document.querySelectorAll('.timer-container');
    
    // 任务管理元素
    const tasksContainer = document.getElementById('tasks-container');
    
    // 翻页时钟元素
    const daysCard = document.getElementById('days-card');
    const hoursCard = document.getElementById('hours-card');
    const minutesCard = document.getElementById('minutes-card');
    const secondsCard = document.getElementById('seconds-card');
    
    // 任务指示器
    const taskIndicator = document.getElementById('task-indicator');
    
    // Timer variables
    let currentTaskIndex = 0; // 当前任务索引
    let totalSeconds = 10 * 60; // 默认: 10 minutes
    let timerInterval = null;
    let isRunning = false;
    let savedSettings = null;
    let tasks = [
        { days: 0, hours: 0, minutes: 10, seconds: 0, template: 'classic' },
        { days: 0, hours: 0, minutes: 5, seconds: 0, template: 'classic' }
    ];
    let isFullscreen = false; // 全屏状态标志
    
    // 用于仪表盘的初始总秒数
    window.initialTotalSeconds = 10 * 60; // 默认10分钟
    
    // 当前选中的模板
    let currentTemplate = 'classic';
    
    // 窗口切换功能
    timerWindowBtn.addEventListener('click', showTimerWindow);
    adminWindowBtn.addEventListener('click', showAdminWindow);
    monitorWindowBtn.addEventListener('click', showMonitorWindow);
    
    // 控制按钮功能
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    fullscreenBtn.addEventListener('click', toggleFullscreenTimer);
    
    // 设置按钮功能
    saveSettingsButton.addEventListener('click', saveSettings);
    resetSettingsButton.addEventListener('click', resetToDefault);
    addTaskBtn.addEventListener('click', addTask);
    
    // 预设按钮功能
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const days = parseInt(btn.dataset.days) || 0;
            const hours = parseInt(btn.dataset.hours) || 0;
            const minutes = parseInt(btn.dataset.minutes) || 0;
            const seconds = parseInt(btn.dataset.seconds) || 0;
            
            if (tasks.length > 0) {
                const currentTask = tasks[currentTaskIndex];
                currentTask.days = days;
                currentTask.hours = hours;
                currentTask.minutes = minutes;
                currentTask.seconds = seconds;
                
                if (!isRunning) {
                    totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
                    updateDisplay();
                }
                
                renderTasks();
                alert('预设时间已应用到当前任务！');
            }
        });
    });
    
    // 模板切换功能
    templateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateName = btn.getAttribute('data-template');
            switchTemplate(templateName);
        });
    });
    
    // 加载用户之前选择的模板
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
        switchTemplate(savedTemplate);
    }
    
    // 模板切换函数
    function switchTemplate(templateName) {
        // 隐藏所有模板
        timerContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // 显示选中的模板
        const selectedContainer = document.querySelector(`.template-${templateName}`);
        if (selectedContainer) {
            selectedContainer.style.display = 'block';
        }
        
        // 更新按钮状态
        templateButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-template="${templateName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        currentTemplate = templateName;
        
        // 更新当前任务的模板设置
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            tasks[currentTaskIndex].template = templateName;
        }
        
        // 保存用户选择的模板到本地存储
        localStorage.setItem('selectedTemplate', templateName);
        
        // 更新显示
        updateDisplay();
    }
    
    // Window switching functions
    function showTimerWindow() {
        timerWindow.classList.add('active');
        adminWindow.classList.remove('active');
        monitorWindow.classList.remove('active');
        timerWindowBtn.classList.add('active');
        adminWindowBtn.classList.remove('active');
        monitorWindowBtn.classList.remove('active');
        
        // 确保显示当前任务的模板
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            const taskTemplate = tasks[currentTaskIndex].template || 'classic';
            if (taskTemplate !== currentTemplate) {
                switchTemplate(taskTemplate);
            }
        }
    }
    
    function showAdminWindow() {
        adminWindow.classList.add('active');
        timerWindow.classList.remove('active');
        monitorWindow.classList.remove('active');
        adminWindowBtn.classList.add('active');
        timerWindowBtn.classList.remove('active');
        monitorWindowBtn.classList.remove('active');
    }
    
    function showMonitorWindow() {
        monitorWindow.classList.add('active');
        timerWindow.classList.remove('active');
        adminWindow.classList.remove('active');
        monitorWindowBtn.classList.add('active');
        timerWindowBtn.classList.remove('active');
        adminWindowBtn.classList.remove('active');
    }
    
    // Timer functions
    function startTimer() {
        if (isRunning) return;
        
        if (totalSeconds <= 0) {
            resetTimer();
            return;
        }
        
        // 设置初始总秒数，用于仪表盘进度计算
        if (!isRunning) {
            window.initialTotalSeconds = totalSeconds;
        }
        
        isRunning = true;
        timerInterval = setInterval(countdown, 1000);
        console.log('倒计时已开始');
    }
    
    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        console.log('倒计时已暂停');
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        
        if (tasks.length > 0) {
            currentTaskIndex = 0;
            const task = tasks[currentTaskIndex];
            totalSeconds = task.days * 24 * 3600 + task.hours * 3600 + task.minutes * 60 + task.seconds;
            updateTaskIndicator();
            updateDisplay();
        }
        
        console.log('倒计时已重置');
    }
    
    function countdown() {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            
            // 切换到下一个任务
            switchToNextTask();
            return;
        }
        
        totalSeconds--;
        updateDisplay();
    }
    
    // Switch to next task
    function switchToNextTask() {
        currentTaskIndex++;
        
        if (currentTaskIndex < tasks.length) {
            // 切换到下一个任务
            const nextTask = tasks[currentTaskIndex];
            totalSeconds = nextTask.days * 24 * 3600 + nextTask.hours * 3600 + nextTask.minutes * 60 + nextTask.seconds;
            console.log('切换到任务', currentTaskIndex + 1, '，总秒数:', totalSeconds);
            
            // 切换模板
            if (nextTask.template && nextTask.template !== currentTemplate) {
                switchTemplate(nextTask.template);
            }
            
            // 更新显示
            updateTaskIndicator();
            updateDisplay();
            
            // 自动开始下一个任务（因为用户已经开始了第一个任务）
            startTimer();
        } else {
            // 所有任务完成
            currentTaskIndex = 0;
            const firstTask = tasks[0];
            totalSeconds = firstTask.days * 24 * 3600 + firstTask.hours * 3600 + firstTask.minutes * 60 + firstTask.seconds;
            console.log('所有任务完成，重置为任务1，总秒数:', totalSeconds);
            
            // 切换回第一个任务的模板
            if (firstTask.template && firstTask.template !== currentTemplate) {
                switchTemplate(firstTask.template);
            }
            
            // 更新显示
            isRunning = false;
            clearInterval(timerInterval);
            updateTaskIndicator();
            updateDisplay();
        }
    }
    
    // Update task indicator
    function updateTaskIndicator() {
        if (taskIndicator) {
            taskIndicator.textContent = `当前任务: 任务 ${currentTaskIndex + 1}`;
        }
    }
    
    // Format time display (add leading zero if needed)
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    // Update timer display
    function updateDisplay() {
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // 更新所有模板的显示
        updateAllTemplates(days, hours, minutes, seconds);
    }
    
    // 更新所有模板的显示
    function updateAllTemplates(days, hours, minutes, seconds) {
        // 格式化时间显示
        const formattedDays = formatTime(days);
        const formattedHours = formatTime(hours);
        const formattedMinutes = formatTime(minutes);
        const formattedSeconds = formatTime(seconds);
        
        // 更新经典翻页模板
        if (document.getElementById('days-current')) {
            document.getElementById('days-current').textContent = formattedDays;
            document.getElementById('days-next').textContent = formattedDays;
            document.getElementById('days-current-top').textContent = formattedDays;
            document.getElementById('days-next-bottom').textContent = formattedDays;
        }
        
        if (document.getElementById('hours-current')) {
            document.getElementById('hours-current').textContent = formattedHours;
            document.getElementById('hours-next').textContent = formattedHours;
            document.getElementById('hours-current-top').textContent = formattedHours;
            document.getElementById('hours-next-bottom').textContent = formattedHours;
        }
        
        if (document.getElementById('minutes-current')) {
            document.getElementById('minutes-current').textContent = formattedMinutes;
            document.getElementById('minutes-next').textContent = formattedMinutes;
            document.getElementById('minutes-current-top').textContent = formattedMinutes;
            document.getElementById('minutes-next-bottom').textContent = formattedMinutes;
        }
        
        if (document.getElementById('seconds-current')) {
            document.getElementById('seconds-current').textContent = formattedSeconds;
            document.getElementById('seconds-next').textContent = formattedSeconds;
            document.getElementById('seconds-current-top').textContent = formattedSeconds;
            document.getElementById('seconds-next-bottom').textContent = formattedSeconds;
        }
        
        // 更新数字时钟模板
        if (document.getElementById('days-digital')) {
            document.getElementById('days-digital').textContent = formattedDays;
        }
        
        if (document.getElementById('hours-digital')) {
            document.getElementById('hours-digital').textContent = formattedHours;
        }
        
        if (document.getElementById('minutes-digital')) {
            document.getElementById('minutes-digital').textContent = formattedMinutes;
        }
        
        if (document.getElementById('seconds-digital')) {
            document.getElementById('seconds-digital').textContent = formattedSeconds;
        }
        
        // 更新极简风格模板
        if (document.getElementById('days-minimal')) {
            document.getElementById('days-minimal').textContent = formattedDays;
        }
        
        if (document.getElementById('hours-minimal')) {
            document.getElementById('hours-minimal').textContent = formattedHours;
        }
        
        if (document.getElementById('minutes-minimal')) {
            document.getElementById('minutes-minimal').textContent = formattedMinutes;
        }
        
        if (document.getElementById('seconds-minimal')) {
            document.getElementById('seconds-minimal').textContent = formattedSeconds;
        }
        
        // 更新渐变背景模板
        if (document.getElementById('days-gradient')) {
            document.getElementById('days-gradient').textContent = formattedDays;
        }
        
        if (document.getElementById('hours-gradient')) {
            document.getElementById('hours-gradient').textContent = formattedHours;
        }
        
        if (document.getElementById('minutes-gradient')) {
            document.getElementById('minutes-gradient').textContent = formattedMinutes;
        }
        
        if (document.getElementById('seconds-gradient')) {
            document.getElementById('seconds-gradient').textContent = formattedSeconds;
        }
        
        // 更新霓虹风格模板
        if (document.getElementById('days-neon')) {
            document.getElementById('days-neon').textContent = formattedDays;
        }
        
        if (document.getElementById('hours-neon')) {
            document.getElementById('hours-neon').textContent = formattedHours;
        }
        
        if (document.getElementById('minutes-neon')) {
            document.getElementById('minutes-neon').textContent = formattedMinutes;
        }
        
        if (document.getElementById('seconds-neon')) {
            document.getElementById('seconds-neon').textContent = formattedSeconds;
        }
        
        // 更新模拟时钟
        updateAnalogClock(hours, minutes, seconds);
        
        // 更新圆环进度
        updateCircleProgress(days, hours, minutes, seconds);
        
        // 更新仪表盘
        updateDashboard(days, hours, minutes, seconds);
        
        // 更新翻牌效果
        updateFlipCard(days, hours, minutes, seconds);
        
        // 更新任务指示器
        updateTaskIndicator();
    }
    
    // 更新模拟时钟
    function updateAnalogClock(hours, minutes, seconds) {
        const hoursHand = document.getElementById('hours-hand');
        const minutesHand = document.getElementById('minutes-hand');
        const secondsHand = document.getElementById('seconds-hand');
        const analogTime = document.getElementById('analog-time');
        
        if (hoursHand && minutesHand && secondsHand) {
            // 计算时针、分针和秒针的角度
            const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 每小时30度，每分钟0.5度
            const minuteAngle = minutes * 6; // 每分钟6度
            const secondAngle = seconds * 6; // 每秒6度
            
            // 设置指针旋转
            hoursHand.style.transform = `rotate(${hourAngle}deg)`;
            minutesHand.style.transform = `rotate(${minuteAngle}deg)`;
            secondsHand.style.transform = `rotate(${secondAngle}deg)`;
        }
        
        if (analogTime) {
            analogTime.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    }
    
    // 更新圆环进度
    function updateCircleProgress(days, hours, minutes, seconds) {
        // 获取DOM元素
        const daysCircleText = document.getElementById('days-circle-text');
        const hoursCircleText = document.getElementById('hours-circle-text');
        const minutesCircleText = document.getElementById('minutes-circle-text');
        const secondsCircleText = document.getElementById('seconds-circle-text');
        
        const daysCircleFill = document.getElementById('days-circle-fill');
        const hoursCircleFill = document.getElementById('hours-circle-fill');
        const minutesCircleFill = document.getElementById('minutes-circle-fill');
        const secondsCircleFill = document.getElementById('seconds-circle-fill');
        
        // 更新文本
        if (daysCircleText) daysCircleText.textContent = formatTime(days);
        if (hoursCircleText) hoursCircleText.textContent = formatTime(hours);
        if (minutesCircleText) minutesCircleText.textContent = formatTime(minutes);
        if (secondsCircleText) secondsCircleText.textContent = formatTime(seconds);
        
        // 计算圆环进度
        const maxDays = 365; // 假设最大为365天
        const maxHours = 24;
        const maxMinutes = 60;
        const maxSeconds = 60;
        
        const circleDashArray = 283; // 圆的周长 (2 * Math.PI * 45)
        
        // 更新圆环进度
        if (daysCircleFill) {
            const daysOffset = ((maxDays - days) / maxDays) * circleDashArray;
            daysCircleFill.style.strokeDashoffset = daysOffset;
        }
        
        if (hoursCircleFill) {
            const hoursOffset = ((maxHours - hours) / maxHours) * circleDashArray;
            hoursCircleFill.style.strokeDashoffset = hoursOffset;
        }
        
        if (minutesCircleFill) {
            const minutesOffset = ((maxMinutes - minutes) / maxMinutes) * circleDashArray;
            minutesCircleFill.style.strokeDashoffset = minutesOffset;
        }
        
        if (secondsCircleFill) {
            const secondsOffset = ((maxSeconds - seconds) / maxSeconds) * circleDashArray;
            secondsCircleFill.style.strokeDashoffset = secondsOffset;
        }
    }
    
    // 更新仪表盘
    function updateDashboard(days, hours, minutes, seconds) {
        // 获取DOM元素
        const daysDashboard = document.getElementById('days-dashboard');
        const hoursDashboard = document.getElementById('hours-dashboard');
        const minutesDashboard = document.getElementById('minutes-dashboard');
        const secondsDashboard = document.getElementById('seconds-dashboard');
        const gaugeHand = document.getElementById('gauge-hand');
        const gaugeValue = document.getElementById('gauge-value');
        
        // 更新数字显示
        if (daysDashboard) daysDashboard.textContent = formatTime(days);
        if (hoursDashboard) hoursDashboard.textContent = formatTime(hours);
        if (minutesDashboard) minutesDashboard.textContent = formatTime(minutes);
        if (secondsDashboard) secondsDashboard.textContent = formatTime(seconds);
        
        // 计算当前总秒数
        const currentTotalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
        
        // 计算仪表盘指针角度（180度表示从左到右的半圆）
        if (gaugeHand && window.initialTotalSeconds) {
            const progress = currentTotalSeconds / window.initialTotalSeconds;
            const angle = 180 * (1 - progress); // 从180度（左侧）到0度（右侧）
            gaugeHand.style.transform = `rotate(${angle}deg)`;
        }
        
        // 更新仪表盘值
        if (gaugeValue) {
            gaugeValue.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    }
    
    // 更新翻牌效果
    function updateFlipCard(days, hours, minutes, seconds) {
        // 获取DOM元素
        const daysFlipcard = document.getElementById('days-flipcard');
        const hoursFlipcard = document.getElementById('hours-flipcard');
        const minutesFlipcard = document.getElementById('minutes-flipcard');
        const secondsFlipcard = document.getElementById('seconds-flipcard');
        
        // 更新翻牌内容
        if (daysFlipcard) {
            const daysFront = daysFlipcard.querySelector('.flipcard-front');
            const daysBack = daysFlipcard.querySelector('.flipcard-back');
            
            if (daysFront && daysBack) {
                daysFront.textContent = formatTime(days);
                daysBack.textContent = formatTime(days);
            }
        }
        
        if (hoursFlipcard) {
            const hoursFront = hoursFlipcard.querySelector('.flipcard-front');
            const hoursBack = hoursFlipcard.querySelector('.flipcard-back');
            
            if (hoursFront && hoursBack) {
                hoursFront.textContent = formatTime(hours);
                hoursBack.textContent = formatTime(hours);
            }
        }
        
        if (minutesFlipcard) {
            const minutesFront = minutesFlipcard.querySelector('.flipcard-front');
            const minutesBack = minutesFlipcard.querySelector('.flipcard-back');
            
            if (minutesFront && minutesBack) {
                minutesFront.textContent = formatTime(minutes);
                minutesBack.textContent = formatTime(minutes);
            }
        }
        
        if (secondsFlipcard) {
            const secondsFront = secondsFlipcard.querySelector('.flipcard-front');
            const secondsBack = secondsFlipcard.querySelector('.flipcard-back');
            
            if (secondsFront && secondsBack) {
                secondsFront.textContent = formatTime(seconds);
                secondsBack.textContent = formatTime(seconds);
            }
        }
    }
    
    // 添加任务
    function addTask() {
        tasks.push({ days: 0, hours: 0, minutes: 10, seconds: 0, template: 'classic' });
        renderTasks();
    }
    
    // 删除任务
    function deleteTask(index) {
        if (tasks.length <= 1) {
            alert('至少需要保留一个任务！');
            return;
        }
        
        tasks.splice(index, 1);
        
        if (currentTaskIndex >= tasks.length) {
            currentTaskIndex = tasks.length - 1;
        }
        
        if (!isRunning) {
            const task = tasks[currentTaskIndex];
            totalSeconds = task.days * 24 * 3600 + task.hours * 3600 + task.minutes * 60 + task.seconds;
            updateTaskIndicator();
            updateDisplay();
        }
        
        renderTasks();
    }
    
    // 渲染任务列表
    function renderTasks() {
        if (!tasksContainer) return;
        
        tasksContainer.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const taskSection = document.createElement('div');
            taskSection.className = 'task-section';
            
            const taskHeader = document.createElement('div');
            taskHeader.className = 'task-header';
            
            const taskTitle = document.createElement('h3');
            taskTitle.textContent = `任务 ${index + 1}`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-task-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => deleteTask(index));
            
            taskHeader.appendChild(taskTitle);
            taskHeader.appendChild(deleteBtn);
            
            const timeSettings = document.createElement('div');
            timeSettings.className = 'time-settings';
            
            // 天数设置
            const daysGroup = document.createElement('div');
            daysGroup.className = 'setting-group';
            
            const daysLabel = document.createElement('label');
            daysLabel.textContent = '天数';
            
            const daysInput = document.createElement('input');
            daysInput.type = 'number';
            daysInput.min = '0';
            daysInput.max = '365';
            daysInput.value = task.days;
            daysInput.addEventListener('change', (e) => {
                tasks[index].days = parseInt(e.target.value) || 0;
            });
            
            daysGroup.appendChild(daysLabel);
            daysGroup.appendChild(daysInput);
            
            // 小时设置
            const hoursGroup = document.createElement('div');
            hoursGroup.className = 'setting-group';
            
            const hoursLabel = document.createElement('label');
            hoursLabel.textContent = '小时';
            
            const hoursInput = document.createElement('input');
            hoursInput.type = 'number';
            hoursInput.min = '0';
            hoursInput.max = '23';
            hoursInput.value = task.hours;
            hoursInput.addEventListener('change', (e) => {
                tasks[index].hours = parseInt(e.target.value) || 0;
            });
            
            hoursGroup.appendChild(hoursLabel);
            hoursGroup.appendChild(hoursInput);
            
            // 分钟设置
            const minutesGroup = document.createElement('div');
            minutesGroup.className = 'setting-group';
            
            const minutesLabel = document.createElement('label');
            minutesLabel.textContent = '分钟';
            
            const minutesInput = document.createElement('input');
            minutesInput.type = 'number';
            minutesInput.min = '0';
            minutesInput.max = '59';
            minutesInput.value = task.minutes;
            minutesInput.addEventListener('change', (e) => {
                tasks[index].minutes = parseInt(e.target.value) || 0;
            });
            
            minutesGroup.appendChild(minutesLabel);
            minutesGroup.appendChild(minutesInput);
            
            // 秒数设置
            const secondsGroup = document.createElement('div');
            secondsGroup.className = 'setting-group';
            
            const secondsLabel = document.createElement('label');
            secondsLabel.textContent = '秒数';
            
            const secondsInput = document.createElement('input');
            secondsInput.type = 'number';
            secondsInput.min = '0';
            secondsInput.max = '59';
            secondsInput.value = task.seconds;
            secondsInput.addEventListener('change', (e) => {
                tasks[index].seconds = parseInt(e.target.value) || 0;
            });
            
            secondsGroup.appendChild(secondsLabel);
            secondsGroup.appendChild(secondsInput);
            
            timeSettings.appendChild(daysGroup);
            timeSettings.appendChild(hoursGroup);
            timeSettings.appendChild(minutesGroup);
            timeSettings.appendChild(secondsGroup);
            
            // 模板选择
            const templateSection = document.createElement('div');
            templateSection.className = 'task-template-section';
            
            const templateLabel = document.createElement('label');
            templateLabel.textContent = '选择模板:';
            templateLabel.className = 'template-label';
            
            const templateSelect = document.createElement('select');
            templateSelect.className = 'template-select';
            templateSelect.value = task.template || 'classic';
            
            const templates = [
                { value: 'classic', name: '经典翻页' },
                { value: 'digital', name: '数字时钟' },
                { value: 'minimal', name: '极简风格' },
                { value: 'gradient', name: '渐变背景' },
                { value: 'neon', name: '霓虹风格' },
                { value: 'analog', name: '模拟时钟' },
                { value: 'circle', name: '圆环进度' },
                { value: 'dashboard', name: '仪表盘' },
                { value: 'flipcard', name: '翻牌效果' }
            ];
            
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.value;
                option.textContent = template.name;
                if (task.template === template.value) {
                    option.selected = true;
                }
                templateSelect.appendChild(option);
            });
            
            templateSelect.addEventListener('change', (e) => {
                tasks[index].template = e.target.value;
            });
            
            templateSection.appendChild(templateLabel);
            templateSection.appendChild(templateSelect);
            
            taskSection.appendChild(taskHeader);
            taskSection.appendChild(timeSettings);
            taskSection.appendChild(templateSection);
            
            tasksContainer.appendChild(taskSection);
        });
    }
    
    // 保存设置
    function saveSettings() {
        savedSettings = {
            tasks: JSON.parse(JSON.stringify(tasks)),
            currentTaskIndex: currentTaskIndex
        };
        
        localStorage.setItem('timerSettings', JSON.stringify(savedSettings));
        
        // 确保应用当前任务的模板
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            const taskTemplate = tasks[currentTaskIndex].template || 'classic';
            if (taskTemplate !== currentTemplate) {
                switchTemplate(taskTemplate);
            }
        }
        
        alert('设置已保存！');
    }
    
    // 重置为默认设置
    function resetToDefault() {
        tasks = [
            { days: 0, hours: 0, minutes: 10, seconds: 0, template: 'classic' },
            { days: 0, hours: 0, minutes: 5, seconds: 0, template: 'classic' }
        ];
        
        currentTaskIndex = 0;
        totalSeconds = 10 * 60;
        updateTaskIndicator();
        updateDisplay();
        
        localStorage.removeItem('timerSettings');
        savedSettings = null;
        
        renderTasks();
        
        alert('已重置为默认设置！点击开始按钮开始执行任务');
    }
    
    // 切换全屏显示
    function toggleFullscreenTimer() {
        if (isFullscreen) {
            // 退出全屏模式
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            
            isFullscreen = false;
            fullscreenBtn.textContent = '全屏';
            fullscreenBtn.title = '全屏显示';
        } else {
            // 进入全屏模式
            document.documentElement.requestFullscreen().catch(err => {
                console.error('全屏请求被拒绝:', err);
            });
            
            isFullscreen = true;
            fullscreenBtn.textContent = '退出全屏';
            fullscreenBtn.title = '退出全屏';
        }
    }
    
    // 加载设置
    function loadSettings() {
        const settings = localStorage.getItem('timerSettings');
        if (settings) {
            try {
                savedSettings = JSON.parse(settings);
                tasks = savedSettings.tasks;
                currentTaskIndex = savedSettings.currentTaskIndex;
                
                if (tasks.length > 0) {
                    const task = tasks[currentTaskIndex];
                    totalSeconds = task.days * 24 * 3600 + task.hours * 3600 + task.minutes * 60 + task.seconds;
                    
                    // 应用当前任务的模板
                    if (task.template) {
                        switchTemplate(task.template);
                    }
                }
                
                renderTasks();
                updateTaskIndicator();
                console.log('加载设置成功，总秒数:', totalSeconds);
            } catch (error) {
                console.error('加载设置失败:', error);
                resetToDefault();
            }
        } else {
            resetToDefault();
        }
    }
    
    // 初始化
    loadSettings();
    updateDisplay();
    console.log('初始化完成，总秒数:', totalSeconds);
}); 