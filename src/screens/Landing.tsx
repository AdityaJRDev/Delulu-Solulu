import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Link2, Sparkles } from 'lucide-react'
import Backdrop from '../components/Backdrop'
import Character from '../cast/Character'
import { DEFAULT_A_LOOK, DEFAULT_B_LOOK } from '../data/cast'

function parseCode(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const match = trimmed.match(/\/play\/([A-Za-z0-9_-]+)/)
  if (match) return match[1]
  if (/^[A-Za-z0-9_-]{4,}$/.test(trimmed)) return trimmed
  return ''
}

export default function Landing() {
  const navigate = useNavigate()
  const [linkOpen, setLinkOpen] = useState(false)
  const [code, setCode] = useState('')

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <Backdrop id="apartment" act={1} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/10 to-ink-950" />

      <div className="relative z-20 flex flex-1 flex-col px-6 pt-[calc(var(--safe-top)+20px)]">
        <div className="flex items-center justify-between">
          <span className="font-display text-[14px] tracking-[0.3em] text-cream-100/90">DELULU SOLUL</span>
          <span className="rounded-full border border-gold-400/40 bg-black/30 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-cream-200/70">
            beta
          </span>
        </div>

        <div className="mt-7 max-w-[310px]">
          <h1 className="font-display text-[44px] leading-[0.98] text-cream-100 text-balance">
            Send them the fight you keep having.
          </h1>
          <p className="mt-3 font-serif text-[14.5px] leading-relaxed text-cream-200/75">
            They play 100 decisions inside your dilemma. You both get an honest mirror at the end.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[60%]">
        <div className="absolute bottom-0 left-[-10%] h-full w-[64%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <Character look={DEFAULT_A_LOOK} expression="neutral" className="h-full w-full" />
        </div>
        <div className="absolute bottom-0 right-[-12%] h-full w-[68%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <Character look={DEFAULT_B_LOOK} expression="soft" className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-20 bg-gradient-to-t from-ink-950 via-ink-950/92 to-transparent px-5 pb-[calc(var(--safe-bottom)+20px)] pt-14">
        <div className="space-y-2.5">
          <Link
            to="/create"
            className="flex w-full items-center justify-between rounded-2xl border border-gold-400/50 bg-gradient-to-b from-maroon-500 to-maroon-700 px-5 py-4 shadow-pill active:scale-[0.98] transition"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-gold-300" />
              <span className="font-display text-[16px] tracking-wide text-cream-50">Start a run</span>
            </span>
            <ArrowRight className="h-4 w-4 text-cream-100/70" />
          </Link>

          {!linkOpen ? (
            <button
              onClick={() => setLinkOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cream-200/20 bg-white/[0.04] px-5 py-3.5 font-sans text-[13.5px] text-cream-200/85 active:scale-[0.98] transition"
            >
              <Link2 className="h-4 w-4" />
              I have a link
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste invite link or code"
                className="min-w-0 flex-1 rounded-2xl border border-cream-200/20 bg-white/[0.05] px-4 py-3.5 font-sans text-[14px] text-cream-100 outline-none placeholder:text-cream-200/35 focus:border-gold-400/60"
              />
              <button
                onClick={() => {
                  const id = parseCode(code)
                  if (id) navigate(`/play/${id}`)
                }}
                className="rounded-2xl border border-gold-400/40 bg-maroon-700 px-4 font-display text-[14px] text-cream-50 active:scale-95 transition"
              >
                Go
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-cream-200/40">
          100 decisions · 4 acts · ~12 min · free
        </p>
      </div>
    </div>
  )
}
