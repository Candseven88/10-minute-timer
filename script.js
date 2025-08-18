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
    
    // 语言选择器
    const languageSelect = document.getElementById('language-select');

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

    // ==== i18n start ====
    const i18n = {
        current: 'zh',
        dict: {
            zh: {
                window_timer: '倒计时',
                window_admin: '设置',
                window_monitor: '监视台',
                title: '倒计时器',
                current_task_prefix: '当前任务',
                footer: '专注工作，高效生活',
                label_days: 'Days',
                label_hours: 'Hours',
                label_minutes: 'Minutes',
                label_seconds: 'Seconds',
                btn_start: '开始',
                btn_pause: '暂停',
                btn_reset: '重置',
                btn_fullscreen: '全屏',
                admin_title: '时间设置',
                add_task: '+ 添加新任务',
                save_settings: '保存设置',
                reset_settings: '重置为默认',
                monitor_title: '监视台',
                preview_section_title: '前端预览',
                preview_title_text: '倒计时页面实时预览',
                monitor_controls_title: '远程控制',
                tasks_overview_title: '任务概览',
                status_section_title: '实时状态',
                status_running_label: '运行状态:',
                status_current_task_label: '当前任务:',
                status_remaining_label: '剩余时间:',
                status_progress_label: '总进度:',
                log_section_title: '执行日志',
                clear_log: '清空日志',
                status_running_value_running: '运行中',
                status_running_value_stopped: '未开始',
                monitor_btn_next: '下一任务',
                // dynamic messages
                alert_settings_saved_title: '设置已保存！',
                alert_settings_saved_hint: '点击开始按钮开始执行任务',
                alert_reset_done: '已重置为默认设置！点击开始按钮开始执行任务',
                log_init_done: '系统初始化完成，等待用户开始',
                log_preview_refreshed: '预览已刷新',
                log_preview_shown: '预览已显示',
                log_preview_hidden: '预览已隐藏',
                log_started: '开始执行任务',
                log_paused: '倒计时已暂停',
                log_task_finished: '任务 完成',
                log_switch_auto: '自动切换到任务',
                log_all_done: '所有任务执行完成',
                log_fullscreen_on: '倒计时全屏模式: 开启',
                log_fullscreen_off: '倒计时全屏模式: 关闭',
            },
            en: {
                window_timer: 'Timer',
                window_admin: 'Settings',
                window_monitor: 'Monitor',
                title: 'Countdown',
                current_task_prefix: 'Current Task',
                footer: 'Focus on work, live efficiently',
                label_days: 'Days',
                label_hours: 'Hours',
                label_minutes: 'Minutes',
                label_seconds: 'Seconds',
                btn_start: 'Start',
                btn_pause: 'Pause',
                btn_reset: 'Reset',
                btn_fullscreen: 'Fullscreen',
                admin_title: 'Time Settings',
                add_task: '+ Add Task',
                save_settings: 'Save',
                reset_settings: 'Reset to Default',
                monitor_title: 'Monitor',
                preview_section_title: 'Preview',
                preview_title_text: 'Live Preview',
                monitor_controls_title: 'Remote Control',
                tasks_overview_title: 'Tasks Overview',
                status_section_title: 'Status',
                status_running_label: 'Running:',
                status_current_task_label: 'Current Task:',
                status_remaining_label: 'Remaining:',
                status_progress_label: 'Progress:',
                log_section_title: 'Logs',
                clear_log: 'Clear Logs',
                status_running_value_running: 'Running',
                status_running_value_stopped: 'Stopped',
                monitor_btn_next: 'Next Task',
                // dynamic messages
                alert_settings_saved_title: 'Settings saved!',
                alert_settings_saved_hint: 'Click Start to begin',
                alert_reset_done: 'Reset to default! Click Start to begin',
                log_init_done: 'Initialized. Waiting to start',
                log_preview_refreshed: 'Preview refreshed',
                log_preview_shown: 'Preview shown',
                log_preview_hidden: 'Preview hidden',
                log_started: 'Start task',
                log_paused: 'Timer paused',
                log_task_finished: 'Task finished',
                log_switch_auto: 'Auto switched to task',
                log_all_done: 'All tasks finished',
                log_fullscreen_on: 'Fullscreen: ON',
                log_fullscreen_off: 'Fullscreen: OFF',
            }
        }
    };

    function getT(key) {
        return (i18n.dict[i18n.current] && i18n.dict[i18n.current][key]) || (i18n.dict.zh[key] || key);
    }

    // ==== same-origin realtime sync (BroadcastChannel) ====
    const bc = 'BroadcastChannel' in window ? new BroadcastChannel('timer_control') : null;
    function bcPost(msg) {
        try { bc && bc.postMessage(msg); } catch (e) {}
    }

    function applyTranslations() {
        // 顶部窗口按钮
        if (timerWindowBtn) timerWindowBtn.textContent = getT('window_timer');
        if (adminWindowBtn) adminWindowBtn.textContent = getT('window_admin');
        if (monitorWindowBtn) monitorWindowBtn.textContent = getT('window_monitor');
        // 主标题与 footer
        if (timerTitle) timerTitle.textContent = tasks[currentTaskIndex]?.title || getT('title');
        if (timerFooterText) timerFooterText.textContent = tasks[currentTaskIndex]?.footer || getT('footer');
        // 标签
        const labelDays = document.getElementById('label-days');
        const labelHours = document.getElementById('label-hours');
        const labelMinutes = document.getElementById('label-minutes');
        const labelSeconds = document.getElementById('label-seconds');
        if (labelDays) labelDays.textContent = getT('label_days');
        if (labelHours) labelHours.textContent = getT('label_hours');
        if (labelMinutes) labelMinutes.textContent = getT('label_minutes');
        if (labelSeconds) labelSeconds.textContent = getT('label_seconds');
        // 控制按钮
        const startBtn = document.getElementById('start');
        const pauseBtn = document.getElementById('pause');
        const resetBtn = document.getElementById('reset');
        if (startBtn) startBtn.textContent = getT('btn_start');
        if (pauseBtn) pauseBtn.textContent = getT('btn_pause');
        if (resetBtn) resetBtn.textContent = getT('btn_reset');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = i18n.current === 'zh' ? '全屏' : getT('btn_fullscreen');
            fullscreenBtn.title = i18n.current === 'zh' ? '全屏显示' : getT('btn_fullscreen');
        }
        // 管理窗口
        const adminTitle = document.getElementById('admin-title');
        const addTaskTextBtn = document.getElementById('add-task-btn');
        const saveSettingsButton = document.getElementById('save-settings');
        const resetSettingsButton = document.getElementById('reset-settings');
        if (adminTitle) adminTitle.textContent = getT('admin_title');
        if (addTaskTextBtn) addTaskTextBtn.textContent = getT('add_task');
        if (saveSettingsButton) saveSettingsButton.textContent = getT('save_settings');
        if (resetSettingsButton) resetSettingsButton.textContent = getT('reset_settings');
        // 监视台
        const monitorTitle = document.getElementById('monitor-title');
        const previewSectionTitle = document.getElementById('preview-section-title');
        const previewTitleText = document.getElementById('preview-title-text');
        const monitorControlsTitle = document.getElementById('monitor-controls-title');
        const tasksOverviewTitle = document.getElementById('tasks-overview-title');
        const statusSectionTitle = document.getElementById('status-section-title');
        const statusLabelRunning = document.getElementById('status-label-running');
        const statusLabelCurrent = document.getElementById('status-label-current-task');
        const statusLabelRemaining = document.getElementById('status-label-remaining');
        const statusLabelProgress = document.getElementById('status-label-progress');
        const clearLogButton = document.getElementById('clear-log');
        const monitorNext = document.getElementById('monitor-next');
        if (monitorTitle) monitorTitle.textContent = getT('monitor_title');
        if (previewSectionTitle) previewSectionTitle.textContent = getT('preview_section_title');
        if (previewTitleText) previewTitleText.textContent = getT('preview_title_text');
        if (monitorControlsTitle) monitorControlsTitle.textContent = getT('monitor_controls_title');
        if (tasksOverviewTitle) tasksOverviewTitle.textContent = getT('tasks_overview_title');
        if (statusSectionTitle) statusSectionTitle.textContent = getT('status_section_title');
        if (statusLabelRunning) statusLabelRunning.textContent = getT('status_running_label');
        if (statusLabelCurrent) statusLabelCurrent.textContent = getT('status_current_task_label');
        if (statusLabelRemaining) statusLabelRemaining.textContent = getT('status_remaining_label');
        if (statusLabelProgress) statusLabelProgress.textContent = getT('status_progress_label');
        if (clearLogButton) clearLogButton.textContent = getT('clear_log');
        if (monitorStartBtn) monitorStartBtn.textContent = getT('btn_start');
        if (monitorPauseBtn) monitorPauseBtn.textContent = getT('btn_pause');
        if (monitorResetBtn) monitorResetBtn.textContent = getT('btn_reset');
        if (monitorNext) monitorNext.textContent = getT('monitor_btn_next');
        // 当前任务行
        updateTaskIndicator();
        // 状态值（运行/停止）
        updateMonitorStatus();
    }

    function setLanguage(lang) {
        if (!i18n.dict[lang]) return;
        i18n.current = lang;
        localStorage.setItem('timerLang', lang);
        applyTranslations();
        generatePreviewContent();
        // 同步到展示端
        bcPost({ type: 'LANG', lang });
    }

    // 初始化语言
    (function initLanguage() {
        const savedLang = localStorage.getItem('timerLang') || 'zh';
        i18n.current = savedLang;
        if (languageSelect) languageSelect.value = savedLang;
    })();

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    // ==== i18n end ====

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
            monitorStatus.textContent = isRunning ? getT('status_running_value_running') : getT('status_running_value_stopped');
            monitorStatus.className = `status-value ${isRunning ? 'success' : 'warning'}`;
        }
        
        if (monitorCurrentTask) {
            monitorCurrentTask.textContent = `${getT('current_task_prefix')} ${currentTaskIndex + 1}`;
        }
        
        if (monitorRemainingTime) {
            const days = Math.floor(totalSeconds / (24 * 3600));
            const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            let timeString = '';
            if (days > 0) timeString += `${days}${i18n.current === 'zh' ? '天' : 'd'}`;
            if (hours > 0) timeString += `${hours}${i18n.current === 'zh' ? '时' : 'h'}`;
            if (minutes > 0) timeString += `${minutes}${i18n.current === 'zh' ? '分' : 'm'}`;
            if (seconds > 0) timeString += `${seconds}${i18n.current === 'zh' ? '秒' : 's'}`;
            
            monitorRemainingTime.textContent = timeString || (i18n.current === 'zh' ? '0秒' : '0s');
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
                let statusText = i18n.current === 'zh' ? '等待中' : 'Pending';
                
                if (index === currentTaskIndex && isRunning) {
                    statusClass = 'current';
                    statusText = i18n.current === 'zh' ? '执行中' : 'Running';
                } else if (index < currentTaskIndex) {
                    statusClass = 'completed';
                    statusText = i18n.current === 'zh' ? '已完成' : 'Completed';
                }
                
                if (index === currentTaskIndex) {
                    taskDiv.classList.add('current');
                } else if (index < currentTaskIndex) {
                    taskDiv.classList.add('completed');
                }
                
                const taskTime = `${task.days}${i18n.current === 'zh' ? '天' : 'd'} ${task.hours}${i18n.current === 'zh' ? '时' : 'h'} ${task.minutes}${i18n.current === 'zh' ? '分' : 'm'} ${task.seconds}${i18n.current === 'zh' ? '秒' : 's'}`;
                
                taskDiv.innerHTML = `
                    <div class="task-info">
                        <span class="task-number">${i18n.current === 'zh' ? '任务' : 'Task'} ${index + 1}</span>
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
                addLog(`${i18n.current === 'zh' ? '通过监视台启动倒计时' : 'Started from monitor'}`, 'success');
            });
        }
        
        if (monitorPauseBtn) {
            monitorPauseBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                isRunning = false;
                addLog(`${i18n.current === 'zh' ? '通过监视台暂停倒计时' : 'Paused from monitor'}`, 'warning');
                console.log('倒计时已暂停'); // 调试信息
                bcPost({ type: 'PAUSE', remainingSeconds: totalSeconds });
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
                addLog(`${i18n.current === 'zh' ? '通过监视台重置倒计时' : 'Reset from monitor'}`, 'info');
                bcPost({ type: 'RESET', tasks, currentTaskIndex, remainingSeconds: totalSeconds, lang: i18n.current });
            });
        }
        
        if (monitorNextBtn) {
            monitorNextBtn.addEventListener('click', () => {
                if (currentTaskIndex < tasks.length - 1) {
                    switchToNextTask();
                    addLog(`${i18n.current === 'zh' ? '通过监视台手动切换到下一任务' : 'Manually switched to next task from monitor'}`, 'info');
                }
            });
        }
        
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => {
                logEntries = [];
                updateMonitorLog();
                addLog(`${i18n.current === 'zh' ? '日志已清空' : 'Logs cleared'}`, 'info');
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
            title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
            taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} ${taskIndex + 1}`,
            footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
            backgroundType: 'color', // 背景类型：color, image
            backgroundColor: '#000000', // 背景颜色
            backgroundImage: '', // 背景图片URL
            backgroundEnabled: true, // 背景是否启用
            backgroundImageOpacity: 80 // 图片背景透明度
        };
        return `
            <div class="task-section" data-task-index="${taskIndex}">
                <div class="task-header">
                    <h3>${i18n.current === 'zh' ? '任务' : 'Task'} ${taskIndex + 1}</h3>
                    <button class="delete-task-btn" onclick="deleteTask(${taskIndex})" title="${i18n.current === 'zh' ? '删除任务' : 'Delete task'}">×</button>
                </div>
                
                <!-- 任务信息设置 - 紧凑横向布局 -->
                <div class="task-info-settings">
                    <div class="setting-group">
                        <label for="title-input-${taskIndex}">${i18n.current === 'zh' ? '标题' : 'Title'}</label>
                        <input type="text" id="title-input-${taskIndex}" value="${taskData.title}" placeholder="${i18n.current === 'zh' ? '倒计时器' : 'Countdown'}">
                    </div>
                    <div class="setting-group">
                        <label for="taskname-input-${taskIndex}">${i18n.current === 'zh' ? '任务名称' : 'Task Name'}</label>
                        <input type="text" id="taskname-input-${taskIndex}" value="${taskData.taskName}" placeholder="${i18n.current === 'zh' ? '任务名称' : 'Task Name'}">
                    </div>
                    <div class="setting-group">
                        <label for="footer-input-${taskIndex}">${i18n.current === 'zh' ? '底部文字' : 'Footer text'}</label>
                        <input type="text" id="footer-input-${taskIndex}" value="${taskData.footer}" placeholder="${i18n.current === 'zh' ? '底部文字' : 'Footer'}">
                    </div>
                </div>
                
                <!-- 背景设置 -->
                <div class="background-settings">
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="background-enabled-${taskIndex}" ${taskData.backgroundEnabled ? 'checked' : ''} onchange="toggleBackgroundSettings(${taskIndex})">
                            ${i18n.current === 'zh' ? '启用背景设置' : 'Enable background'}
                        </label>
                    </div>
                    
                    <div class="background-options" id="background-options-${taskIndex}" style="display: ${taskData.backgroundEnabled ? 'block' : 'none'}">
                        <div class="setting-group">
                            <label for="background-type-${taskIndex}">${i18n.current === 'zh' ? '背景类型' : 'Background type'}</label>
                            <select id="background-type-${taskIndex}" onchange="updateBackgroundSettings(${taskIndex})">
                                <option value="color" ${taskData.backgroundType === 'color' ? 'selected' : ''}>${i18n.current === 'zh' ? '纯色背景' : 'Solid color'}</option>
                                <option value="image" ${taskData.backgroundType === 'image' ? 'selected' : ''}>${i18n.current === 'zh' ? '图片背景' : 'Image'}</option>
                            </select>
                        </div>
                        
                        <!-- 颜色背景设置 -->
                        <div class="background-color-setting" id="background-color-setting-${taskIndex}" style="display: ${taskData.backgroundType === 'color' ? 'block' : 'none'}">
                            <div class="setting-group">
                                <label for="background-color-${taskIndex}">${i18n.current === 'zh' ? '背景颜色' : 'Background color'}</label>
                                <input type="color" id="background-color-${taskIndex}" value="${taskData.backgroundColor}" onchange="updateTaskPreview(${taskIndex})">
                            </div>
                        </div>
                        
                        <!-- 图片背景设置 -->
                        <div class="background-image-setting" id="background-image-setting-${taskIndex}" style="display: ${taskData.backgroundType === 'image' ? 'block' : 'none'}">
                            <div class="setting-group">
                                <label for="background-image-${taskIndex}">${i18n.current === 'zh' ? '图片URL' : 'Image URL'}</label>
                                <input type="url" id="background-image-${taskIndex}" value="${taskData.backgroundImage}" placeholder="https://example.com/image.jpg" onchange="updateTaskPreview(${taskIndex})">
                            </div>
                            <div class="setting-group">
                                <label for="background-image-file-${taskIndex}">${i18n.current === 'zh' ? '或上传图片' : 'Or upload image'}</label>
                                <div class="file-upload-container">
                                    <input type="file" id="background-image-file-${taskIndex}" accept="image/*" onchange="handleImageUpload(${taskIndex})">
                                    <button type="button" class="clear-file-btn" onclick="clearImageFile(${taskIndex})" title="${i18n.current === 'zh' ? '清除已上传的图片' : 'Clear uploaded image'}">×</button>
                                </div>
                                <div class="file-status" id="image-file-status-${taskIndex}"></div>
                            </div>
                            <div class="setting-group">
                                <label for="background-image-opacity-${taskIndex}">${i18n.current === 'zh' ? '蒙版透明度' : 'Overlay opacity'}</label>
                                <input type="range" id="background-image-opacity-${taskIndex}" min="0" max="100" value="${taskData.backgroundImageOpacity || 80}" oninput="updateImageOpacityPreview(${taskIndex}); updateTaskPreview(${taskIndex})">
                                <span class="opacity-value" id="opacity-value-${taskIndex}">${taskData.backgroundImageOpacity || 80}%</span>
                            </div>
                        </div>
                        
                        <!-- 实时效果预览 -->
                        <div class="task-preview-section">
                            <h4>${i18n.current === 'zh' ? '效果预览' : 'Preview'}</h4>
                            <div class="task-preview-container" id="task-preview-${taskIndex}">
                                <div class="task-preview-timer">
                                    <h3>${taskData.title}</h3>
                                    <div class="task-preview-task-name">${taskData.taskName}</div>
                                    <div class="task-preview-time">00:00:05</div>
                                    <div class="task-preview-footer">${taskData.footer}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="time-settings-row">
                    <div class="setting-group">
                        <label for="days-input-${taskIndex}">${i18n.current === 'zh' ? '天' : 'Days'}</label>
                        <input type="number" id="days-input-${taskIndex}" min="0" max="365" value="${taskData.days}">
                    </div>
                    <div class="setting-group">
                        <label for="hours-input-${taskIndex}">${i18n.current === 'zh' ? '时' : 'Hours'}</label>
                        <input type="number" id="hours-input-${taskIndex}" min="0" max="23" value="${taskData.hours}">
                    </div>
                    <div class="setting-group">
                        <label for="minutes-input-${taskIndex}">${i18n.current === 'zh' ? '分' : 'Minutes'}</label>
                        <input type="number" id="minutes-input-${taskIndex}" min="0" max="59" value="${taskData.minutes}">
                    </div>
                    <div class="setting-group">
                        <label for="seconds-input-${taskIndex}">${i18n.current === 'zh' ? '秒' : 'Seconds'}</label>
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
            title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
            taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} ${taskIndex + 1}`,
            footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
            backgroundType: 'color', // 默认背景类型
            backgroundColor: '#000000', // 默认背景颜色
            backgroundImage: '', // 默认背景图片
            backgroundEnabled: true, // 默认启用背景
            backgroundImageOpacity: 80 // 默认图片背景透明度
        };
        tasks.push(newTask);
        
        const taskHTML = createTaskHTML(taskIndex, newTask);
        tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
        
        console.log('添加新任务:', taskIndex);
    }

    // 删除任务
    window.deleteTask = function(taskIndex) {
        if (tasks.length <= 1) {
            alert(i18n.current === 'zh' ? '至少需要保留一个任务！' : 'At least one task is required!');
            return;
        }
        
        if (isRunning && currentTaskIndex === taskIndex) {
            alert(i18n.current === 'zh' ? '无法删除正在运行的任务！' : 'Cannot delete the running task!');
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
                title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 1`,
                footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundEnabled: true, // 默认启用背景
                backgroundImageOpacity: 80 // 默认图片背景透明度
            }];
        } else {
            // 默认设置
            tasks = [
                { 
                    days: 0, 
                    hours: 0, 
                    minutes: 10, 
                    seconds: 0,
                    title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                    taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 1`,
                    footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                    backgroundType: 'color', // 默认背景类型
                    backgroundColor: '#000000', // 默认背景颜色
                    backgroundImage: '', // 默认背景图片
                    backgroundEnabled: true, // 默认启用背景
                    backgroundImageOpacity: 80 // 默认图片背景透明度
                },
                { 
                    days: 0, 
                    hours: 0, 
                    minutes: 5, 
                    seconds: 0,
                    title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                    taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 2`,
                    footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                    backgroundType: 'color', // 默认背景类型
                    backgroundColor: '#000000', // 默认背景颜色
                    backgroundImage: '', // 默认背景图片
                    backgroundEnabled: true, // 默认启用背景
                    backgroundImageOpacity: 80 // 默认图片背景透明度
                }
            ];
        }
        renderTasks();
        applySettings();
        // 初次应用文案翻译
        applyTranslations();
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
            const title = section.querySelector(`#title-input-${index}`).value || (i18n.current === 'zh' ? '倒计时器' : 'Countdown');
            const taskName = section.querySelector(`#taskname-input-${index}`).value || `${i18n.current === 'zh' ? '任务' : 'Task'} ${index + 1}`;
            const footer = section.querySelector(`#footer-input-${index}`).value || (i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently');
            
            // 获取背景设置
            const backgroundEnabled = section.querySelector(`#background-enabled-${index}`).checked;
            const backgroundType = section.querySelector(`#background-type-${index}`).value;
            let backgroundColor = '#000000'; // 默认颜色
            let backgroundImage = '';
            let backgroundImageOpacity = 80; // 默认透明度

            if (backgroundEnabled) {
                if (backgroundType === 'color') {
                    backgroundColor = section.querySelector(`#background-color-${index}`).value;
                } else if (backgroundType === 'image') {
                    backgroundImage = section.querySelector(`#background-image-${index}`).value;
                    backgroundImageOpacity = parseInt(section.querySelector(`#background-image-opacity-${index}`).value) || 80;
                }
            }

            newTasks.push({ days, hours, minutes, seconds, title, taskName, footer, backgroundType, backgroundColor, backgroundImage, backgroundEnabled, backgroundImageOpacity });
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
        
        // 通知展示端设置变更
        bcPost({ type: 'SETTINGS', tasks });
        
        // Show success message (localized)
        const savedTasksCount = newTasks.length;
        const message = `${getT('alert_settings_saved_title')}\n\n`;
        let taskDetails = '';
        
        newTasks.forEach((task, index) => {
            const backgroundInfo = task.backgroundEnabled ? 
                `${i18n.current === 'zh' ? '背景' : 'Background'}: ${task.backgroundType === 'color' ? (i18n.current === 'zh' ? '纯色' : 'Color') : (i18n.current === 'zh' ? '图片' : 'Image')}` : 
                `${i18n.current === 'zh' ? '背景' : 'Background'}: ${i18n.current === 'zh' ? '未启用' : 'Disabled'}`;
            taskDetails += `• ${i18n.current === 'zh' ? '任务' : 'Task'} ${index + 1}: "${task.title}" (${task.taskName}) - ${backgroundInfo}\n`;
        });
        
        alert(message + `${i18n.current === 'zh' ? '已配置' : 'Configured'} ${savedTasksCount} ${i18n.current === 'zh' ? '个任务' : 'tasks'}：\n` + taskDetails + `\n${getT('alert_settings_saved_hint')}`);
    }

    // Apply settings to inputs
    function applySettings() {
        if (tasks.length === 0) {
            tasks = [{ 
                days: 0, 
                hours: 0, 
                minutes: 10, 
                seconds: 0,
                title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 1`,
                footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundEnabled: true, // 默认启用背景
                backgroundImageOpacity: 80 // 默认图片背景透明度
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
                title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 1`,
                footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundEnabled: true, // 默认启用背景
                backgroundImageOpacity: 80 // 默认图片背景透明度
            },
            { 
                days: 0, 
                hours: 0, 
                minutes: 5, 
                seconds: 0,
                title: i18n.current === 'zh' ? '倒计时器' : 'Countdown',
                taskName: `${i18n.current === 'zh' ? '任务' : 'Task'} 2`,
                footer: i18n.current === 'zh' ? '专注工作，高效生活' : 'Focus on work, live efficiently',
                backgroundType: 'color', // 默认背景类型
                backgroundColor: '#000000', // 默认背景颜色
                backgroundImage: '', // 默认背景图片
                backgroundEnabled: true, // 默认启用背景
                backgroundImageOpacity: 80 // 默认图片背景透明度
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
        
        // 通知展示端
        bcPost({ type: 'RESET', tasks, currentTaskIndex, remainingSeconds: totalSeconds, lang: i18n.current });
        
        // 重置后不自动开始，需要用户手动点击开始按钮
        alert(getT('alert_reset_done'));
    }

    // Switch to next task
    function switchToNextTask() {
        currentTaskIndex++;
        
        if (currentTaskIndex < tasks.length) {
            // 切换到下一个任务
            const nextTask = tasks[currentTaskIndex];
            totalSeconds = nextTask.days * 24 * 3600 + nextTask.hours * 3600 + nextTask.minutes * 60 + nextTask.seconds;
            console.log('切换到任务', currentTaskIndex + 1, '，总秒数:', totalSeconds);
            
            addLog(`${getT('log_switch_auto')} ${currentTaskIndex + 1}`, 'info');
            
            // 静默切换，不显示弹框
            updateTaskIndicator();
            updateDisplay();
            
            // 通知展示端切换
            bcPost({ type: 'NEXT', currentTaskIndex, remainingSeconds: totalSeconds, startedAt: Date.now() });
            
            // 自动开始下一个任务（因为用户已经开始了第一个任务）
            startTimer();
        } else {
            // 所有任务完成
            currentTaskIndex = 0;
            totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
            console.log('所有任务完成，重置为任务1，总秒数:', totalSeconds);
            
            addLog(getT('log_all_done'), 'success');
            
            // 静默完成，不显示弹框
            isRunning = false;
            clearInterval(timerInterval);
            updateTaskIndicator();
            updateDisplay();
            
            // 可选循环执行略
        }
    }

    // Start timer
    function startTimer() {
        if (!isRunning && totalSeconds > 0) {
            isRunning = true;
            timerInterval = setInterval(countdown, 1000);
            console.log('倒计时已启动，任务:', currentTaskIndex + 1);
            addLog(`${getT('log_started')} ${currentTaskIndex + 1}`, 'success');
            // 通知展示端开始
            bcPost({ type: 'START', tasks, currentTaskIndex, remainingSeconds: totalSeconds, startedAt: Date.now(), lang: i18n.current });
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
            
            addLog(`${i18n.current === 'zh' ? '任务' : 'Task'} ${currentTaskIndex + 1} ${getT('log_task_finished')}`, 'success');
            
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
                timerTitle.textContent = currentTask.title || getT('title');
            }
            
            // 更新任务指示器 - 只显示任务名称
            if (taskIndicator) {
                taskIndicator.textContent = currentTask.taskName || `${getT('current_task_prefix')} ${currentTaskIndex + 1}`;
            }
            
            // 更新footer
            if (timerFooterText) {
                timerFooterText.textContent = currentTask.footer || getT('footer');
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
        bcPost({ type: 'PAUSE', remainingSeconds: totalSeconds });
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        currentTaskIndex = 0;
        totalSeconds = tasks[0].days * 24 * 3600 + tasks[0].hours * 3600 + tasks[0].minutes * 60 + tasks[0].seconds;
        console.log('重置倒计时，总秒数:', totalSeconds); // 调试信息
        updateTaskIndicator();
        updateDisplay();
        bcPost({ type: 'RESET', tasks, currentTaskIndex, remainingSeconds: totalSeconds, lang: i18n.current });
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
        const title = currentTask ? currentTask.title : getT('title');
        const taskName = currentTask ? currentTask.taskName : `${getT('current_task_prefix')} ${currentTaskIndex + 1}`;
        const footer = currentTask ? currentTask.footer : getT('footer');
        
        // 生成真正的缩小版镜像，完全复制倒计时页面的HTML结构
        const previewHTML = `
            <div class="timer-container preview-mirror" id="preview-timer-container">
                <h1 id="preview-timer-title">${title}</h1>
                <div class="current-task-indicator">
                    <span id="preview-task-indicator">${taskName}</span>
                </div>
                <div class="timer-display">
                    <div class="time-unit">
                        <div class="label">${getT('label_days')}</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(days)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">${getT('label_hours')}</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(hours)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">${getT('label_minutes')}</div>
                        <div class="flip-clock">
                            <div class="digit">${formatTime(minutes)}</div>
                        </div>
                    </div>
                    <div class="separator">:</div>
                    <div class="time-unit">
                        <div class="label">${getT('label_seconds')}</div>
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
        addLog(getT('log_preview_refreshed'), 'info');
    }

    // 切换预览显示/隐藏
    function togglePreview() {
        if (previewContent) {
            isPreviewVisible = !isPreviewVisible;
            previewContent.classList.toggle('hidden', !isPreviewVisible);
            
            const toggleText = isPreviewVisible ? (i18n.current === 'zh' ? '隐藏预览' : 'Hide preview') : (i18n.current === 'zh' ? '显示预览' : 'Show preview');
            togglePreviewBtn.title = toggleText;
            
            addLog(isPreviewVisible ? getT('log_preview_shown') : getT('log_preview_hidden'), 'info');
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
            fullscreenBtn.textContent = i18n.current === 'zh' ? '全屏' : getT('btn_fullscreen');
            fullscreenBtn.title = i18n.current === 'zh' ? '全屏显示' : getT('btn_fullscreen');
        } else {
            document.documentElement.requestFullscreen();
            isFullscreen = true;
            fullscreenBtn.textContent = i18n.current === 'zh' ? '退出全屏' : (getT('btn_fullscreen') + ' Off');
            fullscreenBtn.title = i18n.current === 'zh' ? '退出全屏' : (getT('btn_fullscreen') + ' Off');
        }
        addLog(isFullscreen ? getT('log_fullscreen_on') : getT('log_fullscreen_off'), 'info');
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
            
            fullscreenBtn.textContent = i18n.current === 'zh' ? '全屏' : getT('btn_fullscreen');
            fullscreenBtn.title = i18n.current === 'zh' ? '全屏显示' : getT('btn_fullscreen');
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
            exitBtn.title = i18n.current === 'zh' ? '退出全屏' : 'Exit Fullscreen';
            exitBtn.addEventListener('click', toggleFullscreenTimer);
            timerWindow.appendChild(exitBtn);
            
            // 请求浏览器全屏
            document.documentElement.requestFullscreen().catch(err => {
                console.error('全屏请求被拒绝:', err);
            });
            
            fullscreenBtn.textContent = i18n.current === 'zh' ? '退出全屏' : 'Exit Fullscreen';
            fullscreenBtn.title = i18n.current === 'zh' ? '退出全屏' : 'Exit Fullscreen';
            isFullscreen = true;
        }
        
        addLog(isFullscreen ? getT('log_fullscreen_on') : getT('log_fullscreen_off'), 'info');
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
        
        // 显示对应的背景设置区域
        if (backgroundType === 'color') {
            document.getElementById(`background-color-setting-${taskIndex}`).style.display = 'block';
        } else if (backgroundType === 'image') {
            document.getElementById(`background-image-setting-${taskIndex}`).style.display = 'block';
        }
        
        // 更新预览
        updateTaskPreview(taskIndex);
    };

    // 切换背景设置启用/禁用
    window.toggleBackgroundSettings = function(taskIndex) {
        const backgroundEnabledCheckbox = document.getElementById(`background-enabled-${taskIndex}`);
        const backgroundOptions = document.getElementById(`background-options-${taskIndex}`);

        if (backgroundEnabledCheckbox && backgroundOptions) {
            // 根据勾选框的当前状态显示或隐藏背景选项
            backgroundOptions.style.display = backgroundEnabledCheckbox.checked ? 'block' : 'none';
            // 更新预览
            updateTaskPreview(taskIndex);
        }
    };

    // 更新图片透明度预览
    window.updateImageOpacityPreview = function(taskIndex) {
        const opacity = document.getElementById(`background-image-opacity-${taskIndex}`).value;
        document.getElementById(`opacity-value-${taskIndex}`).textContent = opacity + '%';
    };

    // 更新任务预览
    window.updateTaskPreview = function(taskIndex) {
        const previewContainer = document.getElementById(`task-preview-${taskIndex}`);
        if (!previewContainer) return;
        
        // 获取当前设置值
        const backgroundEnabled = document.getElementById(`background-enabled-${taskIndex}`).checked;
        const backgroundType = document.getElementById(`background-type-${taskIndex}`).value;
        const title = document.getElementById(`title-input-${taskIndex}`).value || getT('title');
        const taskName = document.getElementById(`taskname-input-${taskIndex}`).value || `${getT('current_task_prefix')} ${taskIndex + 1}`;
        const footer = document.getElementById(`footer-input-${taskIndex}`).value || getT('footer');
        
        // 更新预览内容
        const previewTimer = previewContainer.querySelector('.task-preview-timer');
        if (previewTimer) {
            previewTimer.querySelector('h3').textContent = title;
            previewTimer.querySelector('.task-preview-task-name').textContent = taskName;
            previewTimer.querySelector('.task-preview-footer').textContent = footer;
        }
        
        // 清除之前的背景
        previewContainer.style.background = '';
        previewContainer.style.backgroundImage = '';
        previewContainer.style.backgroundSize = '';
        previewContainer.style.backgroundPosition = '';
        previewContainer.style.backgroundRepeat = '';
        
        // 移除之前的视频背景和蒙版
        const existingVideo = previewContainer.querySelector('.background-video');
        if (existingVideo) {
            existingVideo.remove();
        }
        const existingOverlay = previewContainer.querySelector('.background-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // 应用背景设置
        if (backgroundEnabled) {
            if (backgroundType === 'color') {
                const backgroundColor = document.getElementById(`background-color-${taskIndex}`).value;
                previewContainer.style.backgroundColor = backgroundColor;
            } else if (backgroundType === 'image') {
                const backgroundImage = document.getElementById(`background-image-${taskIndex}`).value;
                const opacity = document.getElementById(`background-image-opacity-${taskIndex}`).value;
                
                if (backgroundImage) {
                    previewContainer.style.backgroundImage = `url('${backgroundImage}')`;
                    previewContainer.style.backgroundSize = 'cover';
                    previewContainer.style.backgroundPosition = 'center';
                    previewContainer.style.backgroundRepeat = 'no-repeat';
                    
                    // 添加蒙版
                    const overlay = document.createElement('div');
                    overlay.className = 'background-overlay';
                    overlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, ${1 - opacity / 100});
                        z-index: 0;
                        pointer-events: none;
                    `;
                    previewContainer.style.position = 'relative';
                    previewContainer.appendChild(overlay);
                    
                    // 确保文字内容在蒙版之上
                    const textElements = previewContainer.querySelectorAll('h3, .task-preview-task-name, .task-preview-time, .task-preview-footer');
                    textElements.forEach(element => {
                        element.style.position = 'relative';
                        element.style.zIndex = '1';
                    });
                }
            }
        } else {
            // 如果背景未启用，使用默认黑色背景
            previewContainer.style.backgroundColor = '#000000';
        }
    };

    // 处理图片上传
    window.handleImageUpload = function(taskIndex) {
        const fileInput = document.getElementById(`background-image-file-${taskIndex}`);
        const imageUrlInput = document.getElementById(`background-image-${taskIndex}`);
        const imageFileStatus = document.getElementById(`image-file-status-${taskIndex}`);
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            imageFileStatus.textContent = i18n.current === 'zh' ? '正在处理图片...' : 'Processing image...';
            imageFileStatus.style.color = '#007bff';
            
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrlInput.value = e.target.result;
                imageFileStatus.textContent = `${i18n.current === 'zh' ? '已上传' : 'Uploaded'}: ${file.name}`;
                imageFileStatus.style.color = '#28a745';
                updateImageOpacityPreview(taskIndex);
                updateTaskPreview(taskIndex);
            };
            reader.onerror = function() {
                imageFileStatus.textContent = i18n.current === 'zh' ? '图片处理失败' : 'Image processing failed';
                imageFileStatus.style.color = '#dc3545';
            };
            reader.readAsDataURL(file);
        }
    };

    // 清除图片文件
    window.clearImageFile = function(taskIndex) {
        const imageUrlInput = document.getElementById(`background-image-${taskIndex}`);
        const imageFileStatus = document.getElementById(`image-file-status-${taskIndex}`);
        imageUrlInput.value = '';
        imageFileStatus.textContent = i18n.current === 'zh' ? '已清除' : 'Cleared';
        imageFileStatus.style.color = 'red';
        updateTaskPreview(taskIndex);
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
            
            // 移除之前的视频背景和蒙版
            const existingVideo = timerContainer.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }
            const existingOverlay = timerContainer.querySelector('.background-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
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
                    
                    // 添加蒙版
                    const overlay = document.createElement('div');
                    overlay.className = 'background-overlay';
                    overlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, ${1 - (currentTask.backgroundImageOpacity || 80) / 100});
                        z-index: 0;
                        pointer-events: none;
                    `;
                    timerContainer.style.position = 'relative';
                    timerContainer.appendChild(overlay);
                    
                    // 确保文字内容在蒙版之上
                    const textElements = timerContainer.querySelectorAll('h1, .current-task-indicator, .timer-display, .timer-footer');
                    textElements.forEach(element => {
                        element.style.position = 'relative';
                        element.style.zIndex = '1';
                    });
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
            
            // 移除之前的视频背景和蒙版
            const existingVideo = previewContainer.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }
            const existingOverlay = previewContainer.querySelector('.background-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
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
                    
                    // 添加蒙版
                    const overlay = document.createElement('div');
                    overlay.className = 'background-overlay';
                    overlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, ${1 - (currentTask.backgroundImageOpacity || 80) / 100});
                        z-index: 0;
                        pointer-events: none;
                    `;
                    previewContainer.style.position = 'relative';
                    previewContainer.appendChild(overlay);
                    
                    // 确保文字内容在蒙版之上
                    const textElements = previewContainer.querySelectorAll('h1, .current-task-indicator, .timer-display, .timer-footer');
                    textElements.forEach(element => {
                        element.style.position = 'relative';
                        element.style.zIndex = '1';
                    });
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
        addLog(getT('log_init_done'), 'info');
        applyTranslations();
    }, 500);
}); 