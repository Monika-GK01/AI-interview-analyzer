'use client'

import { useEffect, useRef, useState } from 'react'
import { VideoCameraIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface WebcamCaptureProps {
  isActive: boolean
  onStreamReady?: (stream: MediaStream) => void
  onError?: (error: string) => void
}

export default function WebcamCapture({
  isActive,
  onStreamReady,
  onError,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false, // Audio handled separately
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      onStreamReady?.(mediaStream)
    } catch (err: any) {
      const errorMessage = err.name === 'NotAllowedError'
        ? 'Camera access denied. Please allow camera access in your browser settings.'
        : err.name === 'NotFoundError'
        ? 'No camera found. Please connect a camera and try again.'
        : 'Failed to access camera. Please check your camera settings.'

      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white">Starting camera...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-white mb-2 font-medium">Camera Error</p>
            <p className="text-gray-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isActive && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <VideoCameraIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Camera is off</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${
          stream && !error ? 'block' : 'hidden'
        }`}
      />
    </div>
  )
}
