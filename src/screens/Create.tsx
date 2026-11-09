import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import Character from '../cast/Character'
import { DEFAULT_A_LOOK, DEFAULT_B_LOOK, LOOK_PRESETS, lookByKey } from '../data/cast'
import { HOOK_PRESETS, PRIORITY_CARDS, STYLE_OPTIONS } from '../data/hooks'
import { AXIS_META, clamp, emptyAxes } from '../lib/scoring'
import { AXES } from '../lib/constants'
import type { Axes } from '../lib/types'
import { createSession } from '../lib/session'
import { fillTokens } from '../lib/format'

function LookStrip({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (key: string) => void
  label: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-200/50">
          {label}
        </span>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {LOOK_PRESETS.map((preset) => {
          const active = preset.key === value
          return (
            <button
              key={preset.key}
              onClick={() => onChange(preset.key)}
              className={`relative shrink-0 overflow-hidden rounded-xl border transition ${
                active ? 'border-gold-400' : 'border-white/10'
              }`}
              style={{ width: 62 }}
            >
              <div className="h-[76px] w-full bg-gradient-to-b from-ink-700 to-ink-900">
                <Character look={preset.look} expression="neutral" className="h-full w-full" />
              </div>
              <div className="bg-black/40 px-1 py-1">
                <span className="block truncate text-center font-sans text-[8.5px] text-cream-200/70">
                  {preset.label}
                </span>
              </div>
              {active && (
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-gold-500">
                  <Check className="h-2.5 w-2.5 text-ink-950" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Create() {
  const navigate = useNavigate()
  const [aName, setAName] = useState('Arjun')
  const [bName, setBName] = useState('Meera')
  const [aLookKey, setALookKey] = useState('arjun')
  const [bLookKey, setBLookKey] = useState('meera')
  const [hookId, setHookId] = useState(HOOK_PRESETS[0].id)
  const [hook, setHook] = useState(HOOK_PRESETS[0].text)
  const [styleKey, setStyleKey] = useState(STYLE_OPTIONS[0].key)
  const [priorities, setPriorities] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const aLook = lookByKey(aLookKey, DEFAULT_A_LOOK)
  const bLook = lookByKey(bLookKey, DEFAULT_B_LOOK)

  const baseline = useMemo<Axes>(() => {
    const axes = emptyAxes(50)
    const style = STYLE_OPTIONS.find((option) => option.key === styleKey)
    if (style) {
      for (const axis of AXES) {
        axes[axis] += style.d[axis] ?? 0
      }
    }
    for (const key of priorities) {
      const card = PRIORITY_CARDS.find((c) => c.key === key)
      if (card) axes[card.axis] += 8
    }
    for (const axis of AXES) axes[axis] = clamp(axes[axis], 20, 92)
    return axes
  }, [styleKey, priorities])

  const togglePriority = (key: string) => {
    setPriorities((current) => {
      if (current.includes(key)) return current.filter((k) => k !== key)
      if (current.length >= 3) return current
      return [...current, key]
    })
  }

  const ready = aName.trim() && bName.trim() && hook.trim() && priorities.length === 3

  const submit = async () => {
    if (!ready || busy) return
    setBusy(true)
    setError('')
    try {
      const session = await createSession({
        a: {
          name: aName.trim(),
          hook: fillTokens(hook.trim(), aName.trim(), bName.trim()),
          styleKey,
          priorities,
          baseline,
          look: aLookKey,
        },
        b: { name: bName.trim(), look: bLookKey },
      })
      navigate(`/invite/${session.id}`)
    } catch {
      setError('Could not create the run. Try again.')
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[0.06] bg-ink-950/85 px-4 pb-3 pt-[calc(var(--safe-top)+14px)] backdrop-blur-md">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cream-200/80"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="font-display text-[16px] leading-none text-cream-100">Create a run</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-cream-200/45">
            60 seconds · you set the scene
          </p>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-40 pt-5">
        <section className="mb-7">
          <p className="mb-3 font-display text-[13px] uppercase tracking-[0.18em] text-gold-400/90">
            01 · The two of you
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.16em] text-cream-200/45">
                Your name
              </span>
              <input
                value={aName}
                onChange={(e) => setAName(e.target.value.slice(0, 20))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 font-serif text-[15px] text-cream-100 outline-none focus:border-gold-400/60"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.16em] text-cream-200/45">
                Their name
              </span>
              <input
                value={bName}
                onChange={(e) => setBName(e.target.value.slice(0, 20))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 font-serif text-[15px] text-cream-100 outline-none focus:border-gold-400/60"
              />
            </label>
          </div>
          <div className="mt-4 space-y-4">
            <LookStrip value={aLookKey} onChange={setALookKey} label="Your look" />
            <LookStrip value={bLookKey} onChange={setBLookKey} label="Their look" />
          </div>
        </section>

        <section className="mb-7">
          <p className="mb-1 font-display text-[13px] uppercase tracking-[0.18em] text-gold-400/90">
            02 · The situation
          </p>
          <p className="mb-3 font-sans text-[11.5px] leading-relaxed text-cream-200/50">
            The recurring thing you keep fighting about. They will live inside it.
          </p>
          <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {HOOK_PRESETS.map((preset) => {
              const active = hookId === preset.id
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setHookId(preset.id)
                    setHook(preset.text)
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 font-sans text-[11px] transition ${
                    active
                      ? 'border-gold-400/70 bg-gold-500/15 text-cream-100'
                      : 'border-white/10 bg-white/[0.03] text-cream-200/60'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
          <textarea
            value={hook}
            onChange={(e) => {
              setHook(e.target.value.slice(0, 400))
              setHookId('custom')
            }}
            rows={4}
            placeholder="Describe the dilemma. Use {A} and {B} for your names."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-serif text-[14.5px] leading-relaxed text-cream-100 outline-none placeholder:text-cream-200/30 focus:border-gold-400/60"
          />
          <p className="mt-2 font-sans text-[10.5px] text-cream-200/40">
            Preview: {fillTokens(hook || '…', aName || 'A', bName || 'B')}
          </p>
        </section>

        <section className="mb-7">
          <p className="mb-1 font-display text-[13px] uppercase tracking-[0.18em] text-gold-400/90">
            03 · How you would handle it
          </p>
          <p className="mb-3 font-sans text-[11.5px] leading-relaxed text-cream-200/50">
            This becomes the baseline they are measured against.
          </p>
          <div className="space-y-2">
            {STYLE_OPTIONS.map((option) => {
              const active = styleKey === option.key
              return (
                <button
                  key={option.key}
                  onClick={() => setStyleKey(option.key)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-gold-400/70 bg-gold-500/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-[14px] text-cream-100">{option.label}</span>
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                        active ? 'border-gold-400 bg-gold-500' : 'border-white/25'
                      }`}
                    >
                      {active && <Check className="h-2.5 w-2.5 text-ink-950" strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[11px] leading-snug text-cream-200/45">
                    {option.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-7">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="font-display text-[13px] uppercase tracking-[0.18em] text-gold-400/90">
                04 · Non-negotiables
              </p>
              <p className="mt-1 font-sans text-[11.5px] text-cream-200/50">Pick exactly three.</p>
            </div>
            <span
              className={`font-display text-[13px] ${
                priorities.length === 3 ? 'text-gold-400' : 'text-cream-200/40'
              }`}
            >
              {priorities.length}/3
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_CARDS.map((card) => {
              const active = priorities.includes(card.key)
              return (
                <button
                  key={card.key}
                  onClick={() => togglePriority(card.key)}
                  className={`rounded-full border px-3 py-2 font-sans text-[11.5px] transition ${
                    active
                      ? 'border-gold-400/70 bg-gold-500/15 text-cream-100'
                      : 'border-white/10 bg-white/[0.03] text-cream-200/60'
                  }`}
                >
                  {card.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-4">
          <p className="mb-3 font-display text-[13px] uppercase tracking-[0.18em] text-gold-400/90">
            05 · Your baseline
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            {AXES.map((axis) => (
              <div key={axis} className="mb-2.5 last:mb-0">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-sans text-[10.5px] uppercase tracking-[0.12em] text-cream-200/55">
                    {AXIS_META[axis].short}
                  </span>
                  <span className="font-display text-[11px] text-cream-200/70">
                    {Math.round(baseline[axis])}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${baseline[axis]}%`,
                      background: AXIS_META[axis].color,
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="mt-3 border-t border-white/[0.06] pt-2.5 font-sans text-[10.5px] leading-relaxed text-cream-200/40">
              Not a score. Just where you start, so the reveal has something honest to compare.
            </p>
          </div>
        </section>

        {error && <p className="mb-3 text-center font-sans text-[12px] text-ember-400">{error}</p>}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-ink-950/92 px-5 pb-[calc(var(--safe-bottom)+16px)] pt-3 backdrop-blur-md">
        <button
          onClick={submit}
          disabled={!ready || busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gold-400/50 bg-gradient-to-b from-maroon-500 to-maroon-700 px-5 py-4 font-display text-[16px] tracking-wide text-cream-50 shadow-pill transition disabled:opacity-40 active:scale-[0.98]"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? 'Creating…' : 'Create the invite link'}
        </button>
        {!ready && (
          <p className="mt-2 text-center font-sans text-[10px] uppercase tracking-[0.16em] text-cream-200/35">
            Names, a situation, and three non-negotiables
          </p>
        )}
      </div>
    </div>
  )
}
