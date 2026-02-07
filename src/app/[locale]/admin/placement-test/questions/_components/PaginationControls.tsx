'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: PaginationControlsProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{total} total</span>
        <span className="text-gray-600">|</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-gray-300 cursor-pointer"
        >
          <option value={20}>20/page</option>
          <option value={50}>50/page</option>
          <option value={100}>100/page</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <CaretLeft size={18} />
        </button>
        <span className="text-sm text-gray-300 min-w-[80px] text-center">
          {page + 1} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <CaretRight size={18} />
        </button>
      </div>
    </div>
  );
}
