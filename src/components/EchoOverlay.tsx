import { motion } from 'framer-motion'

export default function EchoOverlay({ text, onDone }: { text: string; onDone: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
      className="absolute inset-0 z-40 flex items-end overflow-hidden bg-ink-950/20 px-5 pb-[calc(var(--safe-bottom)+26px)] text-left"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-ink-950" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[60%] h-24 bg-gradient-to-t from-ink-950 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full"
      >
        <div className="mb-3 h-px w-16 bg-gold-400/60" />
        <p className="font-serif text-[22px] leading-[1.35] text-cream-100 text-balance">{text}</p>
        <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.24em] text-cream-200/45">
          Tap to continue
        </p>
      </motion.div>
    </motion.button>
  )
}
