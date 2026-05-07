import { detectFillerWords, calculateFillerWordPercentage } from './filler-words'
import { calculateSpeakingPace, calculatePaceVariance } from './speaking-pace'
import { calculateConfidenceScore } from './confidence'
import { calculateNervousnessScore, calculateRepetitionRate } from './nervousness'
import {
  calculateEmotionalEngagement,
  analyzeVocabularyRichness,
} from './emotional-engagement'
import type { InterviewTranscript } from '@/types/interview'

export interface ProcessedAnalysis {
  confidence_score: number
  speaking_pace_wpm: number
  filler_word_count: number
  filler_word_percentage: number
  nervousness_score: number
  emotional_engagement_score: number
  total_words: number
  unique_words: number
  average_pause_duration_ms: number | null
  longest_pause_duration_ms: number | null
  analysis_data: {
    pace_variance: number
    sentiment_scores: any
    vocabulary_richness: number
    pause_distribution: number[]
    filler_word_breakdown: Record<string, number>
    speaking_pace_over_time: Array<{ timestamp: number; wpm: number }>
    confidence_factors: any
    nervousness_factors: any
    engagement_factors: any
  }
}

export function processInterviewAnalysis(
  transcripts: InterviewTranscript[],
  durationSeconds: number
): ProcessedAnalysis {
  // Combine all transcript text
  const fullText = transcripts.map((t) => t.text).join(' ')

  // Analyze vocabulary
  const { uniqueWords, totalWords, ratio } = analyzeVocabularyRichness(fullText)

  // Detect filler words
  const fillerWordMatches = detectFillerWords(fullText)
  const fillerWordCount = fillerWordMatches.reduce(
    (sum, match) => sum + match.count,
    0
  )
  const fillerWordPercentage = calculateFillerWordPercentage(
    fillerWordCount,
    totalWords
  )

  // Create filler word breakdown
  const fillerWordBreakdown: Record<string, number> = {}
  fillerWordMatches.forEach((match) => {
    fillerWordBreakdown[match.word] = match.count
  })

  // Calculate speaking pace
  const speakingPaceWpm = calculateSpeakingPace(totalWords, durationSeconds)

  // Calculate pace over time (simplified - divide into 10-second segments)
  const speakingPaceOverTime: Array<{ timestamp: number; wpm: number }> = []
  const segmentDuration = 10 // seconds
  const numSegments = Math.ceil(durationSeconds / segmentDuration)

  for (let i = 0; i < numSegments; i++) {
    const segmentStart = i * segmentDuration * 1000 // ms
    const segmentEnd = (i + 1) * segmentDuration * 1000

    const segmentTranscripts = transcripts.filter(
      (t) => t.timestamp_ms >= segmentStart && t.timestamp_ms < segmentEnd
    )

    const segmentText = segmentTranscripts.map((t) => t.text).join(' ')
    const segmentWords = segmentText.split(/\s+/).filter((w) => w.length > 0).length
    const segmentWpm = (segmentWords / segmentDuration) * 60

    speakingPaceOverTime.push({
      timestamp: segmentStart,
      wpm: Math.round(segmentWpm),
    })
  }

  // Calculate pace variance
  const paceVariance = calculatePaceVariance(speakingPaceOverTime)

  // Calculate pause metrics (simplified - based on gaps in transcripts)
  const pauseDurations: number[] = []
  for (let i = 1; i < transcripts.length; i++) {
    const gap = transcripts[i].timestamp_ms - transcripts[i - 1].timestamp_ms
    if (gap > 500) {
      // Consider gaps > 500ms as pauses
      pauseDurations.push(gap)
    }
  }

  const averagePauseDuration =
    pauseDurations.length > 0
      ? Math.round(
          pauseDurations.reduce((sum, d) => sum + d, 0) / pauseDurations.length
        )
      : null

  const longestPauseDuration =
    pauseDurations.length > 0 ? Math.max(...pauseDurations) : null

  const pauseFrequency = pauseDurations.length / (durationSeconds / 60) // pauses per minute

  // Calculate repetition rate
  const repetitionRate = calculateRepetitionRate(fullText)

  // Calculate confidence score
  const { score: confidenceScore, factors: confidenceFactors } =
    calculateConfidenceScore({
      paceVariance,
      fillerWordCount,
      totalWords,
      averagePauseDuration: averagePauseDuration || 0,
      uniqueWords,
      totalDuration: durationSeconds,
    })

  // Calculate nervousness score
  const { score: nervousnessScore, factors: nervousnessFactors } =
    calculateNervousnessScore({
      fillerWordPercentage,
      averagePauseDuration: averagePauseDuration || 0,
      pauseFrequency,
      paceVariance,
      repetitionRate,
    })

  // Calculate emotional engagement
  const {
    score: emotionalEngagementScore,
    factors: engagementFactors,
    sentimentScores,
  } = calculateEmotionalEngagement({
    text: fullText,
    uniqueWords,
    totalWords,
    speakingPaceWpm,
  })

  return {
    confidence_score: confidenceScore,
    speaking_pace_wpm: speakingPaceWpm,
    filler_word_count: fillerWordCount,
    filler_word_percentage: Number(fillerWordPercentage.toFixed(2)),
    nervousness_score: nervousnessScore,
    emotional_engagement_score: emotionalEngagementScore,
    total_words: totalWords,
    unique_words: uniqueWords,
    average_pause_duration_ms: averagePauseDuration,
    longest_pause_duration_ms: longestPauseDuration,
    analysis_data: {
      pace_variance: Number(paceVariance.toFixed(2)),
      sentiment_scores: sentimentScores,
      vocabulary_richness: Number(ratio.toFixed(4)),
      pause_distribution: pauseDurations,
      filler_word_breakdown: fillerWordBreakdown,
      speaking_pace_over_time: speakingPaceOverTime,
      confidence_factors: confidenceFactors,
      nervousness_factors: nervousnessFactors,
      engagement_factors: engagementFactors,
    },
  }
}
