'use client';

import { Check, X as XIcon } from '@phosphor-icons/react';
import QuestionRenderer from '@/components/placement-test/QuestionRenderer';
import { Question } from './types';

interface QuestionPreviewProps {
  question: Question;
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  const renderMCQ = () => {
    if (!question.options) return null;
    return (
      <div className="space-y-2">
        {question.options.map(opt => {
          const isCorrect = question.correct_answer === opt.id;
          return (
            <div
              key={opt.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                isCorrect
                  ? 'bg-green-900/20 border-green-500/40 text-green-300'
                  : 'bg-slate-700/30 border-slate-600/50 text-gray-300'
              }`}
            >
              <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ borderColor: isCorrect ? 'rgb(34 197 94)' : 'rgb(100 116 139)' }}
              >
                {isCorrect ? <Check size={14} weight="bold" /> : opt.id}
              </span>
              <span className="text-sm">{opt.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = () => {
    const isTrue = question.correct_answer.toLowerCase() === 'true';
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border text-center ${
          isTrue ? 'bg-green-900/20 border-green-500/40 text-green-300' : 'bg-slate-700/30 border-slate-600/50 text-gray-400'
        }`}>
          <Check size={20} className="mx-auto mb-1" />
          <span className="text-sm font-medium">True</span>
        </div>
        <div className={`p-3 rounded-lg border text-center ${
          !isTrue ? 'bg-red-900/20 border-red-500/40 text-red-300' : 'bg-slate-700/30 border-slate-600/50 text-gray-400'
        }`}>
          <XIcon size={20} className="mx-auto mb-1" />
          <span className="text-sm font-medium">False</span>
        </div>
      </div>
    );
  };

  const renderTrueFalseMulti = () => {
    if (!question.options) return null;
    const correctMap = new Map<string, boolean>();
    if (question.correct_answer) {
      question.correct_answer.split(',').forEach(pair => {
        const [id, val] = pair.trim().split(':');
        correctMap.set(id, val === 'true');
      });
    }

    return (
      <div className="space-y-2">
        {question.options.map(opt => {
          const isTrue = correctMap.get(opt.id) ?? true;
          return (
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <span className="text-xs font-mono bg-slate-600 px-1.5 py-0.5 rounded text-gray-300">{opt.id}</span>
              <span className="flex-1 text-sm text-gray-300">{opt.text}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isTrue ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {isTrue ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGapFill = () => {
    const blankPattern = /_{3,}|\[blank\]|\[___\]/gi;
    const parts = question.question_text.split(blankPattern);
    const answers = question.correct_answer ? question.correct_answer.split('|') : [];

    return (
      <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < answers.length && (
                <span className="inline-block mx-1 px-2 py-0.5 bg-green-900/30 border border-green-500/40 rounded text-green-300 text-sm font-medium align-middle">
                  {answers[i] ? answers[i].split(';').join(' / ') : '___'}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderOpenResponse = () => {
    return (
      <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <div className="text-xs text-gray-400 mb-2">Sample Answer / Criteria:</div>
        <p className="text-sm text-gray-200 whitespace-pre-wrap">{question.correct_answer}</p>
      </div>
    );
  };

  // For matching questions, render the actual student-facing component
  // so admin sees exactly what the student sees
  if (question.question_type === 'matching') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-inner border border-slate-600/30 overflow-hidden">
          <QuestionRenderer
            question={{
              id: question.id,
              question_code: question.question_code,
              skill_type: question.skill_type,
              question_type: question.question_type,
              question_text: question.question_text,
              passage_text: question.passage_text,
              audio_url: question.audio_url,
              image_url: question.image_url,
              options: question.options,
              max_points: question.max_points,
            }}
            locale="en"
            onAnswer={() => {}}
          />
        </div>
        <div className="p-3 bg-green-900/15 border border-green-500/30 rounded-lg">
          <div className="text-xs text-green-400 mb-1 font-medium">Correct Answer</div>
          <code className="text-xs text-green-300 break-all">{question.correct_answer}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Passage */}
      {question.passage_text && (
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="text-xs text-gray-400 mb-2 font-medium">Passage</div>
          <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{question.passage_text}</p>
        </div>
      )}

      {/* Audio */}
      {question.audio_url && (
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="text-xs text-gray-400 mb-2 font-medium">Audio</div>
          <audio src={question.audio_url} controls className="w-full h-10" />
        </div>
      )}

      {/* Image */}
      {question.image_url && (
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="text-xs text-gray-400 mb-2 font-medium">Image</div>
          <img src={question.image_url} alt="Question" className="max-w-full max-h-48 rounded-lg object-contain mx-auto" />
        </div>
      )}

      {/* Question text (not for gap fill since it's embedded in the answer render) */}
      {question.question_type !== 'gap_fill' && (
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">Question</div>
          <p className="text-sm text-gray-200 leading-relaxed">{question.question_text}</p>
        </div>
      )}

      {/* Answer section */}
      <div>
        <div className="text-xs text-gray-400 mb-2 font-medium">
          {question.question_type === 'gap_fill' ? 'Fill in the Blanks' : 'Answer'}
        </div>
        {question.question_type === 'mcq' && renderMCQ()}
        {question.question_type === 'true_false' && renderTrueFalse()}
        {question.question_type === 'true_false_multi' && renderTrueFalseMulti()}
        {question.question_type === 'gap_fill' && renderGapFill()}
        {question.question_type === 'open_response' && renderOpenResponse()}
      </div>
    </div>
  );
}
