export function fillTokens(text: string, aName: string, bName: string) {
  return text
    .replaceAll('{A}', aName)
    .replaceAll('{B}', bName)
    .replaceAll('{{HOOK}}', '')
    .trim()
}

export function firstName(name: string) {
  return (name || '').trim().split(/\s+/)[0] || 'You'
}

export function initial(name: string) {
  return (name || '?').trim().charAt(0).toUpperCase() || '?'
}

export function pct(n: number) {
  return `${Math.round(n)}%`
}

export function secondsLabel(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`
}

export function bandLabel(score: number) {
  if (score >= 85) return 'Rare air'
  if (score >= 70) return 'Strong resonance'
  if (score >= 55) return 'Workable'
  if (score >= 40) return 'Guessing a lot'
  return 'Different operating systems'
}
