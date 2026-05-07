# Example: Interview Session Implementation

This document provides a complete example of how to implement the interview session page, which is the core feature of the application.

## Overview

The interview session page handles:
1. Webcam and microphone access
2. Real-time speech-to-text transcription
3. Live analysis of speech patterns
4. Recording and saving transcripts
5. Completing and processing the interview

## File: `app/(dashboard)/interview/[id]/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'use'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDuration } from '@/lib/utils/format'
import {
  MicrophoneIcon,
  VideoCameraIcon,
  StopIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'

export default function InterviewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  // State
  const [interview, setInterview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')

  // Media state
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  // Load interview data
  useEffect(() => {
    loadInterview()
  }, [interviewId])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const loadInterview = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', interviewId)
        .single()

      if (error) throw error
      setInterview(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const startInterview = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setVideoStream(stream)

      // Initialize speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser')
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript)
          saveTranscript(finalTranscript, duration * 1000)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
      }

      recognition.start()
      setRecognition(recognition)

      // Update interview status
      const supabase = createClient()
      await supabase
        .from('interviews')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', interviewId)

      setIsRecording(true)
    } catch (err: any) {
      setError(err.message || 'Failed to start interview')
    }
  }

  const pauseInterview = () => {
    if (recognition) {
      recognition.stop()
    }
    setIsPaused(true)
  }

  const resumeInterview = () => {
    if (recognition) {
      recognition.start()
    }
    setIsPaused(false)
  }

  const stopInterview = async () => {
    try {
      // Stop recognition
      if (recognition) {
        recognition.stop()
      }

      // Stop video stream
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }

      // Update interview
      const supabase = createClient()
      await supabase
        .from('interviews')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration_seconds: duration,
        })
        .eq('id', interviewId)

      // Process analysis
      await fetch('/api/analysis/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview_id: interviewId }),
      })

      // Redirect to report
      router.push(`/reports/${interviewId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to stop interview')
    }
  }

  const saveTranscript = async (text: string, timestamp: number) => {
    try {
      const supabase = createClient()
      await supabase.from('interview_transcripts').insert({
        interview_id: interviewId,
        text,
        timestamp_ms: timestamp,
      })
    } catch (err) {
      console.error('Failed to save transcript:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {interview?.title}
        </h1>
        <p className="text-gray-600">
          {isRecording
            ? 'Interview in progress...'
            : 'Click start when you\'re ready'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video and Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Feed */}
          <Card>
            <CardBody>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {videoStream ? (
                  <video
                    ref={(video) => {
                      if (video && videoStream) {
                        video.srcObject = videoStream
                        video.play()
                      }
                    }}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <VideoCameraIcon className="h-24 w-24 text-gray-600" />
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && !isPaused && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}

                {/* Timer */}
                {isRecording && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                    <span className="text-2xl font-mono">
                      {formatDuration(duration)}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Controls */}
          <Card>
            <CardBody>
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    size="lg"
                    onClick={startInterview}
                    className="px-8"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start Interview
                  </Button>
                ) : (
                  <>
                    {!isPaused ? (
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={pauseInterview}
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={resumeInterview}
                      >
                        Resume
                      </Button>
                    )}
                    <Button
                      size="lg"
                      variant="danger"
                      onClick={stopInterview}
                    >
                      <StopIcon className="h-5 w-5 mr-2" />
                      Stop & Analyze
                    </Button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Live Transcript
              </h2>
              <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
                {transcript ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {transcript}
                  </p>
                ) : (
                  <p className="text-gray-400 text-center mt-8">
                    Your speech will appear here...
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

## Key Implementation Notes

### 1. Web Speech API

The Web Speech API is used for real-time transcription:

```typescript
const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition

const recognition = new SpeechRecognition()
recognition.continuous = true  // Keep listening
recognition.interimResults = true  // Get partial results
recognition.lang = 'en-US'
```

### 2. Media Devices API

For webcam and microphone access:

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
})
```

### 3. Real-time Transcript Saving

Transcripts are saved as they're generated:

```typescript
const saveTranscript = async (text: string, timestamp: number) => {
  await supabase.from('interview_transcripts').insert({
    interview_id: interviewId,
    text,
    timestamp_ms: timestamp,
  })
}
```

### 4. Analysis Processing

After stopping, the analysis is triggered:

```typescript
await fetch('/api/analysis/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ interview_id: interviewId }),
})
```

## Browser Compatibility

### Web Speech API Support
- ✅ Chrome/Edge (recommended)
- ✅ Safari (limited)
- ❌ Firefox (not supported)

### Fallback Strategy

For unsupported browsers, you can:
1. Show a message recommending Chrome
2. Integrate an external API (e.g., Google Cloud Speech-to-Text)
3. Allow manual transcript entry

## Testing Checklist

- [ ] Camera permission requested
- [ ] Microphone permission requested
- [ ] Video feed displays correctly
- [ ] Speech is transcribed in real-time
- [ ] Transcript is saved to database
- [ ] Timer counts correctly
- [ ] Pause/resume works
- [ ] Stop triggers analysis
- [ ] Redirects to report page
- [ ] Works on mobile (responsive)

## Common Issues & Solutions

### Issue: "Speech recognition not supported"

**Solution**: Use Chrome or Edge browser

### Issue: "Permission denied"

**Solution**: 
- Check browser permissions
- Use HTTPS (required for getUserMedia)
- In development, localhost is allowed

### Issue: "Transcript not saving"

**Solution**:
- Check network tab for failed requests
- Verify Supabase connection
- Check RLS policies

### Issue: "Video not displaying"

**Solution**:
- Check if stream is active
- Verify video element ref
- Check browser console for errors

## Performance Optimization

1. **Debounce transcript saves** - Don't save every word
2. **Compress video** - Use lower resolution for recording
3. **Lazy load components** - Split code for faster initial load
4. **Use Web Workers** - For heavy analysis computations

## Security Considerations

1. **Always use HTTPS** in production
2. **Validate user owns interview** before starting
3. **Rate limit** API calls
4. **Don't store video** unless explicitly needed
5. **Clear media streams** on unmount

## Next Steps

After implementing the interview session:

1. **Add live analysis display** - Show metrics in real-time
2. **Implement filler word highlighting** - Visual feedback
3. **Add question prompts** - Guide the interview
4. **Create report page** - Display full analysis
5. **Add export functionality** - Download transcripts

---

This example provides a solid foundation for the interview session feature. Customize it based on your specific requirements!
