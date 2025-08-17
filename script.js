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
    
    // 倒计时器标题和footer
    const timerTitle = document.getElementById('timer-title');
    const timerFooterText = document.getElementById('timer-footer-text');
    
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
    
    // 全屏按钮
    const fullscreenBtn = document.getElementById('fullscreen');
    
    // 验证DOM元素是否正确获取
    console.log('DOM元素检查:', {
        daysDigit: daysDigit,
        hoursDigit: hoursDigit,
        minutesDigit: minutesDigit,
        secondsDigit: secondsDigit,
        taskIndicator: taskIndicator,
        tasksContainer: tasksContainer,
        monitorWindow: monitorWindow,
        fullscreenBtn: fullscreenBtn
    });
    
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    
    const saveSettingsButton = document.getElementById('save-settings');
    const resetSettingsButton = document.getElementById('reset-settings');

    // Timer variables
    let currentTaskIndex = 0; // 当前任务索引
    let totalSeconds = 10 * 60; // 默认: 10 minutes
    let timerInterval = null;
    let isRunning = false;
    let savedSettings = null;
    let tasks = []; // 任务数组
    let isFullscreen = false; // 全屏状态标志

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
        const taskData = task || { 
            days: 0, 
            hours: 0, 
            minutes: 10, 
            seconds: 0,
            title: '倒计时器',
            taskName: `任务 ${taskIndex + 1}`,
            footer: '专注工作，高效生活',
            backgroundType: 'color', // 背景类型：color, image, video
            backgroundColor: '#000000', // 背景颜色
            backgroundImage: '', // 背景图片URL
            backgroundVideo: '', // 背景视频URL
            backgroundEnabled: true // 背景是否启用
        };
        return `
            <div class="task-section" data-task-index="${taskIndex}">
                <div class="task-header">
                    <h3>任务 ${taskIndex + 1}</h3>
                    <button class="delete-task-btn" onclick="deleteTask(${taskIndex})" title="删除任务">×</button>
                </div>
                
                <!-- 任务信息设置 - 紧凑横向布局 -->
                <div class="task-info-settings">
                    <div class="setting-group">
                        <label for="title-input-${taskIndex}">标题</label>
                        <input type="text" id="title-input-${taskIndex}" value="${taskData.title}" placeholder="倒计时器">
                    </div>
                    <div class="setting-group">
                        <label for="taskname-input-${taskIndex}">任务名称</label>
                        <input type="text" id="taskname-input-${taskIndex}" value="${taskData.taskName}" placeholder="任务名称">
                    </div>
                    <div class="setting-group">
                        <label for="footer-input-${taskIndex}">底部文字</label>
                        <input type="text" id="footer-input-${taskIndex}" value="${taskData.footer}" placeholder="底部文字">
                    </div>
                </div>
                
                <!-- 背景设置 -->
                <div class="background-settings">
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="background-enabled-${taskIndex}" ${taskData.backgroundEnabled ? 'checked' : ''} onchange="toggleBackgroundSettings(${taskIndex})">
                            启用背景设置
                        </label>
                    </div>
                    
                    <div class="background-options" id="background-options-${taskIndex}" style="display: ${taskData.backgroundEnabled ? 'block' : 'none'}">
                        <div class="setting-group">
                            <label for="background-type-${taskIndex}">背景类型</label>
                            <select id="background-type-${taskIndex}" onchange="updateBackgroundSettings(${taskIndex})">
                                <option value="color" ${taskData.backgroundType === 'color' ? 'selected' : ''}>纯色背景</option>
                                <option value="image" ${taskData.backgroundType === 'image' ? 'selected' : ''}>图片背景</option>
                                <option value="video" ${taskData.backgroundType === 'video' ? 'selected' : ''}>视频背景</option>
                            </select>
                        </div>
                        
                        <!-- 颜色背景设置 -->
                        <div class="background-color-setting" id="background-color-setting-${taskIndex}" style="display: ${taskData.backgroundType === 'color' ? 'block' : 'none'}">
                            <div class="setting-group">
                                <label for="background-color-${taskIndex}">背景颜色</label>
                                <input type="color" id="background-color-${taskIndex}" value="${taskData.backgroundColor}">
                            </div>
                        </div>
                        
                        <!-- 图片背景设置 -->
                        <div class="background-image-setting" id="background-image-setting-${taskIndex}" style="display: ${taskData.backgroundType === 'image' ? 'block' : 'none'}">
                            <div class="setting-group">
                                <label for="background-image-${taskIndex}">图片URL</label>
                                <input type="url" id="background-image-${taskIndex}" value="${taskData.backgroundImage}" placeholder="https://example.com/image.jpg">
                            </div>
                            <div class="setting-group">
                                <label for="background-image-file-${taskIndex}">或上传图片</label>
                                <input type="file" id="background-image-file-${taskIndex}" accept="image/*" onchange="handleImageUpload(${taskIndex})">
                            </div>
                            <div class="setting-group">
                                <label for="background-image-opacity-${taskIndex}">透明度</label>
                                <input type="range" id="background-image-opacity-${taskIndex}" min="0" max="100" value="80" oninput="updateImageOpacityPreview(${taskIndex})">
                                <span class="opacity-value" id="opacity-value-${taskIndex}">80%</span>
                            </div>
                        </div>
                        
                        <!-- 视频背景设置 -->
                        <div class="background-video-setting" id="background-video-setting-${taskIndex}" style="display: ${taskData.backgroundType === 'video' ? 'block' : 'none'}">
                            <div class="setting-group">
                                <label for="background-video-${taskIndex}">视频URL</label>
                                <input type="url" id="background-video-${taskIndex}" value="${taskData.backgroundVideo}" placeholder="https://example.com/video.mp4">
                            </div>
                            <div class="setting-group">
                                <label for="background-video-file-${taskIndex}">或上传视频</label>
                                <input type="file" id="background-video-file-${taskIndex}" accept="video/*" onchange="handleVideoUpload(${taskIndex})">
                            </div>
                            <div class="setting-group">
                                <label for="background-video-opacity-${taskIndex}">透明度</label>
                                <input type="range" id="background-video-opacity-${taskIndex}" min="0" max="100" value="80" oninput="updateVideoOpacityPreview(${taskIndex})">
                                <span class="opacity-value" id="video-opacity-value-${taskIndex}">80%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="time-settings-row">
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
        const newTask = { 
            days: 0, 
            hours: 0, 
            minutes: 5, 
            seconds: 0,
            title: '倒计时器',
            taskName: `任务 ${taskIndex + 1}`,
            footer: '专注工作，高效生活',
            backgroundType: 'color', // 默认背景类型
            backgroundColor: '#000000', // 默认背景颜色
            backgroundImage: '', // 默认背景图片
            backgroundVideo: '', // 默认背景视频
            backgroundEnabled: true // 默认启用背景
        };
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
            tasks = savedSettings.tasks || [{ 
                days: 0, 
                hours: 0, 
                minutes: 10, 
                seconds: 0,
                title: '倒计时器',
                taskName: '任务 1',
                footer: '专注工作，高效生活',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundVideo: '', // 默认背景视频
                backgroundEnabled: true // 默认启用背景
            }];
        } else {
            // 默认设置
            tasks = [
                { 
                    days: 0, 
                    hours: 0, 
                    minutes: 10, 
                    seconds: 0,
                    title: '倒计时器',
                    taskName: '任务 1',
                    footer: '专注工作，高效生活',
                    backgroundType: 'color', // 默认背景类型
                    backgroundColor: '#000000', // 默认背景颜色
                    backgroundImage: '', // 默认背景图片
                    backgroundVideo: '', // 默认背景视频
                    backgroundEnabled: true // 默认启用背景
                },
                { 
                    days: 0, 
                    hours: 0, 
                    minutes: 5, 
                    seconds: 0,
                    title: '倒计时器',
                    taskName: '任务 2',
                    footer: '专注工作，高效生活',
                    backgroundType: 'color', // 默认背景类型
                    backgroundColor: '#000000', // 默认背景颜色
                    backgroundImage: '', // 默认背景图片
                    backgroundVideo: '', // 默认背景视频
                    backgroundEnabled: true // 默认启用背景
                }
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
            const title = section.querySelector(`#title-input-${index}`).value || '倒计时器';
            const taskName = section.querySelector(`#taskname-input-${index}`).value || `任务 ${index + 1}`;
            const footer = section.querySelector(`#footer-input-${index}`).value || '专注工作，高效生活';
            
            // 获取背景设置
            const backgroundEnabled = section.querySelector(`#background-enabled-${index}`).checked;
            const backgroundType = section.querySelector(`#background-type-${index}`).value;
            let backgroundColor = '#000000'; // 默认颜色
            let backgroundImage = '';
            let backgroundVideo = '';

            if (backgroundEnabled) {
                if (backgroundType === 'color') {
                    backgroundColor = section.querySelector(`#background-color-${index}`).value;
                } else if (backgroundType === 'image') {
                    backgroundImage = section.querySelector(`#background-image-${index}`).value;
                } else if (backgroundType === 'video') {
                    backgroundVideo = section.querySelector(`#background-video-${index}`).value;
                }
            }

            newTasks.push({ days, hours, minutes, seconds, title, taskName, footer, backgroundType, backgroundColor, backgroundImage, backgroundVideo, backgroundEnabled });
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
            tasks = [{ 
                days: 0, 
                hours: 0, 
                minutes: 10, 
                seconds: 0,
                title: '倒计时器',
                taskName: '任务 1',
                footer: '专注工作，高效生活',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundVideo: '', // 默认背景视频
                backgroundEnabled: true // 默认启用背景
            }];
        }
        
        currentTaskIndex = 0;
        totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
        updateTaskIndicator();
        updateDisplay();
    }

    // Reset settings to default
    function resetToDefault() {
        tasks = [
            { 
                days: 0, 
                hours: 0, 
                minutes: 10, 
                seconds: 0,
                title: '倒计时器',
                taskName: '任务 1',
                footer: '专注工作，高效生活',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundVideo: '', // 默认背景视频
                backgroundEnabled: true // 默认启用背景
            },
            { 
                days: 0, 
                hours: 0, 
                minutes: 5, 
                seconds: 0,
                title: '倒计时器',
                taskName: '任务 2',
                footer: '专注工作，高效生活',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundVideo: '', // 默认背景视频
                backgroundEnabled: true // 默认启用背景
            }
        ];
        
        currentTaskIndex = 0;
        totalSeconds = 10 * 60;
        console.log('重置为默认，总秒数:', totalSeconds); // 调试信息
        updateTaskIndicator();
        updateDisplay();
        
        localStorage.removeItem('timerSettings');
        savedSettings = null;
        
        renderTasks();
        
        // 重置后不自动开始，需要用户手动点击开始按钮
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
        
        // 更新标题和footer
        updateTaskInfo();
        
        // 同步更新监视台信息
        updateMonitorStatus();
        updateMonitorTasksList();
        updateMonitorControls();
        
        // 同步更新预览框
        generatePreviewContent();
    }

    // Update task indicator
    function updateTaskIndicator() {
        updateTaskInfo();
        
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

    // Update task info (title and footer)
    function updateTaskInfo() {
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            const currentTask = tasks[currentTaskIndex];
            
            // 更新倒计时器标题
            if (timerTitle) {
                timerTitle.textContent = currentTask.title || '倒计时器';
            }
            
            // 更新任务指示器 - 只显示任务名称
            if (taskIndicator) {
                taskIndicator.textContent = currentTask.taskName || `任务 ${currentTaskIndex + 1}`;
            }
            
            // 更新footer
            if (timerFooterText) {
                timerFooterText.textContent = currentTask.footer || '专注工作，高效生活';
            }
            
            // 应用背景设置
            applyBackgroundToTimer();
        }
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

    // 全屏按钮事件监听
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreenTimer);
    }

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

    // 预览框功能
    let isPreviewVisible = true;

    // 生成预览内容
    function generatePreviewContent() {
        if (!previewContent) return;
        
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // 获取当前任务的信息
        const currentTask = tasks.length > 0 && currentTaskIndex < tasks.length ? tasks[currentTaskIndex] : null;
        const title = currentTask ? currentTask.title : '倒计时器';
        const taskName = currentTask ? currentTask.taskName : `任务 ${currentTaskIndex + 1}`;
        const footer = currentTask ? currentTask.footer : '专注工作，高效生活';
        
        // 生成真正的缩小版镜像，完全复制倒计时页面的HTML结构
        const previewHTML = `
            <div class="timer-container preview-mirror" id="preview-timer-container">
                <h1 id="preview-timer-title">${title}</h1>
                <div class="current-task-indicator">
                    <span id="preview-task-indicator">${taskName}</span>
                </div>
                <div class="timer-display">
                    <div class="time-unit">
                        <div class="label">Days</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(days)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">Hours</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(hours)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">Minutes</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(minutes)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">Seconds</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(seconds)}</div>
                        </div>
                    </div>
                </div>
                <div class="timer-footer">
                    <span id="preview-timer-footer-text">${footer}</span>
                </div>
            </div>
        `;
        
        previewContent.innerHTML = previewHTML;
        
        // 应用背景到预览
        applyBackgroundToPreview();
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

    // 全屏功能
    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            isFullscreen = false;
            fullscreenBtn.textContent = '全屏';
            fullscreenBtn.title = '全屏显示';
        } else {
            document.documentElement.requestFullscreen();
            isFullscreen = true;
            fullscreenBtn.textContent = '退出全屏';
            fullscreenBtn.title = '退出全屏';
        }
        addLog(`全屏状态已切换为: ${isFullscreen ? '全屏' : '退出全屏'}`, 'info');
    }

    // 切换倒计时器全屏显示
    function toggleFullscreenTimer() {
        const timerContainer = document.querySelector('.timer-container');
        const appContainer = document.querySelector('.app-container');
        const timerControls = document.querySelector('.timer-controls');
        
        if (!timerContainer) return;
        
        if (isFullscreen) {
            // 退出全屏模式
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            
            // 移除全屏样式
            timerWindow.classList.remove('fullscreen-timer');
            if (document.querySelector('.fullscreen-exit')) {
                document.querySelector('.fullscreen-exit').remove();
            }
            
            // 恢复原始状态
            appContainer.style.display = '';
            timerWindow.style.display = '';
            
            // 显示控制按钮
            if (timerControls) {
                timerControls.style.display = '';
            }
            
            fullscreenBtn.textContent = '全屏';
            fullscreenBtn.title = '全屏显示';
            isFullscreen = false;
        } else {
            // 进入全屏模式
            timerWindow.classList.add('fullscreen-timer');
            
            // 隐藏控制按钮
            if (timerControls) {
                timerControls.style.display = 'none';
            }
            
            // 创建退出全屏按钮
            const exitBtn = document.createElement('button');
            exitBtn.className = 'fullscreen-exit';
            exitBtn.innerHTML = '×';
            exitBtn.title = '退出全屏';
            exitBtn.addEventListener('click', toggleFullscreenTimer);
            timerWindow.appendChild(exitBtn);
            
            // 请求浏览器全屏
            document.documentElement.requestFullscreen().catch(err => {
                console.error('全屏请求被拒绝:', err);
            });
            
            fullscreenBtn.textContent = '退出全屏';
            fullscreenBtn.title = '退出全屏';
            isFullscreen = true;
        }
        
        addLog(`倒计时全屏模式: ${isFullscreen ? '开启' : '关闭'}`, 'info');
    }

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
        // 如果用户通过浏览器自带功能退出全屏，我们也需要更新UI
        if (!document.fullscreenElement && isFullscreen) {
            toggleFullscreenTimer();
        }
    });

    // 初始化
    loadSettings();
    updateDisplay();
    console.log('初始化完成，总秒数:', totalSeconds); // 调试信息

    // 更新背景设置显示
    window.updateBackgroundSettings = function(taskIndex) {
        const backgroundType = document.getElementById(`background-type-${taskIndex}`).value;
        
        // 隐藏所有背景设置区域
        document.getElementById(`background-color-setting-${taskIndex}`).style.display = 'none';
        document.getElementById(`background-image-setting-${taskIndex}`).style.display = 'none';
        document.getElementById(`background-video-setting-${taskIndex}`).style.display = 'none';
        
        // 显示对应的背景设置区域
        if (backgroundType === 'color') {
            document.getElementById(`background-color-setting-${taskIndex}`).style.display = 'block';
        } else if (backgroundType === 'image') {
            document.getElementById(`background-image-setting-${taskIndex}`).style.display = 'block';
        } else if (backgroundType === 'video') {
            document.getElementById(`background-video-setting-${taskIndex}`).style.display = 'block';
        }
    };

    // 切换背景设置启用/禁用
    window.toggleBackgroundSettings = function(taskIndex) {
        const backgroundEnabledCheckbox = document.getElementById(`background-enabled-${taskIndex}`);
        const backgroundOptions = document.getElementById(`background-options-${taskIndex}`);

        if (backgroundEnabledCheckbox && backgroundOptions) {
            // 根据勾选框的当前状态显示或隐藏背景选项
            backgroundOptions.style.display = backgroundEnabledCheckbox.checked ? 'block' : 'none';
        }
    };

    // 处理图片上传
    window.handleImageUpload = function(taskIndex) {
        const fileInput = document.getElementById(`background-image-file-${taskIndex}`);
        const imageUrlInput = document.getElementById(`background-image-${taskIndex}`);
        const imageOpacityInput = document.getElementById(`background-image-opacity-${taskIndex}`);
        const opacityValueSpan = document.getElementById(`opacity-value-${taskIndex}`);

        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrlInput.value = e.target.result;
                updateImageOpacityPreview(taskIndex); // 更新透明度预览
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    // 处理视频上传
    window.handleVideoUpload = function(taskIndex) {
        const fileInput = document.getElementById(`background-video-file-${taskIndex}`);
        const videoUrlInput = document.getElementById(`background-video-${taskIndex}`);
        const videoOpacityInput = document.getElementById(`background-video-opacity-${taskIndex}`);
        const opacityValueSpan = document.getElementById(`video-opacity-value-${taskIndex}`);

        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                videoUrlInput.value = e.target.result;
                updateVideoOpacityPreview(taskIndex); // 更新透明度预览
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    // 更新图片透明度预览
    window.updateImageOpacityPreview = function(taskIndex) {
        const opacity = document.getElementById(`background-image-opacity-${taskIndex}`).value;
        document.getElementById(`opacity-value-${taskIndex}`).textContent = opacity + '%';
    };

    // 更新视频透明度预览
    window.updateVideoOpacityPreview = function(taskIndex) {
        const opacity = document.getElementById(`background-video-opacity-${taskIndex}`).value;
        document.getElementById(`video-opacity-value-${taskIndex}`).textContent = opacity + '%';
    };

    // 应用背景到倒计时容器
    function applyBackgroundToTimer() {
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            const currentTask = tasks[currentTaskIndex];
            const timerContainer = document.querySelector('.timer-container');
            
            if (!timerContainer) return;
            
            // 移除之前的背景样式
            timerContainer.style.background = '';
            timerContainer.style.backgroundImage = '';
            timerContainer.style.backgroundSize = '';
            timerContainer.style.backgroundPosition = '';
            timerContainer.style.backgroundRepeat = '';
            
            // 移除之前的视频背景
            const existingVideo = timerContainer.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }
            
            // 只在背景启用时应用背景
            if (currentTask.backgroundEnabled) {
                if (currentTask.backgroundType === 'color') {
                    // 应用颜色背景
                    timerContainer.style.backgroundColor = currentTask.backgroundColor || '#000000';
                } else if (currentTask.backgroundType === 'image' && currentTask.backgroundImage) {
                    // 应用图片背景
                    timerContainer.style.backgroundImage = `url('${currentTask.backgroundImage}')`;
                    timerContainer.style.backgroundSize = 'cover';
                    timerContainer.style.backgroundPosition = 'center';
                    timerContainer.style.backgroundRepeat = 'no-repeat';
                } else if (currentTask.backgroundType === 'video' && currentTask.backgroundVideo) {
                    // 应用视频背景
                    const video = document.createElement('video');
                    video.className = 'background-video';
                    video.src = currentTask.backgroundVideo;
                    video.autoplay = true;
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        z-index: -1;
                        opacity: 0.8;
                    `;
                    timerContainer.style.position = 'relative';
                    timerContainer.appendChild(video);
                }
            } else {
                // 如果背景未启用，使用默认黑色背景
                timerContainer.style.backgroundColor = '#000000';
            }
        }
    }
    
    // 应用背景到预览
    function applyBackgroundToPreview() {
        if (tasks.length > 0 && currentTaskIndex < tasks.length) {
            const currentTask = tasks[currentTaskIndex];
            const previewContainer = document.getElementById('preview-timer-container');
            
            if (!previewContainer) return;
            
            // 移除之前的背景样式
            previewContainer.style.background = '';
            previewContainer.style.backgroundImage = '';
            previewContainer.style.backgroundSize = '';
            previewContainer.style.backgroundPosition = '';
            previewContainer.style.backgroundRepeat = '';
            
            // 移除之前的视频背景
            const existingVideo = previewContainer.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }
            
            // 只在背景启用时应用背景
            if (currentTask.backgroundEnabled) {
                if (currentTask.backgroundType === 'color') {
                    // 应用颜色背景
                    previewContainer.style.backgroundColor = currentTask.backgroundColor || '#000000';
                } else if (currentTask.backgroundType === 'image' && currentTask.backgroundImage) {
                    // 应用图片背景
                    previewContainer.style.backgroundImage = `url('${currentTask.backgroundImage}')`;
                    previewContainer.style.backgroundSize = 'cover';
                    previewContainer.style.backgroundPosition = 'center';
                    previewContainer.style.backgroundRepeat = 'no-repeat';
                } else if (currentTask.backgroundType === 'video' && currentTask.backgroundVideo) {
                    // 应用视频背景
                    const video = document.createElement('video');
                    video.className = 'background-video';
                    video.src = currentTask.backgroundVideo;
                    video.autoplay = true;
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        z-index: -1;
                        opacity: 0.8;
                    `;
                    previewContainer.style.position = 'relative';
                    previewContainer.appendChild(video);
                }
            } else {
                // 如果背景未启用，使用默认黑色背景
                previewContainer.style.backgroundColor = '#000000';
            }
        }
    }
    
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