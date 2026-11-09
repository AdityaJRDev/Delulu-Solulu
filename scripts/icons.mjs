import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i]
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const lerp = (a, b, t) => a + (b - a) * t
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]

const MAROON = [122, 35, 66]
const INK = [8, 6, 12]
const GOLD_LIGHT = [244, 210, 138]
const GOLD_DARK = [217, 164, 65]

function render(size, { maskable = false } = {}) {
  const buf = Buffer.alloc(size * size * 4)
  const radius = maskable ? 0 : size * 0.225
  const half = size / 2
  const heartScale = size * (maskable ? 0.2 : 0.255)
  const heartCx = half
  const heartCy = size * (maskable ? 0.5 : 0.515)

  const insideRounded = (px, py) => {
    if (maskable) return true
    const qx = Math.abs(px - half) - (half - radius)
    const qy = Math.abs(py - half) - (half - radius)
    const dx = Math.max(qx, 0)
    const dy = Math.max(qy, 0)
    return Math.hypot(dx, dy) + Math.min(Math.max(qx, qy), 0) - radius <= 0
  }

  const insideHeart = (px, py) => {
    const x = (px - heartCx) / heartScale
    const y = (heartCy - py) / heartScale
    const a = x * x + y * y - 1
    return a * a * a - x * x * y * y * y <= 0
  }

  const samples = 3
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const x = px + (sx + 0.5) / samples
          const y = py + (sy + 0.5) / samples
          if (!insideRounded(x, y)) continue
          const t = Math.min(1, Math.max(0, (x / size) * 0.55 + (y / size) * 0.45))
          let color = mix(MAROON, INK, t)
          if (insideHeart(x, y)) {
            const ht = Math.min(1, Math.max(0, (y - heartCy + heartScale) / (heartScale * 2)))
            color = mix(GOLD_LIGHT, GOLD_DARK, ht)
          }
          r += color[0]
          g += color[1]
          b += color[2]
          a += 255
        }
      }
      const total = samples * samples
      const i = (py * size + px) * 4
      const alpha = a / total
      if (alpha > 0) {
        buf[i] = Math.round(r / (a / 255))
        buf[i + 1] = Math.round(g / (a / 255))
        buf[i + 2] = Math.round(b / (a / 255))
      }
      buf[i + 3] = Math.round(alpha)
    }
  }
  return encodePng(size, size, buf)
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', render(192))
writeFileSync('public/icons/icon-512.png', render(512))
writeFileSync('public/icons/icon-maskable-512.png', render(512, { maskable: true }))
writeFileSync('public/icons/apple-touch-icon.png', render(180))
console.log('icons written to public/icons')
