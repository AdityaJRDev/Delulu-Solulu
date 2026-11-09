import type { Act, Answer, Axes, Axis, Choice, Crossroad, Report, Scene, Session } from './types'
import { nearestArchetype } from './archetypes'
import { AXES, WEIGHTS } from './constants'

export { AXES, WEIGHTS }

export const AXIS_META: Record<
  Axis,
  { label: string; short: string; tiny: string; low: string; high: string; color: string }
> = {
  empathy: {
    label: 'Empathy & Validation',
    short: 'Empathy',
    tiny: 'Emp',
    low: 'fixes first, feelings later',
    high: 'validates before solving',
    color: '#E0576F',
  },
  transparency: {
    label: 'Stress Transparency',
    short: 'Transparency',
    tiny: 'Stress',
    low: 'goes quiet under pressure',
    high: 'over-communicates early',
    color: '#E9A23B',
  },
  autonomy: {
    label: 'Autonomy ↔ Togetherness',
    short: 'Autonomy',
    tiny: 'Auto',
    low: 'hyper-independent',
    high: 'interdependence-first',
    color: '#3F8F86',
  },
  repair: {
    label: 'Conflict & Repair',
    short: 'Repair',
    tiny: 'Repair',
    low: 'defends, keeps score',
    high: 'owns it, repairs fast',
    color: '#7B5BB6',
  },
  finance: {
    label: 'Money & Ego',
    short: 'Money',
    tiny: 'Money',
    low: 'secretive, status-driven',
    high: 'transparent, shared values',
    color: '#C08A3E',
  },
}

export const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))

export function emptyAxes(value = 50): Axes {
  return { empathy: value, transparency: value, autonomy: value, repair: value, finance: value }
}

export function applyChoice(axes: Axes, choice: Choice, bias?: Axes): Axes {
  const next = { ...axes }
  for (const axis of AXES) {
    const delta = (choice.d[axis] ?? 0) - (bias?.[axis] ?? 0)
    if (!delta) continue
    const factor = delta > 0 ? (100 - next[axis]) / 55 : next[axis] / 55
    next[axis] = clamp(Math.round((next[axis] + delta * factor) * 10) / 10)
  }
  return next
}

function sceneBias(scene: Scene): Axes {
  const mean = emptyAxes(0)
  for (const choice of scene.choices) {
    for (const axis of AXES) mean[axis] += (choice.d[axis] ?? 0) / scene.choices.length
  }
  return mean
}

export function replay(answers: Answer[], byId: Record<string, Scene>) {
  let axes = emptyAxes()
  const steps: {
    scene: Scene
    choice: Choice
    before: Axes
    after: Axes
    act: Act
  }[] = []

  for (const answer of answers) {
    const scene = byId[answer.sceneId]
    if (!scene) continue
    const choice = scene.choices[answer.choiceIndex]
    if (!choice) continue
    const before = { ...axes }
    axes = applyChoice(axes, choice, sceneBias(scene))
    steps.push({ scene, choice, before, after: { ...axes }, act: scene.act })
  }

  return { final: axes, steps }
}

export function alignment(a: Axes, b: Axes) {
  const byAxis = {} as Record<Axis, number>
  let overall = 0
  for (const axis of AXES) {
    const value = Math.max(0, Math.round(100 - 2 * Math.abs(a[axis] - b[axis])))
    byAxis[axis] = value
    overall += value * WEIGHTS[axis]
  }
  return { overall: Math.round(overall), byAxis }
}

const EXPECTATION: Record<Axis, { high: string; low: string }> = {
  empathy: {
    high: 'to have their feelings named before any advice',
    low: 'a practical fix more than a long feelings talk',
  },
  transparency: {
    high: 'an early heads-up before the silence got loud',
    low: 'space to disappear and handle it alone',
  },
  autonomy: {
    high: 'to be pulled into the plan, not informed after',
    low: 'their own schedule left mostly untouched',
  },
  repair: {
    high: 'a fast, clean repair the same day',
    low: 'time and distance before talking it out',
  },
  finance: {
    high: 'full visibility and shared decisions',
    low: 'independent money and private choices',
  },
}

const PROMPT: Record<Axis, string> = {
  empathy: 'When I am upset, name the feeling before you fix the problem. Try: "That sounds exhausting."',
  transparency:
    'When work explodes, text me the moment you know — not when you are finally free. Even "this is bad, call you at 10" helps.',
  autonomy:
    'Tell me which plans are truly non-negotiable for you, so I stop guessing which ones I can move.',
  repair:
    'When we fight, I need us back within a day. Silence reads as abandonment, not as cooling off.',
  finance:
    'Let us pick one number we never spend without telling each other. One number, no arguments.',
}

export function buildReport(session: Session, byId: Record<string, Scene>): Report {
  const { final, steps } = replay(session.answers, byId)
  const a = session.a.baseline
  const { overall, byAxis } = alignment(a, final)

  const ranked = steps
    .map((step) => {
      const axis = step.scene.focus
      const gap = Math.abs(a[axis] - step.after[axis])
      return { step, axis, gap }
    })
    .sort((x, y) => y.gap - x.gap)

  const picked: typeof ranked = []
  const actsUsed = new Set<number>()
  for (const item of ranked) {
    if (picked.length >= 3) break
    if (actsUsed.has(item.step.act)) continue
    picked.push(item)
    actsUsed.add(item.step.act)
  }
  for (const item of ranked) {
    if (picked.length >= 3) break
    if (!picked.includes(item)) picked.push(item)
  }

  const crossroads: Crossroad[] = picked.map(({ step, axis, gap }) => ({
    scene: step.scene,
    choice: step.choice,
    gap: Math.round(gap),
    axis,
    aValue: Math.round(a[axis]),
    bValue: Math.round(step.after[axis]),
    expected: EXPECTATION[axis][a[axis] >= 50 ? 'high' : 'low'],
    chose: step.choice.t,
    prompt: PROMPT[axis],
  }))

  const sortedAxes = [...AXES].sort((x, y) => byAxis[y] - byAxis[x])
  const strengths = sortedAxes.slice(0, 2)
  const growth = sortedAxes.slice(-2).reverse()

  const actScores = ([1, 2, 3, 4] as Act[]).map((act) => {
    const actSteps = steps.filter((s) => s.act === act)
    const last = actSteps[actSteps.length - 1]
    const vector = last ? last.after : emptyAxes()
    return {
      act,
      answered: actSteps.length,
      score: actSteps.length ? alignment(a, vector).overall : 0,
    }
  })

  const avgSeconds = steps.length
    ? Math.round(
        (session.answers.reduce((sum, x) => sum + (x.ms || 0), 0) / steps.length / 1000) * 10,
      ) / 10
    : 0

  const verdict =
    overall >= 85
      ? 'Rare air. You two speak the same language when it gets hard.'
      : overall >= 70
        ? 'Strong resonance, with a few honest gaps worth naming.'
        : overall >= 55
          ? 'Workable — but the unspoken stuff needs airtime.'
          : overall >= 40
            ? 'There is love here, and a lot of guessing. Worth a real conversation.'
            : 'Two different operating systems. Not a verdict, an invitation to talk.'

  return {
    overall,
    byAxis,
    bFinal: final,
    aBaseline: a,
    archetype: nearestArchetype(final),
    crossroads,
    strengths,
    growth,
    repairPrompts: growth.map((axis) => PROMPT[axis]),
    actScores,
    answered: steps.length,
    avgSeconds,
    verdict,
  }
}


