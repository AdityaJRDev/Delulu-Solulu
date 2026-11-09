import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { HairStyle, Look, Outfit } from '../data/cast'

export type Expression = 'neutral' | 'soft' | 'hurt' | 'angry' | 'surprised' | 'teary'

type Props = {
  look: Look
  expression?: Expression
  className?: string
  style?: CSSProperties
  dim?: boolean
  flip?: boolean
}

const TONES = [
  { base: '#F3C9A8', shadow: '#D6A07C', light: '#FFE4CB', blush: '#E88A76', lip: '#B4544B' },
  { base: '#E5B189', shadow: '#C48A61', light: '#F8D3B2', blush: '#DD8068', lip: '#A8493F' },
  { base: '#CF9468', shadow: '#AC6E46', light: '#EBB489', blush: '#C96A55', lip: '#8E3A32' },
  { base: '#B3744C', shadow: '#8C5231', light: '#D29168', blush: '#B25A47', lip: '#74302A' },
  { base: '#8E5734', shadow: '#68391F', light: '#AC7248', blush: '#94452F', lip: '#5E241E' },
  { base: '#6E4026', shadow: '#4C2815', light: '#8C5836', blush: '#7A3624', lip: '#4A1A15' },
]

function hairBack(style: HairStyle, hair: string, sheen: string) {
  switch (style) {
    case 'curly':
      return (
        <g fill={hair}>
          <ellipse cx="160" cy="150" rx="94" ry="104" />
          <path d="M74 160 C58 220 64 288 84 330 C94 296 90 244 100 206 Z" />
          <path d="M246 160 C262 220 256 288 236 330 C226 296 230 244 220 206 Z" />
          {[
            [78, 108, 30], [96, 76, 28], [128, 58, 30], [160, 50, 32], [192, 58, 30],
            [224, 78, 28], [242, 110, 30], [70, 158, 26], [250, 158, 26],
            [66, 210, 24], [254, 210, 24], [72, 258, 22], [248, 258, 22],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
          <path d="M96 120 C120 92 140 86 160 84 C132 100 116 118 106 142 Z" fill={sheen} opacity="0.35" />
        </g>
      )
    case 'straight':
      return (
        <g fill={hair}>
          <path d="M88 146 C88 84 118 54 160 54 C202 54 232 84 232 146 L240 430 C222 386 216 300 212 236 L108 236 C104 300 98 386 80 430 Z" />
          <path d="M104 118 C124 84 142 74 160 72 C138 92 126 112 120 140 Z" fill={sheen} opacity="0.3" />
        </g>
      )
    case 'long_curly':
      return (
        <g fill={hair}>
          <ellipse cx="160" cy="146" rx="96" ry="102" />
          <path d="M70 170 C52 250 60 340 82 404 C96 360 88 286 102 228 Z" />
          <path d="M250 170 C268 250 260 340 238 404 C224 360 232 286 218 228 Z" />
          {[
            [70, 200, 26], [62, 252, 24], [70, 304, 24], [84, 352, 22],
            [250, 200, 26], [258, 252, 24], [250, 304, 24], [236, 352, 22],
            [86, 96, 28], [120, 64, 28], [160, 54, 30], [200, 64, 28], [234, 96, 28],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
          <path d="M100 116 C124 88 142 80 160 78 C136 96 122 116 112 142 Z" fill={sheen} opacity="0.3" />
        </g>
      )
    case 'wavy':
      return (
        <g fill={hair}>
          <path d="M92 148 C86 92 114 58 160 58 C206 58 234 92 228 148 C242 208 238 268 222 306 C214 272 214 236 210 206 L110 206 C106 236 106 272 98 306 C82 268 78 208 92 148 Z" />
          <path d="M96 168 C78 220 82 288 96 340 C106 306 100 250 112 206 Z" />
          <path d="M224 168 C242 220 238 288 224 340 C214 306 220 250 208 206 Z" />
          <path d="M104 116 C126 84 144 76 160 74 C138 94 124 114 116 142 Z" fill={sheen} opacity="0.32" />
        </g>
      )
    case 'bun':
      return (
        <g fill={hair}>
          <path d="M96 148 C96 92 122 60 160 60 C198 60 224 92 224 148 C232 190 230 222 220 244 L100 244 C90 222 88 190 96 148 Z" />
          <circle cx="238" cy="96" r="34" />
          <circle cx="238" cy="96" r="20" fill={sheen} opacity="0.25" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={216 + (i % 3) * 16} cy={74 + Math.floor(i / 3) * 18} r="4" fill="#FFF7EC" opacity="0.9" />
          ))}
        </g>
      )
    case 'ponytail':
      return (
        <g fill={hair}>
          <path d="M96 148 C96 92 122 60 160 60 C198 60 224 92 224 148 C230 186 228 216 220 238 L100 238 C92 216 90 186 96 148 Z" />
          <path d="M222 120 C252 132 268 176 262 230 C256 282 240 320 224 344 C232 300 236 250 228 210 C224 176 220 148 222 120 Z" />
          <circle cx="222" cy="126" r="12" />
        </g>
      )
    case 'crop':
    default:
      return (
        <g fill={hair}>
          <path d="M98 146 C98 96 124 66 160 66 C196 66 222 96 222 146 C224 168 222 184 218 196 L102 196 C98 184 96 168 98 146 Z" />
          <path d="M110 112 C130 84 146 78 160 76 C140 94 128 112 122 138 Z" fill={sheen} opacity="0.3" />
        </g>
      )
  }
}

function hairFront(style: HairStyle, hair: string) {
  switch (style) {
    case 'curly':
      return (
        <g fill={hair}>
          {[
            [110, 108, 20], [136, 96, 22], [164, 92, 22], [192, 98, 21], [214, 112, 19],
            [104, 136, 16], [218, 138, 16],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      )
    case 'straight':
      return (
        <g fill={hair}>
          <path d="M160 78 C136 78 112 96 104 128 C118 112 138 102 160 100 Z" />
          <path d="M160 78 C184 78 208 96 216 128 C202 112 182 102 160 100 Z" />
        </g>
      )
    case 'long_curly':
      return (
        <g fill={hair}>
          {[
            [112, 106, 18], [138, 94, 20], [164, 90, 20], [190, 96, 19], [212, 110, 17],
            [102, 138, 15], [220, 140, 15], [100, 168, 13], [222, 170, 13],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      )
    case 'wavy':
      return (
        <g fill={hair}>
          <path d="M160 80 C136 80 112 98 104 132 C120 112 138 100 160 98 Z" />
          <path d="M160 80 C186 80 210 98 218 130 C202 112 182 100 160 98 Z" />
          <path d="M108 132 C120 158 116 178 110 196 C104 174 104 150 108 132 Z" opacity="0.9" />
        </g>
      )
    case 'bun':
    case 'ponytail':
      return (
        <g fill={hair}>
          <path d="M160 76 C134 76 110 96 104 128 C120 110 138 100 160 98 C182 100 200 110 216 128 C210 96 186 76 160 76 Z" />
          <path d="M104 128 C112 148 112 166 108 182 C102 164 100 144 104 128 Z" opacity="0.85" />
        </g>
      )
    case 'crop':
    default:
      return (
        <g fill={hair}>
          <path d="M160 72 C138 72 116 88 106 114 C122 100 140 92 160 90 C180 92 198 100 214 114 C204 88 182 72 160 72 Z" />
        </g>
      )
  }
}

function outfitShape(outfit: Outfit, color: string, accent: string, skinShadow: string) {
  const body = 'M56 620 L70 372 C78 332 106 312 132 304 L188 304 C214 312 242 332 250 372 L264 620 Z'
  switch (outfit) {
    case 'saree':
      return (
        <g>
          <path d={body} fill={color} />
          <path d="M132 304 C150 340 176 344 200 322 L210 620 L120 620 Z" fill={accent} opacity="0.9" />
          <path d="M132 304 C150 340 176 344 200 322 L204 356 C176 372 148 366 128 336 Z" fill="#FFF7EC" opacity="0.16" />
          <path d="M120 620 L210 620 L208 596 L122 596 Z" fill={accent} />
          <path d="M140 312 C154 348 180 356 204 340 L208 364 C180 382 150 374 134 340 Z" fill="#FFF7EC" opacity="0.1" />
          <path d="M96 304 C104 292 116 286 128 286 L128 304 Z" fill={color} />
        </g>
      )
    case 'kurta':
      return (
        <g>
          <path d={body} fill={color} />
          <path d="M132 304 C142 322 156 332 160 332 C164 332 178 322 188 304 L188 336 C176 350 144 350 132 336 Z" fill={skinShadow} opacity="0.35" />
          <path d="M160 336 L160 470" stroke={accent} strokeWidth="3" opacity="0.7" />
          {[358, 396, 434].map((y) => (
            <circle key={y} cx="160" cy={y} r="4" fill={accent} />
          ))}
          <path d="M70 372 C90 356 118 344 132 336 L136 350 C118 360 94 374 76 392 Z" fill="#FFF7EC" opacity="0.08" />
          {[
            [96, 430, 7], [120, 470, 6], [92, 510, 8], [232, 442, 7], [214, 500, 6], [238, 540, 8],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={accent} opacity="0.25" />
          ))}
        </g>
      )
    case 'shirt':
      return (
        <g>
          <path d={body} fill={color} />
          <path d="M132 304 L160 336 L188 304 L176 300 L160 318 L144 300 Z" fill="#FFF7EC" opacity="0.85" />
          <path d="M132 304 L146 300 L160 318 L150 330 Z" fill={accent} opacity="0.5" />
          <path d="M188 304 L174 300 L160 318 L170 330 Z" fill={accent} opacity="0.5" />
          <path d="M160 336 L160 500" stroke="#FFF7EC" strokeWidth="3" opacity="0.25" />
          {[360, 398, 436, 474].map((y) => (
            <circle key={y} cx="160" cy={y} r="3.5" fill="#FFF7EC" opacity="0.6" />
          ))}
          <path d="M70 372 C90 356 118 344 132 336 L136 350 C118 360 94 374 76 392 Z" fill="#FFF7EC" opacity="0.08" />
        </g>
      )
    case 'hoodie':
      return (
        <g>
          <path d={body} fill={color} />
          <path d="M118 306 C128 280 144 268 160 268 C176 268 192 280 202 306 C186 322 134 322 118 306 Z" fill={color} />
          <path d="M118 306 C128 280 144 268 160 268 C176 268 192 280 202 306" fill="none" stroke="#FFF7EC" strokeWidth="3" opacity="0.2" />
          <path d="M150 312 L146 380 M170 312 L174 380" stroke="#FFF7EC" strokeWidth="4" opacity="0.7" />
          <circle cx="146" cy="382" r="4" fill="#FFF7EC" opacity="0.7" />
          <circle cx="174" cy="382" r="4" fill="#FFF7EC" opacity="0.7" />
          <path d="M104 470 C130 458 190 458 216 470 L216 520 C190 508 130 508 104 520 Z" fill={accent} opacity="0.35" />
        </g>
      )
    case 'tee':
    default:
      return (
        <g>
          <path d={body} fill={color} />
          <path d="M132 304 C142 326 178 326 188 304 L188 322 C178 338 142 338 132 322 Z" fill={skinShadow} opacity="0.4" />
          <path d="M70 372 C90 356 118 344 132 336 L136 350 C118 360 94 374 76 392 Z" fill="#FFF7EC" opacity="0.07" />
          <path d="M214 344 C232 356 242 372 250 392 L242 398 C232 378 222 364 208 352 Z" fill="#000" opacity="0.08" />
        </g>
      )
  }
}

function jewelleryLayer(look: Look, tone: (typeof TONES)[number], gold: string, goldLight: string) {
  const has = (j: string) => look.jewellery.includes(j as never)
  return (
    <g>
      {has('chain') && (
        <g>
          <path d="M134 300 C142 330 178 330 186 300" fill="none" stroke={gold} strokeWidth="3" />
          <circle cx="160" cy="322" r="5" fill={goldLight} />
        </g>
      )}
      {has('jhumka') && (
        <g>
          <circle cx="94" cy="196" r="4" fill={goldLight} />
          <path d="M94 200 L84 218 L104 218 Z" fill={gold} />
          <ellipse cx="94" cy="228" rx="15" ry="12" fill={gold} />
          <ellipse cx="94" cy="230" rx="10" ry="7" fill={goldLight} opacity="0.5" />
          <circle cx="226" cy="196" r="4" fill={goldLight} />
          <path d="M226 200 L216 218 L236 218 Z" fill={gold} />
          <ellipse cx="226" cy="228" rx="15" ry="12" fill={gold} />
          <ellipse cx="226" cy="230" rx="10" ry="7" fill={goldLight} opacity="0.5" />
        </g>
      )}
      {has('hoops') && (
        <g fill="none" stroke={gold} strokeWidth="3">
          <circle cx="94" cy="206" r="15" />
          <circle cx="226" cy="206" r="15" />
        </g>
      )}
      {has('nose') && (
        <g>
          <circle cx="150" cy="204" r="4" fill="none" stroke={gold} strokeWidth="2" />
          <circle cx="150" cy="200" r="1.6" fill={goldLight} />
        </g>
      )}
      {has('bindi') && (
        <g>
          <circle cx="160" cy="130" r="6" fill="#B0233A" />
          <circle cx="160" cy="130" r="2.4" fill="#E0576F" opacity="0.8" />
        </g>
      )}
      {has('tikka') && (
        <g>
          <path d="M160 84 L160 116" stroke={gold} strokeWidth="2" />
          <path d="M160 116 L152 130 L160 142 L168 130 Z" fill={gold} />
          <circle cx="160" cy="128" r="3" fill="#B0233A" />
        </g>
      )}
      {look.glasses && (
        <g fill="none" stroke="#2A2420" strokeWidth="2.5" opacity="0.85">
          <rect x="108" y="156" width="44" height="30" rx="8" />
          <rect x="168" y="156" width="44" height="30" rx="8" />
          <path d="M152 168 L168 168" />
          <path d="M108 166 L98 170 M212 166 L222 170" />
        </g>
      )}
      {look.facialHair !== 'none' && (
        <g fill={look.hairColor}>
          {look.facialHair === 'moustache' && (
            <path d="M142 218 C150 212 170 212 178 218 C170 224 150 224 142 218 Z" opacity="0.95" />
          )}
          {look.facialHair === 'stubble' && (
            <path d="M120 214 C126 250 146 264 160 264 C174 264 194 250 200 214 C196 246 180 258 160 258 C140 258 124 246 120 214 Z" opacity="0.28" />
          )}
          {look.facialHair === 'beard' && (
            <path d="M112 208 C116 254 138 272 160 272 C182 272 204 254 208 208 C206 250 186 264 160 264 C134 264 114 250 112 208 Z" opacity="0.9" />
          )}
        </g>
      )}
    </g>
  )
}

function eyesLayer(expression: Expression, tone: (typeof TONES)[number], ink: string) {
  const lidCover: Record<Expression, number> = {
    neutral: 0,
    soft: 8,
    hurt: 5,
    angry: 9,
    surprised: -2,
    teary: 11,
  }
  const cover = lidCover[expression]
  const tear = expression === 'teary' || expression === 'hurt'

  const one = (cx: number, key: string) => (
    <g key={key}>
      <path d={`M${cx - 17} 170 Q${cx} 152 ${cx + 17} 170 Q${cx} 186 ${cx - 17} 170 Z`} fill="#FBF3E4" />
      <circle cx={cx} cy={171} r={8.4} fill="#4A2C1A" />
      <circle cx={cx} cy={171} r={5.2} fill={ink} />
      <circle cx={cx} cy={171} r={2.4} fill="#0B0705" />
      <circle cx={cx - 2.6} cy={168} r={2.1} fill="#FFF7EC" opacity="0.9" />
      <circle cx={cx + 2.4} cy={174} r={1.2} fill="#FFF7EC" opacity="0.5" />
      <path d={`M${cx - 18} 168 Q${cx} 150 ${cx + 18} 168`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${cx + 14} 164 L${cx + 21} 160`} stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${cx - 14} 180 Q${cx} 184 ${cx + 14} 180`} fill="none" stroke={tone.shadow} strokeWidth="1.4" opacity="0.5" />
      {cover > 0 && (
        <path
          d={`M${cx - 19} 168 Q${cx} ${152 - cover} ${cx + 19} 168 L${cx + 19} 154 L${cx - 19} 154 Z`}
          fill={tone.base}
        />
      )}
      {tear && (
        <path d={`M${cx + 12} 182 Q${cx + 16} 194 ${cx + 10} 198 Q${cx + 5} 194 ${cx + 9} 184 Z`} fill="#9FD8E8" opacity="0.85" />
      )}
    </g>
  )

  return (
    <g>
      {one(130, 'l')}
      {one(190, 'r')}
    </g>
  )
}

function browsLayer(expression: Expression, hair: string) {
  const map: Record<Expression, { l: string; r: string }> = {
    neutral: { l: 'M110 146 Q130 138 148 145', r: 'M172 145 Q190 138 210 146' },
    soft: { l: 'M110 144 Q130 136 148 143', r: 'M172 143 Q190 136 210 144' },
    hurt: { l: 'M110 140 Q130 144 148 150', r: 'M172 150 Q190 144 210 140' },
    angry: { l: 'M110 138 Q130 144 148 152', r: 'M172 152 Q190 144 210 138' },
    surprised: { l: 'M110 140 Q130 130 148 138', r: 'M172 138 Q190 130 210 140' },
    teary: { l: 'M110 142 Q130 146 148 151', r: 'M172 151 Q190 146 210 142' },
  }
  const b = map[expression]
  return (
    <g fill="none" stroke={hair} strokeWidth="5" strokeLinecap="round">
      <path d={b.l} />
      <path d={b.r} />
    </g>
  )
}

function mouthLayer(expression: Expression, tone: (typeof TONES)[number]) {
  switch (expression) {
    case 'soft':
      return (
        <g>
          <path d="M144 224 Q160 236 176 224 Q160 230 144 224 Z" fill={tone.lip} />
          <path d="M144 224 Q160 220 176 224" fill="none" stroke={tone.lip} strokeWidth="3" strokeLinecap="round" />
          <path d="M152 230 Q160 234 168 230" stroke="#FFF7EC" strokeWidth="1.4" opacity="0.4" fill="none" />
        </g>
      )
    case 'hurt':
      return (
        <g>
          <path d="M144 230 Q160 220 176 230" fill="none" stroke={tone.lip} strokeWidth="4" strokeLinecap="round" />
          <path d="M150 234 Q160 238 170 234" stroke={tone.shadow} strokeWidth="1.4" opacity="0.5" fill="none" />
        </g>
      )
    case 'angry':
      return (
        <g>
          <path d="M142 226 L178 226" stroke={tone.lip} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M146 232 Q160 235 174 232" stroke={tone.shadow} strokeWidth="1.4" opacity="0.5" fill="none" />
        </g>
      )
    case 'surprised':
      return (
        <g>
          <ellipse cx="160" cy="228" rx="9" ry="11" fill={tone.lip} />
          <ellipse cx="160" cy="231" rx="5" ry="5" fill="#3A1414" opacity="0.7" />
        </g>
      )
    case 'teary':
      return (
        <g>
          <path d="M144 228 Q152 222 160 227 Q168 232 176 226" fill="none" stroke={tone.lip} strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case 'neutral':
    default:
      return (
        <g>
          <path d="M146 225 Q160 221 174 225 Q160 233 146 225 Z" fill={tone.lip} />
          <path d="M146 225 Q160 221 174 225" fill="none" stroke={tone.lip} strokeWidth="3" strokeLinecap="round" />
          <path d="M154 229 Q160 232 166 229" stroke="#FFF7EC" strokeWidth="1.2" opacity="0.35" fill="none" />
        </g>
      )
  }
}

export default function Character({
  look,
  expression = 'neutral',
  className,
  style,
  dim = false,
  flip = false,
}: Props) {
  const uid = useId().replace(/[:]/g, '')
  const tone = TONES[Math.max(0, Math.min(TONES.length - 1, look.tone))]
  const hair = look.hairColor
  const sheen = '#6B4A34'
  const gold = look.accent
  const goldLight = '#F4D28A'
  const ink = '#1B120C'

  return (
    <svg
      viewBox="0 0 320 620"
      className={className}
      style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}
      role="img"
      aria-label="Character portrait"
    >
      <defs>
        <linearGradient id={`skin-${uid}`} x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={tone.light} />
          <stop offset="45%" stopColor={tone.base} />
          <stop offset="100%" stopColor={tone.shadow} />
        </linearGradient>
        <linearGradient id={`hair-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={sheen} />
          <stop offset="35%" stopColor={hair} />
          <stop offset="100%" stopColor={hair} />
        </linearGradient>
        <linearGradient id={`outfit-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={look.outfitColor} />
          <stop offset="60%" stopColor={look.outfitColor} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor="#9A6B22" />
        </linearGradient>
        <radialGradient id={`blush-${uid}`}>
          <stop offset="0%" stopColor={tone.blush} stopOpacity="0.55" />
          <stop offset="100%" stopColor={tone.blush} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0%" stopColor="#FFB86B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFB86B" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <g
        style={{
          filter: dim ? 'saturate(0.55) brightness(0.62) blur(1.4px)' : undefined,
          transition: 'filter 400ms ease',
        }}
      >
        <ellipse cx="160" cy="300" rx="170" ry="280" fill={`url(#glow-${uid})`} opacity={dim ? 0.25 : 0.7} />

        <g fill={`url(#hair-${uid})`}>{hairBack(look.hair, hair, sheen)}</g>

        <g>
          <path
            d="M56 620 L70 372 C78 332 106 312 132 304 L188 304 C214 312 242 332 250 372 L264 620 Z"
            fill={`url(#outfit-${uid})`}
          />
          {outfitShape(look.outfit, look.outfitColor, gold, tone.shadow)}
        </g>

        <path d="M134 238 L134 302 Q160 322 186 302 L186 238 Z" fill={`url(#skin-${uid})`} />
        <path d="M134 252 Q160 282 186 252 L186 238 L134 238 Z" fill={tone.shadow} opacity="0.4" />

        <ellipse cx="94" cy="180" rx="14" ry="22" fill={tone.shadow} />
        <ellipse cx="226" cy="180" rx="14" ry="22" fill={tone.shadow} />

        <path
          d="M96 150 C96 96 122 72 160 72 C198 72 224 96 224 150 C224 204 198 254 160 258 C122 254 96 204 96 150 Z"
          fill={`url(#skin-${uid})`}
        />

        <path
          d="M96 150 C96 112 112 88 136 78 C120 100 112 126 114 156 C116 194 130 226 156 248 C128 240 96 200 96 150 Z"
          fill={tone.shadow}
          opacity="0.18"
        />
        <ellipse cx="124" cy="196" rx="20" ry="12" fill={`url(#blush-${uid})`} />
        <ellipse cx="196" cy="196" rx="20" ry="12" fill={`url(#blush-${uid})`} />

        <path d="M160 176 L152 204 Q160 210 170 204" fill="none" stroke={tone.shadow} strokeWidth="3" opacity="0.55" strokeLinecap="round" />
        <ellipse cx="152" cy="206" rx="3.4" ry="2.2" fill={tone.shadow} opacity="0.5" />
        <ellipse cx="169" cy="206" rx="3.4" ry="2.2" fill={tone.shadow} opacity="0.5" />

        {eyesLayer(expression, tone, ink)}
        {browsLayer(expression, hair)}
        {mouthLayer(expression, tone)}

        <g fill={`url(#hair-${uid})`}>{hairFront(look.hair, hair)}</g>

        <g>{jewelleryLayer(look, tone, gold, goldLight)}</g>


      </g>
    </svg>
  )
}
