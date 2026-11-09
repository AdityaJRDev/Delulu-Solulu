import { AXES } from '../lib/constants'
import type { Axes, Axis } from '../lib/types'

const R = 100
const CX = 170
const CY = 130

const RADAR_LABEL: Record<Axis, string> = {
  empathy: 'EMPATHY',
  transparency: 'STRESS',
  autonomy: 'AUTO',
  repair: 'REPAIR',
  finance: 'MONEY',
}

function pt(index: number, radius: number) {
  const angle = ((-90 + index * 72) * Math.PI) / 180
  return [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius] as const
}

function polygon(values: number[]) {
  return values.map((value, i) => pt(i, (value / 100) * R).join(',')).join(' ')
}

export function RadarChart({
  a,
  b,
  showLabels = true,
  compare = true,
  size = 260,
}: {
  a: Axes
  b: Axes
  showLabels?: boolean
  compare?: boolean
  size?: number
}) {
  const aValues = AXES.map((axis) => a[axis])
  const bValues = AXES.map((axis) => b[axis])

  return (
    <svg viewBox="0 0 340 260" width={size} height={(size * 260) / 340} role="img" aria-label="Alignment radar">
      <defs>
        <radialGradient id="radar-fill">
          <stop offset="0%" stopColor="#E9BC63" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#E23A5E" stopOpacity="0.28" />
        </radialGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={polygon(AXES.map(() => ring * 100))}
          fill="none"
          stroke="rgba(251,243,228,0.14)"
          strokeWidth="1"
        />
      ))}

      {AXES.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(251,243,228,0.12)" strokeWidth="1" />
      })}

      {compare && (
        <polygon
          points={polygon(aValues)}
          fill="none"
          stroke="#F4D28A"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          opacity="0.85"
        />
      )}

      <polygon points={polygon(bValues)} fill="url(#radar-fill)" stroke="#E23A5E" strokeWidth="2" />

      {AXES.map((axis, i) => {
        const [x, y] = pt(i, (bValues[i] / 100) * R)
        return <circle key={axis} cx={x} cy={y} r="3" fill="#FFF7EC" stroke="#E23A5E" strokeWidth="1.5" />
      })}

      {showLabels &&
        AXES.map((axis, i) => {
          const [x, y] = pt(i, R + 18)
          const cos = Math.cos(((-90 + i * 72) * Math.PI) / 180)
          const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'
          return (
            <text
              key={axis}
              x={x}
              y={y + 4}
              textAnchor={anchor}
              fill="rgba(251,243,228,0.7)"
              fontSize="8.5"
              fontFamily="Manrope, sans-serif"
              letterSpacing="0.06em"
            >
              {RADAR_LABEL[axis]}
            </text>
          )
        })}
    </svg>
  )
}

export function ResonanceRing({
  value,
  size = 168,
  label = 'resonance',
}: {
  value: number
  size?: number
  label?: string
}) {
  const stroke = 10
  const radius = 50 - stroke / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(251,243,228,0.1)" strokeWidth={stroke} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.2,0.8,0.2,1)' }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4D28A" />
            <stop offset="55%" stopColor="#E9BC63" />
            <stop offset="100%" stopColor="#E23A5E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[40px] leading-none text-cream-100">{Math.round(value)}%</span>
        <span className="mt-1 font-sans text-[9.5px] uppercase tracking-[0.22em] text-cream-200/55">{label}</span>
      </div>
    </div>
  )
}
