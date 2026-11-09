import type { Act, Axis, Axes, CastId, Choice, Scene } from '../lib/types'

export const CHAPTERS: Record<Act, string> = {
  1: 'Daily Pressure',
  2: 'Outer Circles',
  3: 'Money & Ego',
  4: 'Crisis & Forever',
}

export const CHAPTER_BLURB: Record<Act, string> = {
  1: 'Deadlines, dishes, and the small stuff that quietly decides everything.',
  2: 'Family, exes, friends — the people who never signed the lease.',
  3: 'Bonuses, secrets, and whose ambition pays for the life.',
  4: 'Relocation, grief, and the question under every other question.',
}

export function C(
  t: string,
  d: Partial<Axes>,
  echo: string,
  tag: Choice['tag'],
  flag?: string,
): Choice {
  return { t, d, echo, tag, flag }
}

export function S(
  n: number,
  title: string,
  who: CastId | 'narrator',
  line: string,
  focus: Axis,
  choices: Choice[],
  sub?: string,
  cast?: [CastId, CastId],
  bg?: string,
): Scene {
  const act = (n <= 25 ? 1 : n <= 50 ? 2 : n <= 75 ? 3 : 4) as Act
  return { id: `s${n}`, n, act, chapter: CHAPTERS[act], title, who, line, focus, choices, sub, cast, bg }
}
