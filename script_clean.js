document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timerWindowBtn = document.getElementById('timer-window-btn');
    const adminWindowBtn = document.getElementById('admin-window-btn');
    const timerWindow = document.getElementById('timer-window');
    const adminWindow = document.getElementById('admin-window');
    
    // 模板选择器元素
    const templateButtons = document.querySelectorAll('.template-btn');
    const timerContainers = document.querySelectorAll('.timer-container');
    
    // 翻页时钟元素 - 使用更可靠的选择器
    const daysDigit = document.querySelector('.time-unit:nth-child(1) .digit');
    const hoursDigit = document.querySelector('.time-unit:nth-child(3) .digit'); // 注意：因为添加了分隔符，所以索引变了
    const minutesDigit = document.querySelector('.time-unit:nth-child(5) .digit'); // 注意：因为添加了分隔符，所以索引变了
    const secondsDigit = document.querySelector('.time-unit:nth-child(7) .digit'); // 注意：因为添加了分隔符，所以索引变了
    
    // 任务指示器 - 所有模板
    const taskIndicator = document.getElementById('task-indicator');
    const taskIndicatorDigital = document.getElementById('task-indicator-digital');
    const taskIndicatorMinimal = document.getElementById('task-indicator-minimal');
    const taskIndicatorGradient = document.getElementById('task-indicator-gradient');
    const taskIndicatorNeon = document.getElementById('task-indicator-neon');
    const taskIndicatorAnalog = document.getElementById('task-indicator-analog');
    
    // 数字时钟模板元素
    const daysDigital = document.getElementById('days-digital');
    const hoursDigital = document.getElementById('hours-digital');
    const minutesDigital = document.getElementById('minutes-digital');
    const secondsDigital = document.getElementById('seconds-digital');
    
    // 极简风格模板元素
    const daysMinimal = document.getElementById('days-minimal');
    const hoursMinimal = document.getElementById('hours-minimal');
    const minutesMinimal = document.getElementById('minutes-minimal');
    const secondsMinimal = document.getElementById('seconds-minimal');
    
    // 渐变背景模板元素
    const daysGradient = document.getElementById('days-gradient');
    const hoursGradient = document.getElementById('hours-gradient');
    const minutesGradient = document.getElementById('minutes-gradient');
    const secondsGradient = document.getElementById('seconds-gradient');
    
    // 霓虹风格模板元素
    const daysNeon = document.getElementById('days-neon');
    const hoursNeon = document.getElementById('hours-neon');
    const minutesNeon = document.getElementById('minutes-neon');
    const secondsNeon = document.getElementById('seconds-neon');
    
    // 模拟时钟模板元素
    const hoursHand = document.getElementById('hours-hand');
    const minutesHand = document.getElementById('minutes-hand');
    const secondsHand = document.getElementById('seconds-hand');
    const analogTime = document.getElementById('analog-time');
    
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

    // 当前选中的模板
    let currentTemplate = 'classic';

    // 模板切换功能
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
        
        // 保存用户选择的模板到本地存储
        localStorage.setItem('selectedTemplate', templateName);
        
        addLog(`切换到${getTemplateDisplayName(templateName)}模板`, 'info');
    }

    // 获取模板显示名称
    function getTemplateDisplayName(templateName) {
        const names = {
            'classic': '经典翻页',
            'digital': '数字时钟',
            'minimal': '极简风格',
            'gradient': '渐变背景',
            'neon': '霓虹风格',
            'analog': '模拟时钟',
            'circle': '圆环进度',
            'dashboard': '仪表盘'
        };
        return names[templateName] || templateName;
    }

    // 绑定模板切换事件
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
    
    // 仪表盘模板元素
    const taskIndicatorDashboard = document.getElementById('task-indicator-dashboard');
    const gaugeHand = document.getElementById('gauge-hand');
    const gaugeValue = document.getElementById('gauge-value');
    const daysDashboard = document.getElementById('days-dashboard');
    const hoursDashboard = document.getElementById('hours-dashboard');
    const minutesDashboard = document.getElementById('minutes-dashboard');
    const secondsDashboard = document.getElementById('seconds-dashboard');
    
    // 仪表盘最大值（总时间）
    let maxTotalSeconds = 0;
    let initialTotalSeconds = 0;

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

    // 任务结构
    let tasks = [
        { days: 0, hours: 0, minutes: 10, seconds: 0, template: 'classic' },
        { days: 0, hours: 0, minutes: 5, seconds: 0, template: 'classic' }
    ];

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
            
            // 切换模板
            if (nextTask.template && nextTask.template !== currentTemplate) {
                switchTemplate(nextTask.template);
                addLog(`切换到${getTemplateDisplayName(nextTask.template)}模板`, 'info');
            }
            
            // 静默切换，不显示弹框
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
            
            addLog('所有任务执行完成', 'success');
            
            // 切换回第一个任务的模板
            if (firstTask.template && firstTask.template !== currentTemplate) {
                switchTemplate(firstTask.template);
            }
            
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

    // 更新经典翻页模板的DOM元素
    const daysCard = document.getElementById('days-card');
    const hoursCard = document.getElementById('hours-card');
    const minutesCard = document.getElementById('minutes-card');
    const secondsCard = document.getElementById('seconds-card');
    
    const daysCurrent = document.getElementById('days-current');
    const daysNext = document.getElementById('days-next');
    const daysCurrentTop = document.getElementById('days-current-top');
    const daysNextBottom = document.getElementById('days-next-bottom');
    
    const hoursCurrent = document.getElementById('hours-current');
    const hoursNext = document.getElementById('hours-next');
    const hoursCurrentTop = document.getElementById('hours-current-top');
    const hoursNextBottom = document.getElementById('hours-next-bottom');
    
    const minutesCurrent = document.getElementById('minutes-current');
    const minutesNext = document.getElementById('minutes-next');
    const minutesCurrentTop = document.getElementById('minutes-current-top');
    const minutesNextBottom = document.getElementById('minutes-next-bottom');
    
    const secondsCurrent = document.getElementById('seconds-current');
    const secondsNext = document.getElementById('seconds-next');
    const secondsCurrentTop = document.getElementById('seconds-current-top');
    const secondsNextBottom = document.getElementById('seconds-next-bottom');
    
    // 上一次的时间值，用于检测变化
    let lastDays = -1;
    let lastHours = -1;
    let lastMinutes = -1;
    let lastSeconds = -1;
    
    // 翻页动画函数
    function flipCard(card, currentEl, nextEl, currentTopEl, nextBottomEl, value) {
        if (!card || !currentEl || !nextEl || !currentTopEl || !nextBottomEl) return;
        
        // 设置下一个值
        nextEl.textContent = formatTime(value);
        nextBottomEl.textContent = formatTime(value);
        
        // 添加翻转动画类
        card.classList.add('flipped');
        
        // 动画结束后重置
        setTimeout(() => {
            card.classList.remove('flipped');
            currentEl.textContent = formatTime(value);
            currentTopEl.textContent = formatTime(value);
        }, 600); // 与CSS中的transition时间相匹配
    }

    // 更新DOM元素引用 - 仪表盘模板
    const taskIndicatorDashboard = document.getElementById('task-indicator-dashboard');
    const gaugeHand = document.getElementById('gauge-hand');
    const gaugeValue = document.getElementById('gauge-value');
    const daysDashboard = document.getElementById('days-dashboard');
    const hoursDashboard = document.getElementById('hours-dashboard');
    const minutesDashboard = document.getElementById('minutes-dashboard');
    const secondsDashboard = document.getElementById('seconds-dashboard');
    
    // 仪表盘最大值（总时间）
    let maxTotalSeconds = 0;
    let initialTotalSeconds = 0;

    // Update timer display
    function updateDisplay() {
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        console.log('更新显示:', { days, hours, minutes, seconds, totalSeconds, currentTaskIndex: currentTaskIndex + 1 }); // 调试信息
        
        // 更新经典翻页时钟显示
        if (days !== lastDays) {
            flipCard(daysCard, daysCurrent, daysNext, daysCurrentTop, daysNextBottom, days);
            lastDays = days;
        }
        
        if (hours !== lastHours) {
            flipCard(hoursCard, hoursCurrent, hoursNext, hoursCurrentTop, hoursNextBottom, hours);
            lastHours = hours;
        }
        
        if (minutes !== lastMinutes) {
            flipCard(minutesCard, minutesCurrent, minutesNext, minutesCurrentTop, minutesNextBottom, minutes);
            lastMinutes = minutes;
        }
        
        if (seconds !== lastSeconds) {
            flipCard(secondsCard, secondsCurrent, secondsNext, secondsCurrentTop, secondsNextBottom, seconds);
            lastSeconds = seconds;
        }
        
        // 更新数字时钟模板
        if (daysDigital) daysDigital.textContent = formatTime(days);
        if (hoursDigital) hoursDigital.textContent = formatTime(hours);
        if (minutesDigital) minutesDigital.textContent = formatTime(minutes);
        if (secondsDigital) secondsDigital.textContent = formatTime(seconds);
        
        // 更新极简风格模板
        if (daysMinimal) daysMinimal.textContent = formatTime(days);
        if (hoursMinimal) hoursMinimal.textContent = formatTime(hours);
        if (minutesMinimal) minutesMinimal.textContent = formatTime(minutes);
        if (secondsMinimal) secondsMinimal.textContent = formatTime(seconds);
        
        // 更新渐变背景模板
        if (daysGradient) daysGradient.textContent = formatTime(days);
        if (hoursGradient) hoursGradient.textContent = formatTime(hours);
        if (minutesGradient) minutesGradient.textContent = formatTime(minutes);
        if (secondsGradient) secondsGradient.textContent = formatTime(seconds);
        
        // 更新霓虹风格模板
        if (daysNeon) daysNeon.textContent = formatTime(days);
        if (hoursNeon) hoursNeon.textContent = formatTime(hours);
        if (minutesNeon) minutesNeon.textContent = formatTime(minutes);
        if (secondsNeon) secondsNeon.textContent = formatTime(seconds);
        
        // 更新模拟时钟模板
        updateAnalogClock(hours, minutes, seconds);
        if (analogTime) {
            analogTime.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
        
        // 更新圆环进度模板
        updateCircleProgress(days, hours, minutes, seconds);
        
        // 更新仪表盘模板
        updateDashboardDisplay(days, hours, minutes, seconds);
        
        // 更新翻牌效果模板
        updateFlipCardDisplay(days, hours, minutes, seconds);
        
        // 同步更新监视台信息
        updateMonitorStatus();
        updateMonitorTasksList();
        updateMonitorControls();
        
        // 同步更新预览框
        generatePreviewContent();
    }
    
    // 更新仪表盘显示
    function updateDashboardDisplay(days, hours, minutes, seconds) {
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
        
        // 如果没有设置最大总秒数，则设置为当前总秒数
        if (typeof window.maxTotalSeconds === 'undefined' || window.maxTotalSeconds === 0) {
            window.maxTotalSeconds = totalSeconds;
            window.initialTotalSeconds = totalSeconds;
        }
        
        // 更新仪表盘指针
        if (gaugeHand && window.maxTotalSeconds > 0) {
            const progress = totalSeconds / window.maxTotalSeconds;
            const angle = 180 * progress; // 180度范围的仪表盘
            gaugeHand.style.transform = `rotate(${angle}deg)`;
        }
        
        // 更新仪表盘值
        if (gaugeValue) {
            gaugeValue.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    }
    
    // 更新翻牌效果显示
    function updateFlipCardDisplay(days, hours, minutes, seconds) {
        const daysFlipcard = document.getElementById('days-flipcard');
        const hoursFlipcard = document.getElementById('hours-flipcard');
        const minutesFlipcard = document.getElementById('minutes-flipcard');
        const secondsFlipcard = document.getElementById('seconds-flipcard');
        
        // 更新天数翻牌
        if (daysFlipcard) {
            const daysFront = daysFlipcard.querySelector('.flipcard-front');
            const daysBack = daysFlipcard.querySelector('.flipcard-back');
            if (daysFront && daysBack && daysFront.textContent !== formatTime(days)) {
                daysBack.textContent = formatTime(days);
                daysFlipcard.classList.add('flipped');
                setTimeout(() => {
                    daysFlipcard.classList.remove('flipped');
                    daysFront.textContent = formatTime(days);
                }, 800);
            }
        }
        
        // 更新小时翻牌
        if (hoursFlipcard) {
            const hoursFront = hoursFlipcard.querySelector('.flipcard-front');
            const hoursBack = hoursFlipcard.querySelector('.flipcard-back');
            if (hoursFront && hoursBack && hoursFront.textContent !== formatTime(hours)) {
                hoursBack.textContent = formatTime(hours);
                hoursFlipcard.classList.add('flipped');
                setTimeout(() => {
                    hoursFlipcard.classList.remove('flipped');
                    hoursFront.textContent = formatTime(hours);
                }, 800);
            }
        }
        
        // 更新分钟翻牌
        if (minutesFlipcard) {
            const minutesFront = minutesFlipcard.querySelector('.flipcard-front');
            const minutesBack = minutesFlipcard.querySelector('.flipcard-back');
            if (minutesFront && minutesBack && minutesFront.textContent !== formatTime(minutes)) {
                minutesBack.textContent = formatTime(minutes);
                minutesFlipcard.classList.add('flipped');
                setTimeout(() => {
                    minutesFlipcard.classList.remove('flipped');
                    minutesFront.textContent = formatTime(minutes);
                }, 800);
            }
        }
        
        // 更新秒数翻牌
        if (secondsFlipcard) {
            const secondsFront = secondsFlipcard.querySelector('.flipcard-front');
            const secondsBack = secondsFlipcard.querySelector('.flipcard-back');
            if (secondsFront && secondsBack && secondsFront.textContent !== formatTime(seconds)) {
                secondsBack.textContent = formatTime(seconds);
                secondsFlipcard.classList.add('flipped');
                setTimeout(() => {
                    secondsFlipcard.classList.remove('flipped');
                    secondsFront.textContent = formatTime(seconds);
                }, 800);
            }
        }
    }
    
    // 开始计时
    function startTimer() {
        if (isRunning) return;
        
        if (totalSeconds <= 0) {
            resetTimer();
            return;
        }
        
        // 初始化最大总秒数（用于仪表盘）
        if (typeof window.maxTotalSeconds === 'undefined' || window.maxTotalSeconds === 0) {
            window.maxTotalSeconds = totalSeconds;
            window.initialTotalSeconds = totalSeconds;
        }
        
        isRunning = true;
        timerInterval = setInterval(countdown, 1000);
        console.log('倒计时已开始'); // 调试信息
        
        addLog('倒计时开始', 'success');
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

    // 更新经典翻页模板的DOM元素
    const daysCard = document.getElementById('days-card');
    const hoursCard = document.getElementById('hours-card');
    const minutesCard = document.getElementById('minutes-card');
    const secondsCard = document.getElementById('seconds-card');
    
    const daysCurrent = document.getElementById('days-current');
    const daysNext = document.getElementById('days-next');
    const daysCurrentTop = document.getElementById('days-current-top');
    const daysNextBottom = document.getElementById('days-next-bottom');
    
    const hoursCurrent = document.getElementById('hours-current');
    const hoursNext = document.getElementById('hours-next');
    const hoursCurrentTop = document.getElementById('hours-current-top');
    const hoursNextBottom = document.getElementById('hours-next-bottom');
    
    const minutesCurrent = document.getElementById('minutes-current');
    const minutesNext = document.getElementById('minutes-next');
    const minutesCurrentTop = document.getElementById('minutes-current-top');
    const minutesNextBottom = document.getElementById('minutes-next-bottom');
    
    const secondsCurrent = document.getElementById('seconds-current');
    const secondsNext = document.getElementById('seconds-next');
    const secondsCurrentTop = document.getElementById('seconds-current-top');
    const secondsNextBottom = document.getElementById('seconds-next-bottom');
    
    // 上一次的时间值，用于检测变化
    let lastDays = -1;
    let lastHours = -1;
    let lastMinutes = -1;
    let lastSeconds = -1;
    
    // 翻页动画函数
    function flipCard(card, currentEl, nextEl, currentTopEl, nextBottomEl, value) {
        if (!card || !currentEl || !nextEl || !currentTopEl || !nextBottomEl) return;
        
        // 设置下一个值
        nextEl.textContent = formatTime(value);
        nextBottomEl.textContent = formatTime(value);
        
        // 添加翻转动画类
        card.classList.add('flipped');
        
        // 动画结束后重置
        setTimeout(() => {
            card.classList.remove('flipped');
            currentEl.textContent = formatTime(value);
            currentTopEl.textContent = formatTime(value);
        }, 600); // 与CSS中的transition时间相匹配
    }

    // 更新DOM元素引用
    const taskIndicatorCircle = document.getElementById('task-indicator-circle');
    
    // 圆环进度模板元素
    const daysCircle = document.getElementById('days-circle');
    const hoursCircle = document.getElementById('hours-circle');
    const minutesCircle = document.getElementById('minutes-circle');
    const secondsCircle = document.getElementById('seconds-circle');
    
    const daysCircleText = document.getElementById('days-circle-text');
    const hoursCircleText = document.getElementById('hours-circle-text');
    const minutesCircleText = document.getElementById('minutes-circle-text');
    const secondsCircleText = document.getElementById('seconds-circle-text');
    
    // 圆环进度最大值
    const maxDays = 365;
    const maxHours = 24;
    const maxMinutes = 60;
    const maxSeconds = 60;
    
    // 圆环周长
    const circleDashArray = 283; // 2πr = 2 * π * 45 ≈ 283

    // Update task indicator
    function updateTaskIndicator() {
        const taskText = `当前任务: 任务 ${currentTaskIndex + 1}`;
        
        // 更新所有模板的任务指示器
        if (taskIndicator) taskIndicator.textContent = taskText;
        if (taskIndicatorDigital) taskIndicatorDigital.textContent = taskText;
        if (taskIndicatorMinimal) taskIndicatorMinimal.textContent = taskText;
        if (taskIndicatorGradient) taskIndicatorGradient.textContent = taskText;
        if (taskIndicatorNeon) taskIndicatorNeon.textContent = taskText;
        if (taskIndicatorAnalog) taskIndicatorAnalog.textContent = taskText;
        
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
        
        // 根据当前模板生成不同的预览内容
        let previewHTML = '';
        
        switch (currentTemplate) {
            case 'classic':
                previewHTML = `
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
                    </div>
                `;
                break;
                
            case 'digital':
                previewHTML = `
                    <div class="preview-timer-container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="font-size: 2rem; color: white; font-family: 'Courier New', monospace; margin: 1rem 0;">
                            ${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}
                        </div>
                    </div>
                `;
                break;
                
            case 'minimal':
                previewHTML = `
                    <div class="preview-timer-container" style="background-color: #f8f9fa; color: #333;">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator" style="background-color: #e9ecef; color: #333;">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 300;">${formatTime(days)}</div>
                                <div style="font-size: 0.8rem; color: #666;">天</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 300;">${formatTime(hours)}</div>
                                <div style="font-size: 0.8rem; color: #666;">时</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 300;">${formatTime(minutes)}</div>
                                <div style="font-size: 0.8rem; color: #666;">分</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 300;">${formatTime(seconds)}</div>
                                <div style="font-size: 0.8rem; color: #666;">秒</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'gradient':
                previewHTML = `
                    <div class="preview-timer-container" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3); background-size: 400% 400%; animation: gradientShift 8s ease infinite;">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="display: flex; gap: 0.8rem; justify-content: center; margin: 1rem 0;">
                            <div style="background-color: rgba(255, 255, 255, 0.15); padding: 0.8rem 0.5rem; border-radius: 8px; text-align: center; min-width: 50px;">
                                <div style="font-size: 1.2rem; color: white; font-weight: bold;">${formatTime(days)}</div>
                                <div style="font-size: 0.6rem; color: rgba(255, 255, 255, 0.9);">Days</div>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.15); padding: 0.8rem 0.5rem; border-radius: 8px; text-align: center; min-width: 50px;">
                                <div style="font-size: 1.2rem; color: white; font-weight: bold;">${formatTime(hours)}</div>
                                <div style="font-size: 0.6rem; color: rgba(255, 255, 255, 0.9);">Hours</div>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.15); padding: 0.8rem 0.5rem; border-radius: 8px; text-align: center; min-width: 50px;">
                                <div style="font-size: 1.2rem; color: white; font-weight: bold;">${formatTime(minutes)}</div>
                                <div style="font-size: 0.6rem; color: rgba(255, 255, 255, 0.9);">Minutes</div>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.15); padding: 0.8rem 0.5rem; border-radius: 8px; text-align: center; min-width: 50px;">
                                <div style="font-size: 1.2rem; color: white; font-weight: bold;">${formatTime(seconds)}</div>
                                <div style="font-size: 0.6rem; color: rgba(255, 255, 255, 0.9);">Seconds</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'neon':
                previewHTML = `
                    <div class="preview-timer-container" style="background-color: #0a0a0a; border: 2px solid #00ff41;">
                        <h1 style="color: #00ff41; text-shadow: 0 0 10px #00ff41;">倒计时器</h1>
                        <div class="preview-current-task-indicator" style="background-color: rgba(0, 255, 65, 0.1); border: 1px solid #00ff41;">
                            <span style="color: #00ff41; text-shadow: 0 0 5px #00ff41;">当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: #00ff41; text-shadow: 0 0 10px #00ff41; font-family: 'Courier New', monospace;">${formatTime(days)}</div>
                                <div style="font-size: 0.7rem; color: #00ff41; text-shadow: 0 0 5px #00ff41;">Days</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: #00ff41; text-shadow: 0 0 10px #00ff41; font-family: 'Courier New', monospace;">${formatTime(hours)}</div>
                                <div style="font-size: 0.7rem; color: #00ff41; text-shadow: 0 0 5px #00ff41;">Hours</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: #00ff41; text-shadow: 0 0 10px #00ff41; font-family: 'Courier New', monospace;">${formatTime(minutes)}</div>
                                <div style="font-size: 0.7rem; color: #00ff41; text-shadow: 0 0 5px #00ff41;">Minutes</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: #00ff41; text-shadow: 0 0 10px #00ff41; font-family: 'Courier New', monospace;">${formatTime(seconds)}</div>
                                <div style="font-size: 0.7rem; color: #00ff41; text-shadow: 0 0 5px #00ff41;">Seconds</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'analog':
                previewHTML = `
                    <div class="preview-timer-container" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="text-align: center; margin: 1rem 0;">
                            <div style="width: 80px; height: 80px; border: 4px solid rgba(255, 255, 255, 0.3); border-radius: 50%; position: relative; margin: 0 auto 1rem auto; background-color: rgba(255, 255, 255, 0.1);">
                                <div style="position: absolute; bottom: 50%; left: 50%; width: 2px; height: 30px; background: linear-gradient(to top, #ff6b6b, #ff8e8e); transform-origin: bottom; transform: translateX(-50%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg);"></div>
                                <div style="position: absolute; bottom: 50%; left: 50%; width: 1.5px; height: 35px; background: linear-gradient(to top, #4ecdc4, #6ee7df); transform-origin: bottom; transform: translateX(-50%) rotate(${minutes * 6}deg);"></div>
                                <div style="position: absolute; bottom: 50%; left: 50%; width: 1px; height: 40px; background: linear-gradient(to top, #feca57, #ffd93d); transform-origin: bottom; transform: translateX(-50%) rotate(${seconds * 6}deg);"></div>
                                <div style="position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; background-color: white; border-radius: 50%; transform: translate(-50%, -50%);"></div>
                            </div>
                            <div style="font-size: 1.2rem; color: white; font-family: 'Courier New', monospace;">${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}</div>
                        </div>
                    </div>
                `;
                break;
                
            case 'circle':
                previewHTML = `
                    <div class="preview-timer-container" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(days)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Days</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(hours)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Hours</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(minutes)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Minutes</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(seconds)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Seconds</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'dashboard':
                previewHTML = `
                    <div class="preview-timer-container" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <h1>倒计时器</h1>
                        <div class="preview-current-task-indicator">
                            <span>当前任务: 任务 ${currentTaskIndex + 1}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(days)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Days</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(hours)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Hours</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(minutes)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Minutes</div>
                            </div>
                            <div style="text-align: center; min-width: 50px;">
                                <div style="font-size: 1.5rem; color: white; font-weight: bold;">${formatTime(seconds)}</div>
                                <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.9);">Seconds</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            default:
                previewHTML = `
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
                    </div>
                `;
        }
        
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
        const timerContainer = document.querySelector(`.template-${currentTemplate}`);
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