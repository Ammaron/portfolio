'use client';

import { CaretDown, CaretUp } from '@phosphor-icons/react';
import type { QuestionStats } from './hooks/useQuestions';
import { SKILL_DOT_COLORS, getStatusColor } from './types';

interface StatsDashboardProps {
  stats: QuestionStats;
  collapsed: boolean;
  onToggle: () => void;
}

export default function StatsDashboard({ stats, collapsed, onToggle }: StatsDashboardProps) {
  return (
    <div className="authority-card mb-4 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300 font-medium">{stats.total} questions</span>
          {!collapsed && (
            <>
              <span className="text-gray-600">|</span>
              {Object.entries(stats.bySkill).map(([skill, count]) => (
                <span key={skill} className="flex items-center gap-1.5 text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${SKILL_DOT_COLORS[skill] || 'bg-gray-400'}`} />
                  {skill}: {count}
                </span>
              ))}
            </>
          )}
        </div>
        {collapsed ? (
          <CaretDown size={16} className="text-gray-400" />
        ) : (
          <CaretUp size={16} className="text-gray-400" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Total */}
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>

          {/* Per-skill */}
          {(['reading', 'listening', 'writing', 'speaking'] as const).map(skill => (
            <div key={skill} className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${SKILL_DOT_COLORS[skill]}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stats.bySkill[skill] || 0}</div>
              <div className="text-xs text-gray-400 capitalize">{skill}</div>
            </div>
          ))}

          {/* Status counts */}
          {(['active', 'inactive', 'draft'] as const).map(status => {
            const colors = getStatusColor(status);
            return (
              <div key={status} className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                </div>
                <div className="text-2xl font-bold text-white">{stats.byStatus[status] || 0}</div>
                <div className={`text-xs capitalize ${colors.text}`}>{status}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
