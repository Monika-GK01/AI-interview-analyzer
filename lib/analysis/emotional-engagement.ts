import Sentiment from 'sentiment'

const sentiment = new Sentiment()

export interface EmotionalEngagementFactors {
  vocabularyRichness: number // 0-100
  sentenceComplexity: number // 0-100
  positiveSentiment: number // 0-100
  energyLevel: number // 0-100
}

export function calculateEmotionalEngagement(factors: {
  text: string
  uniqueWords: number
  totalWords: number
  speakingPaceWpm: number
}): { score: number; factors: EmotionalEngagementFactors; sentimentScores: any } {
  // 1. Vocabulary Richness (30%)
  const vocabularyRatio =
    factors.totalWords > 0 ? factors.uniqueWords / factors.totalWords : 0
  const vocabularyRichness = Math.min(100, vocabularyRatio * 200)

  // 2. Sentence Complexity (25%)
  const sentences = factors.text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const avgWordsPerSentence =
    sentences.length > 0 ? factors.totalWords / sentences.length : 0
  // Ideal: 15-20 words per sentence
  const complexityScore =
    avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20
      ? 100
      : avgWordsPerSentence < 15
      ? (avgWordsPerSentence / 15) * 100
      : Math.max(0, 100 - ((avgWordsPerSentence - 20) / 10) * 50)
  const sentenceComplexity = Math.min(100, complexityScore)

  // 3. Positive Sentiment (25%)
  const sentimentResult = sentiment.analyze(factors.text)
  const sentimentScore = sentimentResult.score
  const sentimentComparative = sentimentResult.comparative
  
  // Normalize sentiment to 0-100 (positive sentiment is good)
  const positiveSentiment = Math.min(
    100,
    Math.max(0, 50 + sentimentComparative * 50)
  )

  // 4. Energy Level (20%)
  // Based on speaking pace - moderate to fast pace shows energy
  const energyLevel =
    factors.speakingPaceWpm >= 120 && factors.speakingPaceWpm <= 160
      ? 100
      : factors.speakingPaceWpm < 120
      ? (factors.speakingPaceWpm / 120) * 100
      : Math.max(0, 100 - ((factors.speakingPaceWpm - 160) / 40) * 50)

  // Calculate weighted engagement score
  const engagementScore = Math.round(
    vocabularyRichness * 0.3 +
      sentenceComplexity * 0.25 +
      positiveSentiment * 0.25 +
      energyLevel * 0.2
  )

  return {
    score: Math.min(100, Math.max(0, engagementScore)),
    factors: {
      vocabularyRichness: Math.round(vocabularyRichness),
      sentenceComplexity: Math.round(sentenceComplexity),
      positiveSentiment: Math.round(positiveSentiment),
      energyLevel: Math.round(energyLevel),
    },
    sentimentScores: {
      score: sentimentScore,
      comparative: sentimentComparative,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative,
    },
  }
}

export function getEngagementLevel(score: number): {
  level: 'low' | 'moderate' | 'good' | 'excellent'
  color: string
  message: string
} {
  if (score >= 80) {
    return {
      level: 'excellent',
      color: 'text-green-600',
      message: 'Excellent engagement! Very expressive and enthusiastic.',
    }
  } else if (score >= 60) {
    return {
      level: 'good',
      color: 'text-blue-600',
      message: 'Good engagement. Shows interest and energy.',
    }
  } else if (score >= 40) {
    return {
      level: 'moderate',
      color: 'text-yellow-600',
      message: 'Moderate engagement. Try to show more enthusiasm.',
    }
  } else {
    return {
      level: 'low',
      color: 'text-red-600',
      message: 'Low engagement. Work on expressing more energy and interest.',
    }
  }
}

export function analyzeVocabularyRichness(text: string): {
  uniqueWords: number
  totalWords: number
  ratio: number
} {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:]/g, ''))
    .filter((w) => w.length > 0)

  const uniqueWords = new Set(words).size

  return {
    uniqueWords,
    totalWords: words.length,
    ratio: words.length > 0 ? uniqueWords / words.length : 0,
  }
}
