import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/database';
import { PlacementQuestion, CEFRLevel, SkillType, QuestionType } from '@/lib/placement-test';

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

// GET - List questions with filters
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill') as SkillType | null;
    const level = searchParams.get('level') as CEFRLevel | null;
    const type = searchParams.get('type') as QuestionType | null;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sortField = searchParams.get('sort') || 'cefr_level';
    const sortOrder = searchParams.get('order') || 'asc';

    let query = supabaseAdmin
      .from('placement_questions')
      .select('*', { count: 'exact' });

    if (skill) query = query.eq('skill_type', skill);
    if (level) query = query.eq('cefr_level', level);
    if (type) query = query.eq('question_type', type);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('question_text', `%${search}%`);

    const { data, error, count } = await query
      .order(sortField, { ascending: sortOrder !== 'desc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      questions: data || [],
      total: count || 0
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create new question
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

    // Validate required fields
    const required = ['question_code', 'cefr_level', 'skill_type', 'question_type', 'question_text', 'correct_answer', 'max_points'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate question code
    const { data: existing } = await supabaseAdmin
      .from('placement_questions')
      .select('id')
      .eq('question_code', body.question_code)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Question code already exists' },
        { status: 400 }
      );
    }

    const questionData: Omit<PlacementQuestion, 'id' | 'created_at' | 'updated_at'> = {
      question_code: body.question_code,
      cefr_level: body.cefr_level,
      skill_type: body.skill_type,
      question_type: body.question_type,
      question_text: body.question_text,
      question_text_es: body.question_text_es,
      passage_text: body.passage_text,
      passage_text_es: body.passage_text_es,
      audio_url: body.audio_url,
      image_url: body.image_url,
      options: body.options,
      correct_answer: body.correct_answer,
      max_points: body.max_points,
      difficulty_rating: body.difficulty_rating || 0.5,
      discrimination_index: body.discrimination_index || 0.5,
      time_limit_seconds: body.time_limit_seconds,
      rubric: body.rubric,
      status: body.status || 'active'
    };

    const { data, error } = await supabaseAdmin
      .from('placement_questions')
      .insert(questionData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      question: data
    });

  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update question
export async function PUT(request: NextRequest) {
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

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('placement_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      question: data
    });

  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete question
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('placement_questions')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Question deleted'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
