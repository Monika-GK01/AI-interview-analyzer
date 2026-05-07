export interface Interview {
  id: string
  user_id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  started_at: string | null
  completed_at: string | null
  duration_seconds: number | null
  created_at: string
  updated_at: string
}

export interface InterviewTranscript {
  id: string
  interview_id: string
  text: string
  timestamp_ms: number
  created_at: string
}

export interface InterviewAnalysis {
  id: string
  interview_id: string
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
  analysis_data: AnalysisData | null
  created_at: string
  updated_at: string
}

export interface AnalysisData {
  pace_variance: number
  sentiment_scores: {
    positive: number
    negative: number
    neutral: number
  }
  vocabulary_richness: number
  pause_distribution: number[]
  filler_word_breakdown: Record<string, number>
  speaking_pace_over_time: Array<{
    timestamp: number
    wpm: number
  }>
}

export interface FillerWord {
  id: string
  interview_id: string
  word: string
  count: number
  timestamps: number[]
  created_at: string
}

export interface InterviewWithAnalysis extends Interview {
  analysis?: InterviewAnalysis
  filler_words?: FillerWord[]
}

export interface TranscriptSegment {
  text: string
  timestamp: number
  isFinal: boolean
}

export interface AnalysisMetrics {
  confidenceScore: number
  speakingPaceWpm: number
  fillerWordCount: number
  fillerWordPercentage: number
  nervousnessScore: number
  emotionalEngagementScore: number
  totalWords: number
  uniqueWords: number
}
