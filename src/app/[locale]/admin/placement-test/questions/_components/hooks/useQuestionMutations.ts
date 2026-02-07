'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { Question, MatchingPair, TFMultiStatement, pairsToOptionsFormat, tfMultiStatementsToFormat } from '../types';

interface FormData {
  question_code: string;
  cefr_level: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  correct_answer: string;
  max_points: number;
  options: { id: string; text: string }[];
  audio_url: string;
  passage_text: string;
  image_url: string;
  status?: string;
}

export function useQuestionMutations(refetch: () => void) {
  const getToken = () => localStorage.getItem('admin_token');

  const saveQuestion = useCallback(async (
    formData: FormData,
    editingId: string | null,
    matchingPairs?: MatchingPair[],
    tfMultiStatements?: TFMultiStatement[]
  ): Promise<Question | null> => {
    const token = getToken();
    if (!token) return null;

    // Validate matching pairs
    if (formData.question_type === 'matching' && matchingPairs) {
      if (matchingPairs.length < 2) {
        toast.error('Minimum 2 matching pairs required');
        return null;
      }
      const hasEmptyPairs = matchingPairs.some(pair => !pair.leftText.trim() || !pair.rightText.trim());
      if (hasEmptyPairs) {
        toast.error('All matching pair fields must be filled');
        return null;
      }
    }

    // Validate TF multi statements
    if (formData.question_type === 'true_false_multi' && tfMultiStatements) {
      if (tfMultiStatements.length < 2) {
        toast.error('Minimum 2 statements required');
        return null;
      }
      const hasEmpty = tfMultiStatements.some(s => !s.text.trim());
      if (hasEmpty) {
        toast.error('All statement fields must be filled');
        return null;
      }
    }

    try {
      const method = editingId ? 'PUT' : 'POST';

      let finalFormData = { ...formData };
      if (formData.question_type === 'matching' && matchingPairs) {
        const { options, correct_answer } = pairsToOptionsFormat(matchingPairs);
        finalFormData = {
          ...formData,
          options: options as { id: string; text: string }[],
          correct_answer
        };
      } else if (formData.question_type === 'true_false_multi' && tfMultiStatements) {
        const { options, correct_answer, max_points } = tfMultiStatementsToFormat(tfMultiStatements);
        finalFormData = {
          ...formData,
          options: options as { id: string; text: string }[],
          correct_answer,
          max_points
        };
      }

      const body = editingId ? { id: editingId, ...finalFormData } : finalFormData;

      const response = await fetch('/api/placement-test/admin/questions', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingId ? 'Question updated' : 'Question created');
        refetch();
        return result.question || null;
      } else {
        toast.error(result.error || 'Failed to save');
        return null;
      }
    } catch {
      toast.error('Network error');
      return null;
    }
  }, [refetch]);

  const deleteQuestion = useCallback(async (id: string): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await fetch(`/api/placement-test/admin/questions?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Question deleted');
        refetch();
        return true;
      } else {
        toast.error('Failed to delete');
        return false;
      }
    } catch {
      toast.error('Network error');
      return false;
    }
  }, [refetch]);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const results = await Promise.all(
        ids.map(id =>
          fetch(`/api/placement-test/admin/questions?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      );

      const successCount = results.filter(r => r.ok).length;
      if (successCount === ids.length) {
        toast.success(`Deleted ${successCount} questions`);
      } else {
        toast.success(`Deleted ${successCount} of ${ids.length} questions`);
      }
      refetch();
      return true;
    } catch {
      toast.error('Network error during bulk delete');
      return false;
    }
  }, [refetch]);

  const bulkSetStatus = useCallback(async (ids: string[], status: string): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const results = await Promise.all(
        ids.map(id =>
          fetch('/api/placement-test/admin/questions', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, status })
          })
        )
      );

      const successCount = results.filter(r => r.ok).length;
      toast.success(`Updated ${successCount} questions to ${status}`);
      refetch();
      return true;
    } catch {
      toast.error('Network error during bulk status update');
      return false;
    }
  }, [refetch]);

  const toggleStatus = useCallback(async (question: Question): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    const statusCycle: Record<string, string> = {
      active: 'inactive',
      inactive: 'draft',
      draft: 'active'
    };
    const newStatus = statusCycle[question.status] || 'active';

    try {
      const response = await fetch('/api/placement-test/admin/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: question.id, status: newStatus })
      });

      if (response.ok) {
        toast.success(`Status changed to ${newStatus}`);
        refetch();
        return true;
      } else {
        toast.error('Failed to update status');
        return false;
      }
    } catch {
      toast.error('Network error');
      return false;
    }
  }, [refetch]);

  const duplicateQuestion = useCallback(async (question: Question): Promise<Question | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const newCode = question.question_code + '-copy';
      const body = {
        question_code: newCode,
        cefr_level: question.cefr_level,
        skill_type: question.skill_type,
        question_type: question.question_type,
        question_text: question.question_text,
        correct_answer: question.correct_answer,
        max_points: question.max_points,
        options: question.options,
        audio_url: question.audio_url || '',
        passage_text: question.passage_text || '',
        image_url: question.image_url || '',
        status: 'draft'
      };

      const response = await fetch('/api/placement-test/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Question duplicated');
        refetch();
        return result.question || null;
      } else {
        toast.error(result.error || 'Failed to duplicate');
        return null;
      }
    } catch {
      toast.error('Network error');
      return null;
    }
  }, [refetch]);

  return {
    saveQuestion,
    deleteQuestion,
    bulkDelete,
    bulkSetStatus,
    toggleStatus,
    duplicateQuestion
  };
}
