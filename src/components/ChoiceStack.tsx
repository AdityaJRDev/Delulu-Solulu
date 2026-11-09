import { motion } from 'framer-motion'
import type { Choice } from '../lib/types'

const FILLS = [
  'linear-gradient(180deg, #7A2342 0%, #5E1B33 100%)',
  'linear-gradient(180deg, #2E4A7C 0%, #243A63 100%)',
  'linear-gradient(180deg, #187A70 0%, #12615A 100%)',
  'linear-gradient(180deg, #B8862F 0%, #8A6420 100%)',
]

export default function ChoiceStack({
  choices,
  onPick,
  disabled,
  picked,
}: {
  choices: Choice[]
  onPick: (index: number) => void
  disabled?: boolean
  picked?: number | null
}) {
  return (
    <div className="space-y-2.5 [@media(max-height:720px)]:space-y-1.5">
      {choices.map((choice, i) => {
        const brave = choice.tag === 'bold'
        return (
          <motion.button
            key={`${choice.t}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            whileTap={{ scale: 0.975 }}
            disabled={disabled}
            onClick={() => onPick(i)}
            className="group relative w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-left shadow-pill transition disabled:opacity-60 [@media(max-height:720px)]:py-2.5"
            style={{
              background: brave ? FILLS[3] : FILLS[i % 3],
              borderColor: picked === i ? 'rgba(255,236,190,0.95)' : 'rgba(244,210,138,0.42)',
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream-100/60 to-transparent" />
            <span className="font-serif text-[16.5px] leading-snug text-cream-50 [@media(max-height:720px)]:text-[15px] [@media(max-height:720px)]:leading-[1.3]">{choice.t}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
