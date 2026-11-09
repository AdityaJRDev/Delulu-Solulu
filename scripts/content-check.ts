import { ACTS, SCENES, SCENE_BY_ID, TOTAL } from '../src/data/scenes'
import { buildReport } from '../src/lib/scoring'
import { AXES } from '../src/lib/constants'
import type { Answer, Session, Tag } from '../src/lib/types'

const TAGS: Tag[] = [
  'warm',
  'honest',
  'avoid',
  'blunt',
  'bold',
  'selfish',
  'calm',
  'chaotic',
  'generous',
  'guarded',
]

const errors: string[] = []
let largeDeltas = 0
const fail = (message: string) => errors.push(message)

if (TOTAL !== 100) fail(`expected 100 scenes, found ${TOTAL}`)

for (const act of ACTS) {
  const count = SCENES.filter((scene) => scene.act === act).length
  if (count !== 25) fail(`act ${act} has ${count} scenes (expected 25)`)
}

const ids = new Set<string>()
const numbers = new Set<number>()
const tagCount = new Map<string, number>()
const focusCount = new Map<string, number>()
const choiceCount = new Map<number, number>()

for (const scene of SCENES) {
  if (ids.has(scene.id)) fail(`duplicate id ${scene.id}`)
  ids.add(scene.id)
  if (numbers.has(scene.n)) fail(`duplicate scene number ${scene.n}`)
  numbers.add(scene.n)

  if (!scene.title?.trim()) fail(`${scene.id}: empty title`)
  if (!scene.line?.trim()) fail(`${scene.id}: empty line`)
  if (!scene.chapter?.trim()) fail(`${scene.id}: empty chapter`)
  if (scene.choices.length < 3 || scene.choices.length > 4) {
    fail(`${scene.id}: ${scene.choices.length} choices (expected 3–4)`)
  }
  choiceCount.set(scene.choices.length, (choiceCount.get(scene.choices.length) ?? 0) + 1)
  focusCount.set(scene.focus, (focusCount.get(scene.focus) ?? 0) + 1)

  for (const [i, choice] of scene.choices.entries()) {
    if (!choice.t?.trim()) fail(`${scene.id} choice ${i}: empty text`)
    if (!choice.echo?.trim()) fail(`${scene.id} choice ${i}: empty echo`)
    if (!TAGS.includes(choice.tag)) fail(`${scene.id} choice ${i}: bad tag ${choice.tag}`)
    tagCount.set(choice.tag, (tagCount.get(choice.tag) ?? 0) + 1)

    const deltas = AXES.map((axis) => choice.d[axis] ?? 0)
    if (deltas.every((d) => d === 0)) fail(`${scene.id} choice ${i}: no axis movement`)
    for (const d of deltas) {
      if (Math.abs(d) > 10) fail(`${scene.id} choice ${i}: delta ${d} out of range`)
      if (!Number.isFinite(d)) fail(`${scene.id} choice ${i}: non-finite delta`)
      if (Math.abs(d) > 6) largeDeltas += 1
    }
  }

  for (const text of [scene.line, scene.sub ?? '', ...scene.choices.flatMap((c) => [c.t, c.echo])]) {
    const clean = text.replaceAll('{{HOOK}}', '')
    const tokens = clean.match(/\{[^}]*\}/g) ?? []
    for (const token of tokens) {
      if (token !== '{A}' && token !== '{B}') fail(`${scene.id}: unknown token ${token}`)
    }
    if ((clean.match(/\{/g)?.length ?? 0) !== (clean.match(/\}/g)?.length ?? 0)) {
      fail(`${scene.id}: unbalanced braces in "${text.slice(0, 60)}"`)
    }
  }
}

for (let n = 1; n <= TOTAL; n += 1) {
  if (!numbers.has(n)) fail(`missing scene number ${n}`)
}

function makeSession(answers: Answer[]): Session {
  return {
    id: 'check',
    createdAt: 0,
    updatedAt: 0,
    a: {
      name: 'Arjun',
      hook: 'A test hook.',
      styleKey: 'transparent',
      priorities: ['hear', 'early', 'repair'],
      baseline: { empathy: 68, transparency: 74, autonomy: 52, repair: 70, finance: 58 },
    },
    b: { name: 'Meera' },
    answers,
    status: answers.length >= TOTAL ? 'completed' : 'in_progress',
  }
}

