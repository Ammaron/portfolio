import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionById,
  getQuestionById,
  saveAnswer,
  updateSession,
  updateAdaptiveState,
  cefrToAbility,
  getQuestionsBySkillAndLevel,
  selectNextQuestion,
  CEFR_LEVELS,
  QuestionOrder,
  RawScores,
  SkillType
} from '@/lib/placement-test';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question_index, answer, time_spent_seconds } = body;

    // Validate input
    if (question_index === undefined || answer === undefined) {
      return NextResponse.json(
        { success: false, error: 'question_index and answer are required' },
        { status: 400 }
      );
    }

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
        { success: false, error: 'Session is not active' },
        { status: 400 }
      );
    }

    // Get question from order
    const questionOrder = session.question_order as QuestionOrder[];
    if (question_index < 0 || question_index >= questionOrder.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid question index' },
        { status: 400 }
      );
    }

    const questionRef = questionOrder[question_index];

    // Check if already answered
    if (questionRef.answered) {
      return NextResponse.json(
        { success: false, error: 'Question already answered' },
        { status: 400 }
      );
    }

    // Get full question
    const question = await getQuestionById(questionRef.question_id);
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Determine if answer is correct (for auto-scored questions)
    // Types requiring manual review: open_response, form_filling, short_message, picture_description, interview
    const requiresReview = ['open_response', 'form_filling', 'short_message', 'picture_description', 'interview'].includes(question.question_type) ||
                          question.skill_type === 'writing' ||
                          question.skill_type === 'speaking';

    let isCorrect: boolean | undefined;
    let pointsEarned = 0;

    if (!requiresReview) {
      if (question.question_type === 'true_false_multi') {
        // Parse student answer (array of 'A:true' pairs) and correct answer
        const studentPairs: string[] = Array.isArray(answer) ? answer : JSON.parse(answer);
        const correctPairs = question.correct_answer.split(',').map((s: string) => s.trim().toLowerCase());
        const studentMap = new Map(studentPairs.map((p: string) => {
          const [id, val] = p.toLowerCase().split(':');
          return [id, val];
        }));
        let correctCount = 0;
        for (const cp of correctPairs) {
          const [id, val] = cp.split(':');
          if (studentMap.get(id) === val) correctCount++;
        }
        pointsEarned = correctCount;
        isCorrect = correctCount === correctPairs.length;
      } else {
        // Auto-score the answer (case-insensitive, supports multiple accepted answers separated by ;)
        const studentAnswer = answer.toString().toLowerCase().trim();
        const acceptedAnswers = question.correct_answer.split(';').map((a: string) => a.toLowerCase().trim()).filter(Boolean);
        isCorrect = acceptedAnswers.some((accepted: string) => accepted === studentAnswer);
        pointsEarned = isCorrect ? question.max_points : 0;
      }
    }

    // Update raw scores and adaptive state for this skill (compute before DB calls)
    const rawScores = { ...session.raw_scores } as RawScores;
    const skill = question.skill_type as SkillType;

    if (!rawScores[skill]) {
      rawScores[skill] = {
        correct: 0,
        total: 0,
        points_earned: 0,
        max_points: 0,
        ability_estimate: 0.33,
        questions_answered: 0,
        last_correct: []
      };
    }

    rawScores[skill].total++;
    rawScores[skill].questions_answered++;
    rawScores[skill].max_points += question.max_points;

    if (!requiresReview && isCorrect !== undefined) {
      if (isCorrect) {
        rawScores[skill].correct++;
      }
      rawScores[skill].points_earned += pointsEarned;

      // Update adaptive state
      const questionDifficulty = cefrToAbility(question.cefr_level) +
                                (question.difficulty_rating - 0.5) * 0.15;

      const currentState = {
        ability_estimate: rawScores[skill].ability_estimate,
        questions_answered: rawScores[skill].questions_answered,
        last_correct: rawScores[skill].last_correct,
        stabilized: false,
        convergence_count: 0
      };

      const newState = updateAdaptiveState(currentState, isCorrect, questionDifficulty, question.max_points);
      rawScores[skill].ability_estimate = newState.ability_estimate;
      rawScores[skill].last_correct = newState.last_correct;

      // Dynamic adaptive question selection: replace next unplayed question for this skill
      const nextSameSkillIdx = questionOrder.findIndex(
        (q, i) => i > question_index && !q.answered && q.skill_type === skill
      );

      if (nextSameSkillIdx >= 0) {
        const excludeTypes = session.test_mode === 'quick' ? ['open_response' as const] : undefined;
        const availableQuestions = await getQuestionsBySkillAndLevel(
          skill, [...CEFR_LEVELS], excludeTypes
        );

        // Build set of answered question IDs (already answered + current)
        const answeredIds = new Set<string>();
        questionOrder.forEach(q => { if (q.answered) answeredIds.add(q.question_id); });
        answeredIds.add(question.id);

        const adaptiveState = {
          ability_estimate: newState.ability_estimate,
          questions_answered: newState.questions_answered,
          last_correct: newState.last_correct,
          stabilized: newState.stabilized,
          convergence_count: newState.convergence_count
        };

        const dynamicNext = selectNextQuestion(availableQuestions, adaptiveState, answeredIds);
        if (dynamicNext) {
          questionOrder[nextSameSkillIdx].question_id = dynamicNext.id;
          questionOrder[nextSameSkillIdx].cefr_level = dynamicNext.cefr_level;
        }
      }
    }

    // Mark question as answered in order
    questionOrder[question_index].answered = true;

    // Find next unanswered question (after dynamic replacement so we fetch the right question)
    const nextIndex = questionOrder.findIndex((q, i) => i > question_index && !q.answered);
    const nextQuestionRef = nextIndex >= 0 ? questionOrder[nextIndex] : null;

    // Prepare session update data
    const totalTimeSpent = session.time_spent_seconds + (time_spent_seconds || 0);

    // Run all DB operations in parallel for speed
    const [savedAnswer, , nextQuestionData] = await Promise.all([
      // Save the answer
      saveAnswer({
        session_id: id,
        question_id: question.id,
        student_answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
        is_correct: isCorrect,
        points_earned: pointsEarned,
        max_points: question.max_points,
        time_spent_seconds: time_spent_seconds || 0,
        requires_review: requiresReview
      }),
      // Update session
      updateSession(id, {
        question_order: questionOrder,
        raw_scores: rawScores,
        current_question_index: question_index + 1,
        time_spent_seconds: totalTimeSpent
      }),
      // Fetch next question (if exists)
      nextQuestionRef ? getQuestionById(nextQuestionRef.question_id) : Promise.resolve(null)
    ]);

    if (!savedAnswer) {
      return NextResponse.json(
        { success: false, error: 'Failed to save answer' },
        { status: 500 }
      );
    }

    // Build next question response
    let nextQuestion = null;
    if (nextQuestionData) {
      nextQuestion = {
        id: nextQuestionData.id,
        question_code: nextQuestionData.question_code,
        cefr_level: nextQuestionData.cefr_level,
        skill_type: nextQuestionData.skill_type,
        question_type: nextQuestionData.question_type,
        question_text: nextQuestionData.question_text,
        question_text_es: nextQuestionData.question_text_es,
        passage_text: nextQuestionData.passage_text,
        passage_text_es: nextQuestionData.passage_text_es,
        audio_url: nextQuestionData.audio_url,
        options: nextQuestionData.options?.map(opt => ({
          id: opt.id,
          text: opt.text,
          text_es: opt.text_es
        })),
        max_points: nextQuestionData.max_points,
        time_limit_seconds: nextQuestionData.time_limit_seconds
      };
    }

    return NextResponse.json({
      success: true,
      answer_saved: true,
      is_correct: requiresReview ? null : isCorrect,
      points_earned: pointsEarned,
      next_index: nextIndex >= 0 ? nextIndex : null,
      is_last: nextIndex < 0,
      // Include next question in response to eliminate second API call
      next_question: nextQuestion,
      total_questions: questionOrder.length
    });

  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save answer' },
      { status: 500 }
    );
  }
}
