export type Axis = 'empathy' | 'transparency' | 'autonomy' | 'repair' | 'finance'

export type Axes = Record<Axis, number>

export type Act = 1 | 2 | 3 | 4

export type Tag =
  | 'warm'
  | 'honest'
  | 'avoid'
  | 'blunt'
  | 'bold'
  | 'selfish'
  | 'calm'
  | 'chaotic'
  | 'generous'
  | 'guarded'

export type CastId =
  | 'a'
  | 'b'
  | 'amma'
  | 'appa'
  | 'karthik'
  | 'nisha'
  | 'tanya'
  | 'suresh'
  | 'divya'

export type Choice = {
  t: string
  d: Partial<Axes>
  echo: string
  tag: Tag
  flag?: string
}

export type Scene = {
  id: string
  n: number
  act: Act
  chapter: string
  title: string
  who: CastId | 'narrator'
  line: string
  sub?: string
  focus: Axis
  choices: Choice[]
  cast?: [CastId, CastId]
  bg?: string
}

export type Answer = {
  sceneId: string
  choiceIndex: number
  ms: number
  at: number
}

export type PartnerA = {
  name: string
  hook: string
  styleKey: string
  priorities: string[]
  baseline: Axes
  look?: string
}

export type Session = {
  id: string
  createdAt: number
  updatedAt: number
  a: PartnerA
  b: { name: string; look?: string }
  answers: Answer[]
  status: 'waiting_b' | 'in_progress' | 'completed'
  localOnly?: boolean
}

export type Crossroad = {
  scene: Scene
  choice: Choice
  gap: number
  axis: Axis
  aValue: number
  bValue: number
  expected: string
  chose: string
  prompt: string
}

export type Archetype = {
  key: string
  name: string
  tagline: string
  blurb: string
}

export type Report = {
  overall: number
  byAxis: Record<Axis, number>
  bFinal: Axes
  aBaseline: Axes
  archetype: Archetype
  crossroads: Crossroad[]
  strengths: Axis[]
  growth: Axis[]
  repairPrompts: string[]
  actScores: { act: Act; score: number; answered: number }[]
  answered: number
  avgSeconds: number
  verdict: string
}
