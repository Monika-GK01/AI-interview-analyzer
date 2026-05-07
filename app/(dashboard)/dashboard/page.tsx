import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import {
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { formatRelativeTime, formatDuration } from '@/lib/utils/format'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch recent interviews
  const { data: interviews } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch statistics
  const { count: totalInterviews } = await supabase
    .from('interviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { count: completedInterviews } = await supabase
    .from('interviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('status', 'completed')

  // Fetch average confidence score
  const { data: analysisData } = await supabase
    .from('interview_analysis')
    .select('confidence_score, interview_id')
    .in(
      'interview_id',
      interviews?.map((i) => i.id) || []
    )

  const avgConfidence =
    analysisData && analysisData.length > 0
      ? analysisData.reduce((sum, a) => sum + Number(a.confidence_score), 0) /
        analysisData.length
      : 0

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Ready to practice your interview skills?
        </p>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Link href="/interview/new">
          <Button size="lg" className="w-full sm:w-auto">
            <PlusIcon className="h-5 w-5 mr-2" />
            Start New Interview
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<ClockIcon className="h-8 w-8" />}
          title="Total Interviews"
          value={totalInterviews || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={<TrophyIcon className="h-8 w-8" />}
          title="Completed"
          value={completedInterviews || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={<ChartBarIcon className="h-8 w-8" />}
          title="Avg Confidence"
          value={`${avgConfidence.toFixed(1)}%`}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Interviews */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Interviews
            </h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {interviews && interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={`/reports/${interview.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {interview.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatRelativeTime(interview.created_at)}
                      </p>
                    </div>
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
                  {interview.duration_seconds && (
                    <p className="text-sm text-gray-600 mt-2">
                      Duration: {formatDuration(interview.duration_seconds)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No interviews yet</p>
              <Link href="/interview/new">
                <Button>Start Your First Interview</Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string | number
  color: string
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <div className={`${color} text-white p-3 rounded-lg mr-4`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
