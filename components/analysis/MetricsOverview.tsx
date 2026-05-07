'use client'

import Card, { CardBody } from '@/components/ui/Card'
import {
  ChartBarIcon,
  BoltIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface MetricsOverviewProps {
  confidenceScore: number
  speakingPaceWpm: number
  nervousnessScore: number
  emotionalEngagementScore: number
}

export default function MetricsOverview({
  confidenceScore,
  speakingPaceWpm,
  nervousnessScore,
  emotionalEngagementScore,
}: MetricsOverviewProps) {
  const metrics = [
    {
      label: 'Confidence',
      value: confidenceScore,
      icon: ChartBarIcon,
      color: getScoreColor(confidenceScore),
      bgColor: getScoreBgColor(confidenceScore),
    },
    {
      label: 'Speaking Pace',
      value: speakingPaceWpm,
      suffix: ' WPM',
      icon: BoltIcon,
      color: getPaceColor(speakingPaceWpm),
      bgColor: getPaceBgColor(speakingPaceWpm),
    },
    {
      label: 'Calmness',
      value: 100 - nervousnessScore,
      icon: FaceSmileIcon,
      color: getScoreColor(100 - nervousnessScore),
      bgColor: getScoreBgColor(100 - nervousnessScore),
    },
    {
      label: 'Engagement',
      value: emotionalEngagementScore,
      icon: ExclamationCircleIcon,
      color: getScoreColor(emotionalEngagementScore),
      bgColor: getScoreBgColor(emotionalEngagementScore),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold ${metric.color}`}>
                  {Math.round(metric.value)}
                  {metric.suffix || ''}
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${metric.bgColor}`}
                    style={{
                      width: `${Math.min(
                        100,
                        metric.suffix ? (metric.value / 200) * 100 : metric.value
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className={`ml-4 p-3 rounded-lg ${metric.bgColor} bg-opacity-20`}>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getPaceColor(wpm: number): string {
  if (wpm >= 120 && wpm <= 160) return 'text-green-600'
  if (wpm >= 100 && wpm <= 180) return 'text-blue-600'
  return 'text-yellow-600'
}

function getPaceBgColor(wpm: number): string {
  if (wpm >= 120 && wpm <= 160) return 'bg-green-500'
  if (wpm >= 100 && wpm <= 180) return 'bg-blue-500'
  return 'bg-yellow-500'
}
