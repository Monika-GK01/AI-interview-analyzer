import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Interview } from '@/types/interview'

interface UseInterviewReturn {
  interview: Interview | null
  isLoading: boolean
  error: string | null
  startInterview: () => Promise<void>
  pauseInterview: () => void
  resumeInterview: () => void
  stopInterview: () => Promise<void>
  isRecording: boolean
  isPaused: boolean
  duration: number
}

export function useInterview(interviewId: string): UseInterviewReturn {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Load interview data
  useEffect(() => {
    loadInterview()
  }, [interviewId])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, isPaused, startTime])

  const loadInterview = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', interviewId)
        .single()

      if (error) throw error
      setInterview(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load interview')
    } finally {
      setIsLoading(false)
    }
  }

  const startInterview = useCallback(async () => {
    try {
      const supabase = createClient()
      const now = new Date().toISOString()

      const { error } = await supabase
        .from('interviews')
        // @ts-ignore
        .update({
          status: 'in_progress',
          started_at: now,
        })
        .eq('id', interviewId)

      if (error) throw error

      setIsRecording(true)
      setStartTime(Date.now())
      setDuration(0)
    } catch (err: any) {
      setError(err.message || 'Failed to start interview')
      throw err
    }
  }, [interviewId])

  const pauseInterview = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeInterview = useCallback(() => {
    setIsPaused(false)
  }, [])

  const stopInterview = useCallback(async () => {
    try {
      const supabase = createClient()
      const now = new Date().toISOString()

      const { error } = await supabase
        .from('interviews')
        // @ts-ignore
        .update({
          status: 'completed',
          completed_at: now,
          duration_seconds: duration,
        })
        .eq('id', interviewId)

      if (error) throw error

      setIsRecording(false)
      setIsPaused(false)
    } catch (err: any) {
      setError(err.message || 'Failed to stop interview')
      throw err
    }
  }, [interviewId, duration])

  return {
    interview,
    isLoading,
    error,
    startInterview,
    pauseInterview,
    resumeInterview,
    stopInterview,
    isRecording,
    isPaused,
    duration,
  }
}
