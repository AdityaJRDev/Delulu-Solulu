import type { CastId } from '../lib/types'

export type HairStyle = 'wavy' | 'curly' | 'straight' | 'bun' | 'ponytail' | 'crop' | 'long_curly'
export type Outfit = 'kurta' | 'saree' | 'tee' | 'shirt' | 'hoodie'
export type Jewellery = 'jhumka' | 'hoops' | 'chain' | 'nose' | 'bindi' | 'tikka'
export type FacialHair = 'none' | 'stubble' | 'beard' | 'moustache'

export type Look = {
  tone: number
  hair: HairStyle
  outfit: Outfit
  outfitColor: string
  accent: string
  hairColor: string
  jewellery: Jewellery[]
  facialHair: FacialHair
  glasses?: boolean
}

export type CastMember = {
  id: CastId
  name: string
  role: string
  look: Look
}

const base: Look = {
  tone: 3,
  hair: 'wavy',
  outfit: 'kurta',
  outfitColor: '#6B1B3A',
  accent: '#D9A441',
  hairColor: '#1C1410',
  jewellery: ['jhumka', 'bindi', 'chain'],
  facialHair: 'none',
}

export const DEFAULT_B_LOOK: Look = {
  ...base,
  tone: 3,
  hair: 'long_curly',
  outfit: 'kurta',
  outfitColor: '#6B1B3A',
  jewellery: ['jhumka', 'bindi', 'chain'],
}

export const DEFAULT_A_LOOK: Look = {
  ...base,
  tone: 4,
  hair: 'curly',
  outfit: 'shirt',
  outfitColor: '#243A63',
  jewellery: ['chain'],
  facialHair: 'stubble',
}

export const CAST: Record<CastId, CastMember> = {
  a: { id: 'a', name: 'Arjun', role: 'Partner A', look: DEFAULT_A_LOOK },
  b: { id: 'b', name: 'Meera', role: 'Partner B', look: DEFAULT_B_LOOK },
  amma: {
    id: 'amma',
    name: 'Amma',
    role: "Partner A's mother",
    look: {
      tone: 4,
      hair: 'bun',
      outfit: 'saree',
      outfitColor: '#1F5E52',
      accent: '#D9A441',
      hairColor: '#2A2420',
      jewellery: ['jhumka', 'bindi', 'chain', 'nose'],
      facialHair: 'none',
    },
  },
  appa: {
    id: 'appa',
    name: 'Appa',
    role: "Partner A's father",
    look: {
      tone: 5,
      hair: 'crop',
      outfit: 'shirt',
      outfitColor: '#EFE7D6',
      accent: '#8C7A5B',
      hairColor: '#4A4642',
      jewellery: [],
      facialHair: 'moustache',
      glasses: true,
    },
  },
  karthik: {
    id: 'karthik',
    name: 'Karthik',
    role: "Partner A's best friend",
    look: {
      tone: 4,
      hair: 'curly',
      outfit: 'tee',
      outfitColor: '#3E4A3A',
      accent: '#D9A441',
      hairColor: '#171210',
      jewellery: ['chain'],
      facialHair: 'beard',
    },
  },
  nisha: {
    id: 'nisha',
    name: 'Nisha',
    role: "Partner B's best friend",
    look: {
      tone: 2,
      hair: 'wavy',
      outfit: 'kurta',
      outfitColor: '#8A3B5C',
      accent: '#E9A23B',
      hairColor: '#241A16',
      jewellery: ['hoops', 'bindi'],
      facialHair: 'none',
    },
  },
  tanya: {
    id: 'tanya',
    name: 'Tanya',
    role: 'The ex',
    look: {
      tone: 2,
      hair: 'straight',
      outfit: 'tee',
      outfitColor: '#1E2430',
      accent: '#B0455C',
      hairColor: '#191312',
      jewellery: ['hoops'],
      facialHair: 'none',
    },
  },
  suresh: {
    id: 'suresh',
    name: 'Suresh',
    role: 'The boss',
    look: {
      tone: 4,
      hair: 'crop',
      outfit: 'shirt',
      outfitColor: '#3A4A63',
      accent: '#7C8BA1',
      hairColor: '#2B2622',
      jewellery: [],
      facialHair: 'stubble',
      glasses: true,
    },
  },
  divya: {
    id: 'divya',
    name: 'Divya',
    role: "Partner A's younger sister",
    look: {
      tone: 3,
      hair: 'ponytail',
      outfit: 'hoodie',
      outfitColor: '#4C3F6B',
      accent: '#E9A23B',
      hairColor: '#1B1512',
      jewellery: ['hoops'],
      facialHair: 'none',
    },
  },
}

export const LOOK_PRESETS: { key: string; label: string; look: Look }[] = [
  { key: 'meera', label: 'Warm & soft', look: DEFAULT_B_LOOK },
  {
    key: 'bold',
    label: 'Bold & bright',
    look: {
      ...base,
      tone: 4,
      hair: 'curly',
      outfit: 'saree',
      outfitColor: '#A8402F',
      jewellery: ['jhumka', 'bindi', 'tikka', 'nose'],
    },
  },
  {
    key: 'cool',
    label: 'Cool & sharp',
    look: {
      ...base,
      tone: 2,
      hair: 'straight',
      outfit: 'shirt',
      outfitColor: '#243A63',
      jewellery: ['hoops'],
    },
  },
  {
    key: 'earth',
    label: 'Earthy & calm',
    look: {
      ...base,
      tone: 5,
      hair: 'bun',
      outfit: 'kurta',
      outfitColor: '#5B6B4A',
      jewellery: ['jhumka', 'bindi'],
    },
  },
  { key: 'arjun', label: 'Curly & classic', look: DEFAULT_A_LOOK },
  {
    key: 'sharp',
    label: 'Clean & sharp',
    look: {
      ...base,
      tone: 3,
      hair: 'crop',
      outfit: 'shirt',
      outfitColor: '#2E3A6E',
      jewellery: [],
      facialHair: 'none',
    },
  },
  {
    key: 'artsy',
    label: 'Artsy & long',
    look: {
      ...base,
      tone: 4,
      hair: 'long_curly',
      outfit: 'tee',
      outfitColor: '#3B2F2A',
      jewellery: ['chain', 'nose'],
      facialHair: 'beard',
    },
  },
  {
    key: 'softboy',
    label: 'Soft & cosy',
    look: {
      ...base,
      tone: 1,
      hair: 'wavy',
      outfit: 'hoodie',
      outfitColor: '#4C3F6B',
      jewellery: [],
      facialHair: 'stubble',
    },
  },
]

export function lookByKey(key: string | undefined, fallback: Look): Look {
  return LOOK_PRESETS.find((preset) => preset.key === key)?.look ?? fallback
}

export function memberName(id: CastId, aName: string, bName: string) {
  if (id === 'a') return aName
  if (id === 'b') return bName
  return CAST[id].name
}
