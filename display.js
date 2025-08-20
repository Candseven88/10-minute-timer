(function(){
	const i18n = {
		current: localStorage.getItem('timerLang') || 'en',
		dict: {
				zh: { title:'倒计时器', task:'任务', footer:'专注工作，高效生活', days:'天', hours:'时', minutes:'分', seconds:'秒', currentTask:'当前任务', connectionLost:'连接已断开，正在重连...', connectionRestored:'连接已恢复' },
	en: { title:'Countdown', task:'Task', footer:'Focus on work, live efficiently', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds', currentTask:'Current Task', connectionLost:'Connection lost, reconnecting...', connectionRestored:'Connection restored' }
		}
	};
	function t(k){
		return (i18n.dict[i18n.current] && i18n.dict[i18n.current][k]) || (i18n.dict.zh[k]||k);
	}

	const titleEl = document.getElementById('viewer-title');
	const taskEl = document.getElementById('viewer-task-indicator');
	const footerEl = document.getElementById('viewer-footer');
	const dEl = document.getElementById('viewer-days');
	const hEl = document.getElementById('viewer-hours');
	const mEl = document.getElementById('viewer-minutes');
	const sEl = document.getElementById('viewer-seconds');
	const lblDays = document.getElementById('viewer-label-days');
	const lblHours = document.getElementById('viewer-label-hours');
	const lblMinutes = document.getElementById('viewer-label-minutes');
	const lblSeconds = document.getElementById('viewer-label-seconds');

	const timerWindow = document.getElementById('timer-window');

	// 添加状态通知元素
	const statusNotification = document.createElement('div');
	statusNotification.className = 'status-notification';
	statusNotification.style.cssText = 'position:fixed;bottom:20px;left:20px;background:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:30px;font-size:14px;z-index:9999;transition:all 0.3s ease;opacity:0;transform:translateY(20px);backdrop-filter:blur(5px);box-shadow:0 5px 15px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);';
	document.body.appendChild(statusNotification);

	function showNotification(message, type = 'info') {
		statusNotification.textContent = message;
		statusNotification.className = `status-notification ${type}`;
		statusNotification.style.opacity = '1';
		statusNotification.style.transform = 'translateY(0)';
		
		setTimeout(() => {
			statusNotification.style.opacity = '0';
			statusNotification.style.transform = 'translateY(20px)';
		}, 3000);
	}
	
	// 连接状态指示器元素
	const statusIndicator = document.getElementById('status-indicator');
	const statusText = document.getElementById('status-text');

	// channel from URL
	const params = new URLSearchParams(location.search);
	const CHANNEL = (params.get('channel') || '').trim();
	const API_BASE = location.origin;

	let tasks = [];
	let currentTaskIndex = 0;
	// 非运行态下用于展示的剩余秒数
	let idleSeconds = 0;
	// 运行基准
	let baseStartedAtMs = null;
	let baseRemainingAtStartSec = 0;
	let updateTimer = null;

	let pollTimer = null;
	let lastServerNow = null;
	let connectionFailed = false;
	let reconnectAttempts = 0;
	let maxReconnectAttempts = 10;
	let reconnectDelay = 500;
	
	// 提醒相关变量
	let isWarningActive = false;
	let warningAudio = null;

	// cross-tab sync（仅同源标签页使用）
	const bc = 'BroadcastChannel' in window ? new BroadcastChannel('timer_control') : null;

	function pad(n){ return n<10?`0${n}`:`${n}`; }

	function loadSettings(){
		const saved = localStorage.getItem('timerSettings');
		if(saved){
			try { tasks = JSON.parse(saved).tasks || []; } catch(e){ tasks = []; }
		}
		if(!tasks || tasks.length===0){
			tasks = [ { 
				days:0,hours:0,minutes:10,seconds:0, 
				title:t('title'), 
				taskName:`${t('task')} 1`, 
				footer:t('footer'), 
				backgroundType:'color', 
				backgroundColor:'#000', 
				backgroundEnabled:true, 
				backgroundImage:'', 
				backgroundImageOpacity:80,
				warningEnabled: true, // 默认启用提醒
				warningSeconds: 60, // 默认提前60秒提醒
				soundEnabled: true // 默认启用声音提醒
			} ];
		}
		
		// 为现有任务添加默认的提醒设置（如果不存在）
		tasks.forEach(task => {
			if (task.warningEnabled === undefined) task.warningEnabled = true;
			if (task.warningSeconds === undefined) task.warningSeconds = 60;
			if (task.soundEnabled === undefined) task.soundEnabled = true;
		});
		
		currentTaskIndex = 0;
		const t0 = tasks[0];
		idleSeconds = t0.days*86400 + t0.hours*3600 + t0.minutes*60 + t0.seconds;
		baseStartedAtMs = null;
		applyTaskInfo();
		applyBackground();
		renderSeconds(getDisplaySeconds());
	}

	function applyTaskInfo(){
		const cur = tasks[currentTaskIndex] || {};
		if(titleEl) titleEl.textContent = cur.title || t('title');
		if(taskEl) taskEl.textContent = `${cur.taskName || `${t('task')} ${currentTaskIndex+1}`}`;
		if(footerEl) footerEl.textContent = cur.footer || t('footer');
		if(lblDays) lblDays.textContent = t('days');
		if(lblHours) lblHours.textContent = t('hours');
		if(lblMinutes) lblMinutes.textContent = t('minutes');
		if(lblSeconds) lblSeconds.textContent = t('seconds');
	}

	function applyBackground(){
		const cur = tasks[currentTaskIndex] || {};
		const container = document.querySelector('.timer-container');
		if(!container) return;
		
		// 清除之前的所有样式
		container.style.background = '';
		container.style.backgroundImage = '';
		container.style.backgroundSize = '';
		container.style.backgroundPosition = '';
		container.style.backgroundRepeat = '';
		container.style.backgroundColor = '';
		
		// 移除之前的叠加层
		const old = container.querySelector('.background-overlay');
		if(old) old.remove();
		
		if(cur.backgroundEnabled){
			if(cur.backgroundType==='color'){
				container.style.backgroundColor = cur.backgroundColor || '#000';
			} else if(cur.backgroundType==='image' && cur.backgroundImage){
				container.style.backgroundImage = `url('${cur.backgroundImage}')`;
				container.style.backgroundSize = 'cover';
				container.style.backgroundPosition = 'center';
				container.style.backgroundRepeat = 'no-repeat';
				
				// 创建新的叠加层
				const overlay = document.createElement('div');
				overlay.className = 'background-overlay';
				overlay.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,${1-((cur.backgroundImageOpacity||80)/100)});z-index:0;pointer-events:none;`;
				container.style.position = 'relative';
				container.appendChild(overlay);
				
				// 确保内容在叠加层上方
				['h1','.current-task-indicator','.timer-display','.timer-footer'].forEach(sel=>{
					container.querySelectorAll(sel).forEach(el=>{ 
						el.style.position='relative'; 
						el.style.zIndex='1';
					});
				});
			}
		} else {
			container.style.backgroundColor = '#000';
		}
		
		// 应用动态背景效果
		const dynamicBg = container.querySelector('.dynamic-background');
		if(dynamicBg) dynamicBg.remove();
		
		const bgEffect = document.createElement('div');
		bgEffect.className = 'dynamic-background';
		bgEffect.style.cssText = 'position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 80%);opacity:0.5;z-index:0;pointer-events:none;animation:pulse 15s infinite linear;';
		container.appendChild(bgEffect);
	}

	function getDisplaySeconds(){
		if(baseStartedAtMs!=null){
			const elapsed = Math.floor((Date.now() - baseStartedAtMs)/1000);
			return Math.max(0, baseRemainingAtStartSec - elapsed);
		}
		return Math.max(0, idleSeconds);
	}

	function renderSeconds(sec){
		const days = Math.floor(sec / 86400);
		const hours = Math.floor((sec % 86400) / 3600);
		const minutes = Math.floor((sec % 3600) / 60);
		const seconds = sec % 60;
		if(dEl) dEl.textContent = pad(days);
		if(hEl) hEl.textContent = pad(hours);
		if(mEl) mEl.textContent = pad(minutes);
		if(sEl) sEl.textContent = pad(seconds);
		
		// 更新页面标题，方便用户在后台查看
		document.title = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} - ${tasks[currentTaskIndex]?.title || t('title')}`;
		
		// 检查是否需要启动提醒
		checkWarning(sec);
	}

	function stopUpdater(){ if(updateTimer){ clearInterval(updateTimer); updateTimer=null; } }
	function startUpdater(){
		stopUpdater();
		updateTimer = setInterval(()=>{
			const sec = getDisplaySeconds();
			renderSeconds(sec);
			
			// 当倒计时结束时，自动拉取新状态
			if(sec <= 0 && baseStartedAtMs !== null) {
				stopWarning(); // 停止提醒
				pullFromCloud(true);
			}
		}, 250);
	}
	
	// 检查是否需要启动提醒
	function checkWarning(seconds) {
		if (tasks.length > 0 && currentTaskIndex < tasks.length) {
			const currentTask = tasks[currentTaskIndex];
			if (currentTask.warningEnabled && seconds <= currentTask.warningSeconds && !isWarningActive) {
				startWarning(currentTask);
			}
		}
	}
	
	// 启动警告提醒
	function startWarning(currentTask) {
		if (isWarningActive) return;
		
		isWarningActive = true;
		
		// 添加警告样式类
		document.body.classList.add('timer-warning');
		const timerContainer = document.querySelector('.timer-container');
		if (timerContainer) {
			timerContainer.classList.add('timer-warning');
		}
		
		// 只有在启用声音时才播放警告音频
		if (currentTask.soundEnabled) {
			playWarningSound();
		}
		
		console.log('分享链接页面：倒计时即将结束，已启动提醒');
	}
	
	// 停止警告提醒
	function stopWarning() {
		if (!isWarningActive) return;
		
		isWarningActive = false;
		
		// 移除警告样式类
		document.body.classList.remove('timer-warning');
		const timerContainer = document.querySelector('.timer-container');
		if (timerContainer) {
			timerContainer.classList.remove('timer-warning');
		}
		
		// 停止音频
		stopWarningSound();
	}
	
	// 播放警告声音
	function playWarningSound() {
		try {
			// 创建音频上下文（如果浏览器支持）
			if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
				const AudioContextClass = AudioContext || webkitAudioContext;
				const audioContext = new AudioContextClass();
				
				// 创建振荡器生成警告音
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);
				
				// 设置音频参数
				oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
				oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
				oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
				
				gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
				
				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.3);
				
				// 每2秒重复一次
				setTimeout(() => {
					if (isWarningActive) {
						playWarningSound();
					}
				}, 2000);
			}
		} catch (error) {
			console.log('音频播放失败，使用备用方案:', error);
			// 备用方案：使用现有的音频文件
			playBackupWarningSound();
		}
	}
	
	// 播放备用警告声音
	function playBackupWarningSound() {
		try {
			if (!warningAudio) {
				warningAudio = new Audio('timeisup.mp3');
				warningAudio.volume = 0.5;
			}
			
			if (warningAudio.readyState >= 2) {
				warningAudio.play().catch(error => {
					console.log('备用音频播放失败:', error);
				});
				
				// 每3秒重复一次
				setTimeout(() => {
					if (isWarningActive) {
						playBackupWarningSound();
					}
				}, 3000);
			}
		} catch (error) {
			console.log('备用音频播放失败:', error);
		}
	}
	
	// 停止警告声音
	function stopWarningSound() {
		try {
			if (warningAudio) {
				warningAudio.pause();
				warningAudio.currentTime = 0;
			}
		} catch (error) {
			console.log('停止音频失败:', error);
		}
	}

	async function pullFromCloud(forceRefresh = false){
		if(!CHANNEL) return;
		try{
			const t0 = performance.now();
			const res = await fetch(`${API_BASE}/api/state?channel=${encodeURIComponent(CHANNEL)}&t=${Date.now()}`);
			const t1 = performance.now();
			
			if(!res.ok) {
							if(!connectionFailed) {
				connectionFailed = true;
				showNotification(t('connectionLost'), 'error');
				console.warn('Connection to server failed');
				
				// 更新连接状态指示器
				if(statusIndicator) {
					statusIndicator.className = 'status-indicator offline';
				}
				if(statusText) {
					statusText.textContent = i18n.current === 'zh' ? '连接已断开' : 'Disconnected';
				}
			}
			scheduleReconnect();
			return;
			}
			
			// 连接恢复
			if(connectionFailed) {
				connectionFailed = false;
				reconnectAttempts = 0;
				reconnectDelay = 500;
				showNotification(t('connectionRestored'), 'success');
				console.log('Connection to server restored');
				
				// 更新连接状态指示器
				if(statusIndicator) {
					statusIndicator.className = 'status-indicator';
				}
				if(statusText) {
					statusText.textContent = i18n.current === 'zh' ? '已连接' : 'Connected';
				}
			}
			
			const data = await res.json();
			if(!data.exists) return;
			
			// RTT 与半 RTT
			const rttMs = Math.max(0, t1 - t0);
			const halfRttMs = rttMs / 2;
			lastServerNow = typeof data.serverNow === 'number' ? data.serverNow : null;
			
			// 检查版本变化或强制刷新
			const currentVersion = localStorage.getItem('stateVersion') || '0';
			const newVersion = data.version || '0';
			const versionChanged = currentVersion !== newVersion;
			
			if(versionChanged) {
				localStorage.setItem('stateVersion', newVersion);
			}
			
			// 只有在版本变化或强制刷新时才应用变更
			if(versionChanged || forceRefresh) {
				// apply
				i18n.current = data.lang || i18n.current;
				tasks = Array.isArray(data.tasks) ? data.tasks : tasks;
				currentTaskIndex = typeof data.currentTaskIndex==='number' ? data.currentTaskIndex : currentTaskIndex;
				
				// 为从云端获取的任务添加默认的提醒设置（如果不存在）
				tasks.forEach(task => {
					if (task.warningEnabled === undefined) task.warningEnabled = true;
					if (task.warningSeconds === undefined) task.warningSeconds = 60;
					if (task.soundEnabled === undefined) task.soundEnabled = true;
				});
				
				if(data.isRunning){
					// 用服务端剩余 + 半 RTT 校正基线
					const srvRemain = typeof data.calcRemainingSeconds==='number' ? data.calcRemainingSeconds : (typeof data.remainingSeconds==='number'? data.remainingSeconds : baseRemainingAtStartSec);
					baseRemainingAtStartSec = srvRemain;
					baseStartedAtMs = Date.now() - halfRttMs; // 抵消网络延迟的一半
					applyTaskInfo(); 
					applyBackground(); 
					renderSeconds(getDisplaySeconds()); 
					startUpdater();
				} else {
					stopUpdater();
					idleSeconds = typeof data.calcRemainingSeconds==='number' ? data.calcRemainingSeconds : (typeof data.remainingSeconds==='number'? data.remainingSeconds : idleSeconds);
					baseStartedAtMs = null;
					applyTaskInfo(); 
					applyBackground(); 
					renderSeconds(getDisplaySeconds());
				}
			}
		} catch(e) { 
			console.error('Error pulling from cloud:', e);
			if(!connectionFailed) {
				connectionFailed = true;
				showNotification(t('connectionLost'), 'error');
			}
			scheduleReconnect();
		}
	}

	function scheduleReconnect() {
		if(reconnectAttempts >= maxReconnectAttempts) {
			console.warn(`Max reconnect attempts (${maxReconnectAttempts}) reached`);
			return;
		}
		
		reconnectAttempts++;
		// 指数退避重连
		const delay = Math.min(30000, reconnectDelay * Math.pow(1.5, reconnectAttempts - 1));
		console.log(`Scheduling reconnect attempt ${reconnectAttempts} in ${delay}ms`);
		
		setTimeout(() => {
			pullFromCloud(true);
		}, delay);
	}

	function startPolling(){
		if(!CHANNEL) return;
		if(pollTimer) clearInterval(pollTimer);
		pollTimer = setInterval(() => pullFromCloud(), 1000);
		// 初次拉取
		pullFromCloud(true);
	}








	// storage 与 BroadcastChannel（本地开发时可用）
	window.addEventListener('storage', (e)=>{
		if(e.key === 'timerSettings') loadSettings();
		if(e.key === 'timerLang'){
			i18n.current = localStorage.getItem('timerLang') || 'en';
			applyTaskInfo();
		}
	});
	bc && bc.addEventListener('message', (ev)=>{
		if(CHANNEL) return; // 若是云模式，则跳过本地频道
		const msg = ev.data || {};
		switch(msg.type){
			case 'LANG': i18n.current = msg.lang || i18n.current; applyTaskInfo(); break;
			case 'SETTINGS': if(Array.isArray(msg.tasks)){ tasks = msg.tasks; currentTaskIndex = 0; const cur=tasks[0]; idleSeconds=cur.days*86400+cur.hours*3600+cur.minutes*60+cur.seconds; baseStartedAtMs=null; applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); stopUpdater(); } break;
			case 'START': if(Array.isArray(msg.tasks)) tasks = msg.tasks; if(typeof msg.currentTaskIndex==='number') currentTaskIndex=msg.currentTaskIndex; if(typeof msg.remainingSeconds==='number') baseRemainingAtStartSec=msg.remainingSeconds; baseStartedAtMs= typeof msg.startedAt==='number'? msg.startedAt: Date.now(); applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); startUpdater(); break;
			case 'PAUSE': stopUpdater(); idleSeconds = typeof msg.remainingSeconds==='number'? msg.remainingSeconds : getDisplaySeconds(); baseStartedAtMs=null; renderSeconds(getDisplaySeconds()); break;
			case 'RESET': stopUpdater(); if(Array.isArray(msg.tasks)) tasks=msg.tasks; currentTaskIndex=msg.currentTaskIndex||0; idleSeconds=msg.remainingSeconds||0; baseStartedAtMs=null; applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); break;
			case 'NEXT': if(typeof msg.currentTaskIndex==='number') currentTaskIndex=msg.currentTaskIndex; if(typeof msg.remainingSeconds==='number') baseRemainingAtStartSec=msg.remainingSeconds; baseStartedAtMs= typeof msg.startedAt==='number'? msg.startedAt: Date.now(); applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); startUpdater(); break;
		}
	});



	// 添加动画效果
	function addAnimationStyles() {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes pulse {
				0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
				50% { transform: translate(-25%, -25%) scale(1.2); opacity: 0.3; }
				100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
			}
			
			.status-notification {
				opacity: 0;
				transform: translateY(20px);
			}
			
			.status-notification.error {
				background: rgba(220, 53, 69, 0.8) !important;
			}
			
			.status-notification.success {
				background: rgba(40, 167, 69, 0.8) !important;
			}
		`;
		document.head.appendChild(style);
	}

	// 初始化
	addAnimationStyles();

	// 初始化连接状态指示器
	function initConnectionStatus() {
		if(statusIndicator && statusText) {
			statusIndicator.className = 'status-indicator connecting';
			statusText.textContent = i18n.current === 'zh' ? '连接中...' : 'Connecting...';
			
			// 5秒后如果仍然是connecting状态，说明可能有问题
			setTimeout(() => {
				if(statusIndicator.className.includes('connecting')) {
					statusIndicator.className = 'status-indicator offline';
					statusText.textContent = i18n.current === 'zh' ? '连接超时' : 'Connection timeout';
				}
			}, 5000);
		}
	}
	
	// boot（云模式优先）
	if(CHANNEL){
		initConnectionStatus();
		startPolling();
	} else {
		// 本地模式不需要连接状态指示器
		const connectionStatus = document.getElementById('connection-status');
		if(connectionStatus) {
			connectionStatus.style.display = 'none';
		}
		loadSettings();
	}
})(); 