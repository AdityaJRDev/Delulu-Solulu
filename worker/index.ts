import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  ASSETS: Fetcher
}

type Answer = {
  sceneId: string
  choiceIndex: number
  ms: number
  at: number
}

type Session = {
  id: string
  createdAt: number
  updatedAt: number
  a: {
    name: string
    hook: string
    styleKey: string
    priorities: string[]
    baseline: Record<string, number>
    look?: string
  }
  b: { name: string; look?: string }
  answers: Answer[]
  status: 'waiting_b' | 'in_progress' | 'completed'
}

const AXES = ['empathy', 'transparency', 'autonomy', 'repair', 'finance'] as const
const STATUSES = ['waiting_b', 'in_progress', 'completed'] as const

const clamp = (n: unknown, lo = 0, hi = 100) =>
  Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)))

function sanitizeBaseline(raw: unknown): Record<string, number> {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: Record<string, number> = {}
  for (const axis of AXES) out[axis] = clamp(source[axis] ?? 50)
  return out
}

function cleanAnswers(raw: unknown): Answer[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (x): x is Record<string, unknown> =>
        Boolean(x) && typeof x === 'object' && typeof (x as Answer).sceneId === 'string' && Number.isInteger((x as Answer).choiceIndex),
    )
    .slice(0, 200)
    .map((x) => ({
      sceneId: String(x.sceneId),
      choiceIndex: Number(x.choiceIndex),
      ms: Math.max(0, Math.round(Number(x.ms) || 0)),
      at: Number(x.at) || Date.now(),
    }))
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

app.get('/api/health', async (c) => {
  const row = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM sessions').first<{ n: number }>()
  return c.json({ ok: true, sessions: row?.n ?? 0 })
})

app.post('/api/sessions', async (c) => {
  let body: Record<string, unknown> = {}
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const a = (body.a && typeof body.a === 'object' ? body.a : {}) as Record<string, unknown>
  const b = (body.b && typeof body.b === 'object' ? body.b : {}) as Record<string, unknown>

  const hook = String(a.hook || '').slice(0, 400)
  if (!hook.trim()) return c.json({ error: 'Opening hook is required' }, 400)

  const now = Date.now()
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 9)

  const session: Session = {
    id,
    createdAt: now,
    updatedAt: now,
    a: {
      name: String(a.name || 'Partner A').slice(0, 40),
      hook,
      styleKey: String(a.styleKey || 'transparent').slice(0, 40),
      priorities: Array.isArray(a.priorities) ? a.priorities.slice(0, 6).map(String) : [],
      baseline: sanitizeBaseline(a.baseline),
      look: String(a.look || 'arjun').slice(0, 40),
    },
    b: {
      name: String(b.name || 'Partner B').slice(0, 40),
      look: String(b.look || 'meera').slice(0, 40),
    },
    answers: [],
    status: 'waiting_b',
  }

  await c.env.DB.prepare(
    'INSERT INTO sessions (id, data, created_at, updated_at) VALUES (?, ?, ?, ?)',
  )
    .bind(id, JSON.stringify(session), now, now)
    .run()

  return c.json(session, 201)
})

app.get('/api/sessions/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT data FROM sessions WHERE id = ?')
    .bind(c.req.param('id'))
    .first<{ data: string }>()
  if (!row) return c.json({ error: 'Session not found' }, 404)
  return c.json(JSON.parse(row.data) as Session)
})

app.patch('/api/sessions/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT data FROM sessions WHERE id = ?')
    .bind(id)
    .first<{ data: string }>()
  if (!row) return c.json({ error: 'Session not found' }, 404)

  let body: Record<string, unknown> = {}
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const session = JSON.parse(row.data) as Session

  const b = body.b as Record<string, unknown> | undefined
  if (b && typeof b === 'object') {
    if (typeof b.name === 'string') session.b.name = b.name.slice(0, 40)
    if (typeof b.look === 'string') session.b.look = b.look.slice(0, 40)
  }

  if (Array.isArray(body.answers)) session.answers = cleanAnswers(body.answers)

  if (typeof body.status === 'string' && (STATUSES as readonly string[]).includes(body.status)) {
    session.status = body.status as Session['status']
  }

  session.updatedAt = Date.now()

  await c.env.DB.prepare('UPDATE sessions SET data = ?, updated_at = ? WHERE id = ?')
    .bind(JSON.stringify(session), session.updatedAt, id)
    .run()

  return c.json(session)
})

app.get('*', async (c) => {
  const asset = await c.env.ASSETS.fetch(c.req.raw)
  if (asset.status !== 404) return asset
  const url = new URL('/index.html', c.req.url)
  return c.env.ASSETS.fetch(new Request(url.toString(), { method: 'GET' }))
})

export default app
