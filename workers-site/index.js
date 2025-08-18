import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things:
 * 1. we will skip caching on the edge, which makes it easier to debug
 * 2. we will return an error message on exception in your Response rather than the default 404.html page
 */
const DEBUG = false

addEventListener('fetch', event => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  const { pathname, searchParams } = url

  // CORS preflight
  if (event.request.method === 'OPTIONS') {
    return corsResponse()
  }

  // Simple API router
  if (pathname === '/api/state') {
    const channel = (searchParams.get('channel') || '').trim()
    if (!channel) {
      return json({ error: 'channel required' }, 400)
    }

    if (event.request.method === 'GET') {
      const key = `state:${channel}`
      const raw = await STATE_KV.get(key)
      if (!raw) {
        return json({ exists: false }, 200)
      }
      const state = JSON.parse(raw)
      // Compute remaining on server to avoid client clock skew
      let calcRemainingSeconds = state.remainingSeconds
      if (state.isRunning && typeof state.startedAt === 'number') {
        const elapsed = Math.floor((Date.now() - state.startedAt) / 1000)
        calcRemainingSeconds = Math.max(0, (state.remainingSeconds || 0) - elapsed)
      }
      return json({ exists: true, serverNow: Date.now(), ...state, calcRemainingSeconds }, 200)
    }

    if (event.request.method === 'POST') {
      // Bearer auth
      const auth = event.request.headers.get('authorization') || ''
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
      if (!token || token !== ADMIN_TOKEN) {
        return json({ error: 'unauthorized' }, 401)
      }

      let body
      try { body = await event.request.json() } catch (e) { return json({ error: 'invalid json' }, 400) }

      // Normalize state payload
      const now = Date.now()
      const key = `state:${channel}`
      let version = 1
      const prev = await STATE_KV.get(key)
      if (prev) {
        try { const p = JSON.parse(prev); version = (p.version || 0) + 1 } catch (e) {}
      }

      const state = {
        tasks: Array.isArray(body.tasks) ? body.tasks : [],
        currentTaskIndex: typeof body.currentTaskIndex === 'number' ? body.currentTaskIndex : 0,
        isRunning: !!body.isRunning,
        startedAt: typeof body.startedAt === 'number' ? body.startedAt : null,
        remainingSeconds: typeof body.remainingSeconds === 'number' ? body.remainingSeconds : 0,
        lang: typeof body.lang === 'string' ? body.lang : 'zh',
        version,
        updatedAt: now
      }

      await STATE_KV.put(key, JSON.stringify(state))
      return json({ ok: true, version }, 200)
    }

    return json({ error: 'method not allowed' }, 405)
  }

  // Static assets
  try {
    const options = {}
    if (DEBUG) options.cacheControl = { bypassCache: true }
    return await getAssetFromKV(event, options)
  } catch (e) {
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })
        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e2) {}
    }
    return new Response(e.message || e.toString(), { status: 500 })
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: corsHeaders({ 'content-type': 'application/json; charset=utf-8' })
  })
}

function corsHeaders(extra = {}) {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    ...extra
  }
}

function corsResponse() {
  return new Response(null, { status: 204, headers: corsHeaders() })
} 