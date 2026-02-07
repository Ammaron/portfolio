'use client';

import { SpeakerHigh, Image as ImageIcon } from '@phosphor-icons/react';
import { Question, getSkillColor, getLevelColor, getStatusColor, getQuestionTypeLabel } from './types';

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onCheck: () => void;
}

export default function QuestionCard({
  question,
  isSelected,
  isChecked,
  onSelect,
  onCheck
}: QuestionCardProps) {
  const statusColors = getStatusColor(question.status);

  return (
    <div
      onClick={onSelect}
      className={`group px-4 py-3 border-b border-slate-700/50 cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-600/10 border-l-2 border-l-blue-500'
          : 'hover:bg-slate-700/30 border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-0.5" onClick={(e) => { e.stopPropagation(); onCheck(); }}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}}
            className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: code + badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <code className="text-xs bg-slate-700 text-gray-200 px-1.5 py-0.5 rounded font-mono">
              {question.question_code}
            </code>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getSkillColor(question.skill_type)}`}>
              {question.skill_type}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getLevelColor(question.cefr_level)}`}>
              {question.cefr_level}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-600/50 text-gray-300">
              {getQuestionTypeLabel(question.question_type)}
            </span>
          </div>

          {/* Question text */}
          <p className="text-sm text-gray-200 line-clamp-2 mb-1.5">
            {question.question_text}
          </p>

          {/* Bottom row: points, status, media icons */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-400">{question.max_points}pt{question.max_points !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
              <span className={statusColors.text}>{question.status}</span>
            </span>
            {question.audio_url && (
              <span className="text-purple-400" title="Has audio">
                <SpeakerHigh size={14} />
              </span>
            )}
            {question.image_url && (
              <span className="text-green-400" title="Has image">
                <ImageIcon size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
