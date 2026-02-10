// Placement Test Core Library
import { supabase, supabaseAdmin } from './database';

// CEFR Level Constants
export const CEFR_LEVELS = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CEFRLevel = typeof CEFR_LEVELS[number];

// Level numeric mapping (for calculations)
export const CEFR_NUMERIC: Record<CEFRLevel, number> = {
  'Pre-A1': 0, 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
};

export const NUMERIC_TO_CEFR: Record<number, CEFRLevel> = {
  0: 'Pre-A1', 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2'
};

// Skill types
export const SKILL_TYPES = ['reading', 'listening', 'writing', 'speaking'] as const;
export type SkillType = typeof SKILL_TYPES[number];

// Question types
export const QUESTION_TYPES = ['mcq', 'true_false', 'true_false_multi', 'gap_fill', 'matching', 'open_response'] as const;
export type QuestionType = typeof QUESTION_TYPES[number];

// Test modes
export const TEST_MODES = ['quick', 'personalized', 'advanced'] as const;
export type TestMode = typeof TEST_MODES[number];

// Test session statuses
export const SESSION_STATUSES = ['in_progress', 'completed', 'pending_review', 'reviewed', 'expired'] as const;
export type SessionStatus = typeof SESSION_STATUSES[number];

// Level colors for UI
export const LEVEL_COLORS: Record<CEFRLevel, { bg: string; text: string; border: string; gradient: string }> = {
  'Pre-A1': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-400', gradient: 'from-gray-400 to-gray-600' },
  'A1': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-400', gradient: 'from-emerald-400 to-emerald-600' },
  'A2': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-400', gradient: 'from-teal-400 to-teal-600' },
  'B1': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400', gradient: 'from-blue-400 to-blue-600' },
  'B2': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-400', gradient: 'from-indigo-400 to-indigo-600' },
  'C1': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-400', gradient: 'from-purple-400 to-purple-600' },
  'C2': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-400', gradient: 'from-amber-400 to-amber-600' }
};

// Interfaces

export interface PlacementQuestion {
  id: string;
  question_code: string;
  cefr_level: CEFRLevel;
  skill_type: SkillType;
  question_type: QuestionType;
  question_text: string;
  question_text_es?: string;
  passage_text?: string;
  passage_text_es?: string;
  audio_url?: string;
  image_url?: string;
  options?: QuestionOption[];
  correct_answer: string;
  max_points: number;
  difficulty_rating: number; // 0-1 scale within level
  discrimination_index: number; // How well it distinguishes between levels
  time_limit_seconds?: number;
  rubric?: GradingRubric;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  text_es?: string;
  audio_url?: string;
  is_correct?: boolean; // For matching questions, stores match info
}

export interface GradingRubric {
  criteria: RubricCriterion[];
  max_total: number;
}

export interface RubricCriterion {
  name: string;
  name_es?: string;
  description: string;
  description_es?: string;
  max_points: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  points: number;
  description: string;
  description_es?: string;
}