function runWith(pick: (index: number, sceneChoices: number) => number) {
  const answers: Answer[] = SCENES.map((scene, index) => ({
    sceneId: scene.id,
    choiceIndex: pick(index, scene.choices.length),
    ms: 2400,
    at: index,
  }))
  return buildReport(makeSession(answers), SCENE_BY_ID)
}

for (let fixed = 0; fixed < 4; fixed += 1) {
  const report = runWith((_, count) => Math.min(fixed, count - 1))
  if (report.answered !== TOTAL) fail(`fixed-${fixed}: answered ${report.answered}`)
  if (!(report.overall >= 0 && report.overall <= 100)) fail(`fixed-${fixed}: overall ${report.overall}`)
  if (report.crossroads.length !== 3) fail(`fixed-${fixed}: ${report.crossroads.length} crossroads`)
  if (!report.archetype?.name) fail(`fixed-${fixed}: no archetype`)
  for (const axis of AXES) {
    const value = report.byAxis[axis]
    if (!(value >= 0 && value <= 100)) fail(`fixed-${fixed}: ${axis} alignment ${value}`)
    if (!Number.isFinite(report.bFinal[axis])) fail(`fixed-${fixed}: ${axis} final not finite`)
  }
}

let seed = 42
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}

const axisStats = Object.fromEntries(
  AXES.map((axis) => [axis, { min: 101, max: -1, sum: 0 }]),
) as Record<string, { min: number; max: number; sum: number }>
const overalls: number[] = []
const archetypes = new Map<string, number>()
let extremeAxes = 0

for (let run = 0; run < 1000; run += 1) {
  const report = runWith((_, count) => Math.floor(rand() * count))
  if (!Number.isFinite(report.overall)) fail(`random-${run}: non-finite overall`)
  if (report.crossroads.length !== 3) fail(`random-${run}: ${report.crossroads.length} crossroads`)
  if (!report.verdict) fail(`random-${run}: empty verdict`)
  if (report.repairPrompts.length !== 2) fail(`random-${run}: ${report.repairPrompts.length} repair prompts`)

  overalls.push(report.overall)
  archetypes.set(report.archetype.name, (archetypes.get(report.archetype.name) ?? 0) + 1)
  let extreme = false
  for (const axis of AXES) {
    const value = report.bFinal[axis]
    const stat = axisStats[axis]
    stat.min = Math.min(stat.min, value)
    stat.max = Math.max(stat.max, value)
    stat.sum += value
    if (value < 3 || value > 97) extreme = true
  }
  if (extreme) extremeAxes += 1
}

const partial = buildReport(
  makeSession(SCENES.slice(0, 10).map((scene) => ({ sceneId: scene.id, choiceIndex: 0, ms: 1000, at: 0 }))),
  SCENE_BY_ID,
)
if (partial.answered !== 10) fail(`partial: answered ${partial.answered}`)
if (partial.crossroads.length !== 3) fail(`partial: ${partial.crossroads.length} crossroads`)

if (errors.length) {
  console.error(`\n  ✗ ${errors.length} content problem(s):`)
  for (const error of errors) console.error(`    - ${error}`)
  process.exit(1)
}

console.log(`  ✓ ${TOTAL} scenes, ${ids.size} unique ids, numbers 1–${TOTAL} complete`)
console.log(`  ✓ choices per scene: ${[...choiceCount.entries()].map(([k, v]) => `${k}×${v}`).join(', ')}`)
console.log(`  ✓ focus: ${[...focusCount.entries()].map(([k, v]) => `${k} ${v}`).join(', ')}`)
console.log(`  ✓ tags: ${[...tagCount.entries()].map(([k, v]) => `${k} ${v}`).join(', ')}`)
console.log(`  ! deltas above 6: ${largeDeltas}`)
console.log('  ✓ 4 fixed runs + 1000 random runs build valid reports')
console.log('  ✓ partial run builds a snapshot report')
console.log(
  `  · final axes (random): ${AXES.map((axis) => {
    const stat = axisStats[axis]
    return `${axis} ${stat.min}–${stat.max} (avg ${(stat.sum / 1000).toFixed(1)})`
  }).join(', ')}`,
)
console.log(
  `  · overall: ${Math.min(...overalls)}–${Math.max(...overalls)} (avg ${(
    overalls.reduce((a, b) => a + b, 0) / overalls.length
  ).toFixed(1)})`,
)
console.log(`  · extreme-axis runs: ${extremeAxes}/1000`)
console.log(
  `  · archetypes: ${[...archetypes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${name} ${count}`)
    .join(', ')}`,
)
console.log('')
