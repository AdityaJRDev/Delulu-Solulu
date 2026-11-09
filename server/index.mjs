import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { nanoid } from 'nanoid'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DATA_FILE = join(DATA_DIR, 'sessions.json')
const DIST_DIR = join(__dirname, '..', 'dist')
const PORT = Number(process.env.PORT || 8787)

const AXES = ['empathy', 'transparency', 'autonomy', 'repair', 'finance']
const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)))

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
}

function sanitizeBaseline(raw = {}) {
  const out = {}
  for (const axis of AXES) out[axis] = clamp(raw[axis] ?? 50)
  return out
}

let sessions = {}

async function load() {
  try {
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true })
    if (existsSync(DATA_FILE)) {
      sessions = JSON.parse(await readFile(DATA_FILE, 'utf8'))
    }
  } catch (err) {
    console.error('[store] load failed, starting empty:', err.message)
    sessions = {}
  }
}

let writeTimer = null
function persist() {
  clearTimeout(writeTimer)
  writeTimer = setTimeout(async () => {
    try {
      await writeFile(DATA_FILE, JSON.stringify(sessions, null, 2), 'utf8')
    } catch (err) {
      console.error('[store] persist failed:', err.message)
    }
  }, 150)
}

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/health', (c) =>
  c.json({ ok: true, sessions: Object.keys(sessions).length, uptime: process.uptime() }),
)

app.post('/api/sessions', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }
  const { a = {}, b = {} } = body || {}
  const nameA = String(a.name || 'Partner A').slice(0, 40)
  const nameB = String(b.name || 'Partner B').slice(0, 40)
  const hook = String(a.hook || '').slice(0, 400)

  if (!hook.trim()) return c.json({ error: 'Opening hook is required' }, 400)

  const id = nanoid(9)
  const session = {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    a: {
      name: nameA,
      hook,
      styleKey: String(a.styleKey || 'transparent').slice(0, 40),
      priorities: Array.isArray(a.priorities) ? a.priorities.slice(0, 6).map(String) : [],
      baseline: sanitizeBaseline(a.baseline),
      look: String(a.look || 'arjun').slice(0, 40),
    },
    b: { name: nameB, look: String(b.look || 'meera').slice(0, 40) },
    answers: [],
    status: 'waiting_b',
  }
  sessions[id] = session
  persist()
  return c.json(session, 201)
})

app.get('/api/sessions/:id', (c) => {
  const session = sessions[c.req.param('id')]
  if (!session) return c.json({ error: 'Session not found' }, 404)
  return c.json(session)
})

app.patch('/api/sessions/:id', async (c) => {
  const session = sessions[c.req.param('id')]
  if (!session) return c.json({ error: 'Session not found' }, 404)

  let body = {}
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }
  const { answers, status, b } = body || {}

  if (b && typeof b === 'object') {
    if (typeof b.name === 'string') session.b.name = b.name.slice(0, 40)
    if (typeof b.look === 'string') session.b.look = b.look.slice(0, 40)
  }

  if (Array.isArray(answers)) {
    session.answers = answers
      .filter((x) => x && typeof x.sceneId === 'string' && Number.isInteger(x.choiceIndex))
      .slice(0, 200)
      .map((x) => ({
        sceneId: x.sceneId,
        choiceIndex: x.choiceIndex,
        ms: Math.max(0, Math.round(Number(x.ms) || 0)),
        at: Number(x.at) || Date.now(),
      }))
  }

  if (typeof status === 'string' && ['waiting_b', 'in_progress', 'completed'].includes(status)) {
    session.status = status
  }

  session.updatedAt = Date.now()
  persist()
  return c.json(session)
})

app.get('*', async (c) => {
  const pathname = decodeURIComponent(new URL(c.req.url).pathname)
  const requested = normalize(join(DIST_DIR, pathname))
  if (!requested.startsWith(DIST_DIR)) return c.text('Forbidden', 403)

  try {
    const info = await stat(requested)
    const filePath = info.isDirectory() ? join(requested, 'index.html') : requested
    const data = await readFile(filePath)
    return c.newResponse(data, 200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
  } catch {
    try {
      const html = await readFile(join(DIST_DIR, 'index.html'), 'utf8')
      return c.html(html)
    } catch {
      return c.text('Build the web app first: npm run build', 404)
    }
  }
})

await load()

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n  Delulu Solul API  →  http://localhost:${PORT}`)
  console.log(`  Sessions stored in server/data/sessions.json\n`)
})
