'use client';

import { Info } from '@phosphor-icons/react';

export default function OpenResponseEditor({
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
        <div className="text-sm text-blue-300">
          <p>Open response questions are manually graded.</p>
          <p className="mt-1">Provide a sample/expected answer or grading criteria below.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sample Answer / Grading Criteria
        </label>
        <textarea
          value={correctAnswer}
          onChange={(e) => onCorrectAnswerChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Enter a sample answer or describe what a correct response should include..."
        />
      </div>
    </div>
  );
}
