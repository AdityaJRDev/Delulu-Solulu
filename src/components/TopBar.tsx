import { Heart, X } from 'lucide-react'

export default function TopBar({
  act,
  chapter,
  n,
  total,
  bond,
  onExit,
}: {
  act: number
  chapter: string
  n: number
  total: number
  bond: number
  onExit?: () => void
}) {
  const progress = Math.max(0, Math.min(100, (n / total) * 100))
  return (
    <div className="relative z-30 px-3 pt-[calc(var(--safe-top)+10px)]">
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-gold-400/50 bg-maroon-800/85 px-3 py-1.5 shadow-pill backdrop-blur-sm">
          <span className="truncate font-display text-[11px] tracking-wide text-cream-100">
            Act {act} — {chapter}
          </span>
        </div>

        <div className="flex-1">
          <div className="text-center font-display text-[13px] leading-none text-cream-100">
            {n} / {total}
          </div>
          <div className="mx-auto mt-1.5 h-[5px] w-full max-w-[150px] overflow-hidden rounded-full border border-white/10 bg-black/45">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-cream-100 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
          <Heart className="h-3.5 w-3.5 fill-ember-500 text-ember-500" />
          <span className="font-display text-[12px] text-cream-100">{Math.round(bond)}%</span>
        </div>

        {onExit && (
          <button
            onClick={onExit}
            aria-label="Exit"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 text-cream-200/70"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
