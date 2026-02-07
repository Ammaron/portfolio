'use client';

import { MagnifyingGlass, SortAscending, Spinner, Plus } from '@phosphor-icons/react';
import { Question, SortConfig } from './types';
import QuestionCard from './QuestionCard';
import PaginationControls from './PaginationControls';

interface QuestionListProps {
  questions: Question[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  isChecked: (id: string) => boolean;
  onToggleCheck: (id: string) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  onAddQuestion: () => void;
}

export default function QuestionList({
  questions,
  total,
  totalPages,
  isLoading,
  searchQuery,
  onSearchChange,
  sortConfig,
  onSortChange,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  selectedQuestionId,
  onSelectQuestion,
  isChecked,
  onToggleCheck,
  onSelectAll,
  allChecked,
  onAddQuestion
}: QuestionListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search + Sort bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
        <div className="flex-1 relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            value={`${sortConfig.field}:${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':');
              onSortChange({ field, order: order as 'asc' | 'desc' });
            }}
            className="appearance-none pl-8 pr-6 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white text-sm cursor-pointer focus:border-blue-500"
          >
            <option value="question_code:asc">Code A-Z</option>
            <option value="question_code:desc">Code Z-A</option>
            <option value="cefr_level:asc">Level A1-C2</option>
            <option value="cefr_level:desc">Level C2-A1</option>
            <option value="question_type:asc">Type A-Z</option>
            <option value="max_points:desc">Points High</option>
            <option value="max_points:asc">Points Low</option>
            <option value="created_at:desc">Newest</option>
            <option value="created_at:asc">Oldest</option>
          </select>
          <SortAscending size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={onAddQuestion}
          className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          title="Add Question"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Select All header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
        <input
          type="checkbox"
          checked={allChecked && questions.length > 0}
          onChange={onSelectAll}
          className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-xs text-gray-400">
          {total} question{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Question list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={32} className="text-primary animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2">No questions found.</p>
            <button
              onClick={onAddQuestion}
              className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
            >
              Add a question
            </button>
          </div>
        ) : (
          questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              isSelected={selectedQuestionId === q.id}
              isChecked={isChecked(q.id)}
              onSelect={() => onSelectQuestion(q.id)}
              onCheck={() => onToggleCheck(q.id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
