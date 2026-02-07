'use client';

import { Trash, X } from '@phosphor-icons/react';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onSetStatus: (status: string) => void;
  onDeselectAll: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onDelete,
  onSetStatus,
  onDeselectAll
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl backdrop-blur-xl">
        <span className="text-sm text-gray-300 font-medium">
          {selectedCount} selected
        </span>

        <div className="w-px h-5 bg-slate-600" />

        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors cursor-pointer"
        >
          <Trash size={14} />
          Delete
        </button>

        <select
          onChange={(e) => {
            if (e.target.value) {
              onSetStatus(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          className="px-3 py-1.5 text-xs bg-slate-700 border border-slate-600 text-gray-300 rounded-lg cursor-pointer"
        >
          <option value="" disabled>Set Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>

        <button
          onClick={onDeselectAll}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          title="Deselect all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
