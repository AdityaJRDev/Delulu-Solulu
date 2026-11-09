import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Character from '../cast/Character'
import type { Expression } from '../cast/Character'
import { CAST, DEFAULT_A_LOOK, DEFAULT_B_LOOK, LOOK_PRESETS } from '../data/cast'
import type { CastId } from '../lib/types'

const EXPRESSIONS: Expression[] = ['neutral', 'soft', 'hurt', 'angry', 'surprised', 'teary']

const SUPPORTING: CastId[] = ['amma', 'appa', 'karthik', 'nisha', 'tanya', 'suresh', 'divya']

function Frame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-700 to-ink-900">
      <div className="h-[132px] w-full">{children}</div>
      {label && (
        <p className="truncate border-t border-white/[0.06] px-2 py-1.5 text-center font-sans text-[9px] text-cream-200/55">
          {label}
        </p>
      )}
    </div>
  )
}

export default function CastGallery() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 px-4 pb-3 pt-[calc(var(--safe-top)+14px)]">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cream-200/80"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="font-display text-[16px] leading-none text-cream-100">Cast lab</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-cream-200/45">
            procedural SVG · no photos
          </p>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-12">
        <h2 className="mb-2.5 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
          The pair
        </h2>
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          <Frame label={`A · ${CAST.a.name}`}>
            <Character look={DEFAULT_A_LOOK} expression="neutral" className="h-full w-full" />
          </Frame>
          <Frame label={`B · ${CAST.b.name}`}>
            <Character look={DEFAULT_B_LOOK} expression="soft" className="h-full w-full" />
          </Frame>
        </div>

        <h2 className="mb-2.5 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
          Expressions
        </h2>
        <div className="mb-6 grid grid-cols-3 gap-2">
          {EXPRESSIONS.map((expression) => (
            <Frame key={expression} label={expression}>
              <Character look={DEFAULT_B_LOOK} expression={expression} className="h-full w-full" />
            </Frame>
          ))}
        </div>

        <h2 className="mb-2.5 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
          Supporting cast
        </h2>
        <div className="mb-6 grid grid-cols-3 gap-2">
          {SUPPORTING.map((id) => (
            <Frame key={id} label={CAST[id].name}>
              <Character look={CAST[id].look} expression="neutral" className="h-full w-full" />
            </Frame>
          ))}
        </div>

        <h2 className="mb-2.5 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
          Player looks
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {LOOK_PRESETS.map((preset) => (
            <Frame key={preset.key} label={preset.label}>
              <Character look={preset.look} expression="neutral" className="h-full w-full" />
            </Frame>
          ))}
        </div>
      </div>
    </div>
  )
}
