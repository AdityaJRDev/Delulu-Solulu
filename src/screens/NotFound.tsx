import { Link } from 'react-router-dom'
import Character from '../cast/Character'
import { DEFAULT_A_LOOK, DEFAULT_B_LOOK } from '../data/cast'

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-8 text-center">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[55%] items-end justify-center opacity-70">
        <div className="h-full w-[58%] translate-x-6 drop-shadow-[0_18px_50px_rgba(0,0,0,0.7)]">
          <Character look={DEFAULT_A_LOOK} expression="surprised" className="h-full w-full" />
        </div>
        <div className="h-full w-[58%] -translate-x-6 drop-shadow-[0_18px_50px_rgba(0,0,0,0.7)]">
          <Character look={DEFAULT_B_LOOK} expression="hurt" flip className="h-full w-full" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950/95" />

      <div className="relative z-10 -mt-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-400/70">404</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight text-cream-100 text-balance">
          This scene does not exist.
        </h1>
        <p className="mt-2 max-w-[260px] font-serif text-[13.5px] leading-relaxed text-cream-200/55">
          Maybe the link expired, maybe it was never real. Either way, the story starts over here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl border border-gold-400/50 bg-maroon-700 px-6 py-3 font-display text-[14px] text-cream-50 active:scale-95 transition"
        >
          Back to the start
        </Link>
      </div>
    </div>
  )
}
