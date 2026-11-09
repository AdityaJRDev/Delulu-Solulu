import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import puppeteer from 'puppeteer-core'

const PORT = Number(process.env.SHOT_PORT || 8802)
const BASE = `http://127.0.0.1:${PORT}`
const OUT = process.env.SHOT_DIR || 'C:\\Users\\jradi\\AppData\\Local\\Temp\\opencode\\shots'
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

mkdirSync(OUT, { recursive: true })

const server = spawn(process.execPath, ['server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverLog = ''
server.stdout.on('data', (d) => (serverLog += d.toString()))
server.stderr.on('data', (d) => (serverLog += d.toString()))

async function waitForHealth() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`${BASE}/api/health`)
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await delay(200)
  }
  throw new Error('server did not start')
}

async function createSession(payload) {
  const res = await fetch(`${BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`create failed ${res.status}`)
  return res.json()
}

async function patchSession(id, patch) {
  const res = await fetch(`${BASE}/api/sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error(`patch failed ${res.status}`)
  return res.json()
}

const baseSession = {
  a: {
    name: 'Arjun',
    hook: 'Meera gets pulled into an urgent client deadline on Friday night. Dinner was booked weeks ago.',
    styleKey: 'transparent',
    priorities: ['hear', 'early', 'repair'],
    baseline: { empathy: 68, transparency: 74, autonomy: 52, repair: 70, finance: 58 },
    look: 'arjun',
  },
  b: { name: 'Meera', look: 'meera' },
}

async function main() {
  await waitForHealth()

  const fresh = await createSession(baseSession)
  const done = await createSession(baseSession)
  const answers = Array.from({ length: 100 }, (_, i) => ({
    sceneId: `s${i + 1}`,
    choiceIndex: i % 3,
    ms: 2200 + (i % 7) * 400,
    at: Date.now(),
  }))
  await patchSession(done.id, { answers, status: 'completed' })

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
  })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })

  const width = Number(process.env.SHOT_W || 390)
  const height = Number(process.env.SHOT_H || 844)
  await page.setViewport({ width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

  const shot = async (name) => {
    await page.evaluate(() => document.fonts.ready)
    await delay(650)
    await page.screenshot({ path: `${OUT}\\${name}.png` })
    console.log(`  ✓ ${name}.png`)
  }

  const go = async (path) => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
    await delay(400)
  }

  await go('/')
  await shot('01-landing')

  await page.click('text/Start a run').catch(async () => {
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Start a run'))
      el?.click()
    })
  })
  await delay(700)
  await shot('02-create')

  await page.evaluate((session) => {
    localStorage.setItem('delulu.sessions.v1', JSON.stringify({ [session.id]: session }))
  }, fresh)
  await go(`/invite/${fresh.id}`)
  await shot('03-invite')

  await page.evaluate(() => localStorage.removeItem('delulu.sessions.v1'))
  await go(`/invite/${fresh.id}`)
  await page.waitForFunction((id) => location.pathname === `/play/${id}`, { timeout: 5000 }, fresh.id)
  console.log('  ✓ invite link redirects a fresh device to play')

  await go(`/play/${fresh.id}`)
  await shot('04-play-intro')
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Begin Act'))
    el?.click()
  })
  await delay(800)
  await shot('05-play-scene')
  await page.evaluate(() => {
    const el = document.querySelector('button.group')
    el?.click()
  })
  await delay(800)
  await shot('06-play-echo')

  await go(`/report/${done.id}`)
  await shot('07-report-top')
  await page.evaluate(() => {
    const scroller = document.querySelector('.no-scrollbar.flex-1.overflow-y-auto')
    scroller?.scrollTo({ top: 900 })
  })
  await delay(500)
  await shot('08-report-mid')
  await page.evaluate(() => {
    const scroller = document.querySelector('.no-scrollbar.flex-1.overflow-y-auto')
    scroller?.scrollTo({ top: scroller.scrollHeight })
  })
  await delay(500)
  await shot('09-report-bottom')

  await go('/cast')
  await shot('10-cast')

  await browser.close()

  if (errors.length) {
    console.error(`\n  ✗ browser errors:`)
    for (const error of errors) console.error(`    - ${error}`)
    process.exitCode = 1
  } else {
    console.log('\n  No browser console/page errors.\n')
  }
}

main()
  .catch((err) => {
    console.error(`\n  ✗ ${err.message}`)
    if (serverLog.trim()) console.error(serverLog.trim())
    process.exitCode = 1
  })
  .finally(() => {
    server.kill()
  })
