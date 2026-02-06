import { NextRequest, NextResponse } from 'next/server';
import {
  createPlacementSession,
  getQuestionsBySkillAndLevel,
  selectNextQuestion,
  initializeAdaptiveState,
  TestMode,
  SkillType,
  CEFR_LEVELS
} from '@/lib/placement-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { test_mode, student_name, student_email, student_phone } = body;

    // Validate required fields
    if (!test_mode || !student_name) {
      return NextResponse.json(
        { success: false, error: 'test_mode and student_name are required' },
        { status: 400 }
      );
    }

    // Validate test mode
    if (!['quick', 'personalized'].includes(test_mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid test mode' },
        { status: 400 }
      );
    }

    // Personalized mode requires email
    if (test_mode === 'personalized' && !student_email) {
      return NextResponse.json(
        { success: false, error: 'Email is required for personalized mode' },
        { status: 400 }
      );
    }

    // Determine skills to test based on mode
    const skills_tested: SkillType[] = test_mode === 'quick'
      ? ['reading', 'listening']
      : ['reading', 'listening', 'writing', 'speaking'];

    // Create the session
    const session = await createPlacementSession({
      test_mode: test_mode as TestMode,
      skills_tested,
      student_name,
      student_email,
      student_phone
    });

    // Build initial question order by fetching questions for each skill
    const questionOrder = [];
    const questionsPerSkill = test_mode === 'quick' ? 10 : 12;

    for (const skill of skills_tested) {
      // Get questions for this skill (exclude open_response for quick tests since they require manual review)
      const excludeTypes: import('@/lib/placement-test').QuestionType[] | undefined = test_mode === 'quick' ? ['open_response'] : undefined;
      const questions = await getQuestionsBySkillAndLevel(skill, [...CEFR_LEVELS], excludeTypes);

      if (questions.length === 0) {
        console.warn(`No questions found for skill: ${skill}`);
        continue;
      }

      // Use adaptive algorithm to select initial questions
      const state = initializeAdaptiveState();
      const selectedIds = new Set<string>();

      for (let i = 0; i < Math.min(questionsPerSkill, questions.length); i++) {
        const nextQuestion = selectNextQuestion(questions, state, selectedIds);
        if (nextQuestion) {
          selectedIds.add(nextQuestion.id);
          questionOrder.push({
            question_id: nextQuestion.id,
            skill_type: skill,
            cefr_level: nextQuestion.cefr_level,
            answered: false
          });
        }
      }
    }

    // Update session with question order
    const { supabaseAdmin } = await import('@/lib/database');
    await supabaseAdmin
      .from('placement_test_sessions')
      .update({ question_order: questionOrder })
      .eq('id', session.id);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        session_code: session.session_code,
        test_mode: session.test_mode,
        skills_tested: session.skills_tested,
        total_questions: questionOrder.length,
        status: session.status
      }
    });

  } catch (error) {
    console.error('Error starting placement test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start placement test' },
      { status: 500 }
    );
  }
}
