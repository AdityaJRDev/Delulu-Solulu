import type { Axis } from '../lib/types'

export type HookPreset = { id: string; label: string; text: string }

export const HOOK_PRESETS: HookPreset[] = [
  {
    id: 'deadline',
    label: 'The Friday deadline',
    text: '{B} gets pulled into an urgent client deadline on Friday night. Dinner was booked weeks ago.',
  },
  {
    id: 'family',
    label: 'The family summons',
    text: "{B}'s mother expects you both at a cousin's dinner — the same night as {A}'s promotion party.",
  },
  {
    id: 'ex',
    label: 'The ex appears',
    text: "{B}'s ex sends a casual \"hey\" and wants to catch up. Alone. \"It's nothing,\" {B} says.",
  },
  {
    id: 'spend',
    label: 'The secret spend',
    text: '{B} buys something expensive without mentioning it. The statement arrives before the confession.',
  },
  {
    id: 'move',
    label: 'The far-away offer',
    text: '{B} gets a dream offer in another city, six months after you signed a lease together.',
  },
  {
    id: 'custom',
    label: 'Write your own',
    text: '',
  },
]

export type StyleOption = {
  key: string
  label: string
  desc: string
  d: Partial<Record<Axis, number>>
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    key: 'transparent',
    label: 'Tell me the second you know',
    desc: 'Call, explain the bottleneck, reschedule together.',
    d: { transparency: 14, empathy: 8, repair: 6 },
  },
  {
    key: 'focus',
    label: 'Disappear, finish it, make it up later',
    desc: 'Hyper-focus now. Apologise properly when it is done.',
    d: { autonomy: 14, transparency: -10, finance: 4 },
  },
  {
    key: 'split',
    label: 'Split attention and hope it holds',
    desc: 'Multitask, keep everyone half-happy, survive the night.',
    d: { empathy: 6, transparency: -2, repair: -6 },
  },
]

export type PriorityCard = {
  key: string
  label: string
  axis: Axis
}

export const PRIORITY_CARDS: PriorityCard[] = [
  { key: 'hear', label: 'Hear me before you fix me', axis: 'empathy' },
  { key: 'early', label: 'Tell me early, even when it is ugly', axis: 'transparency' },
  { key: 'space', label: 'Keep your own life, but choose us', axis: 'autonomy' },
  { key: 'repair', label: 'Come back fast after a fight', axis: 'repair' },
  { key: 'money', label: 'No secrets about money', axis: 'finance' },
  { key: 'back', label: 'Back me in front of your family', axis: 'autonomy' },
  { key: 'ask', label: 'Ask before you decide for us', axis: 'autonomy' },
  { key: 'score', label: 'Never keep score', axis: 'repair' },
  { key: 'boring', label: 'Show up on the boring days', axis: 'empathy' },
  { key: 'time', label: 'Protect our time like a meeting', axis: 'transparency' },
]

export const LOOK_PRESETS = [
  { key: 'warm', label: 'Warm & soft', tone: 2, hair: 'wavy', outfit: 'kurta' },
  { key: 'bold', label: 'Bold & bright', tone: 3, hair: 'curly', outfit: 'saree' },
  { key: 'cool', label: 'Cool & sharp', tone: 1, hair: 'straight', outfit: 'shirt' },
  { key: 'earth', label: 'Earthy & calm', tone: 4, hair: 'bun', outfit: 'tee' },
]
