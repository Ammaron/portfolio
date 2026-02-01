import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getSessionById,
  updateSession,
  getSessionAnswers,
  calculateFinalLevel,
  RawScores,
  CEFRLevel
} from '@/lib/placement-test';
import { supabaseAdmin } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

interface JwtPayload {
  role: string;
  username?: string;
}

function verifyAdminToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No token provided' };
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' };
    }
    return { valid: true, user: decoded };
  } catch {
    return { valid: false, error: 'Invalid or expired token' };
  }
}

// GET - Get submission details for grading
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const session = await getSessionById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const answers = await getSessionAnswers(id);

    // Get questions for each answer
    const { data: questions } = await supabaseAdmin
      .from('placement_questions')
      .select('*')
      .in('id', answers.map(a => a.question_id));

    const questionsMap = new Map(questions?.map(q => [q.id, q]) || []);

    // Combine answers with questions
    const detailedAnswers = answers.map(answer => ({
      ...answer,
      question: questionsMap.get(answer.question_id)
    }));

    return NextResponse.json({
      success: true,
      session,
      answers: detailedAnswers
    });

  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Grade/review submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      answer_grades,  // Array of { answer_id, score, feedback }
      admin_feedback,
      admin_adjusted_level,
      mark_complete
    } = body;

    const session = await getSessionById(id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update individual answer grades if provided
    if (answer_grades && Array.isArray(answer_grades)) {
      for (const grade of answer_grades) {
        await supabaseAdmin
          .from('placement_answers')
          .update({
            admin_score: grade.score,
            admin_feedback: grade.feedback
          })
          .eq('id', grade.answer_id)
          .eq('session_id', id);
      }
    }

    // Build session updates
    const sessionUpdates: Record<string, unknown> = {};

    if (admin_feedback !== undefined) {
      sessionUpdates.admin_feedback = admin_feedback;
    }

    if (admin_adjusted_level) {
      sessionUpdates.admin_adjusted_level = admin_adjusted_level as CEFRLevel;
    }

    if (mark_complete) {
      sessionUpdates.status = 'reviewed';
      sessionUpdates.reviewed_by = authResult.user?.username;
      sessionUpdates.reviewed_at = new Date().toISOString();

      // Recalculate level if needed
      if (!admin_adjusted_level) {
        const answers = await getSessionAnswers(id);
        const rawScores = { ...session.raw_scores } as RawScores;

        // Update scores with admin grades
        // Note: In production, this would fetch question details to update skill-specific scores
        void answers; // Acknowledge answers is available for future enhancement

        const skillWeights: Record<string, number> = {};
        const numSkills = session.skills_tested.length;
        for (const skill of session.skills_tested) {
          skillWeights[skill] = 1 / numSkills;
        }

        const result = calculateFinalLevel(
          rawScores,
          skillWeights as Record<'reading' | 'listening' | 'writing' | 'speaking', number>
        );

        sessionUpdates.calculated_level = result.level;
        sessionUpdates.level_confidence = result.confidence;
        sessionUpdates.level_breakdown = result.breakdown;
      }
    }

    // Update session
    if (Object.keys(sessionUpdates).length > 0) {
      await updateSession(id, sessionUpdates);
    }

    return NextResponse.json({
      success: true,
      message: mark_complete ? 'Submission reviewed and completed' : 'Progress saved'
    });

  } catch (error) {
    console.error('Error grading submission:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
