import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all profiles with interview counts
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        last_login_at,
        login_count,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (profilesError) throw profilesError

    // Get interview counts for each user
    const { data: interviewCounts, error: countsError } = await supabase
      .from('interviews')
      .select('user_id, status')

    if (countsError) throw countsError

    // Aggregate data
    const usersWithStats = profiles?.map((profile) => {
      const userInterviews = interviewCounts?.filter((i) => i.user_id === profile.id) || []
      return {
        ...profile,
        total_interviews: userInterviews.length,
        completed_interviews: userInterviews.filter((i) => i.status === 'completed').length,
      }
    })

    return NextResponse.json({ users: usersWithStats })
  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
