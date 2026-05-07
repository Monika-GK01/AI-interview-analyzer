export interface NervousnessFactors {
  fillerWordImpact: number // 0-100
  pauseImpact: number // 0-100
  paceVarianceImpact: number // 0-100
  repetitionImpact: number // 0-100
}

export function calculateNervousnessScore(factors: {
  fillerWordPercentage: number
  averagePauseDuration: number
  pauseFrequency: number
  paceVariance: number
  repetitionRate: number
}): { score: number; factors: NervousnessFactors } {
  // 1. Filler Word Impact (40%)
  // Higher filler word % = higher nervousness
  const fillerWordImpact = Math.min(100, factors.fillerWordPercentage * 10)

  // 2. Pause Impact (30%)
  // Frequent long pauses or very short pauses indicate nervousness
  const pauseFrequencyScore = Math.min(100, factors.pauseFrequency * 20)
  const pauseDurationScore =
    factors.averagePauseDuration > 2000
      ? Math.min(100, (factors.averagePauseDuration / 2000) * 50)
      : 0
  const pauseImpact = (pauseFrequencyScore + pauseDurationScore) / 2

  // 3. Pace Variance Impact (20%)
  // High variance in speaking pace indicates nervousness
  const paceVarianceImpact = Math.min(100, (factors.paceVariance / 50) * 100)

  // 4. Repetition Impact (10%)
  // Repeating words/phrases indicates nervousness
  const repetitionImpact = Math.min(100, factors.repetitionRate * 100)

  // Calculate weighted nervousness score
  const nervousnessScore = Math.round(
    fillerWordImpact * 0.4 +
      pauseImpact * 0.3 +
      paceVarianceImpact * 0.2 +
      repetitionImpact * 0.1
  )

  return {
    score: Math.min(100, Math.max(0, nervousnessScore)),
    factors: {
      fillerWordImpact: Math.round(fillerWordImpact),
      pauseImpact: Math.round(pauseImpact),
      paceVarianceImpact: Math.round(paceVarianceImpact),
      repetitionImpact: Math.round(repetitionImpact),
    },
  }
}

export function getNervousnessLevel(score: number): {
  level: 'calm' | 'slightly_nervous' | 'nervous' | 'very_nervous'
  color: string
  message: string
} {
  if (score < 25) {
    return {
      level: 'calm',
      color: 'text-green-600',
      message: 'Very calm and composed delivery.',
    }
  } else if (score < 50) {
    return {
      level: 'slightly_nervous',
      color: 'text-blue-600',
      message: 'Slightly nervous but well-controlled.',
    }
  } else if (score < 75) {
    return {
      level: 'nervous',
      color: 'text-yellow-600',
      message: 'Noticeable nervousness. Practice relaxation techniques.',
    }
  } else {
    return {
      level: 'very_nervous',
      color: 'text-red-600',
      message: 'High nervousness detected. Consider more preparation.',
    }
  }
}

export function calculateRepetitionRate(text: string): number {
  const words = text.toLowerCase().split(/\s+/)
  if (words.length < 10) return 0

  const wordCounts = new Map<string, number>()
  words.forEach((word) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '')
    if (cleanWord.length > 3) {
      // Only count words longer than 3 chars
      wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1)
    }
  })

  // Count words that appear more than once
  let repeatedWords = 0
  wordCounts.forEach((count) => {
    if (count > 1) repeatedWords += count - 1
  })

  return repeatedWords / words.length
}

export function calculatePauseFrequency(
  pauseDurations: number[],
  totalDuration: number
): number {
  if (totalDuration === 0) return 0
  // Return pauses per minute
  return (pauseDurations.length / totalDuration) * 60
}
