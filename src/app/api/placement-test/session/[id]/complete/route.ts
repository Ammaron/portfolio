import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionById,
  updateSession,
  calculateFinalLevel,
  RawScores,
  SessionStatus
} from '@/lib/placement-test';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session
    const session = await getSessionById(id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if session is active
    if (session.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Session is not active or already completed' },
        { status: 400 }
      );
    }

    const rawScores = session.raw_scores as RawScores;

    // Check if any answers require review
    const hasManualReview = session.test_mode === 'personalized';

    // Calculate weights based on skills tested
    const skillWeights: Record<string, number> = {};
    const numSkills = session.skills_tested.length;
    for (const skill of session.skills_tested) {
      skillWeights[skill] = 1 / numSkills;
    }

    // Calculate final level
    const result = calculateFinalLevel(rawScores, skillWeights as Record<'reading' | 'listening' | 'writing' | 'speaking', number>);

    // Determine status
    let status: SessionStatus = 'completed';
    if (hasManualReview) {
      status = 'pending_review';
    }

    // Update session with results
    const updatedSession = await updateSession(id, {
      status,
      completed_at: new Date().toISOString(),
      calculated_level: result.level,
      level_confidence: result.confidence,
      level_breakdown: result.breakdown
    });

    if (!updatedSession) {
      return NextResponse.json(
        { success: false, error: 'Failed to complete session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session_id: id,
      session_code: session.session_code,
      status,
      calculated_level: result.level,
      level_confidence: result.confidence,
      level_breakdown: result.breakdown,
      requires_review: hasManualReview
    });

  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}
