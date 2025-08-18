(function(){
	const i18n = {
		current: localStorage.getItem('timerLang') || 'en',
		dict: {
			zh: { title:'倒计时器', task:'任务', footer:'专注工作，高效生活', days:'天', hours:'时', minutes:'分', seconds:'秒', currentTask:'当前任务', enterFullscreen:'全屏', exitFullscreen:'退出全屏', connectionLost:'连接已断开，正在重连...', connectionRestored:'连接已恢复' },
			en: { title:'Countdown', task:'Task', footer:'Focus on work, live efficiently', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds', currentTask:'Current Task', enterFullscreen:'Fullscreen', exitFullscreen:'Exit Fullscreen', connectionLost:'Connection lost, reconnecting...', connectionRestored:'Connection restored' }
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
	const fsBtn = document.getElementById('viewer-fullscreen');
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
	let isFs = false;
	let pollTimer = null;
	let lastServerNow = null;
	let connectionFailed = false;
	let reconnectAttempts = 0;
	let maxReconnectAttempts = 10;
	let reconnectDelay = 500;

	// cross-tab sync（仅同源标签页使用）
	const bc = 'BroadcastChannel' in window ? new BroadcastChannel('timer_control') : null;

	function pad(n){ return n<10?`0${n}`:`${n}`; }

	function loadSettings(){
		const saved = localStorage.getItem('timerSettings');
		if(saved){
			try { tasks = JSON.parse(saved).tasks || []; } catch(e){ tasks = []; }
		}
		if(!tasks || tasks.length===0){
			tasks = [ { days:0,hours:0,minutes:10,seconds:0, title:t('title'), taskName:`${t('task')} 1`, footer:t('footer'), backgroundType:'color', backgroundColor:'#000', backgroundEnabled:true, backgroundImage:'', backgroundImageOpacity:80 } ];
		}
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
	}

	function stopUpdater(){ if(updateTimer){ clearInterval(updateTimer); updateTimer=null; } }
	function startUpdater(){
		stopUpdater();
		updateTimer = setInterval(()=>{
			const sec = getDisplaySeconds();
			renderSeconds(sec);
			
			// 当倒计时结束时，自动拉取新状态
			if(sec <= 0 && baseStartedAtMs !== null) {
				pullFromCloud(true);
			}
		}, 250);
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

	function enterFullscreen(){
		if(!timerWindow) return;
		timerWindow.classList.add('fullscreen-timer');
		document.documentElement.requestFullscreen?.();
	}
	function exitFullscreen(){
		timerWindow?.classList.remove('fullscreen-timer');
		if(document.fullscreenElement){ document.exitFullscreen?.(); }
	}

	fsBtn?.addEventListener('click', ()=>{
		if(timerWindow?.classList.contains('fullscreen-timer')){ exitFullscreen(); isFs=false; fsBtn.title = t('enterFullscreen'); }
		else { enterFullscreen(); isFs=true; fsBtn.title = t('exitFullscreen'); }
	});

	document.addEventListener('fullscreenchange', ()=>{
		isFs = !!document.fullscreenElement;
		if(!isFs){ timerWindow?.classList.remove('fullscreen-timer'); }
		fsBtn.title = isFs ? t('exitFullscreen') : t('enterFullscreen');
	});

	// storage 与 BroadcastChannel（本地开发时可用）
	window.addEventListener('storage', (e)=>{
		if(e.key === 'timerSettings') loadSettings();
		if(e.key === 'timerLang'){
			i18n.current = localStorage.getItem('timerLang') || 'zh';
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

	// 添加键盘快捷键
	document.addEventListener('keydown', (e) => {
		// F键触发全屏
		if(e.key === 'f' || e.key === 'F') {
			if(isFs) { exitFullscreen(); isFs=false; }
			else { enterFullscreen(); isFs=true; }
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