'use client';

import { PencilSimple, Copy, Trash, ArrowsClockwise, Eye } from '@phosphor-icons/react';
import { Question, getSkillColor, getLevelColor, getStatusColor, getQuestionTypeLabel } from './types';
import QuestionPreview from './QuestionPreview';

interface QuestionPreviewPanelProps {
  question: Question | null;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onClose: () => void;
}

export default function QuestionPreviewPanel({
  question,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onClose
}: QuestionPreviewPanelProps) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <Eye size={48} className="mb-3 text-gray-600" />
        <p className="text-sm">Select a question to preview</p>
      </div>
    );
  }

  const statusColors = getStatusColor(question.status);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <code className="text-sm bg-slate-700 text-gray-200 px-2 py-1 rounded font-mono">
            {question.question_code}
          </code>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs cursor-pointer lg:hidden"
          >
            Close
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSkillColor(question.skill_type)}`}>
            {question.skill_type}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(question.cefr_level)}`}>
            {question.cefr_level}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-600/50 text-gray-300">
            {getQuestionTypeLabel(question.question_type)}
          </span>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${statusColors.bg} ${statusColors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
            {question.status}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{question.max_points}pt{question.max_points !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <PencilSimple size={14} />
          Edit
        </button>
        <button
          onClick={onDuplicate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-500 transition-colors cursor-pointer"
        >
          <Copy size={14} />
          Duplicate
        </button>
        <button
          onClick={onToggleStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-500 transition-colors cursor-pointer"
          title="Cycle status: active → inactive → draft → active"
        >
          <ArrowsClockwise size={14} />
          Status
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors cursor-pointer ml-auto"
        >
          <Trash size={14} />
          Delete
        </button>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-y-auto p-4">
        <QuestionPreview question={question} />
      </div>
    </div>
  );
}
