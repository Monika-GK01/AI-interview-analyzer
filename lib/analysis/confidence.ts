import { calculatePaceConsistencyScore } from './speaking-pace'
import { calculateFillerWordPercentage } from './filler-words'

export interface ConfidenceFactors {
  paceConsistency: number // 0-100
  fillerWordScore: number // 0-100
  pauseScore: number // 0-100
  vocabularyScore: number // 0-100
  lengthScore: number // 0-100
}

export function calculateConfidenceScore(factors: {
  paceVariance: number
  fillerWordCount: number
  totalWords: number
  averagePauseDuration: number
  uniqueWords: number
  totalDuration: number
}): { score: number; factors: ConfidenceFactors } {
  // 1. Pace Consistency (30%)
  const paceConsistency = calculatePaceConsistencyScore(factors.paceVariance)

  // 2. Filler Word Score (25%)
  const fillerPercentage = calculateFillerWordPercentage(
    factors.fillerWordCount,
    factors.totalWords
  )
  const fillerWordScore = Math.max(0, 100 - fillerPercentage * 10)

  // 3. Pause Score (20%)
  // Ideal pause: 500-1000ms, penalize very short or very long pauses
  const idealPause = 750
  const pauseDiff = Math.abs(factors.averagePauseDuration - idealPause)
  const pauseScore = Math.max(0, 100 - (pauseDiff / idealPause) * 100)

  // 4. Vocabulary Score (15%)
  // Higher unique word ratio = better vocabulary
  const vocabularyRatio =
    factors.totalWords > 0 ? factors.uniqueWords / factors.totalWords : 0
  const vocabularyScore = Math.min(100, vocabularyRatio * 200) // 50% unique = 100 score

  // 5. Response Length Score (10%)
  // Penalize very short responses (< 30 seconds)
  const lengthScore =
    factors.totalDuration < 30
      ? (factors.totalDuration / 30) * 100
      : 100

  // Calculate weighted average
  const confidenceScore = Math.round(
    paceConsistency * 0.3 +
      fillerWordScore * 0.25 +
      pauseScore * 0.2 +
      vocabularyScore * 0.15 +
      lengthScore * 0.1
  )

  return {
    score: Math.min(100, Math.max(0, confidenceScore)),
    factors: {
      paceConsistency: Math.round(paceConsistency),
      fillerWordScore: Math.round(fillerWordScore),
      pauseScore: Math.round(pauseScore),
      vocabularyScore: Math.round(vocabularyScore),
      lengthScore: Math.round(lengthScore),
    },
  }
}

export function getConfidenceLevel(score: number): {
  level: 'low' | 'moderate' | 'good' | 'excellent'
  color: string
  message: string
} {
  if (score >= 80) {
    return {
      level: 'excellent',
      color: 'text-green-600',
      message: 'Excellent confidence! You spoke clearly and naturally.',
    }
  } else if (score >= 60) {
    return {
      level: 'good',
      color: 'text-blue-600',
      message: 'Good confidence. Minor improvements possible.',
    }
  } else if (score >= 40) {
    return {
      level: 'moderate',
      color: 'text-yellow-600',
      message: 'Moderate confidence. Practice will help improve.',
    }
  } else {
    return {
      level: 'low',
      color: 'text-red-600',
      message: 'Low confidence detected. Focus on preparation and practice.',
    }
  }
}
