'use client';

import { CheckCircle, X, Check, Info } from '@phosphor-icons/react';

export default function TrueFalseEditor({
  correctAnswer,
  onCorrectAnswerChange
}: {
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">Select whether the statement is true or false.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onCorrectAnswerChange('true')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
            correctAnswer.toLowerCase() === 'true'
              ? 'bg-green-900/30 border-green-500 text-green-400'
              : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
          }`}
        >
          {correctAnswer.toLowerCase() === 'true' ? (
            <CheckCircle size={32} weight="fill" className="text-green-400" />
          ) : (
            <Check size={32} />
          )}
          <span className="font-semibold text-lg">True</span>
        </button>

        <button
          type="button"
          onClick={() => onCorrectAnswerChange('false')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
            correctAnswer.toLowerCase() === 'false'
              ? 'bg-red-900/30 border-red-500 text-red-400'
              : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
          }`}
        >
          {correctAnswer.toLowerCase() === 'false' ? (
            <X size={32} weight="bold" className="text-red-400" />
          ) : (
            <X size={32} />
          )}
          <span className="font-semibold text-lg">False</span>
        </button>
      </div>
    </div>
  );
}
