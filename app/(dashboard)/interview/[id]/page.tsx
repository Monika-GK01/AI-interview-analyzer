'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import { useInterview } from '@/hooks/useInterview'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import WebcamCapture from '@/components/interview/WebcamCapture'
import AudioRecorder from '@/components/interview/AudioRecorder'
import TranscriptDisplay from '@/components/interview/TranscriptDisplay'
import InterviewControls from '@/components/interview/InterviewControls'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function InterviewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const {
    interview,
    isLoading: isLoadingInterview,
    error: interviewError,
    startInterview,
    pauseInterview,
    resumeInterview,
    stopInterview,
    isRecording,
    isPaused,
    duration,
  } = useInterview(interviewId)

  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [lastSavedLength, setLastSavedLength] = useState(0)

  // Save transcript chunks to database
  useEffect(() => {
    if (transcript && isRecording && transcript.length > lastSavedLength + 50) {
      const newText = transcript.slice(lastSavedLength)
      saveTranscriptChunk(newText, duration * 1000)
      setLastSavedLength(transcript.length)
    }
  }, [transcript, isRecording, duration, lastSavedLength])

  const saveTranscriptChunk = async (text: string, timestamp: number) => {
    try {
      const supabase = createClient()
      await supabase.from('interview_transcripts').insert({
        interview_id: interviewId,
        text: text.trim(),
        timestamp_ms: timestamp,
      } as any)
    } catch (err) {
      console.error('Failed to save transcript:', err)
    }
  }

  const handleStart = async () => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    setIsStarting(true)
    try {
      await startInterview()
      startListening()
    } catch (err) {
      console.error('Failed to start interview:', err)
    } finally {
      setIsStarting(false)
    }
  }

  const handlePause = () => {
    pauseInterview()
    stopListening()
  }

  const handleResume = () => {
    resumeInterview()
    startListening()
  }

  const handleStop = async () => {
    setIsStopping(true)
    try {
      stopListening()
      
      // Stop media streams
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop())
      }

      await stopInterview()

      // Process analysis
      await fetch('/api/analysis/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview_id: interviewId }),
      })

      // Redirect to report
      router.push(`/reports/${interviewId}`)
    } catch (err) {
      console.error('Failed to stop interview:', err)
      alert('Failed to complete interview. Please try again.')
    } finally {
      setIsStopping(false)
    }
  }

  if (isLoadingInterview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (interviewError || !interview) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                {interviewError || 'Interview not found'}
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{interview.title}</h1>
          <p className="text-gray-600 mt-1">
            {isRecording
              ? 'Interview in progress...'
              : 'Click start when you\'re ready'}
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {speechError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{speechError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Video and Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Feed */}
          <Card>
            <CardBody>
              <WebcamCapture
                isActive={isRecording}
                onStreamReady={setVideoStream}
                onError={(err) => console.error('Webcam error:', err)}
              />

              {/* Recording Indicator Overlay */}
              {isRecording && !isPaused && (
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg">
                    <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                    <span className="font-medium">Recording</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Audio Recorder */}
          <AudioRecorder
            isActive={isRecording}
            onStreamReady={setAudioStream}
            onError={(err) => console.error('Audio error:', err)}
          />

          {/* Controls */}
          <InterviewControls
            isRecording={isRecording}
            isPaused={isPaused}
            duration={duration}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            isStarting={isStarting}
            isStopping={isStopping}
          />
        </div>

        {/* Right Column - Transcript */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TranscriptDisplay transcript={transcript} isRecording={isRecording} />
          </div>
        </div>
      </div>
    </div>
  )
}
