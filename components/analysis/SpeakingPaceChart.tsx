'use client'

import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface SpeakingPaceChartProps {
  paceOverTime: Array<{ timestamp: number; wpm: number }>
}

export default function SpeakingPaceChart({ paceOverTime }: SpeakingPaceChartProps) {
  const data = paceOverTime.map((point, index) => ({
    time: `${Math.floor(point.timestamp / 1000 / 60)}:${String(
      Math.floor((point.timestamp / 1000) % 60)
    ).padStart(2, '0')}`,
    wpm: point.wpm,
  }))

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Speaking Pace Over Time
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Words per minute throughout the interview
        </p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 200]} />
            <Tooltip />
            <ReferenceLine
              y={120}
              stroke="#22c55e"
              strokeDasharray="3 3"
              label="Ideal Min"
            />
            <ReferenceLine
              y={160}
              stroke="#22c55e"
              strokeDasharray="3 3"
              label="Ideal Max"
            />
            <Line
              type="monotone"
              dataKey="wpm"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span className="text-gray-600">Ideal Range: 120-160 WPM</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
