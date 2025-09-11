// 同步计时器WebSocket客户端通信模块
// 处理与服务器的实时通信和状态同步

class SyncTimer {
    constructor() {
        this.ws = null;
        this.sessionId = null;
        this.userType = 'participant'; // 'host' or 'participant'
        this.userName = 'Anonymous';
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        // API端点配置
        this.apiBaseUrl = this.getApiBaseUrl();
        
        // 状态数据
        this.sessionData = null;
        this.timerState = null;
        this.connections = [];
        
        // 事件监听器
        this.eventListeners = new Map();
        
        // 心跳机制
        this.heartbeatInterval = null;
        this.heartbeatTimeout = null;
        
        console.log('SyncTimer initialized with API base:', this.apiBaseUrl);
    }
    
    // 获取API基础URL
    getApiBaseUrl() {
        // 如果是本地开发环境，使用当前域名
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return window.location.origin;
        }
        // 生产环境使用Worker URL
        return 'https://10-minute-timer-worker.snapmenuai250707.workers.dev';
    }
    
    // 获取WebSocket URL
    getWebSocketUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // 本地开发环境
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.host;
            return `${protocol}//${host}/ws?sessionId=${this.sessionId}&type=${this.userType}&name=${encodeURIComponent(this.userName)}`;
        } else {
            // 生产环境使用Worker WebSocket
            return `wss://10-minute-timer-worker.snapmenuai250707.workers.dev/ws?sessionId=${this.sessionId}&type=${this.userType}&name=${encodeURIComponent(this.userName)}`;
        }
    }
    
    // 事件监听器管理
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }
    
    // 创建会话（主持人）
    async createSession(hostName, sessionName) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/create-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hostName,
                    sessionName
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.sessionId = result.sessionId;
                this.userType = 'host';
                this.userName = hostName;
                
                // 自动连接到会话
                await this.connectToSession();
                
                this.emit('sessionCreated', {
                    sessionId: result.sessionId,
                    hostUrl: result.hostUrl,
                    participantUrl: result.participantUrl
                });
                
                return result;
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Error creating session:', error);
            this.emit('error', { message: 'Failed to create session: ' + error.message });
            throw error;
        }
    }
    
    // 加入会话（参与者）
    async joinSession(sessionId, participantName) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/join-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId,
                    participantName
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.sessionId = sessionId;
                this.userType = 'participant';
                this.userName = participantName;
                
                // 自动连接到会话
                await this.connectToSession();
                
                this.emit('sessionJoined', {
                    sessionId: result.sessionId,
                    sessionName: result.sessionName
                });
                
                return result;
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Error joining session:', error);
            this.emit('error', { message: 'Failed to join session: ' + error.message });
            throw error;
        }
    }
    
    // 连接到WebSocket会话
    async connectToSession() {
        if (!this.sessionId) {
            throw new Error('No session ID provided');
        }
        
        return new Promise((resolve, reject) => {
            try {
                // 构建WebSocket URL
                const wsUrl = this.getWebSocketUrl();
                
                console.log('Connecting to WebSocket:', wsUrl);
                
                this.ws = new WebSocket(wsUrl);
                
                this.ws.onopen = (event) => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    // 启动心跳
                    this.startHeartbeat();
                    
                    this.emit('connected', { sessionId: this.sessionId });
                    resolve();
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };
                
                this.ws.onclose = (event) => {
                    console.log('WebSocket disconnected:', event.code, event.reason);
                    this.isConnected = false;
                    
                    // 停止心跳
                    this.stopHeartbeat();
                    
                    this.emit('disconnected', { 
                        code: event.code, 
                        reason: event.reason 
                    });
                    
                    // 尝试重连
                    if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    } else {
                        this.emit('error', { 
                            message: 'Failed to reconnect after maximum attempts' 
                        });
                    }
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', { message: 'WebSocket connection error' });
                    reject(error);
                };
                
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                reject(error);
            }
        });
    }
    
    // 处理接收到的消息
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message);
            
            switch (message.type) {
                case 'INITIAL_STATE':
                    this.handleInitialState(message);
                    break;
                    
                case 'TIMER_UPDATE':
                    this.handleTimerUpdate(message);
                    break;
                    
                case 'TIMER_COMPLETE':
                    this.handleTimerComplete(message);
                    break;
                    
                case 'CONNECTION_UPDATE':
                    this.handleConnectionUpdate(message);
                    break;
                    
                case 'ERROR':
                    this.handleError(message);
                    break;
                    
                case 'PONG':
                    this.handlePong();
                    break;
                    
                default:
                    console.log('Unknown message type:', message.type);
            }
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }
    
    // 处理初始状态
    handleInitialState(message) {
        this.sessionData = message.sessionData;
        this.timerState = message.timerState;
        this.connections = message.connections;
        
        this.emit('initialState', {
            sessionData: this.sessionData,
            timerState: this.timerState,
            connections: this.connections
        });
    }
    
    // 处理计时器更新
    handleTimerUpdate(message) {
        this.timerState = message.timerState;
        this.emit('timerUpdate', this.timerState);
    }
    
    // 处理计时器完成
    handleTimerComplete(message) {
        this.timerState = message.timerState;
        this.emit('timerComplete', this.timerState);
    }
    
    // 处理连接更新
    handleConnectionUpdate(message) {
        this.connections = message.connections;
        this.emit('connectionUpdate', this.connections);
    }
    
    // 处理错误消息
    handleError(message) {
        console.error('Server error:', message.message);
        this.emit('error', { message: message.message });
    }
    
    // 处理心跳响应
    handlePong() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }
    
    // 发送消息到服务器
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            return true;
        } else {
            console.warn('WebSocket is not connected');
            return false;
        }
    }
    
    // 主持人控制方法
    startTimer() {
        if (this.userType === 'host') {
            return this.send({ type: 'START_TIMER' });
        } else {
            console.warn('Only host can start timer');
            return false;
        }
    }
    
    pauseTimer() {
        if (this.userType === 'host') {
            return this.send({ type: 'PAUSE_TIMER' });
        } else {
            console.warn('Only host can pause timer');
            return false;
        }
    }
    
    resetTimer() {
        if (this.userType === 'host') {
            return this.send({ type: 'RESET_TIMER' });
        } else {
            console.warn('Only host can reset timer');
            return false;
        }
    }
    
    setTime(seconds) {
        if (this.userType === 'host') {
            return this.send({ 
                type: 'SET_TIME', 
                seconds: seconds 
            });
        } else {
            console.warn('Only host can set time');
            return false;
        }
    }
    
    updateTask(task) {
        if (this.userType === 'host') {
            return this.send({ 
                type: 'UPDATE_TASK', 
                task: task 
            });
        } else {
            console.warn('Only host can update task');
            return false;
        }
    }
    
    // 心跳机制
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'PING' });
                
                // 设置心跳超时
                this.heartbeatTimeout = setTimeout(() => {
                    console.warn('Heartbeat timeout, closing connection');
                    this.ws.close();
                }, 5000);
            }
        }, 30000); // 每30秒发送一次心跳
    }
    
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }
    
    // 重连机制
    scheduleReconnect() {
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
        
        console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
        
        setTimeout(async () => {
            this.reconnectAttempts++;
            
            try {
                await this.connectToSession();
                console.log('Reconnected successfully');
            } catch (error) {
                console.error('Reconnect failed:', error);
                
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                }
            }
        }, delay);
    }
    
    // 断开连接
    disconnect() {
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.isConnected = false;
        this.emit('disconnected', { reason: 'Manual disconnect' });
    }
    
    // 获取当前状态
    getState() {
        return {
            isConnected: this.isConnected,
            sessionId: this.sessionId,
            userType: this.userType,
            userName: this.userName,
            sessionData: this.sessionData,
            timerState: this.timerState,
            connections: this.connections
        };
    }
}

// 导出类供全局使用
window.SyncTimer = SyncTimer; 