import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { importQuestionsFromData, PlacementQuestion, CEFRLevel, SkillType, QuestionType } from '@/lib/placement-test';

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

// Valid values for validation
const VALID_LEVELS: CEFRLevel[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const VALID_SKILLS: SkillType[] = ['reading', 'listening', 'writing', 'speaking'];
const VALID_TYPES: string[] = ['mcq', 'true_false', 'gap_fill', 'matching', 'open_response', 'form_filling', 'short_message', 'picture_description', 'interview'];

// POST - Import questions from JSON data (parsed from Excel on frontend)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: 'Questions array is required' },
        { status: 400 }
      );
    }

    // Validate and transform questions
    const validatedQuestions: Omit<PlacementQuestion, 'id' | 'created_at' | 'updated_at'>[] = [];
    const validationErrors: string[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const rowNum = i + 2; // Assuming row 1 is header

      // Validate required fields
      if (!q.question_code) {
        validationErrors.push(`Row ${rowNum}: Missing question_code`);
        continue;
      }
      // Normalize cefr_level: handle case variations like "PRE-A1", "pre-a1", etc.
      const normalizedLevel = q.cefr_level
        ? VALID_LEVELS.find((l) => l.toLowerCase() === q.cefr_level.toLowerCase())
        : null;
      if (!normalizedLevel) {
        validationErrors.push(`Row ${rowNum}: Invalid cefr_level "${q.cefr_level}"`);
        continue;
      }
      if (!q.skill_type || !VALID_SKILLS.includes(q.skill_type.toLowerCase())) {
        validationErrors.push(`Row ${rowNum}: Invalid skill_type "${q.skill_type}"`);
        continue;
      }
      if (!q.question_type || !VALID_TYPES.includes(q.question_type.toLowerCase())) {
        validationErrors.push(`Row ${rowNum}: Invalid question_type "${q.question_type}"`);
        continue;
      }
      if (!q.question_text) {
        validationErrors.push(`Row ${rowNum}: Missing question_text`);
        continue;
      }
      if (!q.correct_answer) {
        validationErrors.push(`Row ${rowNum}: Missing correct_answer`);
        continue;
      }

      // Parse options if present
      let options = null;
      if (q.options) {
        try {
          if (typeof q.options === 'string') {
            // Try to parse as JSON or split by delimiter
            if (q.options.startsWith('[')) {
              options = JSON.parse(q.options);
            } else {
              // Split by | or ; and create option objects
              const optionTexts = q.options.split(/[|;]/).map((t: string) => t.trim()).filter((t: string) => t);
              options = optionTexts.map((text: string, idx: number) => ({
                id: String.fromCharCode(65 + idx), // A, B, C, D...
                text: text
              }));
            }
          } else if (Array.isArray(q.options)) {
            options = q.options;
          }
        } catch {
          validationErrors.push(`Row ${rowNum}: Invalid options format`);
        }
      }

      // Parse rubric if present
      let rubric = null;
      if (q.rubric) {
        try {
          rubric = typeof q.rubric === 'string' ? JSON.parse(q.rubric) : q.rubric;
        } catch {
          // Ignore rubric parsing errors
        }
      }

      validatedQuestions.push({
        question_code: q.question_code,
        cefr_level: normalizedLevel,
        skill_type: q.skill_type.toLowerCase() as SkillType,
        question_type: q.question_type.toLowerCase() as QuestionType,
        question_text: q.question_text,
        question_text_es: q.question_text_es || null,
        passage_text: q.passage_text || null,
        passage_text_es: q.passage_text_es || null,
        audio_url: q.audio_url || null,
        image_url: q.image_url || null,
        options: options,
        correct_answer: String(q.correct_answer),
        max_points: Number(q.max_points) || 1,
        difficulty_rating: Number(q.difficulty_rating) || 0.5,
        discrimination_index: Number(q.discrimination_index) || 0.5,
        time_limit_seconds: q.time_limit_seconds ? Number(q.time_limit_seconds) : undefined,
        rubric: rubric,
        status: 'active'
      });
    }

    // Import validated questions
    const result = await importQuestionsFromData(validatedQuestions);

    return NextResponse.json({
      success: true,
      imported: result.imported,
      total_submitted: questions.length,
      validation_errors: validationErrors,
      import_errors: result.errors
    });

  } catch (error) {
    console.error('Error importing questions:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during import' },
      { status: 500 }
    );
  }
}
