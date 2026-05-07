export interface SpeakingPaceAnalysis {
  wpm: number
  rating: 'too_slow' | 'optimal' | 'too_fast'
  message: string
  color: string
}

export function calculateSpeakingPace(
  totalWords: number,
  durationSeconds: number
): number {
  if (durationSeconds === 0) return 0
  const minutes = durationSeconds / 60
  return Math.round(totalWords / minutes)
}

export function analyzeSpeakingPace(wpm: number): SpeakingPaceAnalysis {
  if (wpm < 100) {
    return {
      wpm,
      rating: 'too_slow',
      message: 'Speaking pace is slow. Try to speak more naturally.',
      color: 'text-yellow-600',
    }
  } else if (wpm >= 100 && wpm <= 160) {
    return {
      wpm,
      rating: 'optimal',
      message: 'Excellent speaking pace! Clear and natural.',
      color: 'text-green-600',
    }
  } else {
    return {
      wpm,
      rating: 'too_fast',
      message: 'Speaking too fast. Slow down for better clarity.',
      color: 'text-red-600',
    }
  }
}

export function calculatePaceVariance(
  paceOverTime: Array<{ timestamp: number; wpm: number }>
): number {
  if (paceOverTime.length < 2) return 0

  const wpms = paceOverTime.map((p) => p.wpm)
  const mean = wpms.reduce((sum, wpm) => sum + wpm, 0) / wpms.length
  const variance =
    wpms.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpms.length

  return Math.sqrt(variance)
}

export function getPaceConsistencyScore(variance: number): number {
  // Lower variance = higher consistency score
  // Variance of 0-10 = 100 score
  // Variance of 50+ = 0 score
  const maxVariance = 50
  const score = Math.max(0, 100 - (variance / maxVariance) * 100)
  return Math.round(score)
}
