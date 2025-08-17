document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timerWindowBtn = document.getElementById('timer-window-btn');
    const adminWindowBtn = document.getElementById('admin-window-btn');
    const timerWindow = document.getElementById('timer-window');
    const adminWindow = document.getElementById('admin-window');
    
    // 翻页时钟元素 - 使用更可靠的选择器
    const daysDigit = document.querySelector('.time-unit:nth-child(1) .digit');
    const hoursDigit = document.querySelector('.time-unit:nth-child(3) .digit'); // 注意：因为添加了分隔符，所以索引变了
    const minutesDigit = document.querySelector('.time-unit:nth-child(5) .digit'); // 注意：因为添加了分隔符，所以索引变了
    const secondsDigit = document.querySelector('.time-unit:nth-child(7) .digit'); // 注意：因为添加了分隔符，所以索引变了
    
    // 任务指示器
    const taskIndicator = document.getElementById('task-indicator');
    
    // 任务管理元素
    const tasksContainer = document.getElementById('tasks-container');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    // 监视台元素
    const monitorWindowBtn = document.getElementById('monitor-window-btn');
    const monitorWindow = document.getElementById('monitor-window');
    const monitorStatus = document.getElementById('monitor-status');
    const monitorCurrentTask = document.getElementById('monitor-current-task');
    const monitorRemainingTime = document.getElementById('monitor-remaining-time');
    const monitorProgress = document.getElementById('monitor-progress');
    const monitorTasksList = document.getElementById('monitor-tasks-list');
    const monitorLog = document.getElementById('monitor-log');
    
    // 预览框元素
    const previewContent = document.getElementById('preview-content');
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    const togglePreviewBtn = document.getElementById('toggle-preview');
    
    // 监视台控制按钮
    const monitorStartBtn = document.getElementById('monitor-start');
    const monitorPauseBtn = document.getElementById('monitor-pause');
    const monitorResetBtn = document.getElementById('monitor-reset');
    const monitorNextBtn = document.getElementById('monitor-next');
    const clearLogBtn = document.getElementById('clear-log');
    
    // 验证DOM元素是否正确获取
    console.log('DOM元素检查:', {
        daysDigit: daysDigit,
        hoursDigit: hoursDigit,
        minutesDigit: minutesDigit,
        secondsDigit: secondsDigit,
        taskIndicator: taskIndicator,
        tasksContainer: tasksContainer,
        monitorWindow: monitorWindow
    });
    
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    
    const saveSettingsButton = document.getElementById('save-settings');
    const resetSettingsButton = document.getElementById('reset-settings');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Timer variables
    let currentTaskIndex = 0; // 当前任务索引
    let totalSeconds = 10 * 60; // 默认: 10 minutes
    let timerInterval = null;
    let isRunning = false;
    let savedSettings = null;
    let tasks = []; // 任务数组

    // 日志记录
    let logEntries = [];

    // 添加日志
    function addLog(message, type = 'info') {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const logEntry = {
            time: timeString,
            message: message,
            type: type
        };
        
        logEntries.push(logEntry);
        
        // 限制日志数量
        if (logEntries.length > 100) {
            logEntries.shift();
        }
        
        updateMonitorLog();
    }

    // 更新监视台日志
    function updateMonitorLog() {
        if (monitorLog) {
            monitorLog.innerHTML = '';
            logEntries.forEach(entry => {
                const logDiv = document.createElement('div');
                logDiv.className = 'log-entry';
                logDiv.innerHTML = `
                    <span class="log-time">[${entry.time}]</span>
                    <span class="log-message ${entry.type}">${entry.message}</span>
                `;
                monitorLog.appendChild(logDiv);
            });
            
            // 滚动到底部
            monitorLog.scrollTop = monitorLog.scrollHeight;
        }
    }

    // 更新监视台状态
    function updateMonitorStatus() {
        if (monitorStatus) {
            monitorStatus.textContent = isRunning ? '运行中' : '已停止';
            monitorStatus.className = `status-value ${isRunning ? 'success' : 'warning'}`;
        }
        
        if (monitorCurrentTask) {
            monitorCurrentTask.textContent = `任务 ${currentTaskIndex + 1}`;
        }
        
        if (monitorRemainingTime) {
            const days = Math.floor(totalSeconds / (24 * 3600));
            const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            let timeString = '';
            if (days > 0) timeString += `${days}天`;
            if (hours > 0) timeString += `${hours}时`;
            if (minutes > 0) timeString += `${minutes}分`;
            if (seconds > 0) timeString += `${seconds}秒`;
            
            monitorRemainingTime.textContent = timeString || '0秒';
        }
        
        if (monitorProgress) {
            if (tasks.length > 0) {
                const progress = Math.round(((currentTaskIndex + 1) / tasks.length) * 100);
                monitorProgress.textContent = `${progress}% (${currentTaskIndex + 1}/${tasks.length})`;
            } else {
                monitorProgress.textContent = '0%';
            }
        }
    }

    // 更新监视台任务列表
    function updateMonitorTasksList() {
        if (monitorTasksList) {
            monitorTasksList.innerHTML = '';
            
            tasks.forEach((task, index) => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task-item';
                
                // 确定任务状态
                let statusClass = 'pending';
                let statusText = '等待中';
                
                if (index === currentTaskIndex && isRunning) {
                    statusClass = 'current';
                    statusText = '执行中';
                } else if (index < currentTaskIndex) {
                    statusClass = 'completed';
                    statusText = '已完成';
                }
                
                if (index === currentTaskIndex) {
                    taskDiv.classList.add('current');
                } else if (index < currentTaskIndex) {
                    taskDiv.classList.add('completed');
                }
                
                const taskTime = `${task.days}天 ${task.hours}时 ${task.minutes}分 ${task.seconds}秒`;
                
                taskDiv.innerHTML = `
                    <div class="task-info">
                        <span class="task-number">任务 ${index + 1}</span>
                        <span class="task-time">${taskTime}</span>
                    </div>
                    <span class="task-status ${statusClass}">${statusText}</span>
                `;
                
                monitorTasksList.appendChild(taskDiv);
            });
        }
    }

    // 更新监视台控制按钮状态
    function updateMonitorControls() {
        if (monitorStartBtn) {
            monitorStartBtn.disabled = isRunning;
        }
        
        if (monitorPauseBtn) {
            monitorPauseBtn.disabled = !isRunning;
        }
        
        if (monitorResetBtn) {
            monitorResetBtn.disabled = false;
        }
        
        if (monitorNextBtn) {
            monitorNextBtn.disabled = !isRunning || currentTaskIndex >= tasks.length - 1;
        }
    }

    // 监视台远程控制功能
    function setupMonitorControls() {
        if (monitorStartBtn) {
            monitorStartBtn.addEventListener('click', () => {
                startTimer();
                addLog('通过监视台启动倒计时', 'success');
            });
        }
        
        if (monitorPauseBtn) {
            monitorPauseBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                isRunning = false;
                addLog('通过监视台暂停倒计时', 'warning');
                console.log('倒计时已暂停'); // 调试信息
            });
        }
        
        if (monitorResetBtn) {
            monitorResetBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                isRunning = false;
                currentTaskIndex = 0;
                totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
                console.log('重置倒计时，总秒数:', totalSeconds); // 调试信息
                updateTaskIndicator();
                updateDisplay();
                addLog('通过监视台重置倒计时', 'info');
            });
        }
        
        if (monitorNextBtn) {
            monitorNextBtn.addEventListener('click', () => {
                if (currentTaskIndex < tasks.length - 1) {
                    switchToNextTask();
                    addLog('通过监视台手动切换到下一任务', 'info');
                }
            });
        }
        
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => {
                logEntries = [];
                updateMonitorLog();
                addLog('日志已清空', 'info');
            });
        }
    }

    // 创建任务HTML
    function createTaskHTML(taskIndex, task = null) {
        const taskData = task || { days: 0, hours: 0, minutes: 10, seconds: 0 };
        return `
            <div class="task-section" data-task-index="${taskIndex}">
                <div class="task-header">
                    <h3>任务 ${taskIndex + 1}</h3>
                    <button class="delete-task-btn" onclick="deleteTask(${taskIndex})" title="删除任务">×</button>
                </div>
                <div class="time-settings">
                    <div class="setting-group">
                        <label for="days-input-${taskIndex}">天</label>
                        <input type="number" id="days-input-${taskIndex}" min="0" max="365" value="${taskData.days}">
                    </div>
                    <div class="setting-group">
                        <label for="hours-input-${taskIndex}">时</label>
                        <input type="number" id="hours-input-${taskIndex}" min="0" max="23" value="${taskData.hours}">
                    </div>
                    <div class="setting-group">
                        <label for="minutes-input-${taskIndex}">分</label>
                        <input type="number" id="minutes-input-${taskIndex}" min="0" max="59" value="${taskData.minutes}">
                    </div>
                    <div class="setting-group">
                        <label for="seconds-input-${taskIndex}">秒</label>
                        <input type="number" id="seconds-input-${taskIndex}" min="0" max="59" value="${taskData.seconds}">
                    </div>
                </div>
            </div>
        `;
    }

    // 添加新任务
    function addTask() {
        const taskIndex = tasks.length;
        const newTask = { days: 0, hours: 0, minutes: 5, seconds: 0 };
        tasks.push(newTask);
        
        const taskHTML = createTaskHTML(taskIndex, newTask);
        tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
        
        console.log('添加新任务:', taskIndex);
    }

    // 删除任务
    window.deleteTask = function(taskIndex) {
        if (tasks.length <= 1) {
            alert('至少需要保留一个任务！');
            return;
        }
        
        if (isRunning && currentTaskIndex === taskIndex) {
            alert('无法删除正在运行的任务！');
            return;
        }
        
        tasks.splice(taskIndex, 1);
        renderTasks();
        
        // 如果删除的是当前任务之前或当前任务，需要调整索引
        if (currentTaskIndex >= taskIndex) {
            currentTaskIndex = Math.max(0, currentTaskIndex - 1);
        }
        
        console.log('删除任务:', taskIndex);
    };

    // 渲染所有任务
    function renderTasks() {
        tasksContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskHTML = createTaskHTML(index, task);
            tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
        });
    }

    // Load saved settings from localStorage
    function loadSettings() {
        const saved = localStorage.getItem('timerSettings');
        if (saved) {
            savedSettings = JSON.parse(saved);
            tasks = savedSettings.tasks || [{ days: 0, hours: 0, minutes: 10, seconds: 0 }];
        } else {
            // 默认设置
            tasks = [
                { days: 0, hours: 0, minutes: 10, seconds: 0 },
                { days: 0, hours: 0, minutes: 5, seconds: 0 }
            ];
        }
        renderTasks();
        applySettings();
    }

    // Save settings to localStorage
    function saveSettings() {
        // 从DOM中收集所有任务数据
        const newTasks = [];
        const taskSections = tasksContainer.querySelectorAll('.task-section');
        
        taskSections.forEach((section, index) => {
            const days = parseInt(section.querySelector(`#days-input-${index}`).value) || 0;
            const hours = parseInt(section.querySelector(`#hours-input-${index}`).value) || 0;
            const minutes = parseInt(section.querySelector(`#minutes-input-${index}`).value) || 0;
            const seconds = parseInt(section.querySelector(`#seconds-input-${index}`).value) || 0;
            
            newTasks.push({ days, hours, minutes, seconds });
        });
        
        const settings = { tasks: newTasks };
        
        console.log('保存设置:', settings); // 调试信息
        
        localStorage.setItem('timerSettings', JSON.stringify(settings));
        savedSettings = settings;
        tasks = newTasks;
        
        // 如果当前没有运行，只更新显示，不自动开始
        if (!isRunning) {
            currentTaskIndex = 0;
            totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
            updateDisplay();
        }
        
        // Show success message
        alert('设置已保存！点击开始按钮开始执行任务');
    }

    // Apply settings to inputs
    function applySettings() {
        if (tasks.length === 0) {
            tasks = [{ days: 0, hours: 0, minutes: 10, seconds: 0 }];
        }
        
        // 设置当前任务，但不自动开始
        if (!isRunning) {
            currentTaskIndex = 0;
            totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
            updateDisplay();
        }
    }

    // Reset settings to default
    function resetToDefault() {
        tasks = [
            { days: 0, hours: 0, minutes: 10, seconds: 0 },
            { days: 0, hours: 0, minutes: 5, seconds: 0 }
        ];
        
        currentTaskIndex = 0;
        totalSeconds = 10 * 60;
        console.log('重置为默认，总秒数:', totalSeconds); // 调试信息
        updateTaskIndicator();
        updateDisplay();
        
        localStorage.removeItem('timerSettings');
        savedSettings = null;
        
        renderTasks();
        
        // 重置后不自动开始，需要用户手动点击开始
        alert('已重置为默认设置！点击开始按钮开始执行任务');
    }

    // Switch to next task
    function switchToNextTask() {
        currentTaskIndex++;
        
        if (currentTaskIndex < tasks.length) {
            // 切换到下一个任务
            const nextTask = tasks[currentTaskIndex];
            totalSeconds = nextTask.days * 24 * 3600 + nextTask.hours * 3600 + nextTask.minutes * 60 + nextTask.seconds;
            console.log('切换到任务', currentTaskIndex + 1, '，总秒数:', totalSeconds);
            
            addLog(`自动切换到任务 ${currentTaskIndex + 1}`, 'info');
            
            // 静默切换，不显示弹框
            updateTaskIndicator();
            updateDisplay();
            
            // 自动开始下一个任务（因为用户已经开始了第一个任务）
            startTimer();
        } else {
            // 所有任务完成
            currentTaskIndex = 0;
            totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
            console.log('所有任务完成，重置为任务1，总秒数:', totalSeconds);
            
            addLog('所有任务执行完成', 'success');
            
            // 静默完成，不显示弹框
            isRunning = false;
            clearInterval(timerInterval);
            updateTaskIndicator();
            updateDisplay();
            
            // 可以选择是否自动重新开始所有任务
            // 如果需要循环执行，可以取消下面的注释
            // setTimeout(() => {
            //     if (tasks.length > 0 && totalSeconds > 0) {
            //         startTimer();
            //     }
            // }, 1000);
        }
    }

    // Start timer
    function startTimer() {
        if (!isRunning && totalSeconds > 0) {
            isRunning = true;
            timerInterval = setInterval(countdown, 1000);
            console.log('倒计时已启动，任务:', currentTaskIndex + 1);
            addLog(`开始执行任务 ${currentTaskIndex + 1}`, 'success');
        }
    }

    // Auto start all tasks
    function autoStartAllTasks() {
        if (tasks.length > 0 && !isRunning) {
            currentTaskIndex = 0;
            totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
            updateTaskIndicator();
            updateDisplay();
            
            // 不自动开始，等待用户点击开始按钮
            console.log('任务已准备就绪，等待用户点击开始按钮');
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
        
        console.log('更新显示:', { days, hours, minutes, seconds, totalSeconds, currentTaskIndex: currentTaskIndex + 1 }); // 调试信息
        
        // 检查DOM元素是否存在
        if (!daysDigit || !hoursDigit || !minutesDigit || !secondsDigit) {
            console.error('某些DOM元素未找到，无法更新显示');
            return;
        }
        
        // 更新翻页时钟显示
        daysDigit.textContent = formatTime(days);
        hoursDigit.textContent = formatTime(hours);
        minutesDigit.textContent = formatTime(minutes);
        secondsDigit.textContent = formatTime(seconds);
        
        // 同步更新监视台信息
        updateMonitorStatus();
        updateMonitorTasksList();
        updateMonitorControls();
        
        // 同步更新预览框
        generatePreviewContent();
    }

    // Update task indicator
    function updateTaskIndicator() {
        if (taskIndicator) {
            taskIndicator.textContent = `当前任务: 任务 ${currentTaskIndex + 1}`;
        }
        
        // 同步更新监视台信息
        updateMonitorStatus();
        updateMonitorTasksList();
        updateMonitorControls();
        
        // 同步更新预览框
        generatePreviewContent();
    }

    // Timer countdown function
    function countdown() {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            
            addLog(`任务 ${currentTaskIndex + 1} 完成`, 'success');
            
            // 切换到下一个任务
            switchToNextTask();
            return;
        }
        
        totalSeconds--;
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
        
        // 切换到倒计时窗口时，只准备任务，不自动开始
        autoStartAllTasks();
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
        
        // 切换到监视台时更新所有信息
        updateMonitorStatus();
        updateMonitorTasksList();
        updateMonitorControls();
    }

    // Event listeners
    timerWindowBtn.addEventListener('click', showTimerWindow);
    adminWindowBtn.addEventListener('click', showAdminWindow);
    monitorWindowBtn.addEventListener('click', showMonitorWindow);
    addTaskBtn.addEventListener('click', addTask);

    startButton.addEventListener('click', () => {
        console.log('开始按钮点击，当前状态:', { isRunning, totalSeconds, currentTaskIndex: currentTaskIndex + 1 }); // 调试信息
        startTimer();
    });

    pauseButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        console.log('倒计时已暂停'); // 调试信息
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        currentTaskIndex = 0;
        totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
        console.log('重置倒计时，总秒数:', totalSeconds); // 调试信息
        updateTaskIndicator();
        updateDisplay();
    });

    saveSettingsButton.addEventListener('click', saveSettings);
    resetSettingsButton.addEventListener('click', resetToDefault);

    // Preset button functionality
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const days = parseInt(btn.dataset.days) || 0;
            const hours = parseInt(btn.dataset.hours) || 0;
            const minutes = parseInt(btn.dataset.minutes) || 0;
            const seconds = parseInt(btn.dataset.seconds) || 0;
            
            console.log('预设按钮点击:', { days, hours, minutes, seconds }); // 调试信息
            
            // 为当前选中的任务应用预设
            if (tasks.length > 0) {
                const currentTask = tasks[currentTaskIndex];
                currentTask.days = days;
                currentTask.hours = hours;
                currentTask.minutes = minutes;
                currentTask.seconds = seconds;
                
                // 更新显示
                if (!isRunning) {
                    totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
                    updateDisplay();
                }
                
                // 重新渲染任务列表
                renderTasks();
                
                alert('预设时间已应用到当前任务！');
            }
        });
    });

    // 预览框功能
    let isPreviewVisible = true;

    // 生成预览内容
    function generatePreviewContent() {
        if (!previewContent) return;
        
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const previewHTML = `
            <div class="preview-timer-container">
                <h1>倒计时器</h1>
                <div class="preview-current-task-indicator">
                    <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                </div>
                <div class="preview-timer-display">
                    <div class="preview-time-row">
                        <span>${formatTime(days)}</span>
                        <span class="preview-separator">:</span>
                        <span>${formatTime(hours)}</span>
                        <span class="preview-separator">:</span>
                        <span>${formatTime(minutes)}</span>
                        <span class="preview-separator">:</span>
                        <span>${formatTime(seconds)}</span>
                    </div>
                    <div class="preview-time-labels">
                        <span class="label">DD</span>
                        <span class="preview-separator">:</span>
                        <span class="label">HH</span>
                        <span class="preview-separator">:</span>
                        <span class="label">MM</span>
                        <span class="preview-separator">:</span>
                        <span class="label">SS</span>
                    </div>
                </div>
                <div class="preview-timer-controls">
                    <button id="preview-start" ${isRunning ? 'disabled' : ''}>开始</button>
                    <button id="preview-pause" ${!isRunning ? 'disabled' : ''}>暂停</button>
                    <button id="preview-reset">重置</button>
                </div>
            </div>
        `;
        
        previewContent.innerHTML = previewHTML;
        
        // 为预览框中的按钮添加事件监听器
        setupPreviewButtonControls();
    }

    // 设置预览框控制按钮
    function setupPreviewButtonControls() {
        const previewStartBtn = document.getElementById('preview-start');
        const previewPauseBtn = document.getElementById('preview-pause');
        const previewResetBtn = document.getElementById('preview-reset');
        
        if (previewStartBtn) {
            previewStartBtn.addEventListener('click', () => {
                startTimer();
                addLog('通过预览框启动倒计时', 'success');
            });
        }
        
        if (previewPauseBtn) {
            previewPauseBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                isRunning = false;
                addLog('通过预览框暂停倒计时', 'warning');
                console.log('倒计时已暂停'); // 调试信息
            });
        }
        
        if (previewResetBtn) {
            previewResetBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                isRunning = false;
                currentTaskIndex = 0;
                totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
                console.log('重置倒计时，总秒数:', totalSeconds); // 调试信息
                updateTaskIndicator();
                updateDisplay();
                addLog('通过预览框重置倒计时', 'info');
            });
        }
    }

    // 刷新预览
    function refreshPreview() {
        generatePreviewContent();
        addLog('预览已刷新', 'info');
    }

    // 切换预览显示/隐藏
    function togglePreview() {
        if (previewContent) {
            isPreviewVisible = !isPreviewVisible;
            previewContent.classList.toggle('hidden', !isPreviewVisible);
            
            const toggleText = isPreviewVisible ? '隐藏预览' : '显示预览';
            togglePreviewBtn.title = toggleText;
            
            addLog(`预览已${isPreviewVisible ? '显示' : '隐藏'}`, 'info');
        }
    }

    // 设置预览框控制功能
    function setupPreviewControls() {
        if (refreshPreviewBtn) {
            refreshPreviewBtn.addEventListener('click', refreshPreview);
        }
        
        if (togglePreviewBtn) {
            togglePreviewBtn.addEventListener('click', togglePreview);
        }
    }

    // Initialize
    loadSettings();
    updateDisplay();
    console.log('初始化完成，总秒数:', totalSeconds); // 调试信息
    
    // 设置监视台控制功能
    setupMonitorControls();
    
    // 设置预览框控制功能
    setupPreviewControls();
    
    // 生成初始预览内容
    generatePreviewContent();
    
    // 初始化完成后准备任务，但不自动开始
    setTimeout(() => {
        autoStartAllTasks();
        addLog('系统初始化完成，等待用户开始', 'info');
    }, 500);
}); 