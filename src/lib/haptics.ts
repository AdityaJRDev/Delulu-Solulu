export function tap(pattern: number | number[] = 12) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    /* unsupported */
  }
}

export const haptics = {
  choice: () => tap(14),
  brave: () => tap([18, 40, 28]),
  act: () => tap([30, 60, 30, 60, 45]),
  complete: () => tap([40, 70, 40, 70, 90]),
}
