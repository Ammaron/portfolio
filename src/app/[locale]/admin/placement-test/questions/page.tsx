'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  X,
  SpeakerHigh,
  CloudArrowUp,
  Link as LinkIcon,
  Image as ImageIcon
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
  audio_url?: string;
  passage_text?: string;
  image_url?: string;
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
      reading: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      listening: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      writing: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      speaking: 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
    };
    return colors[skill] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      A2: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
      B1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      B2: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      C1: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      C2: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
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
              className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white text-sm cursor-pointer"
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
              className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white text-sm cursor-pointer"
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
              className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white text-sm cursor-pointer"
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            <span className="text-sm text-gray-300">{total} questions</span>
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
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Skill</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Question</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Points</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/50">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-700/50">
                      <td className="py-3 px-4">
                        <code className="text-xs bg-slate-700 text-gray-200 px-2 py-1 rounded">
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
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {q.question_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-200 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{q.question_text}</span>
                          {q.audio_url && (
                            <span className="flex-shrink-0" title="Has audio">
                              <SpeakerHigh size={16} className="text-purple-400" />
                            </span>
                          )}
                          {q.image_url && (
                            <span className="flex-shrink-0" title="Has image">
                              <ImageIcon size={16} className="text-green-400" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {q.max_points}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => { setEditingQuestion(q); setShowForm(true); }}
                          className="p-2 hover:bg-slate-600 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 cursor-pointer"
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

// Audio Upload Field Component
function AudioUploadField({
  audioUrl,
  onAudioChange,
  isListening
}: {
  audioUrl: string;
  onAudioChange: (url: string) => void;
  isListening: boolean;
}) {
  const [mode, setMode] = useState<'upload' | 'url'>(audioUrl && !audioUrl.startsWith('/uploads/') ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/placement-test/admin/audio/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onAudioChange(result.url);
        toast.success('Audio uploaded successfully');
      } else {
        setUploadError(result.error || 'Upload failed');
        toast.error(result.error || 'Upload failed');
      }
    } catch {
      setUploadError('Network error during upload');
      toast.error('Network error during upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAudio = async () => {
    if (audioUrl.startsWith('/uploads/audio/')) {
      // Delete from server
      try {
        const token = localStorage.getItem('admin_token');
        const filename = audioUrl.split('/').pop();
        await fetch(`/api/placement-test/admin/audio/upload?filename=${filename}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        // Ignore delete errors, still clear the field
      }
    }
    onAudioChange('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Audio File
        {isListening && (
          <span className="text-amber-400 font-normal ml-2">(recommended for listening)</span>
        )}
        {!isListening && (
          <span className="text-gray-500 font-normal ml-2">(optional)</span>
        )}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-3 bg-slate-700/50 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CloudArrowUp size={16} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'url'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LinkIcon size={16} />
          URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          {!audioUrl ? (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.webm,.m4a"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isUploading ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
              }`}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size={24} className="text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-400">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <CloudArrowUp size={32} className="text-gray-500" />
                    <span className="text-sm text-gray-400">
                      Click or drag to upload audio
                    </span>
                    <span className="text-xs text-gray-500">
                      MP3, WAV, OGG, WebM, M4A (max 10MB)
                    </span>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <SpeakerHigh size={16} />
                  Audio uploaded
                </span>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Trash size={14} />
                  Remove
                </button>
              </div>
              <audio src={audioUrl} controls className="w-full h-10" />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => onAudioChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="https://example.com/audio.mp3"
          />
          {audioUrl && (
            <div className="mt-2 bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Preview:</span>
                <button
                  type="button"
                  onClick={() => onAudioChange('')}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash size={12} />
                  Clear
                </button>
              </div>
              <audio
                src={audioUrl}
                controls
                className="w-full h-10"
                onError={(e) => {
                  const target = e.target as HTMLAudioElement;
                  target.style.display = 'none';
                  const errorMsg = target.parentElement?.querySelector('.audio-error');
                  if (errorMsg) errorMsg.classList.remove('hidden');
                }}
              />
              <p className="audio-error text-xs text-red-400 mt-1 hidden">Unable to load audio from this URL</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Image Upload Field Component
function ImageUploadField({
  imageUrl,
  onImageChange,
  isPictureDescription
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
  isPictureDescription: boolean;
}) {
  const [mode, setMode] = useState<'upload' | 'url'>(imageUrl && !imageUrl.startsWith('/uploads/') ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/placement-test/admin/image/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onImageChange(result.url);
        toast.success('Image uploaded successfully');
      } else {
        setUploadError(result.error || 'Upload failed');
        toast.error(result.error || 'Upload failed');
      }
    } catch {
      setUploadError('Network error during upload');
      toast.error('Network error during upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl.startsWith('/uploads/images/')) {
      try {
        const token = localStorage.getItem('admin_token');
        const filename = imageUrl.split('/').pop();
        await fetch(`/api/placement-test/admin/image/upload?filename=${filename}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        // Ignore delete errors
      }
    }
    onImageChange('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Image
        {isPictureDescription && (
          <span className="text-amber-400 font-normal ml-2">(recommended for picture description)</span>
        )}
        {!isPictureDescription && (
          <span className="text-gray-500 font-normal ml-2">(optional)</span>
        )}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-3 bg-slate-700/50 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CloudArrowUp size={16} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'url'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LinkIcon size={16} />
          URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          {!imageUrl ? (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isUploading ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
              }`}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size={24} className="text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-400">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={32} className="text-gray-500" />
                    <span className="text-sm text-gray-400">
                      Click or drag to upload image
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, PNG, GIF, WebP (max 5MB)
                    </span>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <ImageIcon size={16} />
                  Image uploaded
                </span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Trash size={14} />
                  Remove
                </button>
              </div>
              <img
                src={imageUrl}
                alt="Question image"
                className="max-w-full max-h-48 rounded-lg object-contain mx-auto"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div className="mt-2 bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Preview:</span>
                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash size={12} />
                  Clear
                </button>
              </div>
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const errorMsg = target.parentElement?.querySelector('.image-error');
                  if (errorMsg) errorMsg.classList.remove('hidden');
                }}
              />
              <p className="image-error text-xs text-red-400 mt-1 hidden text-center">Unable to load image from this URL</p>
            </div>
          )}
        </div>
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
    ],
    audio_url: question?.audio_url || '',
    passage_text: question?.passage_text || '',
    image_url: question?.image_url || ''
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-600/30 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {question ? 'Edit Question' : 'Add Question'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Question Code *
              </label>
              <input
                type="text"
                value={formData.question_code}
                onChange={(e) => setFormData({ ...formData, question_code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., R-B1-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Points
              </label>
              <input
                type="number"
                value={formData.max_points}
                onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Skill *
              </label>
              <select
                value={formData.skill_type}
                onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                CEFR Level *
              </label>
              <select
                value={formData.cefr_level}
                onChange={(e) => setFormData({ ...formData, cefr_level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Question Type *
              </label>
              <select
                value={formData.question_type}
                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Question Text *
            </label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Passage Text - for reading questions or questions with context */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Passage/Context Text
              <span className="text-gray-500 font-normal ml-2">(optional)</span>
            </label>
            <textarea
              value={formData.passage_text}
              onChange={(e) => setFormData({ ...formData, passage_text: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Reading passage or additional context for the question..."
            />
          </div>

          {/* Audio - Upload or URL */}
          <AudioUploadField
            audioUrl={formData.audio_url}
            onAudioChange={(url) => setFormData({ ...formData, audio_url: url })}
            isListening={formData.skill_type === 'listening'}
          />

          {/* Image - Upload or URL */}
          <ImageUploadField
            imageUrl={formData.image_url}
            onImageChange={(url) => setFormData({ ...formData, image_url: url })}
            isPictureDescription={formData.question_type === 'picture_description'}
          />

          {formData.question_type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="w-8 text-center font-medium text-gray-400">{option.id}</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = { ...option, text: e.target.value };
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={`Option ${option.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Correct Answer *
            </label>
            <input
              type="text"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={formData.question_type === 'mcq' ? 'e.g., A' : 'Enter correct answer'}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-600">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-500 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
