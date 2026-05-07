export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          last_login_at: string | null
          login_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          last_login_at?: string | null
          login_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          last_login_at?: string | null
          login_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      interviews: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          title: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          started_at?: string | null
          completed_at?: string | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          started_at?: string | null
          completed_at?: string | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      interview_transcripts: {
        Row: {
          id: string
          interview_id: string
          text: string
          timestamp_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          text: string
          timestamp_ms: number
          created_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          text?: string
          timestamp_ms?: number
          created_at?: string
        }
      }
      interview_analysis: {
        Row: {
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
          analysis_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          confidence_score: number
          speaking_pace_wpm: number
          filler_word_count?: number
          filler_word_percentage?: number
          nervousness_score: number
          emotional_engagement_score: number
          total_words?: number
          unique_words?: number
          average_pause_duration_ms?: number | null
          longest_pause_duration_ms?: number | null
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          confidence_score?: number
          speaking_pace_wpm?: number
          filler_word_count?: number
          filler_word_percentage?: number
          nervousness_score?: number
          emotional_engagement_score?: number
          total_words?: number
          unique_words?: number
          average_pause_duration_ms?: number | null
          longest_pause_duration_ms?: number | null
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      filler_words: {
        Row: {
          id: string
          interview_id: string
          word: string
          count: number
          timestamps: number[]
          created_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          word: string
          count?: number
          timestamps?: number[]
          created_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          word?: string
          count?: number
          timestamps?: number[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
