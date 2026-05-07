'use client'

import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface FillerWordsChartProps {
  fillerWordBreakdown: Record<string, number>
}

export default function FillerWordsChart({ fillerWordBreakdown }: FillerWordsChartProps) {
  const data = Object.entries(fillerWordBreakdown)
    .map(([word, count]) => ({
      word,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10

  const COLORS = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
  ]

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Filler Words</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            <p>No filler words detected! Excellent job!</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Filler Words Breakdown
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Most frequently used filler words
        </p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((item, index) => (
            <div
              key={item.word}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm font-medium text-gray-700">
                "{item.word}"
              </span>
              <span className="text-sm text-gray-600">{item.count}x</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
