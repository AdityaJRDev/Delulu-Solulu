import { motion } from 'framer-motion'
import { CHAPTERS, CHAPTER_BLURB } from '../data/kit'
import type { Act } from '../lib/types'

type IntroContext = {
  role: string
  partner: string
  hook: string
}

export default function ActIntro({
  act,
  onBegin,
  context,
}: {
  act: Act
  onBegin: () => void
  context?: IntroContext
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col justify-end overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3A1526_0%,#0B0710_55%,#08060c_100%)] px-6 pb-[calc(var(--safe-bottom)+24px)] pt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-auto mt-auto"
      >
        {context && (
          <div className="mb-5 rounded-2xl border border-cream-200/15 bg-black/25 p-4">
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold-300/85">
              You're playing as {context.role}
            </p>
            <p className="mt-1.5 font-serif text-[13.5px] leading-relaxed text-cream-100/85">{context.hook}</p>
            <p className="mt-1.5 font-sans text-[10px] text-cream-200/40">
              {context.partner} set this dilemma. 100 decisions. No right answers.
            </p>
          </div>
        )}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-maroon-800/60 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          <span className="font-display text-[11px] uppercase tracking-[0.22em] text-cream-200">
            Act {act}
          </span>
        </div>
        <h1 className="font-display text-[44px] leading-[1.02] text-cream-100">{CHAPTERS[act]}</h1>
        <p className="mt-3 max-w-[300px] font-serif text-[15px] leading-relaxed text-cream-200/75">
          {CHAPTER_BLURB[act]}
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBegin}
        className="w-full rounded-2xl border border-gold-400/50 bg-gradient-to-b from-maroon-500 to-maroon-700 px-5 py-4 text-center font-display text-[17px] tracking-wide text-cream-50 shadow-pill"
      >
        Begin Act {act}
      </motion.button>
    </motion.div>
  )
}
