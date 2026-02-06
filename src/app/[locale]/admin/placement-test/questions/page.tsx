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
  Image as ImageIcon,
  ArrowRight,
  Info,
  CheckCircle,
  Circle,
  TextT,
  Check
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
              <option value="true_false_multi">True/False (Multiple)</option>
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
  const [mode, setMode] = useState<'upload' | 'url'>(audioUrl && !audioUrl.startsWith('/api/uploads/') && !audioUrl.startsWith('/uploads/') ? 'url' : 'upload');
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
    if (audioUrl.startsWith('/api/uploads/audio/') || audioUrl.startsWith('/uploads/audio/')) {
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
  const [mode, setMode] = useState<'upload' | 'url'>(imageUrl && !imageUrl.startsWith('/api/uploads/') && !imageUrl.startsWith('/uploads/') ? 'url' : 'upload');
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
    if (imageUrl.startsWith('/api/uploads/images/') || imageUrl.startsWith('/uploads/images/')) {
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

// Matching Pair Interface
interface MatchingPair {
  id: string;
  leftId: string;
  leftText: string;
  leftText_es?: string;
  leftAudioUrl?: string;
  rightId: string;
  rightText: string;
  rightText_es?: string;
  rightAudioUrl?: string;
}

// Parse existing options to pairs (for editing)
function parseOptionsToPairs(
  options: { id: string; text: string; text_es?: string; audio_url?: string }[] | undefined
): MatchingPair[] {
  if (!options || options.length < 2) {
    return [createEmptyPair(1)];
  }

  const pairs: MatchingPair[] = [];

  // Options are stored as alternating left/right items
  for (let i = 0; i < options.length; i += 2) {
    const leftItem = options[i];
    const rightItem = options[i + 1];

    if (leftItem && rightItem) {
      pairs.push({
        id: `pair-${pairs.length + 1}`,
        leftId: leftItem.id,
        leftText: leftItem.text,
        leftText_es: leftItem.text_es,
        leftAudioUrl: leftItem.audio_url,
        rightId: rightItem.id,
        rightText: rightItem.text,
        rightText_es: rightItem.text_es,
        rightAudioUrl: rightItem.audio_url
      });
    }
  }

  return pairs.length > 0 ? pairs : [createEmptyPair(1)];
}

// Create an empty pair with generated IDs
function createEmptyPair(pairNumber: number): MatchingPair {
  return {
    id: `pair-${pairNumber}`,
    leftId: `L${pairNumber}`,
    leftText: '',
    rightId: `R${pairNumber}`,
    rightText: ''
  };
}

// Convert pairs to options format (for saving)
function pairsToOptionsFormat(pairs: MatchingPair[]): {
  options: { id: string; text: string; text_es?: string; audio_url?: string }[];
  correct_answer: string;
} {
  const options: { id: string; text: string; text_es?: string; audio_url?: string }[] = [];
  const correctPairings: string[] = [];

  pairs.forEach((pair) => {
    // Left item
    const leftOption: { id: string; text: string; text_es?: string; audio_url?: string } = {
      id: pair.leftId,
      text: pair.leftText
    };
    if (pair.leftText_es) leftOption.text_es = pair.leftText_es;
    if (pair.leftAudioUrl) leftOption.audio_url = pair.leftAudioUrl;
    options.push(leftOption);

    // Right item
    const rightOption: { id: string; text: string; text_es?: string; audio_url?: string } = {
      id: pair.rightId,
      text: pair.rightText
    };
    if (pair.rightText_es) rightOption.text_es = pair.rightText_es;
    if (pair.rightAudioUrl) rightOption.audio_url = pair.rightAudioUrl;
    options.push(rightOption);

    // Correct pairing
    correctPairings.push(`${pair.leftId}:${pair.rightId}`);
  });

  return {
    options,
    correct_answer: correctPairings.join(',')
  };
}

// Compact Audio Upload for Matching Items
function CompactAudioUpload({
  audioUrl,
  onAudioChange,
  label
}: {
  audioUrl?: string;
  onAudioChange: (url: string) => void;
  label: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/placement-test/admin/audio/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onAudioChange(result.url);
        toast.success('Audio uploaded');
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (audioUrl && (audioUrl.startsWith('/api/uploads/audio/') || audioUrl.startsWith('/uploads/audio/'))) {
      try {
        const token = localStorage.getItem('admin_token');
        const filename = audioUrl.split('/').pop();
        await fetch(`/api/placement-test/admin/audio/upload?filename=${filename}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        // Ignore errors
      }
    }
    onAudioChange('');
  };

  if (audioUrl) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <SpeakerHigh size={14} className="text-green-400" />
        <audio src={audioUrl} controls className="h-6 flex-1" />
        <button
          type="button"
          onClick={handleRemove}
          className="text-red-400 hover:text-red-300 cursor-pointer p-1"
          title="Remove audio"
        >
          <Trash size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        id={`audio-${label}`}
      />
      <label
        htmlFor={`audio-${label}`}
        className={`text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
          isUploading
            ? 'bg-blue-600/30 text-blue-300'
            : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
        }`}
      >
        {isUploading ? (
          <>
            <Spinner size={10} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <SpeakerHigh size={12} />
            Add Audio
          </>
        )}
      </label>
    </div>
  );
}

// Matching Pairs Editor Component
function MatchingPairsEditor({
  pairs,
  onChange
}: {
  pairs: MatchingPair[];
  onChange: (pairs: MatchingPair[]) => void;
}) {
  const addPair = () => {
    const newPairNumber = pairs.length + 1;
    onChange([...pairs, createEmptyPair(newPairNumber)]);
  };

  const removePair = (index: number) => {
    if (pairs.length <= 2) {
      toast.error('Minimum 2 pairs required');
      return;
    }
    const newPairs = pairs.filter((_, i) => i !== index);
    // Renumber the pairs
    const renumberedPairs = newPairs.map((pair, i) => ({
      ...pair,
      id: `pair-${i + 1}`,
      leftId: `L${i + 1}`,
      rightId: `R${i + 1}`
    }));
    onChange(renumberedPairs);
  };

  const updatePair = (index: number, field: keyof MatchingPair, value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    onChange(newPairs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          Create matching pairs below. Left items are prompts, right items are answers.
          The order is shuffled when shown to students.
        </p>
      </div>

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div key={pair.id} className="relative p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            {/* Pair header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Pair {index + 1}</span>
              <button
                type="button"
                onClick={() => removePair(index)}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded cursor-pointer transition-colors"
                title="Remove pair"
              >
                <X size={16} />
              </button>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-start">
              {/* Left item */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-600 px-2 py-0.5 rounded text-gray-300">
                    {pair.leftId}
                  </span>
                  <span className="text-xs text-gray-400">Left Item</span>
                </div>
                <input
                  type="text"
                  value={pair.leftText}
                  onChange={(e) => updatePair(index, 'leftText', e.target.value)}
                  placeholder="Left item text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={pair.leftText_es || ''}
                  onChange={(e) => updatePair(index, 'leftText_es', e.target.value)}
                  placeholder="Spanish (optional)"
                  className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded text-gray-300 placeholder-gray-500 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <CompactAudioUpload
                  audioUrl={pair.leftAudioUrl}
                  onAudioChange={(url) => updatePair(index, 'leftAudioUrl', url)}
                  label={`left-${index}`}
                />
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center pt-8">
                <ArrowRight size={24} className="text-gray-500" />
              </div>

              {/* Right item */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-600 px-2 py-0.5 rounded text-gray-300">
                    {pair.rightId}
                  </span>
                  <span className="text-xs text-gray-400">Right Item</span>
                </div>
                <input
                  type="text"
                  value={pair.rightText}
                  onChange={(e) => updatePair(index, 'rightText', e.target.value)}
                  placeholder="Right item text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={pair.rightText_es || ''}
                  onChange={(e) => updatePair(index, 'rightText_es', e.target.value)}
                  placeholder="Spanish (optional)"
                  className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded text-gray-300 placeholder-gray-500 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <CompactAudioUpload
                  audioUrl={pair.rightAudioUrl}
                  onAudioChange={(url) => updatePair(index, 'rightAudioUrl', url)}
                  label={`right-${index}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPair}
        className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        Add Pair
      </button>
    </div>
  );
}

// Multiple Choice Options Editor Component
function MultipleChoiceEditor({
  options,
  correctAnswer,
  onOptionsChange,
  onCorrectAnswerChange
}: {
  options: { id: string; text: string }[];
  correctAnswer: string;
  onOptionsChange: (options: { id: string; text: string }[]) => void;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  const addOption = () => {
    const nextId = String.fromCharCode(65 + options.length); // A, B, C, D, E...
    if (options.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    onOptionsChange([...options, { id: nextId, text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    const removedId = options[index].id;
    const newOptions = options.filter((_, i) => i !== index);
    // Re-letter the options
    const reletteredOptions = newOptions.map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i)
    }));
    onOptionsChange(reletteredOptions);
    // Clear correct answer if the removed option was selected
    if (correctAnswer === removedId) {
      onCorrectAnswerChange('');
    } else if (correctAnswer > removedId) {
      // Adjust correct answer letter if needed
      const newCorrect = String.fromCharCode(correctAnswer.charCodeAt(0) - 1);
      onCorrectAnswerChange(newCorrect);
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          Click on an option to mark it as the correct answer.
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
              correctAnswer === option.id
                ? 'bg-green-900/30 border-green-500/50'
                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
            }`}
            onClick={() => onCorrectAnswerChange(option.id)}
          >
            <div className="flex-shrink-0">
              {correctAnswer === option.id ? (
                <CheckCircle size={24} weight="fill" className="text-green-400" />
              ) : (
                <Circle size={24} className="text-gray-500" />
              )}
            </div>
            <span className="w-8 text-center font-bold text-gray-300">{option.id}</span>
            <input
              type="text"
              value={option.text}
              onChange={(e) => {
                e.stopPropagation();
                updateOption(index, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={`Option ${option.id}`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(index);
              }}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors cursor-pointer"
              title="Remove option"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOption}
        className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        Add Option
      </button>
    </div>
  );
}

// True/False Editor Component
function TrueFalseEditor({
  correctAnswer,
  onCorrectAnswerChange
}: {
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          Select whether the statement is true or false.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onCorrectAnswerChange('true')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
            correctAnswer.toLowerCase() === 'true'
              ? 'bg-green-900/30 border-green-500 text-green-400'
              : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
          }`}
        >
          {correctAnswer.toLowerCase() === 'true' ? (
            <CheckCircle size={32} weight="fill" className="text-green-400" />
          ) : (
            <Check size={32} />
          )}
          <span className="font-semibold text-lg">True</span>
        </button>

        <button
          type="button"
          onClick={() => onCorrectAnswerChange('false')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
            correctAnswer.toLowerCase() === 'false'
              ? 'bg-red-900/30 border-red-500 text-red-400'
              : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
          }`}
        >
          {correctAnswer.toLowerCase() === 'false' ? (
            <X size={32} weight="bold" className="text-red-400" />
          ) : (
            <X size={32} />
          )}
          <span className="font-semibold text-lg">False</span>
        </button>
      </div>
    </div>
  );
}

// True/False Multi Statement Interface
interface TFMultiStatement {
  id: string;
  text: string;
  text_es?: string;
  isTrue: boolean;
}

// Parse existing options + correct_answer to TFMultiStatements (for editing)
function parseOptionsToTFMultiStatements(
  options: { id: string; text: string; text_es?: string }[] | undefined,
  correctAnswer: string
): TFMultiStatement[] {
  if (!options || options.length === 0) {
    return [
      { id: 'A', text: '', isTrue: true },
      { id: 'B', text: '', isTrue: false }
    ];
  }

  const correctMap = new Map<string, boolean>();
  if (correctAnswer) {
    correctAnswer.split(',').forEach(pair => {
      const [id, val] = pair.trim().split(':');
      correctMap.set(id, val === 'true');
    });
  }

  return options.map(opt => ({
    id: opt.id,
    text: opt.text,
    text_es: opt.text_es,
    isTrue: correctMap.get(opt.id) ?? true
  }));
}

// Convert TFMultiStatements to options + correct_answer format (for saving)
function tfMultiStatementsToFormat(statements: TFMultiStatement[]): {
  options: { id: string; text: string; text_es?: string }[];
  correct_answer: string;
  max_points: number;
} {
  const options = statements.map(s => {
    const opt: { id: string; text: string; text_es?: string } = { id: s.id, text: s.text };
    if (s.text_es) opt.text_es = s.text_es;
    return opt;
  });
  const correct_answer = statements.map(s => `${s.id}:${s.isTrue ? 'true' : 'false'}`).join(',');
  return { options, correct_answer, max_points: statements.length };
}

// True/False Multi Editor Component
function TrueFalseMultiEditor({
  statements,
  onChange
}: {
  statements: TFMultiStatement[];
  onChange: (statements: TFMultiStatement[]) => void;
}) {
  const addStatement = () => {
    if (statements.length >= 8) {
      toast.error('Maximum 8 statements allowed');
      return;
    }
    const nextId = String.fromCharCode(65 + statements.length); // A, B, C...
    onChange([...statements, { id: nextId, text: '', isTrue: true }]);
  };

  const removeStatement = (index: number) => {
    if (statements.length <= 2) {
      toast.error('Minimum 2 statements required');
      return;
    }
    const newStatements = statements.filter((_, i) => i !== index);
    // Re-letter the statements
    const relettered = newStatements.map((s, i) => ({
      ...s,
      id: String.fromCharCode(65 + i)
    }));
    onChange(relettered);
  };

  const updateStatement = (index: number, field: string, value: string | boolean) => {
    const newStatements = [...statements];
    newStatements[index] = { ...newStatements[index], [field]: value };
    onChange(newStatements);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p>Add multiple statements. For each statement, set whether it is True or False.</p>
          <p className="mt-1">Students will see all statements and select True/False for each one. Partial credit is awarded (1 point per correct statement).</p>
        </div>
      </div>

      <div className="space-y-3">
        {statements.map((statement, index) => (
          <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">
                Statement {statement.id}
              </span>
              <button
                type="button"
                onClick={() => removeStatement(index)}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded cursor-pointer transition-colors"
                title="Remove statement"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={statement.text}
                onChange={(e) => updateStatement(index, 'text', e.target.value)}
                placeholder="Statement text (e.g., 'The speaker lives in London')"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={statement.text_es || ''}
                onChange={(e) => updateStatement(index, 'text_es', e.target.value)}
                placeholder="Spanish translation (optional)"
                className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded text-gray-300 placeholder-gray-500 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              {/* True/False toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Correct answer:</span>
                <button
                  type="button"
                  onClick={() => updateStatement(index, 'isTrue', true)}
                  className={`px-4 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                    statement.isTrue
                      ? 'bg-green-900/30 border-green-500 text-green-400'
                      : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
                  }`}
                >
                  True
                </button>
                <button
                  type="button"
                  onClick={() => updateStatement(index, 'isTrue', false)}
                  className={`px-4 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                    !statement.isTrue
                      ? 'bg-red-900/30 border-red-500 text-red-400'
                      : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:border-slate-500'
                  }`}
                >
                  False
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addStatement}
        className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        Add Statement
      </button>

      {/* Summary */}
      <div className="p-3 bg-slate-700/30 rounded-lg text-sm text-gray-400">
        {statements.length} statements = {statements.length} max points (1 point per correct statement)
      </div>
    </div>
  );
}

// Gap Fill Editor Component
function GapFillEditor({
  questionText,
  correctAnswer,
  onQuestionTextChange,
  onCorrectAnswerChange
}: {
  questionText: string;
  correctAnswer: string;
  onQuestionTextChange: (text: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  // Parse blanks from question text (marked with ___ or [blank])
  const blankPattern = /_{3,}|\[blank\]|\[___\]/gi;
  const blanks = questionText.match(blankPattern) || [];
  const answers = correctAnswer ? correctAnswer.split('|') : [];

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    while (newAnswers.length <= index) {
      newAnswers.push('');
    }
    newAnswers[index] = value;
    onCorrectAnswerChange(newAnswers.join('|'));
  };

  const insertBlank = () => {
    const textarea = document.querySelector('textarea[data-gap-fill]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = questionText.slice(0, start) + '___' + questionText.slice(end);
      onQuestionTextChange(newText);
      // Add empty answer for the new blank
      const newAnswers = [...answers, ''];
      onCorrectAnswerChange(newAnswers.join('|'));
    } else {
      onQuestionTextChange(questionText + ' ___');
      const newAnswers = [...answers, ''];
      onCorrectAnswerChange(newAnswers.join('|'));
    }
  };

  // Preview the question with blanks highlighted
  const previewParts = questionText.split(blankPattern);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p>Use <code className="bg-slate-700 px-1.5 py-0.5 rounded">___</code> (three underscores) to mark blanks in the question text.</p>
          <p className="mt-1">For multiple blanks, separate answers with <code className="bg-slate-700 px-1.5 py-0.5 rounded">|</code> (pipe).</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Question with Blanks
          </label>
          <button
            type="button"
            onClick={insertBlank}
            className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded hover:bg-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <TextT size={14} />
            Insert Blank
          </button>
        </div>
        <textarea
          data-gap-fill="true"
          value={questionText}
          onChange={(e) => onQuestionTextChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="The capital of France is ___."
        />
      </div>

      {blanks.length > 0 && (
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Preview
          </label>
          <p className="text-gray-200">
            {previewParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < blanks.length && (
                  <span className="inline-block mx-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-amber-300 text-sm">
                    {answers[i] || `blank ${i + 1}`}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Correct Answers for Each Blank
          </label>
          <div className="space-y-2">
            {blanks.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-20 text-sm text-gray-400">Blank {index + 1}:</span>
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter correct answer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {blanks.length === 0 && (
        <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg text-center">
          <p className="text-amber-300 text-sm">
            No blanks detected. Add <code className="bg-slate-700 px-1.5 py-0.5 rounded">___</code> to your question text.
          </p>
        </div>
      )}
    </div>
  );
}

// Open Response Editor Component
function OpenResponseEditor({
  correctAnswer,
  onCorrectAnswerChange
}: {
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p>Open response questions are manually graded.</p>
          <p className="mt-1">Provide a sample/expected answer or grading criteria below.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sample Answer / Grading Criteria
        </label>
        <textarea
          value={correctAnswer}
          onChange={(e) => onCorrectAnswerChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Enter a sample answer or describe what a correct response should include..."
        />
      </div>
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

  // Initialize matching pairs from options if editing a matching question
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>(() => {
    if (question?.question_type === 'matching' && question.options) {
      return parseOptionsToPairs(
        question.options as { id: string; text: string; text_es?: string; audio_url?: string }[]
      );
    }
    return [createEmptyPair(1), createEmptyPair(2)];
  });

  // Initialize true/false multi statements from options if editing
  const [tfMultiStatements, setTfMultiStatements] = useState<TFMultiStatement[]>(() => {
    if (question?.question_type === 'true_false_multi' && question.options) {
      return parseOptionsToTFMultiStatements(
        question.options as { id: string; text: string; text_es?: string }[],
        question.correct_answer
      );
    }
    return [
      { id: 'A', text: '', isTrue: true },
      { id: 'B', text: '', isTrue: false }
    ];
  });

  const handleSave = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    // Validate matching pairs if applicable
    if (formData.question_type === 'matching') {
      if (matchingPairs.length < 2) {
        toast.error('Minimum 2 matching pairs required');
        return;
      }
      const hasEmptyPairs = matchingPairs.some(
        (pair) => !pair.leftText.trim() || !pair.rightText.trim()
      );
      if (hasEmptyPairs) {
        toast.error('All matching pair fields must be filled');
        return;
      }
    }

    // Validate true/false multi statements if applicable
    if (formData.question_type === 'true_false_multi') {
      if (tfMultiStatements.length < 2) {
        toast.error('Minimum 2 statements required');
        return;
      }
      const hasEmpty = tfMultiStatements.some(s => !s.text.trim());
      if (hasEmpty) {
        toast.error('All statement fields must be filled');
        return;
      }
    }

    setIsSaving(true);

    try {
      const method = question ? 'PUT' : 'POST';

      // Convert matching pairs to options format if matching question
      let finalFormData = { ...formData };
      if (formData.question_type === 'matching') {
        const { options, correct_answer } = pairsToOptionsFormat(matchingPairs);
        finalFormData = {
          ...formData,
          options: options as { id: string; text: string }[],
          correct_answer
        };
      } else if (formData.question_type === 'true_false_multi') {
        const { options, correct_answer, max_points } = tfMultiStatementsToFormat(tfMultiStatements);
        finalFormData = {
          ...formData,
          options: options as { id: string; text: string }[],
          correct_answer,
          max_points
        };
      }

      const body = question ? { id: question.id, ...finalFormData } : finalFormData;

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
                <option value="true_false_multi">True/False (Multiple)</option>
                <option value="gap_fill">Gap Fill</option>
                <option value="matching">Matching</option>
                <option value="open_response">Open Response</option>
              </select>
            </div>
          </div>

          {/* Question Text - hidden for gap_fill since it has its own editor */}
          {formData.question_type !== 'gap_fill' && (
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
          )}

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

          {/* Multiple Choice Editor */}
          {formData.question_type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Answer Options
              </label>
              <MultipleChoiceEditor
                options={formData.options}
                correctAnswer={formData.correct_answer}
                onOptionsChange={(options) => setFormData({ ...formData, options })}
                onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
              />
            </div>
          )}

          {/* True/False Editor */}
          {formData.question_type === 'true_false' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correct Answer
              </label>
              <TrueFalseEditor
                correctAnswer={formData.correct_answer}
                onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
              />
            </div>
          )}

          {/* True/False Multi Editor */}
          {formData.question_type === 'true_false_multi' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Statements
              </label>
              <TrueFalseMultiEditor
                statements={tfMultiStatements}
                onChange={setTfMultiStatements}
              />
            </div>
          )}

          {/* Gap Fill Editor */}
          {formData.question_type === 'gap_fill' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gap Fill Configuration
              </label>
              <GapFillEditor
                questionText={formData.question_text}
                correctAnswer={formData.correct_answer}
                onQuestionTextChange={(text) => setFormData({ ...formData, question_text: text })}
                onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
              />
            </div>
          )}

          {/* Matching Pairs Editor */}
          {formData.question_type === 'matching' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Matching Pairs
              </label>
              <MatchingPairsEditor
                pairs={matchingPairs}
                onChange={setMatchingPairs}
              />
            </div>
          )}

          {/* Open Response Editor */}
          {formData.question_type === 'open_response' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Answer Configuration
              </label>
              <OpenResponseEditor
                correctAnswer={formData.correct_answer}
                onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
              />
            </div>
          )}

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
