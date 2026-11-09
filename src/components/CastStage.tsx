import Character, { type Expression } from '../cast/Character'
import { CAST, memberName, type Look } from '../data/cast'
import type { CastId, Scene } from '../lib/types'

export function expressionForScene(scene: Scene): Expression {
  const text = `${scene.line} ${scene.sub ?? ''}`.toLowerCase()
  if (/cry|tear|hurt|grief|funeral|lost|scared|break|miss you/.test(text)) return 'hurt'
  if (/fight|angry|yell|snap|furious|disrespect|hate|stop\./.test(text)) return 'angry'
  if (/love|proud|happy|smile|wedding|vows|choose|hug/.test(text)) return 'soft'
  if (/seriously|really|what\?|why|how could|alone/.test(text)) return 'surprised'
  return 'neutral'
}

export function expressionForTag(tag?: string): Expression {
  switch (tag) {
    case 'warm':
    case 'honest':
    case 'generous':
      return 'soft'
    case 'blunt':
    case 'selfish':
      return 'angry'
    case 'avoid':
    case 'guarded':
      return 'hurt'
    case 'chaotic':
      return 'surprised'
    default:
      return 'neutral'
  }
}

function resolveCast(scene: Scene): [CastId, CastId] {
  if (scene.cast) return scene.cast
  if (scene.who === 'b') return ['b', 'a']
  if (scene.who === 'narrator') return ['a', 'b']
  if (scene.who === 'a') return ['a', 'b']
  return [scene.who, 'b']
}

type Props = {
  scene: Scene
  aName: string
  bName: string
  aLook: Look
  bLook: Look
  overrideExpression?: Expression
}

export default function CastStage({ scene, aName, bName, aLook, bLook, overrideExpression }: Props) {
  const pair = resolveCast(scene)
  const speakerId: CastId | null = scene.who === 'narrator' ? null : scene.who
  const speakerIndex = speakerId ? (pair[0] === speakerId ? 0 : 1) : 0
  const listenerIndex = speakerIndex === 0 ? 1 : 0

  const lookFor = (id: CastId): Look => {
    if (id === 'a') return aLook
    if (id === 'b') return bLook
    return CAST[id].look
  }

  const baseExpression = expressionForScene(scene)
  const speakerExpression = overrideExpression ?? baseExpression

  const speaker = pair[speakerIndex]
  const listener = pair[listenerIndex]

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute bottom-0"
        style={{
          left: '50%',
          width: '96%',
          height: '96%',
          transform: `translateX(${speakerIndex === 0 ? '-70%' : '-30%'})`,
          filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.55))',
          zIndex: 10,
        }}
      >
        <Character
          look={lookFor(speaker)}
          expression={speakerExpression}
          className="h-full w-full"
        />
      </div>

      <div
        className="absolute"
        style={{
          [listenerIndex === 1 ? 'right' : 'left']: '-12%',
          bottom: '-6%',
          width: '64%',
          height: '72%',
          zIndex: 20,
          opacity: 0.85,
        }}
      >
        <Character
          look={lookFor(listener)}
          expression="neutral"
          dim
          flip={listenerIndex === 0}
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
    </div>
  )
}

export { memberName }
