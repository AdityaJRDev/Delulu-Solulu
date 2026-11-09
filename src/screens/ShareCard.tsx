import { forwardRef } from 'react'
import { RadarChart, ResonanceRing } from '../components/Charts'
import type { Report } from '../lib/types'

const ShareCard = forwardRef<HTMLDivElement, { report: Report; aName: string; bName: string; url: string }>(
  function ShareCard({ report, aName, bName, url }, ref) {
    return (
      <div
        ref={ref}
        style={{ width: 320, height: 568 }}
        className="relative overflow-hidden rounded-[26px] border border-gold-400/40"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,#5E1B33_0%,#2A1020_45%,#0B0710_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_85%_90%,rgba(217,164,65,0.22),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative flex h-full flex-col px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-[9px] tracking-[0.3em] text-cream-200/70">DELULU SOLUL</span>
            <span className="rounded-full border border-gold-400/40 px-2 py-0.5 font-sans text-[7px] uppercase tracking-[0.18em] text-gold-300">
              alignment audit
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <div>
              <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-cream-200/45">
                overall resonance
              </p>
              <p className="mt-1 font-display text-[13px] text-cream-100">{report.archetype.name}</p>
              <p className="mt-0.5 max-w-[150px] font-serif text-[9px] leading-snug text-cream-200/55">
                {report.archetype.tagline}
              </p>
            </div>
            <ResonanceRing value={report.overall} size={104} label="resonance" />
          </div>

          <div className="flex flex-1 items-center justify-center py-2">
            <RadarChart a={report.aBaseline} b={report.bFinal} size={220} showLabels />
          </div>

          <div className="mt-auto">
            <div className="mb-2 flex items-center justify-center gap-2 font-display text-[15px] text-cream-100">
              <span>{aName}</span>
              <span className="text-gold-400">×</span>
              <span>{bName}</span>
            </div>
            <p className="text-center font-serif text-[9px] italic leading-snug text-cream-200/55">
              &ldquo;{report.verdict}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
              <span className="font-sans text-[7px] uppercase tracking-[0.16em] text-cream-200/35">
                100 decisions · no right answers
              </span>
              <span className="max-w-[150px] truncate font-sans text-[7px] text-gold-300/70">{url}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default ShareCard
