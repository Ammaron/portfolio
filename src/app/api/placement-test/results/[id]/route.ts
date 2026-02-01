import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, getSessionByCode, getSessionAnswers } from '@/lib/placement-test';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by session code
    let session = await getSessionById(id);
    if (!session) {
      session = await getSessionByCode(id);
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Results not found' },
        { status: 404 }
      );
    }

    // Check if session is completed or reviewed
    if (session.status === 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Test is still in progress' },
        { status: 400 }
      );
    }

    // Get answers for detailed breakdown
    const answers = await getSessionAnswers(session.id);

    // Build response
    const response = {
      success: true,
      session_code: session.session_code,
      student_name: session.student_name,
      test_mode: session.test_mode,
      skills_tested: session.skills_tested,
      status: session.status,
      started_at: session.started_at,
      completed_at: session.completed_at,
      time_spent_minutes: Math.round((session.time_spent_seconds || 0) / 60),
      calculated_level: session.calculated_level,
      level_confidence: session.level_confidence,
      level_breakdown: session.level_breakdown,
      admin_feedback: session.admin_feedback,
      admin_adjusted_level: session.admin_adjusted_level,
      // Summary stats
      total_questions: answers.length,
      auto_scored_correct: answers.filter(a => a.is_correct === true).length,
      auto_scored_total: answers.filter(a => a.is_correct !== undefined).length,
      pending_review: answers.filter(a => a.requires_review && !a.admin_score).length
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
