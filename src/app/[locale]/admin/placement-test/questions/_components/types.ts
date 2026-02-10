// Extracted types, interfaces, constants, and helper functions for the Question Bank

export interface Question {
  id: string;
  question_code: string;
  cefr_level: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  options?: { id: string; text: string; text_es?: string; audio_url?: string }[];
  correct_answer: string;
  max_points: number;
  status: string;
  audio_url?: string;
  passage_text?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Matching Pair Interface
export interface MatchingPair {
  id: string;
  leftId: string;
  leftText: string;
  leftText_es?: string;
  leftAudioUrl?: string;
  rightId: string;
  rightText: string;
  rightText_es?: string;
  rightAudioUrl?: string;
}

// True/False Multi Statement Interface
export interface TFMultiStatement {
  id: string;
  text: string;
  text_es?: string;
  isTrue: boolean;
}

// Panel mode for the right side panel
export type PanelMode = 'preview' | 'edit' | 'create' | 'empty';

// Sort configuration
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

// Sidebar filter
export interface SidebarFilter {
  skill: string;
  level: string;
}

// Skill colors (badge style)
export const SKILL_COLORS: Record<string, string> = {
  reading: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  listening: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  writing: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  speaking: 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
};

// Skill dot colors (for sidebar/cards)
export const SKILL_DOT_COLORS: Record<string, string> = {
  reading: 'bg-blue-400',
  listening: 'bg-purple-400',
  writing: 'bg-amber-400',
  speaking: 'bg-pink-400'
};

export const SKILL_TEXT_COLORS: Record<string, string> = {
  reading: 'text-blue-400',
  listening: 'text-purple-400',
  writing: 'text-amber-400',
  speaking: 'text-pink-400'
};

// Level colors (badge style)
export const LEVEL_COLORS: Record<string, string> = {
  'Pre-A1': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  A1: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  A2: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  B1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  B2: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  C1: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  C2: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
};

export function getSkillColor(skill: string): string {
  return SKILL_COLORS[skill] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
}

export function getLevelColor(level: string): string {
  return LEVEL_COLORS[level] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
}

export function getStatusColor(status: string): { dot: string; text: string; bg: string } {
  switch (status) {
    case 'active': return { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/20' };
    case 'inactive': return { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    case 'draft': return { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/20' };
    default: return { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/20' };
  }
}

export function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    mcq: 'MCQ',
    true_false: 'T/F',
    true_false_multi: 'T/F Multi',
    gap_fill: 'Gap Fill',
    matching: 'Matching',
    open_response: 'Open'
  };
  return labels[type] || type;
}

// Skills and levels constants
export const SKILLS = ['reading', 'listening', 'writing', 'speaking'] as const;
export const LEVELS = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const QUESTION_TYPES = ['mcq', 'true_false', 'true_false_multi', 'gap_fill', 'matching', 'open_response'] as const;

// --- Matching Pair Helpers ---

export function createEmptyPair(pairNumber: number): MatchingPair {
  return {
    id: `pair-${pairNumber}`,
    leftId: `L${pairNumber}`,
    leftText: '',
    rightId: `R${pairNumber}`,
    rightText: ''
  };
}

export function parseOptionsToPairs(
  options: { id: string; text: string; text_es?: string; audio_url?: string }[] | undefined
): MatchingPair[] {
  if (!options || options.length < 2) {
    return [createEmptyPair(1)];
  }

  const pairs: MatchingPair[] = [];
  for (let i = 0; i < options.length; i += 2) {
    const leftItem = options[i];
    const rightItem = options[i + 1];
    if (leftItem && rightItem) {
      pairs.push({
        id: `pair-${pairs.length + 1}`,
        leftId: leftItem.id,
        leftText: leftItem.text,
        leftText_es: leftItem.text_es,
        leftAudioUrl: leftItem.audio_url,
        rightId: rightItem.id,
        rightText: rightItem.text,
        rightText_es: rightItem.text_es,
        rightAudioUrl: rightItem.audio_url
      });
    }
  }
  return pairs.length > 0 ? pairs : [createEmptyPair(1)];
}

export function pairsToOptionsFormat(pairs: MatchingPair[]): {
  options: { id: string; text: string; text_es?: string; audio_url?: string }[];
  correct_answer: string;
} {
  const options: { id: string; text: string; text_es?: string; audio_url?: string }[] = [];
  const correctPairings: string[] = [];

  pairs.forEach((pair) => {
    const leftOption: { id: string; text: string; text_es?: string; audio_url?: string } = {
      id: pair.leftId,
      text: pair.leftText
    };
    if (pair.leftText_es) leftOption.text_es = pair.leftText_es;
    if (pair.leftAudioUrl) leftOption.audio_url = pair.leftAudioUrl;
    options.push(leftOption);

    const rightOption: { id: string; text: string; text_es?: string; audio_url?: string } = {
      id: pair.rightId,
      text: pair.rightText
    };
    if (pair.rightText_es) rightOption.text_es = pair.rightText_es;
    if (pair.rightAudioUrl) rightOption.audio_url = pair.rightAudioUrl;
    options.push(rightOption);

    correctPairings.push(`${pair.leftId}:${pair.rightId}`);
  });

  return { options, correct_answer: correctPairings.join(',') };
}

// --- TF Multi Helpers ---

export function parseOptionsToTFMultiStatements(
  options: { id: string; text: string; text_es?: string }[] | undefined,
  correctAnswer: string
): TFMultiStatement[] {
  if (!options || options.length === 0) {
    return [
      { id: 'A', text: '', isTrue: true },
      { id: 'B', text: '', isTrue: false }
    ];
  }

  const correctMap = new Map<string, boolean>();
  if (correctAnswer) {
    correctAnswer.split(',').forEach(pair => {
      const [id, val] = pair.trim().split(':');
      correctMap.set(id, val === 'true');
    });
  }

  return options.map(opt => ({
    id: opt.id,
    text: opt.text,
    text_es: opt.text_es,
    isTrue: correctMap.get(opt.id) ?? true
  }));
}

export function tfMultiStatementsToFormat(statements: TFMultiStatement[]): {
  options: { id: string; text: string; text_es?: string }[];
  correct_answer: string;
  max_points: number;
} {
  const options = statements.map(s => {
    const opt: { id: string; text: string; text_es?: string } = { id: s.id, text: s.text };
    if (s.text_es) opt.text_es = s.text_es;
    return opt;
  });
  const correct_answer = statements.map(s => `${s.id}:${s.isTrue ? 'true' : 'false'}`).join(',');
  return { options, correct_answer, max_points: statements.length };
}
