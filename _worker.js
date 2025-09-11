// Cloudflare Worker for WebSocket-based synchronized timer sessions
// 支持多房间实时同步计时功能

export { TimerSession } from './timer-session.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理WebSocket升级请求
    if (url.pathname === '/ws') {
      return handleWebSocketUpgrade(request, env);
    }
    
    // 处理会话管理API
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    // 其他请求返回静态文件（由Pages处理）
    return new Response('Not found', { status: 404 });
  }
};

// 处理WebSocket连接升级
async function handleWebSocketUpgrade(request, env) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');
  const userType = url.searchParams.get('type') || 'participant'; // 'host' or 'participant'
  
  if (!sessionId) {
    return new Response('Missing sessionId parameter', { status: 400 });
  }

  // 获取或创建Durable Object实例
  const id = env.TIMER_SESSIONS.idFromName(sessionId);
  const session = env.TIMER_SESSIONS.get(id);
  
  // 转发WebSocket连接到Durable Object
  return session.fetch(request);
}

// 处理API请求
async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  if (path === '/api/create-session' && request.method === 'POST') {
    return createSession(request, env);
  }
  
  if (path === '/api/join-session' && request.method === 'POST') {
    return joinSession(request, env);
  }
  
  return new Response('API endpoint not found', { status: 404 });
}

// 创建新会话
async function createSession(request, env) {
  try {
    const { hostName, sessionName } = await request.json();
    
    // 生成唯一会话ID
    const sessionId = generateSessionId();
    
    // 获取Durable Object实例
    const id = env.TIMER_SESSIONS.idFromName(sessionId);
    const session = env.TIMER_SESSIONS.get(id);
    
    // 初始化会话
    const initRequest = new Request('https://dummy/init', {
      method: 'POST',
      body: JSON.stringify({
        hostName,
        sessionName,
        sessionId
      })
    });
    
    await session.fetch(initRequest);
    
    return new Response(JSON.stringify({
      success: true,
      sessionId,
      hostUrl: `/host.html?sessionId=${sessionId}`,
      participantUrl: `/participant.html?sessionId=${sessionId}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 加入会话
async function joinSession(request, env) {
  try {
    const { sessionId, participantName } = await request.json();
    
    if (!sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查会话是否存在
    const id = env.TIMER_SESSIONS.idFromName(sessionId);
    const session = env.TIMER_SESSIONS.get(id);
    
    const checkRequest = new Request('https://dummy/check', {
      method: 'GET'
    });
    
    const response = await session.fetch(checkRequest);
    const sessionData = await response.json();
    
    if (!sessionData.exists) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      sessionId,
      sessionName: sessionData.sessionName,
      participantUrl: `/participant.html?sessionId=${sessionId}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 生成唯一会话ID
function generateSessionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 