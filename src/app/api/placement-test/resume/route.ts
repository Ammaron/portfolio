import { NextRequest, NextResponse } from 'next/server';
import { getSessionByCode } from '@/lib/placement-test';

// POST - Resume a session by code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_code } = body;

    if (!session_code) {
      return NextResponse.json(
        { success: false, error: 'Session code is required' },
        { status: 400 }
      );
    }

    const session = await getSessionByCode(session_code);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if session can be resumed
    if (session.status !== 'in_progress') {
      return NextResponse.json({
        success: false,
        error: session.status === 'expired'
          ? 'This session has expired'
          : 'This session has already been completed',
        status: session.status
      }, { status: 400 });
    }

    // Check for session expiry (24 hours)
    const startedAt = new Date(session.started_at);
    const now = new Date();
    const hoursElapsed = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

    if (hoursElapsed > 24) {
      // Mark session as expired
      const { supabaseAdmin } = await import('@/lib/database');
      await supabaseAdmin
        .from('placement_test_sessions')
        .update({ status: 'expired' })
        .eq('id', session.id);

      return NextResponse.json({
        success: false,
        error: 'This session has expired (24 hour limit)',
        status: 'expired'
      }, { status: 400 });
    }

    // Find current question index
    const questionOrder = session.question_order || [];
    const currentIndex = questionOrder.findIndex(q => !q.answered);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        session_code: session.session_code,
        test_mode: session.test_mode,
        skills_tested: session.skills_tested,
        student_name: session.student_name,
        current_question_index: currentIndex >= 0 ? currentIndex : questionOrder.length,
        total_questions: questionOrder.length,
        questions_answered: questionOrder.filter(q => q.answered).length,
        time_spent_seconds: session.time_spent_seconds,
        status: session.status
      }
    });

  } catch (error) {
    console.error('Error resuming session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resume session' },
      { status: 500 }
    );
  }
}
