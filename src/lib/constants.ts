import type { Axis } from './types'

export const AXES: Axis[] = ['empathy', 'transparency', 'autonomy', 'repair', 'finance']

export const WEIGHTS: Record<Axis, number> = {
  empathy: 0.25,
  transparency: 0.2,
  autonomy: 0.2,
  repair: 0.2,
  finance: 0.15,
}
