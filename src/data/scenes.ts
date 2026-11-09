import type { Act, Scene } from '../lib/types'
import { act1 } from './act1'
import { act2 } from './act2'
import { act3 } from './act3'
import { act4 } from './act4'

export const SCENES: Scene[] = [...act1, ...act2, ...act3, ...act4].sort((a, b) => a.n - b.n)

export const SCENE_BY_ID: Record<string, Scene> = Object.fromEntries(
  SCENES.map((scene) => [scene.id, scene]),
)

export const TOTAL = SCENES.length

export const ACTS: Act[] = [1, 2, 3, 4]

export function scenesForAct(act: Act): Scene[] {
  return SCENES.filter((scene) => scene.act === act)
}

export function sceneAt(n: number): Scene | undefined {
  return SCENES.find((scene) => scene.n === n)
}

export function actOf(n: number): Act {
  return n <= 25 ? 1 : n <= 50 ? 2 : n <= 75 ? 3 : 4
}
