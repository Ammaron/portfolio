import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, getQuestionById } from '@/lib/placement-test';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const indexParam = searchParams.get('index');

    if (!indexParam) {
      return NextResponse.json(
        { success: false, error: 'Question index is required' },
        { status: 400 }
      );
    }

    const index = parseInt(indexParam, 10);

    // Get session
    const session = await getSessionById(id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if session is still active
    if (session.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Session is not active' },
        { status: 400 }
      );
    }

    // Get question from order
    const questionOrder = session.question_order || [];
    if (index < 0 || index >= questionOrder.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid question index' },
        { status: 400 }
      );
    }

    const questionRef = questionOrder[index];
    const question = await getQuestionById(questionRef.question_id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Return question without correct answer
    const safeQuestion = {
      id: question.id,
      question_code: question.question_code,
      cefr_level: question.cefr_level,
      skill_type: question.skill_type,
      question_type: question.question_type,
      question_text: question.question_text,
      question_text_es: question.question_text_es,
      passage_text: question.passage_text,
      passage_text_es: question.passage_text_es,
      audio_url: question.audio_url,
      options: question.options?.map(opt => ({
        id: opt.id,
        text: opt.text,
        text_es: opt.text_es
      })),
      max_points: question.max_points,
      time_limit_seconds: question.time_limit_seconds
    };

    // Find the first unanswered question index for resume functionality
    const firstUnansweredIndex = questionOrder.findIndex(q => !q.answered);

    return NextResponse.json({
      success: true,
      question: safeQuestion,
      index,
      total: questionOrder.length,
      skill_type: questionRef.skill_type,
      answered: questionRef.answered,
      // Include session state for resume functionality
      current_question_index: session.current_question_index,
      first_unanswered_index: firstUnansweredIndex >= 0 ? firstUnansweredIndex : questionOrder.length
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}
