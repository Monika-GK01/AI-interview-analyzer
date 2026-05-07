'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatRelativeTime, formatDuration } from '@/lib/utils/format'
import { ClockIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import type { Interview } from '@/types/interview'

export default function HistoryPage() {
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all')

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInterviews(data || [])
    } catch (err) {
      console.error('Failed to load interviews:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) {
      return
    }

    try {
      const response = await fetch(`/api/interviews/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setInterviews((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      alert('Failed to delete interview')
    }
  }

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === 'all') return true
    return interview.status === filter
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Interview History
        </h1>
        <p className="text-gray-600">
          View and manage your past interview sessions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({interviews.length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({interviews.filter((i) => i.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({interviews.filter((i) => i.status === 'in_progress').length})
        </Button>
      </div>

      {/* Interview List */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No interviews found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Start your first interview to see it here'
                  : `No ${filter.replace('_', ' ')} interviews`}
              </p>
              <Button onClick={() => router.push('/interview/new')}>
                Start New Interview
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          interview.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : interview.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {interview.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatRelativeTime(interview.created_at)}</span>
                      {interview.duration_seconds && (
                        <span>Duration: {formatDuration(interview.duration_seconds)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {interview.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/reports/${interview.id}`)}
                      >
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                    )}

                    {interview.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => router.push(`/interview/${interview.id}`)}
                      >
                        Continue
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(interview.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
