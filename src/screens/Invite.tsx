import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Copy, Eye, Loader2, MessageCircle, Share2 } from 'lucide-react'
import QRCode from 'qrcode'
import Character from '../cast/Character'
import { DEFAULT_B_LOOK, lookByKey } from '../data/cast'
import { getCachedSession, getSession, inviteUrl } from '../lib/session'
import { fillTokens } from '../lib/format'
import type { Session } from '../lib/types'
import { AXES } from '../lib/constants'
import { AXIS_META } from '../lib/scoring'

export default function Invite() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const isCreator = useMemo(() => Boolean(getCachedSession(id)), [id])
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let alive = true
    getSession(id).then((found) => {
      if (!alive) return
      if (found && !isCreator) {
        navigate(`/play/${found.id}`, { replace: true })
        return
      }
      setSession(found)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [id, isCreator, navigate])

  const url = useMemo(() => (typeof window !== 'undefined' ? inviteUrl(id) : ''), [id])
  const bLook = lookByKey(session?.b.look, DEFAULT_B_LOOK)

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, {
      width: 360,
      margin: 1,
      color: { dark: '#2A1A14', light: '#FBF3E4' },
    })
      .then(setQr)
      .catch(() => setQr(''))
  }, [url])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }

  const message = session
    ? `${session.a.name} sent you a Delulu Solul run. 100 decisions, no right answers. Play it: ${url}`
    : url

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Delulu Solul', text: message, url })
        return
      } catch {
        /* cancelled */
      }
    }
    copy()
  }

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-[22px] text-cream-100">This link has gone cold.</p>
        <p className="mt-2 font-sans text-[13px] text-cream-200/50">
          We could not find that run on this device or server.
        </p>
        <Link
          to="/create"
          className="mt-6 rounded-2xl border border-gold-400/50 bg-maroon-700 px-5 py-3 font-display text-[14px] text-cream-50"
        >
          Create a new run
        </Link>
      </div>
    )
  }

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
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-200/45">
          Invite ready
        </p>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[30px] leading-[1.05] text-cream-100">
              Send this to {session.b.name}.
            </h1>
            <p className="mt-2 font-serif text-[13.5px] leading-relaxed text-cream-200/60">
              No account. No download. They open the link and start living inside your dilemma.
            </p>
          </div>
          <div className="h-[120px] w-[78px] shrink-0 drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <Character look={bLook} expression="soft" className="h-full w-full" />
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="mb-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] text-cream-200/40">
            The hook you set
          </p>
          <p className="font-serif text-[13px] leading-relaxed text-cream-100/90">
            {fillTokens(session.a.hook, session.a.name, session.b.name)}
          </p>
        </div>

        {session.localOnly && (
          <div className="mb-4 flex gap-2.5 rounded-2xl border border-ember-500/40 bg-ember-500/10 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ember-300" />
            <p className="font-sans text-[11px] leading-relaxed text-cream-200/70">
              This run is saved only on this device. The invite link will not open on another phone.
              Check the server connection and create a new run before sending it.
            </p>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-gold-400/25 bg-black/30 p-2 pl-4">
          <span className="min-w-0 flex-1 truncate font-sans text-[12px] text-cream-200/70">{url}</span>
          <button
            onClick={copy}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gold-400/40 bg-maroon-700 px-3 py-2 font-sans text-[11px] text-cream-50 active:scale-95 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-cream-100 p-1.5">
            {qr ? <img src={qr} alt="Invite QR code" className="h-full w-full" /> : null}
          </div>
          <div>
            <p className="font-display text-[13px] text-cream-100">Scan it across the table.</p>
            <p className="mt-1 font-sans text-[11px] leading-relaxed text-cream-200/45">
              Works on any phone camera. Best if you are in the same room and want to watch their face.
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 font-sans text-[9.5px] uppercase tracking-[0.2em] text-cream-200/40">
            Your baseline
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {AXES.map((axis) => (
              <div key={axis} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-1 py-2 text-center">
                <div className="font-display text-[13px] text-cream-100">
                  {Math.round(session.a.baseline[axis])}
                </div>
                <div className="mt-0.5 font-sans text-[8px] uppercase tracking-wide text-cream-200/40">
                  {AXIS_META[axis].tiny}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-600/90 px-5 py-3.5 font-display text-[14.5px] text-white active:scale-[0.98] transition"
          >
            <MessageCircle className="h-4 w-4" />
            Send on WhatsApp
          </a>
          <button
            onClick={share}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gold-400/40 bg-maroon-700 px-5 py-3.5 font-display text-[14.5px] text-cream-50 active:scale-[0.98] transition"
          >
            <Share2 className="h-4 w-4" />
            Share the link
          </button>
          <button
            onClick={() => navigate(`/play/${session.id}`)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-sans text-[12.5px] text-cream-200/75 active:scale-[0.98] transition"
          >
            <Eye className="h-4 w-4" />
            Preview as {session.b.name}
          </button>
          <Link
            to={`/report/${session.id}`}
            className="block pt-1 text-center font-sans text-[11px] uppercase tracking-[0.16em] text-cream-200/35"
          >
            View the audit anytime
          </Link>
        </div>
      </div>
    </div>
  )
}
