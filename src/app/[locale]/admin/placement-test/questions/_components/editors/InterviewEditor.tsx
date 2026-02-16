'use client';

import { Info, Microphone } from '@phosphor-icons/react';

export default function InterviewEditor({
  correctAnswer,
  onCorrectAnswerChange,
}: {
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <div className="flex items-center gap-1.5 mb-1">
            <Microphone size={14} />
            <span className="font-medium">Interview / Speaking</span>
          </div>
          <p>Students will record an audio response to the question.</p>
          <p className="mt-1">Use <strong>Question Text</strong> for the interview prompt/question.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Expected Response / Grading Criteria
        </label>
        <textarea
          value={correctAnswer}
          onChange={(e) => onCorrectAnswerChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Describe expected response content, vocabulary, grammar focus..."
        />
      </div>
    </div>
  );
}
