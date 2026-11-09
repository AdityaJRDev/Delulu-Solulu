import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const PORT = Number(process.env.SMOKE_PORT || 8799)
const BASE = `http://127.0.0.1:${PORT}`

const child = spawn(process.execPath, ['server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let output = ''
child.stdout.on('data', (d) => (output += d.toString()))
child.stderr.on('data', (d) => (output += d.toString()))

function fail(message) {
  console.error(`\n  ✗ ${message}\n`)
  if (output.trim()) console.error(output.trim())
  child.kill()
  process.exit(1)
}

async function waitForHealth() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch(`${BASE}/api/health`)
      if (res.ok) return res.json()
    } catch {
      /* not up yet */
    }
    await delay(200)
  }
  fail('server did not become healthy in 10s')
}

async function main() {
  const health = await waitForHealth()
  console.log(`  ✓ health ${JSON.stringify(health)}`)

  const createRes = await fetch(`${BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      a: {
        name: 'Arjun',
        hook: 'Meera gets pulled into a Friday deadline. Dinner was booked weeks ago.',
        styleKey: 'transparent',
        priorities: ['hear', 'early', 'repair'],
        baseline: { empathy: 68, transparency: 74, autonomy: 52, repair: 70, finance: 58 },
        look: 'arjun',
      },
      b: { name: 'Meera', look: 'meera' },
    }),
  })
  if (createRes.status !== 201) fail(`create expected 201, got ${createRes.status}`)
  const session = await createRes.json()
  if (!session.id || session.answers.length !== 0) fail('create returned a malformed session')
  if (session.a.look !== 'arjun' || session.b.look !== 'meera') fail('looks were not persisted')
  console.log(`  ✓ created ${session.id}`)

  const getRes = await fetch(`${BASE}/api/sessions/${session.id}`)
  if (!getRes.ok) fail(`get expected 200, got ${getRes.status}`)
  const fetched = await getRes.json()
  if (fetched.a.baseline.transparency !== 74) fail('baseline was not persisted')
  console.log('  ✓ fetched session')

  const answers = [
    { sceneId: 's1', choiceIndex: 0, ms: 2100, at: Date.now() },
    { sceneId: 's2', choiceIndex: 2, ms: 3400, at: Date.now() },
  ]
  const patchRes = await fetch(`${BASE}/api/sessions/${session.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, status: 'in_progress' }),
  })
  if (!patchRes.ok) fail(`patch expected 200, got ${patchRes.status}`)
  const patched = await patchRes.json()
  if (patched.answers.length !== 2) fail('answers were not stored')
  if (patched.status !== 'in_progress') fail('status was not updated')
  console.log('  ✓ patched answers + status')

  const doneRes = await fetch(`${BASE}/api/sessions/${session.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  })
  const done = await doneRes.json()
  if (done.status !== 'completed') fail('completion status was not stored')
  console.log('  ✓ completed')

  const missing = await fetch(`${BASE}/api/sessions/does-not-exist`)
  if (missing.status !== 404) fail(`missing session expected 404, got ${missing.status}`)
  console.log('  ✓ 404 for unknown session')

  const bad = await fetch(`${BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: { name: 'A', hook: '' }, b: { name: 'B' } }),
  })
  if (bad.status !== 400) fail(`empty hook expected 400, got ${bad.status}`)
  console.log('  ✓ 400 for empty hook')

  if (existsSync('dist/index.html')) {
    const home = await fetch(`${BASE}/`)
    const homeHtml = await home.text()
    if (!home.ok || !homeHtml.includes('id="root"')) fail('static / did not serve the built index.html')
    const spa = await fetch(`${BASE}/play/abc123`)
    const spaHtml = await spa.text()
    if (!spa.ok || !spaHtml.includes('id="root"')) fail('SPA fallback did not serve index.html')
    const icon = await fetch(`${BASE}/favicon.svg`)
    if (!icon.ok || !(icon.headers.get('content-type') || '').includes('svg')) fail('favicon did not serve')
    console.log('  ✓ static files + SPA fallback')
  }

  console.log('\n  All smoke checks passed.\n')
  child.kill()
  process.exit(0)
}

main().catch((err) => fail(err?.message || String(err)))
