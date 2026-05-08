import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import { processInterviewAnalysis } from '@/lib/analysis/processor'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { interview_id } = body

    if (!interview_id) {
      return NextResponse.json(
        { error: 'Interview ID is required' },
        { status: 400 }
      )
    }

    // Verify interview belongs to user
    // @ts-ignore
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interview_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (interviewError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    // Fetch all transcripts
    const { data: transcripts, error: transcriptsError } = await supabase
      .from('interview_transcripts')
      .select('*')
      .eq('interview_id', interview_id)
      .order('timestamp_ms', { ascending: true })

    if (transcriptsError) throw transcriptsError

    if (!transcripts || transcripts.length === 0) {
      return NextResponse.json(
        { error: 'No transcripts found for this interview' },
        { status: 400 }
      )
    }

    // Process analysis
    const durationSeconds = (interview as any).duration_seconds || 0
    const analysisResult = processInterviewAnalysis(transcripts, durationSeconds)

    // Save analysis to database
    const { data: analysis, error: analysisError } = await supabase
      .from('interview_analysis')
      .upsert({
        interview_id,
        ...analysisResult,
      } as any)
      .select()
      .maybeSingle()

    if (analysisError) throw analysisError

    // Save filler words breakdown
    const fillerWordsData = Object.entries(
      analysisResult.analysis_data.filler_word_breakdown
    ).map(([word, count]) => ({
      interview_id,
      word,
      count: count as number,
    }))

    if (fillerWordsData.length > 0) {
      await supabase.from('filler_words').upsert(fillerWordsData as any)
    }

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Analysis processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process analysis' },
      { status: 500 }
    )
  }
}
