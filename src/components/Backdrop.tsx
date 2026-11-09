import type { ReactNode } from 'react'

export type BackdropId =
  | 'apartment'
  | 'kitchen'
  | 'bedroom'
  | 'office'
  | 'restaurant'
  | 'cafe'
  | 'temple'
  | 'wedding'
  | 'hospital'
  | 'terrace'
  | 'airport'
  | 'family_home'

type Palette = { wall: [string, string]; floor: string; light: string; props: ReactNode }

const P: Record<BackdropId, Palette> = {
  apartment: {
    wall: ['#3A2418', '#6B3E22'],
    floor: '#241610',
    light: '#FFB15C',
    props: (
      <g>
        <rect x="18" y="90" width="120" height="200" rx="6" fill="#2A1A12" />
        <rect x="26" y="98" width="104" height="184" rx="4" fill="#8FB3C4" opacity="0.35" />
        <path d="M26 98 H130 V150 H26 Z" fill="#E9C48C" opacity="0.18" />
        <rect x="250" y="120" width="130" height="26" rx="4" fill="#4A2C1A" />
        <rect x="258" y="150" width="114" height="150" rx="4" fill="#3A2216" />
        <rect x="266" y="158" width="42" height="52" rx="2" fill="#E9A23B" opacity="0.22" />
        <rect x="316" y="158" width="48" height="52" rx="2" fill="#8FB3C4" opacity="0.16" />
        <ellipse cx="300" cy="430" rx="120" ry="40" fill="#4A2C1A" />
        <rect x="200" y="360" width="200" height="110" rx="24" fill="#5A3520" />
        <rect x="210" y="340" width="180" height="60" rx="22" fill="#6B4226" />
        <path d="M60 300 C60 280 84 280 84 300 L84 340 L60 340 Z" fill="#3E5B3A" opacity="0.7" />
        <rect x="52" y="336" width="40" height="34" rx="4" fill="#7A4B2A" />
        <circle cx="220" cy="180" r="52" fill="#FFB15C" opacity="0.16" />
      </g>
    ),
  },
  kitchen: {
    wall: ['#2E2A22', '#5C4B36'],
    floor: '#211B15',
    light: '#FFC978',
    props: (
      <g>
        <rect x="0" y="70" width="400" height="150" fill="#3A3226" />
        <rect x="16" y="86" width="110" height="120" rx="4" fill="#4A3E2E" />
        <rect x="140" y="86" width="110" height="120" rx="4" fill="#4A3E2E" />
        <rect x="264" y="86" width="120" height="220" rx="6" fill="#2A2620" />
        <rect x="274" y="96" width="100" height="200" rx="4" fill="#8FB3C4" opacity="0.12" />
        <rect x="0" y="330" width="400" height="34" fill="#6B5A42" />
        <rect x="0" y="364" width="400" height="200" fill="#3A3226" />
        <circle cx="150" cy="220" r="70" fill="#FFC978" opacity="0.12" />
        <rect x="200" y="300" width="60" height="30" rx="6" fill="#8A6A44" />
        <path d="M60 330 L60 300 Q80 288 100 300 L100 330 Z" fill="#5B6B4A" opacity="0.6" />
      </g>
    ),
  },
  bedroom: {
    wall: ['#241A26', '#4A2E42'],
    floor: '#1B131C',
    light: '#E9A6B8',
    props: (
      <g>
        <rect x="0" y="120" width="150" height="300" fill="#3A2434" />
        <rect x="20" y="140" width="110" height="260" fill="#C88FA6" opacity="0.12" />
        <rect x="250" y="150" width="140" height="260" rx="8" fill="#33202E" />
        <rect x="240" y="140" width="160" height="20" rx="8" fill="#4A2E42" />
        <circle cx="320" cy="250" r="60" fill="#FFC98A" opacity="0.16" />
        <path d="M300 300 L360 300 L372 400 L288 400 Z" fill="#4A2E42" />
        <rect x="120" y="420" width="200" height="120" rx="10" fill="#3E2638" />
        <rect x="130" y="400" width="180" height="50" rx="18" fill="#5A3A50" />
      </g>
    ),
  },
  office: {
    wall: ['#16202E', '#2A3A52'],
    floor: '#101822',
    light: '#7FB6D9',
    props: (
      <g>
        <rect x="0" y="80" width="400" height="320" fill="#1E2A3A" />
        <rect x="20" y="100" width="160" height="220" rx="4" fill="#8FB3C4" opacity="0.14" />
        <rect x="220" y="100" width="160" height="220" rx="4" fill="#8FB3C4" opacity="0.1" />
        <rect x="0" y="400" width="400" height="30" fill="#2A3A52" />
        <rect x="40" y="430" width="150" height="90" rx="6" fill="#243244" />
        <rect x="220" y="430" width="150" height="90" rx="6" fill="#243244" />
        <rect x="60" y="420" width="60" height="36" rx="3" fill="#7FB6D9" opacity="0.35" />
        <rect x="240" y="420" width="60" height="36" rx="3" fill="#7FB6D9" opacity="0.25" />
        <circle cx="200" cy="200" r="90" fill="#7FB6D9" opacity="0.08" />
      </g>
    ),
  },
  restaurant: {
    wall: ['#2A1614', '#5A2A22'],
    floor: '#1C0F0D',
    light: '#FFB36B',
    props: (
      <g>
        <rect x="0" y="0" width="400" height="420" fill="#3A1E18" />
        {[60, 160, 260, 360].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 0 L${x} 120`} stroke="#1C0F0D" strokeWidth="3" />
            <circle cx={x} cy="130" r="22" fill="#FFB36B" opacity="0.35" />
            <circle cx={x} cy="130" r="10" fill="#FFE0AE" opacity="0.5" />
          </g>
        ))}
        <rect x="0" y="400" width="400" height="140" fill="#4A241C" />
        <rect x="30" y="360" width="150" height="60" rx="8" fill="#6B3A2A" />
        <rect x="220" y="360" width="150" height="60" rx="8" fill="#6B3A2A" />
        <rect x="60" y="340" width="40" height="24" rx="4" fill="#D9A441" opacity="0.4" />
        <rect x="260" y="340" width="40" height="24" rx="4" fill="#D9A441" opacity="0.4" />
      </g>
    ),
  },
  cafe: {
    wall: ['#2E261C', '#5E4A32'],
    floor: '#211A13',
    light: '#FFC98A',
    props: (
      <g>
        <rect x="20" y="60" width="170" height="240" rx="6" fill="#8FB3C4" opacity="0.22" />
        <rect x="250" y="80" width="130" height="220" rx="6" fill="#3A2E22" />
        <rect x="260" y="100" width="110" height="60" rx="4" fill="#D9A441" opacity="0.18" />
        <rect x="0" y="380" width="400" height="120" fill="#4A3826" />
        <rect x="30" y="330" width="140" height="60" rx="8" fill="#6B5238" />
        <ellipse cx="200" cy="160" rx="120" ry="90" fill="#FFC98A" opacity="0.1" />
        <path d="M300 300 C300 250 360 250 360 300 L360 380 L300 380 Z" fill="#3E5B3A" opacity="0.5" />
        <path d="M320 340 C330 300 350 300 356 340" stroke="#5B7B4A" strokeWidth="6" fill="none" opacity="0.6" />
      </g>
    ),
  },
  temple: {
    wall: ['#3A1E14', '#8A4A22'],
    floor: '#24120C',
    light: '#FFAE5C',
    props: (
      <g>
        <circle cx="300" cy="120" r="70" fill="#FFD08A" opacity="0.35" />
        <path d="M0 460 L60 300 L120 460 Z" fill="#2A1610" opacity="0.8" />
        <path d="M60 300 L80 240 L100 300 Z" fill="#2A1610" opacity="0.8" />
        <rect x="0" y="440" width="400" height="80" fill="#3A1E14" />
        {[40, 120, 200, 280, 360].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="80" r="5" fill="#FFD08A" opacity="0.8" />
            <path d={`M${x - 24} 80 Q${x} 120 ${x + 24} 80`} stroke="#E9A23B" strokeWidth="6" fill="none" opacity="0.55" />
            <circle cx={x - 14} cy="92" r="4" fill="#FF7A45" opacity="0.8" />
            <circle cx={x + 8} cy="96" r="4" fill="#FFC24B" opacity="0.8" />
          </g>
        ))}
        <path d="M120 460 L160 380 L200 460 Z" fill="#1C0F0A" opacity="0.7" />
      </g>
    ),
  },
  wedding: {
    wall: ['#3A2436', '#7A4A5E'],
    floor: '#2A1A26',
    light: '#FFD9A8',
    props: (
      <g>
        <rect x="0" y="0" width="400" height="460" fill="#4A2E42" />
        <path d="M40 0 C40 180 80 260 40 460 L0 460 L0 0 Z" fill="#C88FA6" opacity="0.18" />
        <path d="M360 0 C360 180 320 260 360 460 L400 460 L400 0 Z" fill="#C88FA6" opacity="0.18" />
        <rect x="120" y="60" width="20" height="300" fill="#D9A441" opacity="0.35" />
        <rect x="260" y="60" width="20" height="300" fill="#D9A441" opacity="0.35" />
        <path d="M100 60 Q200 10 300 60" stroke="#D9A441" strokeWidth="6" fill="none" opacity="0.5" />
        {[80, 140, 200, 260, 320].map((x, i) => (
          <circle key={i} cx={x} cy="70" r="5" fill="#FFE0AE" opacity="0.8" />
        ))}
        <rect x="0" y="440" width="400" height="80" fill="#3A2436" />
        <ellipse cx="200" cy="440" rx="160" ry="30" fill="#D9A441" opacity="0.12" />
      </g>
    ),
  },
  hospital: {
    wall: ['#16282A', '#2E4A4C'],
    floor: '#0F1C1E',
    light: '#9FE0D6',
    props: (
      <g>
        <rect x="0" y="60" width="400" height="360" fill="#1E3436" />
        <rect x="0" y="120" width="400" height="10" fill="#9FE0D6" opacity="0.18" />
        <rect x="0" y="230" width="400" height="10" fill="#9FE0D6" opacity="0.12" />
        <rect x="0" y="420" width="400" height="40" fill="#2A4446" />
        <rect x="30" y="300" width="120" height="90" rx="6" fill="#2A4446" />
        <rect x="250" y="300" width="120" height="90" rx="6" fill="#2A4446" />
        <circle cx="200" cy="140" r="80" fill="#9FE0D6" opacity="0.1" />
      </g>
    ),
  },
  terrace: {
    wall: ['#0E1424', '#243A5E'],
    floor: '#0A0F18',
    light: '#8FB6FF',
    props: (
      <g>
        <rect x="0" y="0" width="400" height="420" fill="#101A2E" />
        {[
          [30, 300, 40, 120], [80, 260, 50, 160], [140, 320, 36, 100], [190, 240, 60, 180],
          [260, 300, 44, 120], [310, 270, 54, 150], [370, 310, 30, 110],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#0A1220" />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <rect key={`${r}-${c}`} x={x + 6 + c * (w / 2)} y={y + 12 + r * 24} width={w / 4} height={8} fill="#FFD08A" opacity={0.25 + ((i + r) % 3) * 0.15} />
              )),
            )}
          </g>
        ))}
        <path d="M0 60 Q100 20 200 60 T400 60" stroke="#1C2A44" strokeWidth="3" fill="none" />
        {[40, 100, 160, 220, 280, 340].map((x, i) => (
          <circle key={i} cx={x} cy={64 + (i % 2) * 8} r="4" fill="#FFE0AE" opacity="0.85" />
        ))}
        <rect x="0" y="420" width="400" height="100" fill="#0A0F18" />
      </g>
    ),
  },
  airport: {
    wall: ['#16202E', '#3A4E6B'],
    floor: '#0E1620',
    light: '#9CC4E8',
    props: (
      <g>
        <rect x="0" y="40" width="400" height="300" fill="#1A2838" />
        {[20, 120, 220, 320].map((x, i) => (
          <rect key={i} x={x} y="50" width="70" height="270" rx="3" fill="#9CC4E8" opacity="0.12" />
        ))}
        <rect x="0" y="340" width="400" height="20" fill="#2A3A52" />
        <rect x="0" y="360" width="400" height="160" fill="#16202E" />
        {[60, 140, 220, 300].map((x, i) => (
          <rect key={i} x={x} y="380" width="50" height="50" rx="6" fill="#243244" />
        ))}
        <rect x="280" y="120" width="100" height="60" rx="4" fill="#0E1620" opacity="0.8" />
        <rect x="290" y="130" width="80" height="6" fill="#9CC4E8" opacity="0.5" />
        <rect x="290" y="144" width="60" height="6" fill="#9CC4E8" opacity="0.35" />
      </g>
    ),
  },
  family_home: {
    wall: ['#3A2618', '#7A4E2A'],
    floor: '#24160E',
    light: '#FFB86B',
    props: (
      <g>
        <rect x="0" y="60" width="400" height="360" fill="#4A301C" />
        <rect x="24" y="90" width="120" height="250" rx="4" fill="#2A1A10" />
        <rect x="34" y="100" width="100" height="230" rx="3" fill="#5A3A22" />
        <path d="M34 100 H134 V180 H34 Z" fill="#D9A441" opacity="0.14" />
        <rect x="250" y="110" width="120" height="230" rx="4" fill="#2A1A10" />
        <rect x="260" y="120" width="100" height="210" rx="3" fill="#5A3A22" />
        <circle cx="200" cy="240" r="80" fill="#FFB86B" opacity="0.12" />
        <path d="M170 380 L170 330 Q200 310 230 330 L230 380 Z" fill="#7A4E2A" />
        <path d="M170 330 L200 310 L230 330" fill="none" stroke="#D9A441" strokeWidth="4" opacity="0.5" />
        <rect x="0" y="420" width="400" height="100" fill="#2A1A10" />
        <ellipse cx="200" cy="430" rx="70" ry="12" fill="#D9A441" opacity="0.18" />
      </g>
    ),
  },
}

const ACT_TINT: Record<number, string> = {
  1: 'rgba(255,170,90,0.16)',
  2: 'rgba(255,140,90,0.18)',
  3: 'rgba(90,110,200,0.18)',
  4: 'rgba(40,50,110,0.28)',
}

export default function Backdrop({
  id = 'apartment',
  act = 1,
  className = '',
}: {
  id?: string
  act?: number
  className?: string
}) {
  const key = (id in P ? id : 'apartment') as BackdropId
  const palette = P[key]
  const tint = ACT_TINT[act] || ACT_TINT[1]

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${palette.wall[0]} 0%, ${palette.wall[1]} 62%, ${palette.floor} 100%)`,
        }}
      />
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {palette.props}
        <rect width="400" height="800" fill={tint} />
        <rect width="400" height="800" fill="url(#vignette)" opacity="0.7" />
        <defs>
          <radialGradient id="vignette" cx="50%" cy="42%" r="72%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.75" />
          </radialGradient>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="400" height="800" filter="url(#grain)" opacity="0.06" />
      </svg>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 42% at 32% 30%, ${palette.light}33 0%, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(0,0,0,0.55),transparent_60%)]" />
    </div>
  )
}
