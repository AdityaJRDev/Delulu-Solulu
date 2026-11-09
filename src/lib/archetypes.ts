import type { Archetype, Axes, Axis } from './types'
import { AXES } from './constants'

type Prototype = Archetype & { v: Axes }

const p = (
  key: string,
  name: string,
  tagline: string,
  blurb: string,
  v: [number, number, number, number, number],
): Prototype => ({
  key,
  name,
  tagline,
  blurb,
  v: { empathy: v[0], transparency: v[1], autonomy: v[2], repair: v[3], finance: v[4] },
})

export const ARCHETYPES: Prototype[] = [
  p(
    'strategic_anchors',
    'The Strategic Anchors',
    'Calm in the storm, honest in the quiet',
    'You both plan, communicate early, and repair fast. Your risk is becoming a project manager instead of a partner.',
    [70, 82, 64, 86, 76],
  ),
  p(
    'soft_landing',
    'The Soft Landing',
    'Feelings first, logistics second',
    'Warmth is your default. You validate before you solve — just make sure the practical stuff still gets said out loud.',
    [90, 72, 60, 74, 56],
  ),
  p(
    'slow_burn',
    'The Slow Burn',
    'Quiet, fused, and slower to speak',
    'You move as one unit but keep a lot inside. The silence is comfortable until it is not.',
    [80, 58, 36, 66, 54],
  ),
  p(
    'lone_wolves',
    'The Lone Wolves',
    'Independent, private, hard to read',
    'You both handle pressure alone and protect your space. Love is real; visibility is the work.',
    [46, 36, 88, 50, 66],
  ),
  p(
    'fixers',
    'The Fixers',
    'Practical, direct, allergic to spirals',
    'You solve problems fast and communicate clearly. The gap is the feeling underneath the problem.',
    [40, 80, 58, 82, 72],
  ),
  p(
    'open_books',
    'The Open Books',
    'Nothing hidden, everything discussed',
    'Radical transparency is your love language. Watch for over-sharing as a way to avoid sitting with discomfort.',
    [62, 92, 54, 70, 84],
  ),
  p(
    'velvet_vault',
    'The Velvet Vault',
    'Warm on the surface, private underneath',
    'You are affectionate but keep money, stress, and fear close to the chest. Open one drawer at a time.',
    [82, 36, 50, 58, 34],
  ),
  p(
    'grounded_romantics',
    'The Grounded Romantics',
    'Soft hearts, sensible systems',
    'You balance feeling with follow-through. Your quiet strength is that nothing is left to guess.',
    [76, 72, 60, 82, 80],
  ),
  p(
    'passionate_rebels',
    'The Passionate Rebels',
    'Loud, free, and fiercely loyal',
    'You feel everything at full volume and protect your freedom. Money and boundaries are where the plot thickens.',
    [84, 54, 80, 70, 38],
  ),
  p(
    'escape_artists',
    'The Escape Artists',
    'Cool the room, change the subject',
    'You avoid the sharp edges and keep things light. The unspoken things are quietly running the show.',
    [42, 32, 74, 30, 54],
  ),
]

function centered(axes: Axes): Axes {
  const mean = AXES.reduce((sum, axis) => sum + axes[axis], 0) / AXES.length
  const out = {} as Axes
  for (const axis of AXES) out[axis] = axes[axis] - mean + 50
  return out
}

function shape(axes: Axes, radius = 30): Axes {
  const centeredAxes = centered(axes)
  let norm = 0
  for (const axis of AXES) norm += centeredAxes[axis] ** 2
  norm = Math.sqrt(norm)
  const out = {} as Axes
  for (const axis of AXES) out[axis] = norm > 0.0001 ? (centeredAxes[axis] / norm) * radius : 0
  return out
}

const SHAPES = ARCHETYPES.map((archetype) => ({ archetype, v: shape(archetype.v) }))
const NEUTRAL = ARCHETYPES.reduce(
  (best, archetype) => {
    const centeredAxes = centered(archetype.v)
    const norm = AXES.reduce((sum, axis) => sum + centeredAxes[axis] ** 2, 0)
    return norm < best.norm ? { archetype, norm } : best
  },
  { archetype: ARCHETYPES[0], norm: Infinity },
)

export function nearestArchetype(axes: Axes): Archetype {
  const target = shape(axes)
  const targetNorm = AXES.reduce((sum, axis) => sum + target[axis] ** 2, 0)
  if (targetNorm < 9) return NEUTRAL.archetype

  let best = SHAPES[0].archetype
  let bestDistance = Infinity
  for (const { archetype, v } of SHAPES) {
    let distance = 0
    for (const axis of AXES) {
      const diff = v[axis] - target[axis]
      distance += diff * diff
    }
    if (distance < bestDistance) {
      bestDistance = distance
      best = archetype
    }
  }
  return { key: best.key, name: best.name, tagline: best.tagline, blurb: best.blurb }
}

export const AXIS_ORDER: Axis[] = AXES
