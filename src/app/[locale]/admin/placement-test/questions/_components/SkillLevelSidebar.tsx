'use client';

import { useState } from 'react';
import { CaretDown, CaretRight } from '@phosphor-icons/react';
import type { QuestionStats } from './hooks/useQuestions';
import { SidebarFilter, SKILLS, LEVELS, SKILL_DOT_COLORS, SKILL_TEXT_COLORS } from './types';

interface SkillLevelSidebarProps {
  stats: QuestionStats;
  filter: SidebarFilter;
  onFilterChange: (filter: SidebarFilter) => void;
}

export default function SkillLevelSidebar({ stats, filter, onFilterChange }: SkillLevelSidebarProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set(SKILLS));

  const toggleSkill = (skill: string) => {
    setExpandedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const isActive = (skill: string, level: string) => {
    return filter.skill === skill && filter.level === level;
  };

  const isSkillActive = (skill: string) => {
    return filter.skill === skill && !filter.level;
  };

  const isAllActive = !filter.skill && !filter.level;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Filter by Skill & Level
        </h3>

        {/* All Questions */}
        <button
          onClick={() => onFilterChange({ skill: '', level: '' })}
          className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors cursor-pointer ${
            isAllActive
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-gray-300 hover:bg-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Questions</span>
            <span className={`text-xs ${isAllActive ? 'text-blue-400' : 'text-gray-500'}`}>
              {stats.total}
            </span>
          </div>
        </button>

        <div className="my-2 border-t border-slate-700" />

        {/* Skill sections */}
        {SKILLS.map(skill => {
          const isExpanded = expandedSkills.has(skill);
          const skillCount = stats.bySkill[skill] || 0;
          const dotColor = SKILL_DOT_COLORS[skill] || 'bg-gray-400';
          const textColor = SKILL_TEXT_COLORS[skill] || 'text-gray-400';

          return (
            <div key={skill} className="mb-1">
              {/* Skill header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleSkill(skill)}
                  className="p-1 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {isExpanded ? <CaretDown size={14} /> : <CaretRight size={14} />}
                </button>
                <button
                  onClick={() => onFilterChange({ skill, level: '' })}
                  className={`flex-1 text-left px-2 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isSkillActive(skill)
                      ? 'bg-slate-700/70 border border-slate-600'
                      : 'hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className={`capitalize font-medium ${isSkillActive(skill) ? textColor : 'text-gray-300'}`}>
                        {skill}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">{skillCount}</span>
                  </div>
                </button>
              </div>

              {/* Level sub-items */}
              {isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {LEVELS.map(level => {
                    const count = stats.bySkillLevel[skill]?.[level] || 0;
                    const active = isActive(skill, level);

                    return (
                      <button
                        key={level}
                        onClick={() => onFilterChange({ skill, level })}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                          active
                            ? 'bg-slate-700/70 border border-slate-600 text-white'
                            : 'text-gray-400 hover:bg-slate-700/30 hover:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={active ? 'font-medium' : ''}>{level}</span>
                          <span className={`text-xs ${count === 0 ? 'text-gray-600' : 'text-gray-500'}`}>
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
