import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Loader2,
  MessageSquareQuote,
  Share2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { RadarChart, ResonanceRing } from '../components/Charts'
import ShareCard from './ShareCard'
import { DEFAULT_B_LOOK, lookByKey } from '../data/cast'
import { SCENE_BY_ID, TOTAL } from '../data/scenes'
import { getSession, inviteUrl, reportUrl } from '../lib/session'
import { AXIS_META, buildReport } from '../lib/scoring'
import { AXES } from '../lib/constants'
import { bandLabel, fillTokens } from '../lib/format'
import type { Session } from '../lib/types'
import Character from '../cast/Character'

export default function Report() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<'link' | 'invite' | null>(null)
  const [busy, setBusy] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    getSession(id).then((found) => {
      if (!alive) return
      setSession(found)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [id])

  const report = useMemo(() => (session ? buildReport(session, SCENE_BY_ID) : null), [session])

  const copy = async (value: string, kind: 'link' | 'invite') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* ignore */
    }
  }

  const share = async () => {
    if (!session || !report) return
    const url = reportUrl(session.id)
    const text = `${session.a.name} × ${session.b.name} scored ${report.overall}% resonance on Delulu Solul. ${report.archetype.name}.`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Delulu Solul — Alignment Audit', text, url })
        return
      } catch {
        /* cancelled */
      }
    }
    copy(url, 'link')
  }

  const downloadCard = async () => {
    if (!cardRef.current || !session || !report) return
    setBusy(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3.375,
        cacheBust: true,
        backgroundColor: '#0B0710',
      })
      const anchor = document.createElement('a')
      anchor.href = dataUrl
      anchor.download = `delulu-solul-${session.id}.png`
      anchor.click()
    } catch {
      /* ignore */
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
      </div>
    )
  }

  if (!session || !report) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-[22px] text-cream-100">No audit here.</p>
        <p className="mt-2 font-sans text-[13px] text-cream-200/50">
          This run lives on the device that created it, or the link has expired.
        </p>
        <Link
          to="/create"
          className="mt-6 rounded-2xl border border-gold-400/50 bg-maroon-700 px-5 py-3 font-display text-[14px] text-cream-50"
        >
          Start a run
        </Link>
      </div>
    )
  }

  const bLook = lookByKey(session.b.look, DEFAULT_B_LOOK)

  if (report.answered === 0) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col">
        <header className="flex items-center gap-3 px-4 pb-2 pt-[calc(var(--safe-top)+14px)]">
          <Link
            to="/"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cream-200/80"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-200/45">Audit</p>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-7 pb-10 text-center">
          <div className="h-[150px] w-[100px] drop-shadow-[0_14px_40px_rgba(0,0,0,0.7)]">
            <Character look={bLook} expression="soft" className="h-full w-full" />
          </div>
          <h1 className="mt-5 font-display text-[26px] leading-tight text-cream-100">
            {session.b.name} has not played yet.
          </h1>
          <p className="mt-2 max-w-[280px] font-serif text-[13.5px] leading-relaxed text-cream-200/55">
            The audit is built from their 100 decisions. Send the link and come back when they are done.
          </p>
          <button
            onClick={() => copy(inviteUrl(session.id), 'invite')}
            className="mt-6 flex items-center gap-2 rounded-2xl border border-gold-400/50 bg-maroon-700 px-5 py-3 font-display text-[14px] text-cream-50 active:scale-95 transition"
          >
            {copied === 'invite' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'invite' ? 'Invite copied' : 'Copy invite link'}
          </button>
          <button
            onClick={() => navigate(`/play/${session.id}`)}
            className="mt-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-sans text-[12.5px] text-cream-200/70"
          >
            Preview as {session.b.name}
          </button>
        </div>
      </div>
    )
  }

  const partial = report.answered < TOTAL

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.06] bg-ink-950/85 px-4 pb-3 pt-[calc(var(--safe-top)+14px)] backdrop-blur-md">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cream-200/80"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] leading-none text-cream-100">Alignment audit</p>
          <p className="mt-1 truncate font-sans text-[10px] uppercase tracking-[0.16em] text-cream-200/45">
            {session.a.name} × {session.b.name}
          </p>
        </div>
        <button
          onClick={share}
          className="grid h-9 w-9 place-items-center rounded-full border border-gold-400/40 bg-maroon-700/80 text-cream-100"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-12 pt-4">
        {partial && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gold-400/30 bg-gold-500/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-gold-300" />
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[11.5px] text-cream-100/85">
                Snapshot · {report.answered} of {TOTAL} decisions
              </p>
              <p className="font-sans text-[10.5px] text-cream-200/45">
                Finish the run for the full read.
              </p>
            </div>
            <Link
              to={`/play/${session.id}`}
              className="shrink-0 rounded-xl border border-gold-400/40 bg-maroon-700 px-3 py-2 font-sans text-[11px] text-cream-50"
            >
              Continue
            </Link>
          </div>
        )}

        <section className="mb-4 overflow-hidden rounded-3xl border border-gold-400/25 bg-gradient-to-b from-maroon-800/70 to-ink-900/90 p-5">
          <p className="font-sans text-[9.5px] uppercase tracking-[0.24em] text-gold-300/80">
            The read
          </p>
          <div className="mt-3 flex items-center gap-4">
            <ResonanceRing value={report.overall} size={124} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[19px] leading-tight text-cream-100">
                {bandLabel(report.overall)}
              </p>
              <p className="mt-1.5 font-serif text-[12.5px] leading-relaxed text-cream-200/65">
                {report.verdict}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold-300" />
              <span className="font-sans text-[9.5px] uppercase tracking-[0.12em] text-cream-200/50">
                you
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ember-500" />
              <span className="font-sans text-[9.5px] uppercase tracking-[0.12em] text-cream-200/50">
                {session.b.name}
              </span>
            </div>
            <span className="ml-auto font-sans text-[9.5px] text-cream-200/35">
              avg {report.avgSeconds}s / choice
            </span>
          </div>
        </section>

        <section className="mb-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex justify-center">
            <RadarChart a={report.aBaseline} b={report.bFinal} size={300} showLabels />
          </div>
          <div className="mt-1 grid grid-cols-5 gap-1">
            {AXES.map((axis) => (
              <div key={axis} className="text-center">
                <p className="font-display text-[12.5px] text-cream-100">{report.byAxis[axis]}%</p>
                <p className="font-sans text-[7.5px] uppercase tracking-wide text-cream-200/35">
                  {AXIS_META[axis].tiny}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="mb-2.5 px-1 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
            Axis by axis
          </h2>
          <div className="space-y-2">
            {[...AXES]
              .sort((x, y) => report.byAxis[y] - report.byAxis[x])
              .map((axis) => {
                const meta = AXIS_META[axis]
                const value = report.byAxis[axis]
                return (
                  <div key={axis} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-[13.5px] text-cream-100">{meta.label}</span>
                      <span className="font-display text-[13px] text-cream-100/90">{value}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/40">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${value}%`, background: meta.color }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="font-sans text-[9.5px] text-cream-200/35">
                        you {Math.round(report.aBaseline[axis])} · them {Math.round(report.bFinal[axis])}
                      </span>
                      <span className="max-w-[62%] truncate text-right font-sans text-[9.5px] text-cream-200/45">
                        {value >= 70 ? meta.high : meta.low}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>

        <section className="mb-4 overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-ink-800 to-ink-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-300/70">
                their archetype
              </p>
              <h2 className="mt-1.5 font-display text-[24px] leading-tight text-cream-100">
                {report.archetype.name}
              </h2>
              <p className="mt-1 font-serif text-[12px] italic text-cream-200/55">
                {report.archetype.tagline}
              </p>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-gold-400/70" />
          </div>
          <p className="mt-3 font-serif text-[13px] leading-relaxed text-cream-200/70">
            {report.archetype.blurb}
          </p>
        </section>

        <section className="mb-4">
          <div className="mb-2.5 flex items-center gap-2 px-1">
            <MessageSquareQuote className="h-3.5 w-3.5 text-gold-400" />
            <h2 className="font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
              Moments that decided it
            </h2>
          </div>
          <div className="space-y-2.5">
            {report.crossroads.map((cross) => (
              <div
                key={cross.scene.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-2.5">
                  <span className="font-sans text-[9.5px] uppercase tracking-[0.16em] text-cream-200/40">
                    Scene {cross.scene.n} · {cross.scene.title}
                  </span>
                  <span className="shrink-0 rounded-full border border-ember-500/30 bg-ember-500/10 px-2 py-0.5 font-sans text-[9px] text-ember-300">
                    {cross.gap} pt gap
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="font-serif text-[13px] leading-relaxed text-cream-100/85">
                    &ldquo;{fillTokens(cross.scene.line, session.a.name, session.b.name)}&rdquo;
                  </p>
                  <p className="mt-2.5 font-sans text-[10px] uppercase tracking-[0.14em] text-cream-200/35">
                    they chose
                  </p>
                  <p className="font-serif text-[13px] text-cream-100">
                    {fillTokens(cross.chose, session.a.name, session.b.name)}
                  </p>
                  <p className="mt-2 font-sans text-[10.5px] leading-relaxed text-cream-200/45">
                    You leaned toward {cross.expected}. They landed at {cross.bValue}, you at {cross.aValue}.
                  </p>
                </div>
                <div className="border-t border-gold-400/20 bg-gold-500/[0.07] px-4 py-3">
                  <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-gold-300/70">
                    try saying
                  </p>
                  <p className="mt-1 font-serif text-[12.5px] leading-relaxed text-cream-100/85">
                    {cross.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300/80" />
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-emerald-200/60">
                strengths
              </p>
            </div>
            {report.strengths.map((axis) => (
              <p key={axis} className="font-serif text-[12.5px] leading-relaxed text-cream-100/85">
                {AXIS_META[axis].short}
              </p>
            ))}
          </div>
          <div className="rounded-2xl border border-ember-500/20 bg-ember-500/[0.06] p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-ember-300/80" />
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-ember-200/60">
                needs airtime
              </p>
            </div>
            {report.growth.map((axis) => (
              <p key={axis} className="font-serif text-[12.5px] leading-relaxed text-cream-100/85">
                {AXIS_META[axis].short}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.2em] text-cream-200/40">
            act by act
          </p>
          <div className="space-y-2.5">
            {report.actScores.map((row) => (
              <div key={row.act} className="flex items-center gap-3">
                <span className="w-12 shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] text-cream-200/45">
                  Act {row.act}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-ember-500"
                    style={{ width: `${row.answered ? row.score : 0}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-display text-[11px] text-cream-100/80">
                  {row.answered ? `${row.score}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="mb-2.5 px-1 font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
            Take this into a conversation
          </h2>
          <div className="space-y-2">
            {report.repairPrompts.map((prompt, i) => (
              <div key={i} className="rounded-2xl border border-gold-400/20 bg-gold-500/[0.05] px-4 py-3">
                <p className="font-serif text-[12.5px] leading-relaxed text-cream-100/85">{prompt}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <h2 className="font-display text-[12px] uppercase tracking-[0.2em] text-gold-400/90">
              Share the result
            </h2>
            <span className="font-sans text-[9px] uppercase tracking-[0.14em] text-cream-200/30">
              1080 × 1920
            </span>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.02] px-4 py-5">
            <ShareCard
              ref={cardRef}
              report={report}
              aName={session.a.name}
              bName={session.b.name}
              url={reportUrl(session.id).replace(/^https?:\/\//, '')}
            />
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              <button
                onClick={downloadCard}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gold-400/50 bg-maroon-700 px-4 py-3 font-display text-[13px] text-cream-50 disabled:opacity-50 active:scale-[0.98] transition"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {busy ? 'Making' : 'Download'}
              </button>
              <button
                onClick={share}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-display text-[13px] text-cream-100 active:scale-[0.98] transition"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
            <button
              onClick={() => copy(reportUrl(session.id), 'link')}
              className="mt-2 flex items-center gap-1.5 font-sans text-[10.5px] text-cream-200/40"
            >
              {copied === 'link' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied === 'link' ? 'Link copied' : 'Copy report link'}
            </button>
          </div>
        </section>

        <div className="space-y-2.5 pb-2">
          <Link
            to="/create"
            className="flex w-full items-center justify-between rounded-2xl border border-gold-400/50 bg-gradient-to-b from-maroon-500 to-maroon-700 px-5 py-4 shadow-pill active:scale-[0.98] transition"
          >
            <span className="font-display text-[14.5px] text-cream-50">Run it on someone else</span>
            <ArrowRight className="h-4 w-4 text-cream-100/70" />
          </Link>
          <button
            onClick={() => navigate(`/play/${session.id}`)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-sans text-[12px] text-cream-200/60"
          >
            Replay as {session.b.name}
          </button>
        </div>
      </div>
    </div>
  )
}
