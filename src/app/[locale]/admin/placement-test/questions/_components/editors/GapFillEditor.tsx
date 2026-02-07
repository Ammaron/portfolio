'use client';

import { Info, TextT } from '@phosphor-icons/react';

export default function GapFillEditor({
  questionText,
  correctAnswer,
  onQuestionTextChange,
  onCorrectAnswerChange
}: {
  questionText: string;
  correctAnswer: string;
  onQuestionTextChange: (text: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  const blankPattern = /_{3,}|\[blank\]|\[___\]/gi;
  const blanks = questionText.match(blankPattern) || [];
  const answers = correctAnswer ? correctAnswer.split('|') : [];

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    while (newAnswers.length <= index) newAnswers.push('');
    newAnswers[index] = value;
    onCorrectAnswerChange(newAnswers.join('|'));
  };

  const insertBlank = () => {
    const textarea = document.querySelector('textarea[data-gap-fill]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = questionText.slice(0, start) + '___' + questionText.slice(end);
      onQuestionTextChange(newText);
      const newAnswers = [...answers, ''];
      onCorrectAnswerChange(newAnswers.join('|'));
    } else {
      onQuestionTextChange(questionText + ' ___');
      const newAnswers = [...answers, ''];
      onCorrectAnswerChange(newAnswers.join('|'));
    }
  };

  const previewParts = questionText.split(blankPattern);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p>Use <code className="bg-slate-700 px-1.5 py-0.5 rounded">___</code> (three underscores) to mark blanks in the question text.</p>
          <p className="mt-1">For multiple blanks, separate answers with <code className="bg-slate-700 px-1.5 py-0.5 rounded">|</code> (pipe).</p>
          <p className="mt-1">To accept multiple answers for a blank, separate with <code className="bg-slate-700 px-1.5 py-0.5 rounded">;</code> (semicolon). E.g. <code className="bg-slate-700 px-1.5 py-0.5 rounded">repaired;fixed</code></p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Question with Blanks</label>
          <button
            type="button"
            onClick={insertBlank}
            className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded hover:bg-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <TextT size={14} />
            Insert Blank
          </button>
        </div>
        <textarea
          data-gap-fill="true"
          value={questionText}
          onChange={(e) => onQuestionTextChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="The capital of France is ___."
        />
      </div>

      {blanks.length > 0 && (
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
          <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {previewParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < blanks.length && (
                  <span className="inline-block mx-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-amber-300 text-sm align-middle">
                    {answers[i] ? answers[i].split(';').join(' / ') : `blank ${i + 1}`}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answers for Each Blank</label>
          <div className="space-y-2">
            {blanks.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-20 text-sm text-gray-400">Blank {index + 1}:</span>
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter correct answer (use ; for alternatives)"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {blanks.length === 0 && (
        <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg text-center">
          <p className="text-amber-300 text-sm">
            No blanks detected. Add <code className="bg-slate-700 px-1.5 py-0.5 rounded">___</code> to your question text.
          </p>
        </div>
      )}
    </div>
  );
}
