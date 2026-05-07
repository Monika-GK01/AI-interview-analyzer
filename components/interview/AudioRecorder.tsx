'use client'

import { useEffect, useState, useRef } from 'react'
import { MicrophoneIcon } from '@heroicons/react/24/outline'

interface AudioRecorderProps {
  isActive: boolean
  onStreamReady?: (stream: MediaStream) => void
  onError?: (error: string) => void
}

export default function AudioRecorder({
  isActive,
  onStreamReady,
  onError,
}: AudioRecorderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (isActive) {
      startAudio()
    } else {
      stopAudio()
    }

    return () => {
      stopAudio()
    }
  }, [isActive])

  const startAudio = async () => {
    try {
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      setStream(mediaStream)
      onStreamReady?.(mediaStream)

      // Set up audio level visualization
      setupAudioVisualization(mediaStream)
    } catch (err: any) {
      const errorMessage = err.name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow microphone access.'
        : 'Failed to access microphone. Please check your settings.'

      setError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const setupAudioVisualization = (mediaStream: MediaStream) => {
    try {
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(mediaStream)

      analyser.fftSize = 256
      microphone.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      updateAudioLevel()
    } catch (err) {
      console.error('Failed to setup audio visualization:', err)
    }
  }

  const updateAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    const normalizedLevel = Math.min(100, (average / 128) * 100)

    setAudioLevel(normalizedLevel)

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }

  const stopAudio = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    analyserRef.current = null
    setAudioLevel(0)
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <MicrophoneIcon
        className={`h-6 w-6 ${
          isActive && !error ? 'text-red-500 animate-pulse' : 'text-gray-400'
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {error ? 'Microphone Error' : isActive ? 'Recording' : 'Microphone Off'}
          </span>
          {isActive && !error && (
            <span className="text-xs text-gray-500">{Math.round(audioLevel)}%</span>
          )}
        </div>

        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
