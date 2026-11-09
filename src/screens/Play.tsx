import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Backdrop from '../components/Backdrop'
import CastStage, { expressionForTag } from '../components/CastStage'
import TopBar from '../components/TopBar'
import SpeechBubble from '../components/SpeechBubble'
import ChoiceStack from '../components/ChoiceStack'
import ActIntro from '../components/ActIntro'
import EchoOverlay from '../components/EchoOverlay'
import { CAST, DEFAULT_A_LOOK, DEFAULT_B_LOOK, lookByKey } from '../data/cast'
import { SCENES, SCENE_BY_ID, TOTAL } from '../data/scenes'
import { getSession, patchSession } from '../lib/session'
import { alignment, replay } from '../lib/scoring'
import { fillTokens } from '../lib/format'
import { haptics } from '../lib/haptics'
import type { Answer, CastId, Session } from '../lib/types'
import type { Expression } from '../cast/Character'

const ACT_BG: Record<number, string> = {
  1: 'apartment',
  2: 'family_home',
  3: 'apartment',
  4: 'terrace',
}

function speakerName(who: CastId | 'narrator', session: Session) {
  if (who === 'a') return session.a.name
  if (who === 'b') return session.b.name
  if (who === 'narrator') return 'Narrator'
  return CAST[who].name
}

