(function(){
	const i18n = {
		current: localStorage.getItem('timerLang') || 'zh',
		dict: {
			zh: { title:'倒计时器', task:'任务', footer:'专注工作，高效生活', days:'天', hours:'时', minutes:'分', seconds:'秒', currentTask:'当前任务', enterFullscreen:'全屏', exitFullscreen:'退出全屏' },
			en: { title:'Countdown', task:'Task', footer:'Focus on work, live efficiently', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds', currentTask:'Current Task', enterFullscreen:'Fullscreen', exitFullscreen:'Exit Fullscreen' }
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

	let tasks = [];
	let currentTaskIndex = 0;
	// 非运行态下用于展示的剩余秒数
	let idleSeconds = 0;
	// 运行基准：管理员开始时刻与开始时的剩余秒数
	let baseStartedAtMs = null;
	let baseRemainingAtStartSec = 0;
	let updateTimer = null;
	let isFs = false;

	// cross-tab sync
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
		baseStartedAtMs = null; // 未运行
		applyTaskInfo();
		applyBackground();
		renderSeconds(getDisplaySeconds());
	}

	function applyTaskInfo(){
		const cur = tasks[currentTaskIndex];
		if(titleEl) titleEl.textContent = cur.title || t('title');
		if(taskEl) taskEl.textContent = `${cur.taskName || `${t('task')} ${currentTaskIndex+1}`}`;
		if(footerEl) footerEl.textContent = cur.footer || t('footer');
		if(lblDays) lblDays.textContent = t('days');
		if(lblHours) lblHours.textContent = t('hours');
		if(lblMinutes) lblMinutes.textContent = t('minutes');
		if(lblSeconds) lblSeconds.textContent = t('seconds');
	}

	function applyBackground(){
		const cur = tasks[currentTaskIndex];
		const container = document.querySelector('.timer-container');
		if(!container) return;
		container.style.background = '';
		container.style.backgroundImage = '';
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
				const overlay = document.createElement('div');
				overlay.className = 'background-overlay';
				overlay.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,${1-((cur.backgroundImageOpacity||80)/100)});z-index:0;pointer-events:none;`;
				container.style.position = 'relative';
				container.appendChild(overlay);
				['h1','.current-task-indicator','.timer-display','.timer-footer'].forEach(sel=>{
					container.querySelectorAll(sel).forEach(el=>{ el.style.position='relative'; el.style.zIndex='1';});
				});
			}
		} else {
			container.style.backgroundColor = '#000';
		}
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
	}

	function stopUpdater(){ if(updateTimer){ clearInterval(updateTimer); updateTimer=null; } }
	function startUpdater(){
		stopUpdater();
		updateTimer = setInterval(()=>{
			const sec = getDisplaySeconds();
			renderSeconds(sec);
			// 不在本地自动切换任务，等待管理端下发 NEXT
		}, 250);
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

	// storage 与 BroadcastChannel 同步
	window.addEventListener('storage', (e)=>{
		if(e.key === 'timerSettings') loadSettings();
		if(e.key === 'timerLang'){
			i18n.current = localStorage.getItem('timerLang') || 'zh';
			applyTaskInfo();
		}
	});
	bc && bc.addEventListener('message', (ev)=>{
		const msg = ev.data || {};
		switch(msg.type){
			case 'LANG':
				i18n.current = msg.lang || i18n.current; applyTaskInfo(); break;
			case 'SETTINGS':
				if(Array.isArray(msg.tasks)){
					tasks = msg.tasks; currentTaskIndex = 0;
					const cur = tasks[0];
					idleSeconds = cur.days*86400 + cur.hours*3600 + cur.minutes*60 + cur.seconds;
					baseStartedAtMs = null;
					applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); stopUpdater();
				}
				break;
			case 'START':
				if(Array.isArray(msg.tasks)) tasks = msg.tasks;
				if(typeof msg.currentTaskIndex==='number') currentTaskIndex = msg.currentTaskIndex;
				if(typeof msg.remainingSeconds==='number') baseRemainingAtStartSec = msg.remainingSeconds;
				baseStartedAtMs = typeof msg.startedAt==='number' ? msg.startedAt : Date.now();
				applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); startUpdater();
				break;
			case 'PAUSE':
				stopUpdater();
				// 固化当前剩余秒数为 idle 状态
				if(typeof msg.remainingSeconds==='number') idleSeconds = msg.remainingSeconds; else idleSeconds = getDisplaySeconds();
				baseStartedAtMs = null;
				renderSeconds(getDisplaySeconds());
				break;
			case 'RESET':
				stopUpdater();
				if(Array.isArray(msg.tasks)) tasks = msg.tasks;
				currentTaskIndex = msg.currentTaskIndex||0;
				idleSeconds = msg.remainingSeconds||0;
				baseStartedAtMs = null;
				applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds());
				break;
			case 'NEXT':
				if(typeof msg.currentTaskIndex==='number') currentTaskIndex = msg.currentTaskIndex;
				if(typeof msg.remainingSeconds==='number') baseRemainingAtStartSec = msg.remainingSeconds;
				baseStartedAtMs = typeof msg.startedAt==='number' ? msg.startedAt : Date.now();
				applyTaskInfo(); applyBackground(); renderSeconds(getDisplaySeconds()); startUpdater();
				break;
		}
	});

	// boot（不自动开始，等待管理员 START）
	loadSettings();
})(); 