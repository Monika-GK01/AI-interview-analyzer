export const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'actually',
  'basically',
  'literally',
  'sort of',
  'kind of',
  'i mean',
  'you see',
  'right',
  'okay',
  'so',
  'well',
  'anyway',
]

export interface FillerWordMatch {
  word: string
  count: number
  positions: number[]
}

export function detectFillerWords(text: string): FillerWordMatch[] {
  const normalizedText = text.toLowerCase()
  const words = normalizedText.split(/\s+/)
  const fillerMatches: Map<string, FillerWordMatch> = new Map()

  // Initialize map
  FILLER_WORDS.forEach((filler) => {
    fillerMatches.set(filler, { word: filler, count: 0, positions: [] })
  })

  // Check for multi-word fillers first
  const multiWordFillers = FILLER_WORDS.filter((f) => f.includes(' '))
  multiWordFillers.forEach((filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi')
    let match
    while ((match = regex.exec(normalizedText)) !== null) {
      const matchData = fillerMatches.get(filler)!
      matchData.count++
      matchData.positions.push(match.index)
    }
  })

  // Check for single-word fillers
  const singleWordFillers = FILLER_WORDS.filter((f) => !f.includes(' '))
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '')
    if (singleWordFillers.includes(cleanWord)) {
      const matchData = fillerMatches.get(cleanWord)!
      matchData.count++
      matchData.positions.push(index)
    }
  })

  return Array.from(fillerMatches.values()).filter((match) => match.count > 0)
}

export function calculateFillerWordPercentage(
  fillerWordCount: number,
  totalWords: number
): number {
  if (totalWords === 0) return 0
  return (fillerWordCount / totalWords) * 100
}

export function getFillerWordSeverity(percentage: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor'
  color: string
  message: string
} {
  if (percentage < 2) {
    return {
      level: 'excellent',
      color: 'text-green-600',
      message: 'Excellent! Very few filler words.',
    }
  } else if (percentage < 5) {
    return {
      level: 'good',
      color: 'text-blue-600',
      message: 'Good. Minimal filler words.',
    }
  } else if (percentage < 10) {
    return {
      level: 'fair',
      color: 'text-yellow-600',
      message: 'Fair. Try to reduce filler words.',
    }
  } else {
    return {
      level: 'poor',
      color: 'text-red-600',
      message: 'High filler word usage. Practice reducing them.',
    }
  }
}
