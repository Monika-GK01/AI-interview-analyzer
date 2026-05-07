'use client'

import { useEffect, useRef } from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

interface TranscriptDisplayProps {
  transcript: string
  isRecording: boolean
}

export default function TranscriptDisplay({
  transcript,
  isRecording,
}: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
        </div>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Recording</span>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: '500px' }}
      >
        {transcript ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {transcript}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {isRecording
                  ? 'Start speaking... Your words will appear here'
                  : 'Transcript will appear here when you start recording'}
              </p>
            </div>
          </div>
        )}
      </div>

      {transcript && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Words: {transcript.split(/\s+/).filter(Boolean).length}</span>
            <span>Characters: {transcript.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
