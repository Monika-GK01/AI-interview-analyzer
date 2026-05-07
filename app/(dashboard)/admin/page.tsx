'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/lib/utils/format'
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface UserData {
  id: string
  email: string
  full_name: string | null
  created_at: string
  interview_count: number
  last_interview: string | null
}

interface Stats {
  totalUsers: number
  totalInterviews: number
  completedInterviews: number
  avgConfidence: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userInterviews, setUserInterviews] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin-login')
        return
      }

      // Verify admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/dashboard')
        return
      }

      loadAdminData()
    } catch (err) {
      console.error('Admin access check failed:', err)
      router.push('/admin-login')
    }
  }

  const loadAdminData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Get all users with their interview counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          created_at,
          interviews:interviews(count)
        `)
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get user emails from auth (you need service role for this in production)
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()

      // Combine data
      const usersData: UserData[] = profiles?.map((profile: any) => {
        const authUser = authUsers?.find((u) => u.id === profile.id)
        return {
          id: profile.id,
          email: authUser?.email || 'N/A',
          full_name: profile.full_name,
          created_at: profile.created_at,
          interview_count: profile.interviews?.[0]?.count || 0,
          last_interview: null,
        }
      }) || []

      setUsers(usersData)

      // Calculate stats
      const { data: interviews } = await supabase
        .from('interviews')
        .select('status')

      const { data: analysis } = await supabase
        .from('interview_analysis')
        .select('confidence_score')

      const avgConfidence = analysis && analysis.length > 0
        ? analysis.reduce((sum, a) => sum + Number(a.confidence_score), 0) / analysis.length
        : 0

      setStats({
        totalUsers: usersData.length,
        totalInterviews: interviews?.length || 0,
        completedInterviews: interviews?.filter((i) => i.status === 'completed').length || 0,
        avgConfidence: Math.round(avgConfidence),
      })
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserInterviews = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          interview_analysis(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserInterviews(data || [])
      setSelectedUser(userId)
    } catch (err) {
      console.error('Failed to load user interviews:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔐 Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage users and view all interview data
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <UsersIcon className="h-12 w-12 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalInterviews}</p>
                </div>
                <DocumentTextIcon className="h-12 w-12 text-green-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completedInterviews}</p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-purple-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgConfidence}%</p>
                </div>
                <ClockIcon className="h-12 w-12 text-orange-500" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Interviews</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{user.full_name || 'N/A'}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {user.interview_count}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => loadUserInterviews(user.id)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                User Interview History
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {userInterviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No interviews found</p>
              ) : (
                <div className="space-y-4">
                  {userInterviews.map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{interview.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          interview.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatDate(interview.created_at)}
                      </p>
                      {interview.interview_analysis && interview.interview_analysis.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-600">Confidence</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {Math.round(interview.interview_analysis[0].confidence_score)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Pace (WPM)</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {Math.round(interview.interview_analysis[0].speaking_pace_wpm)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Filler Words</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {interview.interview_analysis[0].filler_word_count}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Engagement</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {Math.round(interview.interview_analysis[0].emotional_engagement_score)}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
