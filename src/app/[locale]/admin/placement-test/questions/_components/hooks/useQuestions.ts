'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import toast from 'react-hot-toast';
import { Question, SortConfig, SidebarFilter, SKILLS, LEVELS } from '../types';

export interface QuestionStats {
  total: number;
  bySkill: Record<string, number>;
  byLevel: Record<string, number>;
  byStatus: Record<string, number>;
  bySkillLevel: Record<string, Record<string, number>>;
}

interface UseQuestionsOptions {
  sidebarFilter: SidebarFilter;
  searchQuery: string;
  sortConfig: SortConfig;
  page: number;
  pageSize: number;
}

export function useQuestions({ sidebarFilter, searchQuery, sortConfig, page, pageSize }: UseQuestionsOptions) {
  const { locale } = useI18n();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<QuestionStats>({
    total: 0,
    bySkill: {},
    byLevel: {},
    byStatus: {},
    bySkillLevel: {}
  });

  // Track if stats have been loaded (only fetch once, then update from question list)
  const statsLoaded = useRef(false);

  const getToken = useCallback(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push(`/${locale}/admin/placement-test`);
      return null;
    }
    return token;
  }, [locale, router]);

  // Load stats (all questions unfiltered for counts)
  const loadStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/placement-test/admin/questions?limit=1000', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        const allQuestions: Question[] = result.questions || [];
        const bySkill: Record<string, number> = {};
        const byLevel: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        const bySkillLevel: Record<string, Record<string, number>> = {};

        for (const skill of SKILLS) {
          bySkill[skill] = 0;
          bySkillLevel[skill] = {};
          for (const level of LEVELS) {
            bySkillLevel[skill][level] = 0;
          }
        }

        for (const q of allQuestions) {
          bySkill[q.skill_type] = (bySkill[q.skill_type] || 0) + 1;
          byLevel[q.cefr_level] = (byLevel[q.cefr_level] || 0) + 1;
          byStatus[q.status] = (byStatus[q.status] || 0) + 1;
          if (bySkillLevel[q.skill_type]) {
            bySkillLevel[q.skill_type][q.cefr_level] = (bySkillLevel[q.skill_type][q.cefr_level] || 0) + 1;
          }
        }

        setStats({
          total: result.total || allQuestions.length,
          bySkill,
          byLevel,
          byStatus,
          bySkillLevel
        });
        statsLoaded.current = true;
      }
    } catch {
      // Stats loading failure is non-critical
    }
  }, [getToken]);

  // Load filtered/paginated questions
  const loadQuestions = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(page * pageSize),
        sort: sortConfig.field,
        order: sortConfig.order
      });

      if (sidebarFilter.skill) params.append('skill', sidebarFilter.skill);
      if (sidebarFilter.level) params.append('level', sidebarFilter.level);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/placement-test/admin/questions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setQuestions(result.questions || []);
        setTotal(result.total || 0);
      }
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  }, [sidebarFilter, searchQuery, sortConfig, page, pageSize, getToken]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (!statsLoaded.current) {
      loadStats();
    }
  }, [loadStats]);

  const refetch = useCallback(() => {
    loadQuestions();
    loadStats(); // Refresh stats after mutations
  }, [loadQuestions, loadStats]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    questions,
    total,
    totalPages,
    isLoading,
    stats,
    refetch
  };
}
