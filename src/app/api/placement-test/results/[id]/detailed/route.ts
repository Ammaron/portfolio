import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, getSessionByCode, getSessionAnswers } from '@/lib/placement-test';
import { supabaseAdmin } from '@/lib/database';

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

    if (session.status === 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Test is still in progress' },
        { status: 400 }
      );
    }

    // Get answers for detailed breakdown
    const answers = await getSessionAnswers(session.id);

    // Get questions for each answer
    const questionIds = answers.map(a => a.question_id);
    const { data: questions } = await supabaseAdmin
      .from('placement_questions')
      .select('id, question_text, skill_type, question_type, max_points')
      .in('id', questionIds);

    const questionsMap = new Map(questions?.map(q => [q.id, q]) || []);

    // Build detailed answers
    const detailedAnswers = answers.map(answer => {
      const question = questionsMap.get(answer.question_id);
      return {
        question_text: question?.question_text || '',
        skill_type: question?.skill_type || '',
        question_type: question?.question_type || '',
        student_answer: answer.student_answer,
        is_correct: answer.is_correct,
        points_earned: answer.points_earned,
        max_points: answer.max_points,
        admin_score: answer.admin_score,
        admin_feedback: answer.admin_feedback,
        requires_review: answer.requires_review
      };
    });

    // Look up certificate from certifications table
    let certificateIssued = false;
    let certificateCode: string | undefined;

    const { data: cert } = await supabaseAdmin
      .from('certifications')
      .select('certificate_code')
      .eq('placement_session_id', session.id)
      .maybeSingle();

    if (cert) {
      certificateIssued = true;
      certificateCode = cert.certificate_code;
    }

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
      total_questions: answers.length,
      auto_scored_correct: answers.filter(a => a.is_correct === true).length,
      auto_scored_total: answers.filter(a => a.is_correct !== undefined).length,
      pending_review: answers.filter(a => a.requires_review && !a.admin_score).length,
      answers: detailedAnswers,
      certificate_issued: certificateIssued,
      certificate_code: certificateCode
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching detailed results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch detailed results' },
      { status: 500 }
    );
  }
}
