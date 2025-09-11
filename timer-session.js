// TimerSession Durable Object - 管理WebSocket会话状态和计时器同步
// 每个会话实例维护连接的客户端和计时器状态

export class TimerSession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    
    // 会话数据
    this.sessionData = {
      sessionId: null,
      hostName: null,
      sessionName: null,
      createdAt: null,
      exists: false
    };
    
    // 计时器状态
    this.timerState = {
      totalSeconds: 600,
      remainingSeconds: 600,
      originalSeconds: 600,
      isRunning: false,
      isPaused: false,
      startTime: null,
      currentTask: {
        title: 'Focus Time',
        name: 'Focus Time',
        motto: 'Stay focused, be productive'
      },
      tasks: []
    };
    
    // 连接的客户端
    this.connections = new Map();
    this.hostConnection = null;
    
    // 计时器间隔
    this.timerInterval = null;
    
    console.log('TimerSession Durable Object created');
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    
    // 处理WebSocket升级
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocketUpgrade(request);
    }
    
    // 处理API请求
    if (url.pathname === '/init' && request.method === 'POST') {
      return this.initSession(request);
    }
    
    if (url.pathname === '/check' && request.method === 'GET') {
      return this.checkSession();
    }
    
    return new Response('Not found', { status: 404 });
  }
  
  // 初始化会话
  async initSession(request) {
    try {
      const { hostName, sessionName, sessionId } = await request.json();
      
      this.sessionData = {
        sessionId,
        hostName,
        sessionName,
        createdAt: new Date().toISOString(),
        exists: true
      };
      
      // 持久化会话数据
      await this.state.storage.put('sessionData', this.sessionData);
      await this.state.storage.put('timerState', this.timerState);
      
      console.log(`Session initialized: ${sessionId}`);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error initializing session:', error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 检查会话是否存在
  async checkSession() {
    // 从存储中加载会话数据
    const sessionData = await this.state.storage.get('sessionData');
    
    if (sessionData) {
      this.sessionData = sessionData;
      return new Response(JSON.stringify(this.sessionData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ exists: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 处理WebSocket连接升级
  async handleWebSocketUpgrade(request) {
    const url = new URL(request.url);
    const userType = url.searchParams.get('type') || 'participant';
    const userName = url.searchParams.get('name') || 'Anonymous';
    
    // 创建WebSocket对
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    // 接受WebSocket连接
    this.state.acceptWebSocket(server);
    
    // 生成连接ID
    const connectionId = this.generateConnectionId();
    
    // 存储连接信息
    const connectionInfo = {
      id: connectionId,
      type: userType,
      name: userName,
      connectedAt: new Date().toISOString(),
      websocket: server
    };
    
    this.connections.set(connectionId, connectionInfo);
    
    // 如果是主持人连接，设置主持人连接
    if (userType === 'host') {
      this.hostConnection = connectionInfo;
    }
    
    console.log(`WebSocket connected: ${userType} - ${userName} (${connectionId})`);
    
    // 发送初始状态给新连接的客户端
    await this.sendInitialState(server);
    
    // 广播连接状态更新
    this.broadcastConnectionUpdate();
    
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
  
  // WebSocket消息处理
  async webSocketMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      const connection = this.findConnectionByWebSocket(ws);
      
      if (!connection) {
        console.error('Connection not found for WebSocket');
        return;
      }
      
      console.log(`Received message from ${connection.type}:`, data);
      
      switch (data.type) {
        case 'START_TIMER':
          await this.handleStartTimer(connection, data);
          break;
          
        case 'PAUSE_TIMER':
          await this.handlePauseTimer(connection, data);
          break;
          
        case 'RESET_TIMER':
          await this.handleResetTimer(connection, data);
          break;
          
        case 'SET_TIME':
          await this.handleSetTime(connection, data);
          break;
          
        case 'UPDATE_TASK':
          await this.handleUpdateTask(connection, data);
          break;
          
        case 'PING':
          // 响应心跳
          ws.send(JSON.stringify({ type: 'PONG' }));
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
      
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Failed to process message'
      }));
    }
  }
  
  // WebSocket连接关闭处理
  async webSocketClose(ws, code, reason, wasClean) {
    const connection = this.findConnectionByWebSocket(ws);
    
    if (connection) {
      console.log(`WebSocket disconnected: ${connection.type} - ${connection.name} (${connection.id})`);
      
      // 如果是主持人断开连接，暂停计时器
      if (connection.type === 'host') {
        this.hostConnection = null;
        await this.pauseTimer();
      }
      
      // 移除连接
      this.connections.delete(connection.id);
      
      // 广播连接状态更新
      this.broadcastConnectionUpdate();
    }
  }
  
  // WebSocket错误处理
  async webSocketError(ws, error) {
    console.error('WebSocket error:', error);
  }
  
  // 处理开始计时器
  async handleStartTimer(connection, data) {
    // 只有主持人可以控制计时器
    if (connection.type !== 'host') {
      connection.websocket.send(JSON.stringify({
        type: 'ERROR',
        message: 'Only host can control the timer'
      }));
      return;
    }
    
    await this.startTimer();
  }
  
  // 处理暂停计时器
  async handlePauseTimer(connection, data) {
    if (connection.type !== 'host') {
      connection.websocket.send(JSON.stringify({
        type: 'ERROR',
        message: 'Only host can control the timer'
      }));
      return;
    }
    
    await this.pauseTimer();
  }
  
  // 处理重置计时器
  async handleResetTimer(connection, data) {
    if (connection.type !== 'host') {
      connection.websocket.send(JSON.stringify({
        type: 'ERROR',
        message: 'Only host can control the timer'
      }));
      return;
    }
    
    await this.resetTimer();
  }
  
  // 处理设置时间
  async handleSetTime(connection, data) {
    if (connection.type !== 'host') {
      connection.websocket.send(JSON.stringify({
        type: 'ERROR',
        message: 'Only host can control the timer'
      }));
      return;
    }
    
    const { seconds } = data;
    await this.setTime(seconds);
  }
  
  // 处理更新任务信息
  async handleUpdateTask(connection, data) {
    if (connection.type !== 'host') {
      connection.websocket.send(JSON.stringify({
        type: 'ERROR',
        message: 'Only host can update task information'
      }));
      return;
    }
    
    const { task } = data;
    this.timerState.currentTask = { ...this.timerState.currentTask, ...task };
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播更新
    this.broadcastTimerUpdate();
  }
  
  // 启动计时器
  async startTimer() {
    if (this.timerState.remainingSeconds <= 0) {
      await this.resetTimer();
      return;
    }
    
    this.timerState.isRunning = true;
    this.timerState.isPaused = false;
    this.timerState.startTime = Date.now();
    
    // 启动计时器
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(async () => {
      await this.tick();
    }, 1000);
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播更新
    this.broadcastTimerUpdate();
    
    console.log('Timer started');
  }
  
  // 暂停计时器
  async pauseTimer() {
    this.timerState.isRunning = false;
    this.timerState.isPaused = true;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播更新
    this.broadcastTimerUpdate();
    
    console.log('Timer paused');
  }
  
  // 重置计时器
  async resetTimer() {
    this.timerState.isRunning = false;
    this.timerState.isPaused = false;
    this.timerState.remainingSeconds = this.timerState.originalSeconds;
    this.timerState.startTime = null;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播更新
    this.broadcastTimerUpdate();
    
    console.log('Timer reset');
  }
  
  // 设置计时器时间
  async setTime(seconds) {
    if (!this.timerState.isRunning) {
      this.timerState.totalSeconds = seconds;
      this.timerState.remainingSeconds = seconds;
      this.timerState.originalSeconds = seconds;
      
      // 持久化状态
      await this.state.storage.put('timerState', this.timerState);
      
      // 广播更新
      this.broadcastTimerUpdate();
    }
  }
  
  // 计时器滴答
  async tick() {
    this.timerState.remainingSeconds--;
    
    // 检查是否结束
    if (this.timerState.remainingSeconds <= 0) {
      await this.timerComplete();
      return;
    }
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播更新
    this.broadcastTimerUpdate();
  }
  
  // 计时器完成
  async timerComplete() {
    await this.pauseTimer();
    this.timerState.remainingSeconds = 0;
    
    // 持久化状态
    await this.state.storage.put('timerState', this.timerState);
    
    // 广播完成事件
    this.broadcast({
      type: 'TIMER_COMPLETE',
      timerState: this.timerState
    });
    
    console.log('Timer completed');
  }
  
  // 发送初始状态给新连接
  async sendInitialState(ws) {
    // 从存储加载最新状态
    const savedTimerState = await this.state.storage.get('timerState');
    if (savedTimerState) {
      this.timerState = savedTimerState;
    }
    
    const savedSessionData = await this.state.storage.get('sessionData');
    if (savedSessionData) {
      this.sessionData = savedSessionData;
    }
    
    ws.send(JSON.stringify({
      type: 'INITIAL_STATE',
      sessionData: this.sessionData,
      timerState: this.timerState,
      connections: Array.from(this.connections.values()).map(conn => ({
        id: conn.id,
        type: conn.type,
        name: conn.name,
        connectedAt: conn.connectedAt
      }))
    }));
  }
  
  // 广播计时器更新
  broadcastTimerUpdate() {
    this.broadcast({
      type: 'TIMER_UPDATE',
      timerState: this.timerState
    });
  }
  
  // 广播连接状态更新
  broadcastConnectionUpdate() {
    this.broadcast({
      type: 'CONNECTION_UPDATE',
      connections: Array.from(this.connections.values()).map(conn => ({
        id: conn.id,
        type: conn.type,
        name: conn.name,
        connectedAt: conn.connectedAt
      }))
    });
  }
  
  // 广播消息给所有连接
  broadcast(message) {
    const messageStr = JSON.stringify(message);
    
    for (const connection of this.connections.values()) {
      try {
        connection.websocket.send(messageStr);
      } catch (error) {
        console.error('Error sending message to connection:', error);
        // 移除无效连接
        this.connections.delete(connection.id);
      }
    }
  }
  
  // 根据WebSocket查找连接
  findConnectionByWebSocket(ws) {
    for (const connection of this.connections.values()) {
      if (connection.websocket === ws) {
        return connection;
      }
    }
    return null;
  }
  
  // 生成连接ID
  generateConnectionId() {
    return Math.random().toString(36).substr(2, 9);
  }
} 