export default function Play() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'scene' | 'echo'>('intro')
  const [picked, setPicked] = useState<number | null>(null)
  const [echo, setEcho] = useState<{ text: string; expression: Expression } | null>(null)
  const [timeLeft, setTimeLeft] = useState(12)
  const [gut, setGut] = useState(false)
  const startedAt = useRef(Date.now())
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let alive = true
    getSession(id).then((found) => {
      if (!alive) return
      setSession(found)
      if (found) {
        const resume = Math.min(found.answers.length, TOTAL)
        setIndex(resume)
        setPhase(resume >= TOTAL ? 'scene' : resume % 25 === 0 ? 'intro' : 'scene')
        if (resume >= TOTAL) navigate(`/report/${found.id}`, { replace: true })
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [id, navigate])

  const scene = SCENES[index]
  const bond = useMemo(() => {
    if (!session) return 50
    const { final } = replay(session.answers, SCENE_BY_ID)
    return alignment(session.a.baseline, final).overall
  }, [session])

  const timed = scene ? scene.focus === 'repair' || scene.focus === 'transparency' : false

  useEffect(() => {
    if (phase !== 'scene' || !timed) return
    setTimeLeft(12)
    setGut(false)
    const started = Date.now()
    const timer = setInterval(() => {
      const remaining = Math.max(0, 12 - (Date.now() - started) / 1000)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        setGut(true)
        clearInterval(timer)
      }
    }, 120)
    return () => clearInterval(timer)
  }, [phase, index, timed])

  useEffect(() => {
    startedAt.current = Date.now()
  }, [index])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-[22px] text-cream-100">That run didn't load.</p>
        <p className="mt-2 max-w-[280px] font-sans text-[13px] leading-relaxed text-cream-200/50">
          The invite may have been created on a device that wasn't connected to the server, or the
          link is incomplete. Ask the creator to resend it from the deployed app.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl border border-gold-400/50 bg-maroon-700 px-5 py-3 font-display text-[14px] text-cream-50"
          >
            Try again
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-2xl border border-cream-200/20 bg-white/[0.04] px-5 py-3 font-display text-[14px] text-cream-200/80"
          >
            Go home
          </button>
        </div>
      </div>
    )
  }

  if (!scene) {
    return (
      <div className="grid flex-1 place-items-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
      </div>
    )
  }

  const aLook = lookByKey(session.a.look, DEFAULT_A_LOOK)
  const bLook = lookByKey(session.b.look, DEFAULT_B_LOOK)
  const name = speakerName(scene.who, session)
  const line = fillTokens(scene.line, session.a.name, session.b.name)
  const sub = scene.sub
    ? scene.sub === '{{HOOK}}'
      ? fillTokens(session.a.hook, session.a.name, session.b.name)
      : fillTokens(scene.sub, session.a.name, session.b.name)
    : undefined
  const introContext =
    scene.act === 1 && index === 0
      ? {
          role: session.b.name,
          partner: session.a.name,
          hook: fillTokens(session.a.hook, session.a.name, session.b.name),
        }
      : undefined

  const saveAnswer = (answer: Answer, nextAnswers: Answer[], complete: boolean) => {
    const next: Session = {
      ...session,
      answers: nextAnswers,
      status: complete ? 'completed' : 'in_progress',
      updatedAt: Date.now(),
    }
    setSession(next)
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      patchSession(session.id, {
        answers: nextAnswers,
        status: complete ? 'completed' : 'in_progress',
      })
    }, 350)
    return answer
  }

  const pick = (choiceIndex: number) => {
    if (phase !== 'scene' || picked !== null) return
    const choice = scene.choices[choiceIndex]
    if (!choice) return
    haptics.choice()
    setPicked(choiceIndex)
    const answer: Answer = {
      sceneId: scene.id,
      choiceIndex,
      ms: Date.now() - startedAt.current,
      at: Date.now(),
    }
    const nextAnswers = [...session.answers, answer]
    saveAnswer(answer, nextAnswers, nextAnswers.length >= TOTAL)
    setEcho({ text: fillTokens(choice.echo, session.a.name, session.b.name), expression: expressionForTag(choice.tag) })
    setPhase('echo')
  }

  const advance = () => {
    const next = index + 1
    setPicked(null)
    setEcho(null)
    if (next >= TOTAL) {
      haptics.complete()
      navigate(`/report/${session.id}`)
      return
    }
    haptics.act()
    setIndex(next)
    setPhase(next % 25 === 0 ? 'intro' : 'scene')
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-ink-950">
      <Backdrop id={scene.bg ?? ACT_BG[scene.act]} act={scene.act} />
      <CastStage
        scene={scene}
        aName={session.a.name}
        bName={session.b.name}
        aLook={aLook}
        bLook={bLook}
        overrideExpression={echo?.expression}
      />

      <div className="relative z-30 flex min-h-0 flex-1 flex-col">
        <TopBar
          act={scene.act}
          chapter={scene.chapter}
          n={index + 1}
          total={TOTAL}
          bond={bond}
          onExit={() => navigate('/')}
        />

        <p className="mt-1.5 shrink-0 px-6 text-center font-sans text-[9.5px] uppercase tracking-[0.22em] text-cream-200/40">
          {scene.title}
        </p>

        <div className="min-h-0 flex-1" />

        <div className="shrink-0 pb-[calc(var(--safe-bottom)+14px)]">
          <SpeechBubble name={name} text={line} sub={sub} />

          {timed && phase === 'scene' && (
            <div className="mx-5 mt-3 flex items-center gap-2 [@media(max-height:720px)]:mt-2">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-[width] duration-150 ${
                    gut ? 'bg-gold-400' : 'bg-cream-200/60'
                  }`}
                  style={{ width: `${(timeLeft / 12) * 100}%` }}
                />
              </div>
              <span className="font-sans text-[8.5px] uppercase tracking-[0.18em] text-cream-200/35">
                {gut ? 'gut answer' : 'gut reaction'}
              </span>
            </div>
          )}

          <div className="mt-3 px-4 [@media(max-height:720px)]:mt-2">
            <ChoiceStack choices={scene.choices} onPick={pick} disabled={phase !== 'scene'} picked={picked} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {phase === 'intro' && (
          <ActIntro
            key={`intro-${scene.act}`}
            act={scene.act}
            context={introContext}
            onBegin={() => setPhase('scene')}
          />
        )}
        {phase === 'echo' && echo && (
          <EchoOverlay key={`echo-${scene.id}`} text={echo.text} onDone={advance} />
        )}
      </AnimatePresence>
    </div>
  )
}