export interface PlacementTestSession {
  id: string;
  session_code: string;
  test_mode: TestMode;
  skills_tested: SkillType[];
  student_name: string;
  student_email?: string;
  student_phone?: string;
  status: SessionStatus;
  started_at: string;
  completed_at?: string;
  time_spent_seconds: number;
  current_question_index: number;
  question_order: QuestionOrder[];
  raw_scores: RawScores;
  calculated_level?: CEFRLevel;
  level_confidence?: number; // 0-1
  level_breakdown?: LevelBreakdown;
  admin_feedback?: string;
  admin_adjusted_level?: CEFRLevel;
  reviewed_by?: string;
  reviewed_at?: string;
  certificate_issued_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOrder {
  question_id: string;
  skill_type: SkillType;
  cefr_level: CEFRLevel;
  answered: boolean;
}

export interface RawScores {
  [skill: string]: {
    correct: number;
    total: number;
    points_earned: number;
    max_points: number;
    ability_estimate: number; // 0-1 scale for adaptive algorithm
    questions_answered: number;
    last_correct: boolean[];
  };
}

export interface LevelBreakdown {
  [skill: string]: {
    level: CEFRLevel;
    confidence: number;
    ability_estimate: number;
    description: string;
  };
}

export interface PlacementAnswer {
  id: string;
  session_id: string;
  question_id: string;
  student_answer: string;
  is_correct?: boolean;
  points_earned: number;
  max_points: number;
  time_spent_seconds: number;
  requires_review: boolean;
  admin_score?: number;
  admin_feedback?: string;
  created_at: string;
}

export interface PlacementTestConfig {
  id: string;
  config_key: string;
  config_value: string;
  description?: string;
  updated_at: string;
}

// Utility Functions

// Generate unique session code
export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars (I,O,0,1)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format: XXXX-XXXX
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

// Convert ability estimate (0-1) to CEFR level
export function abilityToCEFR(ability: number): CEFRLevel {
  if (ability < 0.10) return 'Pre-A1';
  if (ability < 0.25) return 'A1';
  if (ability < 0.40) return 'A2';
  if (ability < 0.55) return 'B1';
  if (ability < 0.70) return 'B2';
  if (ability < 0.85) return 'C1';
  return 'C2';
}

// Convert CEFR level to ability estimate midpoint
export function cefrToAbility(level: CEFRLevel): number {
  const midpoints: Record<CEFRLevel, number> = {
    'Pre-A1': 0.05, 'A1': 0.175, 'A2': 0.325, 'B1': 0.475, 'B2': 0.625, 'C1': 0.775, 'C2': 0.925
  };
  return midpoints[level];
}

// Adaptive Algorithm

export interface AdaptiveState {
  ability_estimate: number;
  questions_answered: number;
  last_correct: boolean[];
  stabilized: boolean;
  convergence_count: number;
}

export function initializeAdaptiveState(): AdaptiveState {
  return {
    ability_estimate: 0.33, // Start at A2/B1 boundary
    questions_answered: 0,
    last_correct: [],
    stabilized: false,
    convergence_count: 0
  };
}

export function updateAdaptiveState(
  state: AdaptiveState,
  correct: boolean,
  questionDifficulty: number,
  maxPoints: number = 1
): AdaptiveState {
  const newState = { ...state };
  newState.questions_answered++;
  newState.last_correct.push(correct);

  // Keep only last 5 answers for convergence check
  if (newState.last_correct.length > 5) {
    newState.last_correct.shift();
  }

  // Points weight: questions worth more points have a bigger impact on ability estimate
  // A 1-point question = 1x, a 3-point question = ~1.5x, a 5-point question = ~1.8x
  // Using logarithmic scaling to avoid extreme swings from high-point questions
  const pointsWeight = 1 + Math.log2(Math.max(1, maxPoints)) * 0.25;

  // Calculate adjustment - decreases as test progresses
  const baseAdjustment = 0.15;
  const decayFactor = Math.max(0.3, 1 - (newState.questions_answered * 0.05));
  const difficultyBonus = Math.abs(questionDifficulty - newState.ability_estimate) * 0.5;

  let adjustment = baseAdjustment * decayFactor * pointsWeight;

  // Larger adjustment for surprising results
  if (correct && questionDifficulty > newState.ability_estimate) {
    adjustment += difficultyBonus;
  } else if (!correct && questionDifficulty < newState.ability_estimate) {
    adjustment += difficultyBonus;
  }

  // Update ability estimate
  if (correct) {
    newState.ability_estimate = Math.min(1, newState.ability_estimate + adjustment);
  } else {
    newState.ability_estimate = Math.max(0, newState.ability_estimate - adjustment);
  }

  // Check for convergence (stabilization)
  if (newState.last_correct.length >= 3) {
    const lastThree = newState.last_correct.slice(-3);
    const allSame = lastThree.every(c => c === lastThree[0]);
    const mixed = !allSame;

    // If we have mixed results at current level, we're converging
    if (mixed) {
      newState.convergence_count++;
    } else {
      newState.convergence_count = 0;
    }

    // Stabilized if we have 2+ convergence counts or answered 8+ questions
    if (newState.convergence_count >= 2 || newState.questions_answered >= 8) {
      newState.stabilized = true;
    }
  }

  return newState;
}

export function selectNextQuestion(
  availableQuestions: PlacementQuestion[],
  state: AdaptiveState,
  answeredQuestionIds: Set<string>
): PlacementQuestion | null {
  // Filter out already answered questions
  const unanswered = availableQuestions.filter(q => !answeredQuestionIds.has(q.id));

  if (unanswered.length === 0) return null;

  // Target ability for next question
  const targetAbility = state.ability_estimate;

  // Score each question based on:
  // 1. Closeness to target ability
  // 2. Discrimination index (higher is better)
  const scoredQuestions = unanswered.map(q => {
    const questionAbility = cefrToAbility(q.cefr_level) + (q.difficulty_rating - 0.5) * 0.15;
    const abilityDiff = Math.abs(questionAbility - targetAbility);
    const score = (1 - abilityDiff) * 0.7 + q.discrimination_index * 0.3;
    return { question: q, score };
  });

  // Sort by score and return the best match
  scoredQuestions.sort((a, b) => b.score - a.score);

  // Add some randomness to top 3 candidates
  const topCandidates = scoredQuestions.slice(0, Math.min(3, scoredQuestions.length));
  const selectedIndex = Math.floor(Math.random() * topCandidates.length);

  return topCandidates[selectedIndex].question;
}

// Level Calculation

export function calculateFinalLevel(
  skillScores: RawScores,
  weights: Record<SkillType, number> = { reading: 0.25, listening: 0.25, writing: 0.25, speaking: 0.25 }
): { level: CEFRLevel; confidence: number; breakdown: LevelBreakdown } {
  const breakdown: LevelBreakdown = {};
  let weightedSum = 0;
  let totalWeight = 0;
  let totalConfidence = 0;

  for (const skill of Object.keys(skillScores) as SkillType[]) {
    const skillData = skillScores[skill];
    const level = abilityToCEFR(skillData.ability_estimate);

    // Calculate confidence based on convergence and consistency
    const questionsAnswered = skillData.questions_answered;
    const consistencyScore = calculateConsistency(skillData.last_correct);
    const confidence = Math.min(1, (questionsAnswered / 10) * 0.6 + consistencyScore * 0.4);

    breakdown[skill] = {
      level,
      confidence,
      ability_estimate: skillData.ability_estimate,
      description: getLevelDescription(level, skill)
    };

    const weight = weights[skill] || 0.25;
    weightedSum += skillData.ability_estimate * weight;
    totalWeight += weight;
    totalConfidence += confidence * weight;
  }

  const finalAbility = weightedSum / totalWeight;
  const finalLevel = abilityToCEFR(finalAbility);
  const avgConfidence = totalConfidence / totalWeight;

  return {
    level: finalLevel,
    confidence: avgConfidence,
    breakdown
  };
}

function calculateConsistency(lastCorrect: boolean[]): number {
  if (lastCorrect.length < 2) return 0.5;

  let changes = 0;
  for (let i = 1; i < lastCorrect.length; i++) {
    if (lastCorrect[i] !== lastCorrect[i - 1]) changes++;
  }

  // More changes means better targeting (mixed results at correct level)
  // But too many changes means unstable
  const changeRate = changes / (lastCorrect.length - 1);
  if (changeRate >= 0.3 && changeRate <= 0.7) return 1;
  return 0.6;
}

function getLevelDescription(level: CEFRLevel, skill: SkillType): string {
  const descriptions: Record<CEFRLevel, Record<SkillType, string>> = {
    'Pre-A1': {
      reading: 'Cannot yet understand simple words or phrases',
      listening: 'Cannot yet follow simple spoken instructions',
      writing: 'Cannot yet write simple words or phrases',
      speaking: 'Cannot yet produce basic spoken phrases'
    },
    'A1': {
      reading: 'Can understand familiar names and simple sentences',
      listening: 'Can recognize familiar words in simple speech',
      writing: 'Can write simple phrases and sentences',
      speaking: 'Can use basic phrases and introduce themselves'
    },
    'A2': {
      reading: 'Can read short, simple texts and find information',
      listening: 'Can understand phrases and common vocabulary',
      writing: 'Can write short, simple notes and messages',
      speaking: 'Can communicate in simple routine tasks'
    },
    'B1': {
      reading: 'Can understand texts on familiar matters',
      listening: 'Can understand main points of clear standard speech',
      writing: 'Can write simple connected text on familiar topics',
      speaking: 'Can deal with most situations while traveling'
    },
    'B2': {
      reading: 'Can read articles on contemporary problems',
      listening: 'Can understand extended speech and lectures',
      writing: 'Can write clear, detailed text on various subjects',
      speaking: 'Can interact fluently with native speakers'
    },
    'C1': {
      reading: 'Can understand long and complex texts',
      listening: 'Can understand extended speech even when not clearly structured',
      writing: 'Can express ideas fluently and spontaneously',
      speaking: 'Can use language flexibly for social and professional purposes'
    },
    'C2': {
      reading: 'Can understand virtually everything read',
      listening: 'Can understand any kind of spoken language',
      writing: 'Can write complex text with appropriate style',
      speaking: 'Can express themselves spontaneously with precision'
    }
  };

  return descriptions[level][skill];
}

// Database Operations

export async function createPlacementSession(
  data: {
    test_mode: TestMode;
    skills_tested: SkillType[];
    student_name: string;
    student_email?: string;
    student_phone?: string;
  }
): Promise<PlacementTestSession> {
  let session_code: string;
  let attempts = 0;
  const maxAttempts = 5;

  // Ensure unique session code
  do {
    session_code = generateSessionCode();
    const { data: existing } = await supabaseAdmin
      .from('placement_test_sessions')
      .select('session_code')
      .eq('session_code', session_code)
      .maybeSingle();

    if (!existing) break;
    attempts++;
  } while (attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique session code');
  }

  // Initialize raw scores for each skill
  const raw_scores: RawScores = {};
  for (const skill of data.skills_tested) {
    raw_scores[skill] = {
      correct: 0,
      total: 0,
      points_earned: 0,
      max_points: 0,
      ability_estimate: 0.33,
      questions_answered: 0,
      last_correct: []
    };
  }

  const sessionData = {
    session_code,
    test_mode: data.test_mode,
    skills_tested: data.skills_tested,
    student_name: data.student_name,
    student_email: data.student_email,
    student_phone: data.student_phone,
    status: 'in_progress' as SessionStatus,
    started_at: new Date().toISOString(),
    time_spent_seconds: 0,
    current_question_index: 0,
    question_order: [],
    raw_scores
  };

  const { data: session, error } = await supabaseAdmin
    .from('placement_test_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return session;
}

export async function getSessionByCode(code: string): Promise<PlacementTestSession | null> {
  const { data, error } = await supabase
    .from('placement_test_sessions')
    .select('*')
    .eq('session_code', code.toUpperCase())
    .maybeSingle();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return data;
}

export async function getSessionById(id: string): Promise<PlacementTestSession | null> {
  const { data, error } = await supabase
    .from('placement_test_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return data;
}

export async function updateSession(
  id: string,
  updates: Partial<PlacementTestSession>
): Promise<PlacementTestSession | null> {
  const { data, error } = await supabaseAdmin
    .from('placement_test_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    return null;
  }

  return data;
}

export async function saveAnswer(
  answer: Omit<PlacementAnswer, 'id' | 'created_at'>
): Promise<PlacementAnswer | null> {
  const { data, error } = await supabaseAdmin
    .from('placement_answers')
    .insert(answer)
    .select()
    .single();

  if (error) {
    console.error('Error saving answer:', error);
    return null;
  }

  return data;
}

export async function getSessionAnswers(sessionId: string): Promise<PlacementAnswer[]> {
  const { data, error } = await supabase
    .from('placement_answers')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching answers:', error);
    return [];
  }

  return data || [];
}

export async function getQuestionsBySkillAndLevel(
  skill: SkillType,
  levels?: CEFRLevel[],
  excludeTypes?: QuestionType[]
): Promise<PlacementQuestion[]> {
  let query = supabaseAdmin
    .from('placement_questions')
    .select('*')
    .eq('skill_type', skill)
    .eq('status', 'active');

  if (levels && levels.length > 0) {
    query = query.in('cefr_level', levels);
  }

  if (excludeTypes && excludeTypes.length > 0) {
    for (const t of excludeTypes) {
      query = query.neq('question_type', t);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data || [];
}

export async function getQuestionById(id: string): Promise<PlacementQuestion | null> {
  const { data, error } = await supabase
    .from('placement_questions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching question:', error);
    return null;
  }

  return data;
}

// Admin Operations

export async function getAllSessions(
  filters?: {
    status?: SessionStatus;
    test_mode?: TestMode;
    from_date?: string;
    to_date?: string;
  },
  limit = 50,
  offset = 0
): Promise<{ sessions: PlacementTestSession[]; total: number }> {
  let query = supabaseAdmin
    .from('placement_test_sessions')
    .select('*', { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.test_mode) {
    query = query.eq('test_mode', filters.test_mode);
  }
  if (filters?.from_date) {
    query = query.gte('started_at', filters.from_date);
  }
  if (filters?.to_date) {
    query = query.lte('started_at', filters.to_date);
  }

  const { data, error, count } = await query
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching sessions:', error);
    return { sessions: [], total: 0 };
  }

  return { sessions: data || [], total: count || 0 };
}

export async function getAnalytics(): Promise<{
  totalTests: number;
  completedTests: number;
  pendingReview: number;
  levelDistribution: Record<CEFRLevel, number>;
  averageTimeMinutes: number;
  testsByMode: Record<TestMode, number>;
}> {
  // Get all completed sessions
  const { data: sessions, error } = await supabaseAdmin
    .from('placement_test_sessions')
    .select('*')
    .in('status', ['completed', 'pending_review', 'reviewed']);

  if (error || !sessions) {
    return {
      totalTests: 0,
      completedTests: 0,
      pendingReview: 0,
      levelDistribution: { 'Pre-A1': 0, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 },
      averageTimeMinutes: 0,
      testsByMode: { quick: 0, personalized: 0, advanced: 0 }
    };
  }

  const levelDistribution: Record<CEFRLevel, number> = { 'Pre-A1': 0, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  const testsByMode: Record<TestMode, number> = { quick: 0, personalized: 0, advanced: 0 };
  let totalTime = 0;
  let pendingReview = 0;

  for (const session of sessions) {
    if (session.calculated_level) {
      levelDistribution[session.calculated_level as CEFRLevel]++;
    }
    testsByMode[session.test_mode as TestMode]++;
    totalTime += session.time_spent_seconds || 0;
    if (session.status === 'pending_review') {
      pendingReview++;
    }
  }

  return {
    totalTests: sessions.length,
    completedTests: sessions.filter(s => s.status === 'completed' || s.status === 'reviewed').length,
    pendingReview,
    levelDistribution,
    averageTimeMinutes: sessions.length > 0 ? Math.round(totalTime / sessions.length / 60) : 0,
    testsByMode
  };
}

// Question Import Utility
export async function importQuestionsFromData(
  questions: Omit<PlacementQuestion, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const question of questions) {
    const { error } = await supabaseAdmin
      .from('placement_questions')
      .insert(question);

    if (error) {
      errors.push(`Failed to import ${question.question_code}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return { imported, errors };
}

// Config Operations
export async function getConfig(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('placement_test_config')
    .select('config_value')
    .eq('config_key', key)
    .maybeSingle();

  if (error || !data) return null;
  return data.config_value;
}

export async function setConfig(key: string, value: string, description?: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('placement_test_config')
    .upsert({
      config_key: key,
      config_value: value,
      description,
      updated_at: new Date().toISOString()
    }, { onConflict: 'config_key' });

  return !error;
}

// Default test configuration
export const DEFAULT_CONFIG = {
  QUICK_QUESTIONS_PER_SKILL: '10',
  PERSONALIZED_QUESTIONS_PER_SKILL: '12',
  QUICK_TIME_LIMIT_MINUTES: '30',
  PERSONALIZED_TIME_LIMIT_MINUTES: '60',
  SESSION_EXPIRY_HOURS: '24',
  READING_WEIGHT: '0.25',
  LISTENING_WEIGHT: '0.25',
  WRITING_WEIGHT: '0.25',
  SPEAKING_WEIGHT: '0.25'
};
