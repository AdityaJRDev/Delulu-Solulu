import { motion } from 'framer-motion'

export default function SpeechBubble({
  name,
  text,
  accent = '#6B1B3A',
  sub,
}: {
  name: string
  text: string
  accent?: string
  sub?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <div className="relative mx-4">
        <div
          className="absolute -top-4 left-5 z-10 rounded-xl border px-4 py-1.5 shadow-pill"
          style={{
            background: `linear-gradient(180deg, ${accent}, rgba(0,0,0,0.35))`,
            borderColor: 'rgba(244,210,138,0.55)',
          }}
        >
          <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-cream-100">
            {name}
          </span>
        </div>

        <div
          className="relative rounded-[22px] border-2 bg-cream-100 px-5 pb-5 pt-6 shadow-card [@media(max-height:720px)]:pb-4 [@media(max-height:720px)]:pt-5"
          style={{ borderColor: 'rgba(217,164,65,0.85)' }}
        >
          <div
            className="absolute -top-[9px] left-10 h-4 w-4 rotate-45 border-l-2 border-t-2 bg-cream-100"
            style={{ borderColor: 'rgba(217,164,65,0.85)' }}
          />
          <p className="font-serif text-[19px] leading-[1.42] text-[#2A1A14] text-balance [@media(max-height:720px)]:text-[17px] [@media(max-height:720px)]:leading-[1.34]">
            {text}
          </p>
          {sub && (
            <p className="mt-2 border-t border-[#2A1A14]/10 pt-2 font-sans text-[11.5px] leading-snug text-[#2A1A14]/60 [@media(max-height:720px)]:text-[10.5px]">
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
