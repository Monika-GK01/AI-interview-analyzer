'use client'

import Button from '@/components/ui/Button'
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid'
import { formatDuration } from '@/lib/utils/format'

interface InterviewControlsProps {
  isRecording: boolean
  isPaused: boolean
  duration: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  isStarting?: boolean
  isStopping?: boolean
}

export default function InterviewControls({
  isRecording,
  isPaused,
  duration,
  onStart,
  onPause,
  onResume,
  onStop,
  isStarting = false,
  isStopping = false,
}: InterviewControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-5xl font-mono font-bold text-gray-900 mb-2">
            {formatDuration(duration)}
          </div>
          <p className="text-sm text-gray-600">
            {!isRecording
              ? 'Ready to start'
              : isPaused
              ? 'Paused'
              : 'Recording in progress'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={onStart}
              isLoading={isStarting}
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
                  onClick={onPause}
                  className="px-6"
                >
                  <PauseIcon className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={onResume}
                  className="px-6"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Resume
                </Button>
              )}

              <Button
                size="lg"
                variant="danger"
                onClick={onStop}
                isLoading={isStopping}
                className="px-6"
              >
                <StopIcon className="h-5 w-5 mr-2" />
                Stop & Analyze
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <div className="text-center max-w-md">
            <p className="text-sm text-gray-600">
              Click "Start Interview" to begin recording. Make sure your camera
              and microphone are enabled.
            </p>
          </div>
        )}

        {isRecording && (
          <div className="text-center max-w-md">
            <p className="text-sm text-gray-600">
              Speak naturally and answer the interview questions. Click "Stop &
              Analyze" when you're done to see your results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
