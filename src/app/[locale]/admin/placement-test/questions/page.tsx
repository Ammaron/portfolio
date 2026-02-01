'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  CaretLeft,
  Plus,
  Upload,
  Trash,
  PencilSimple,
  MagnifyingGlass,
  Funnel,
  Spinner,
  X
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question_code: string;
  cefr_level: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  options?: { id: string; text: string }[];
  correct_answer: string;
  max_points: number;
  status: string;
}

export default function QuestionBankPage() {
  const { locale } = useI18n();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filters, setFilters] = useState({
    skill: '',
    level: '',
    type: '',
    search: ''
  });

  const loadQuestions = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push(`/${locale}/admin/placement-test`);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.level) params.append('level', filters.level);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);

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
  }, [filters, locale, router]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`/api/placement-test/admin/questions?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Question deleted');
        loadQuestions();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      reading: 'bg-blue-100 text-blue-700',
      listening: 'bg-purple-100 text-purple-700',
      writing: 'bg-amber-100 text-amber-700',
      speaking: 'bg-pink-100 text-pink-700'
    };
    return colors[skill] || 'bg-gray-100 text-gray-700';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: 'bg-emerald-100 text-emerald-700',
      A2: 'bg-teal-100 text-teal-700',
      B1: 'bg-blue-100 text-blue-700',
      B2: 'bg-indigo-100 text-indigo-700',
      C1: 'bg-purple-100 text-purple-700',
      C2: 'bg-amber-100 text-amber-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/${locale}/admin/placement-test`}
              className="text-primary hover:text-primary-dark text-sm mb-2 inline-flex items-center gap-1"
            >
              <CaretLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Question Bank
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/placement-test/questions/import`}
              className="btn-authority btn-secondary-authority"
            >
              <Upload size={18} className="mr-2" />
              Import
            </Link>
            <button
              onClick={() => { setEditingQuestion(null); setShowForm(true); }}
              className="btn-authority btn-primary-authority"
            >
              <Plus size={18} className="mr-2" />
              Add Question
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="authority-card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Funnel size={18} className="text-gray-400" />

            <select
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Skills</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
              <option value="writing">Writing</option>
              <option value="speaking">Speaking</option>
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Levels</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="gap_fill">Gap Fill</option>
              <option value="matching">Matching</option>
              <option value="open_response">Open Response</option>
            </select>

            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                />
              </div>
            </div>

            <span className="text-sm text-gray-500">{total} questions</span>
          </div>
        </div>

        {/* Questions Table */}
        <div className="authority-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Spinner size={32} className="text-primary animate-spin mx-auto" />
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No questions found. Import or add questions to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Skill</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Question</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {q.question_code}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSkillColor(q.skill_type)}`}>
                          {q.skill_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(q.cefr_level)}`}>
                          {q.cefr_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {q.question_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">
                        {q.question_text}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {q.max_points}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => { setEditingQuestion(q); setShowForm(true); }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={() => { setShowForm(false); setEditingQuestion(null); }}
          onSave={() => { setShowForm(false); setEditingQuestion(null); loadQuestions(); }}
        />
      )}
    </div>
  );
}

// Question Form Modal Component
function QuestionFormModal({
  question,
  onClose,
  onSave
}: {
  question: Question | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    question_code: question?.question_code || '',
    cefr_level: question?.cefr_level || 'B1',
    skill_type: question?.skill_type || 'reading',
    question_type: question?.question_type || 'mcq',
    question_text: question?.question_text || '',
    correct_answer: question?.correct_answer || '',
    max_points: question?.max_points || 1,
    options: question?.options || [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ]
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setIsSaving(true);

    try {
      const method = question ? 'PUT' : 'POST';
      const body = question ? { id: question.id, ...formData } : formData;

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
        toast.success(question ? 'Question updated' : 'Question created');
        onSave();
      } else {
        toast.error(result.error || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="authority-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {question ? 'Edit Question' : 'Add Question'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Code *
              </label>
              <input
                type="text"
                value={formData.question_code}
                onChange={(e) => setFormData({ ...formData, question_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., R-B1-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Points
              </label>
              <input
                type="number"
                value={formData.max_points}
                onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill *
              </label>
              <select
                value={formData.skill_type}
                onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEFR Level *
              </label>
              <select
                value={formData.cefr_level}
                onChange={(e) => setFormData({ ...formData, cefr_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Type *
              </label>
              <select
                value={formData.question_type}
                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="gap_fill">Gap Fill</option>
                <option value="matching">Matching</option>
                <option value="open_response">Open Response</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          {formData.question_type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="w-8 text-center font-medium text-gray-500">{option.id}</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = { ...option, text: e.target.value };
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder={`Option ${option.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer *
            </label>
            <input
              type="text"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={formData.question_type === 'mcq' ? 'e.g., A' : 'Enter correct answer'}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-authority btn-primary-authority"
            >
              {isSaving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
