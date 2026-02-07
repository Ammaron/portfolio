'use client';

import { useState, useCallback, useMemo } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  CaretLeft,
  Plus,
  Upload,
  List as ListIcon,
  X
} from '@phosphor-icons/react';

import { SortConfig, SidebarFilter, PanelMode, MatchingPair, TFMultiStatement } from './_components/types';
import { useQuestions } from './_components/hooks/useQuestions';
import { useBulkSelection } from './_components/hooks/useBulkSelection';
import { useQuestionMutations } from './_components/hooks/useQuestionMutations';
import StatsDashboard from './_components/StatsDashboard';
import SkillLevelSidebar from './_components/SkillLevelSidebar';
import QuestionList from './_components/QuestionList';
import QuestionPreviewPanel from './_components/QuestionPreviewPanel';
import QuestionEditPanel from './_components/QuestionEditPanel';
import BulkActionBar from './_components/BulkActionBar';
import ConfirmDialog from './_components/ConfirmDialog';

export default function QuestionBankPage() {
  const { locale } = useI18n();

  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const [statsCollapsed, setStatsCollapsed] = useState(false);

  // Filter / search / sort / pagination state
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>({ skill: '', level: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'cefr_level', order: 'asc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Panel state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('empty');
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // mobile overlay
  const [isSaving, setIsSaving] = useState(false);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });

  // Data hooks
  const { questions, total, totalPages, isLoading, stats, refetch } = useQuestions({
    sidebarFilter, searchQuery, sortConfig, page, pageSize
  });

  const { selectedIds, selectedCount, toggle, selectAll, deselectAll, isSelected } = useBulkSelection();
  const mutations = useQuestionMutations(refetch);

  // Find the selected question object
  const selectedQuestion = useMemo(
    () => questions.find(q => q.id === selectedQuestionId) || null,
    [questions, selectedQuestionId]
  );

  // --- Handlers ---

  const handleSidebarFilterChange = useCallback((filter: SidebarFilter) => {
    setSidebarFilter(filter);
    setPage(0);
    setSelectedQuestionId(null);
    setPanelMode('empty');
    deselectAll();
    setSidebarOpen(false);
  }, [deselectAll]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(0);
  }, []);

  const handleSortChange = useCallback((config: SortConfig) => {
    setSortConfig(config);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  }, []);

  const handleSelectQuestion = useCallback((id: string) => {
    setSelectedQuestionId(id);
    setPanelMode('preview');
    setRightPanelOpen(true);
  }, []);

  const handleAddQuestion = useCallback(() => {
    setSelectedQuestionId(null);
    setPanelMode('create');
    setRightPanelOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setPanelMode('edit');
  }, []);

  const handleCancelEdit = useCallback(() => {
    if (selectedQuestionId) {
      setPanelMode('preview');
    } else {
      setPanelMode('empty');
      setRightPanelOpen(false);
    }
  }, [selectedQuestionId]);

  const handleSave = useCallback(async (
    formData: {
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
    },
    matchingPairs?: MatchingPair[],
    tfMultiStatements?: TFMultiStatement[]
  ) => {
    setIsSaving(true);
    const editingId = panelMode === 'edit' ? selectedQuestionId : null;
    const saved = await mutations.saveQuestion(formData, editingId, matchingPairs, tfMultiStatements);
    setIsSaving(false);

    if (saved) {
      setSelectedQuestionId(saved.id);
      setPanelMode('preview');
    }
  }, [panelMode, selectedQuestionId, mutations]);

  const handleDelete = useCallback(() => {
    if (!selectedQuestion) return;
    setConfirmDialog({
      open: true,
      title: 'Delete Question',
      message: `Are you sure you want to delete "${selectedQuestion.question_code}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await mutations.deleteQuestion(selectedQuestion.id);
        setSelectedQuestionId(null);
        setPanelMode('empty');
        setRightPanelOpen(false);
      }
    });
  }, [selectedQuestion, mutations]);

  const handleDuplicate = useCallback(async () => {
    if (!selectedQuestion) return;
    const dup = await mutations.duplicateQuestion(selectedQuestion);
    if (dup) {
      setSelectedQuestionId(dup.id);
      setPanelMode('preview');
    }
  }, [selectedQuestion, mutations]);

  const handleToggleStatus = useCallback(async () => {
    if (!selectedQuestion) return;
    await mutations.toggleStatus(selectedQuestion);
  }, [selectedQuestion, mutations]);

  const handleSelectAll = useCallback(() => {
    const allIds = questions.map(q => q.id);
    const allSelected = allIds.every(id => isSelected(id));
    if (allSelected) {
      deselectAll();
    } else {
      selectAll(allIds);
    }
  }, [questions, isSelected, selectAll, deselectAll]);

  const allChecked = useMemo(
    () => questions.length > 0 && questions.every(q => isSelected(q.id)),
    [questions, isSelected]
  );

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selectedIds);
    setConfirmDialog({
      open: true,
      title: 'Delete Questions',
      message: `Are you sure you want to delete ${ids.length} question${ids.length > 1 ? 's' : ''}? This cannot be undone.`,
      confirmLabel: 'Delete All',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await mutations.bulkDelete(ids);
        deselectAll();
        if (ids.includes(selectedQuestionId || '')) {
          setSelectedQuestionId(null);
          setPanelMode('empty');
        }
      }
    });
  }, [selectedIds, mutations, deselectAll, selectedQuestionId]);

  const handleBulkSetStatus = useCallback((status: string) => {
    const ids = Array.from(selectedIds);
    setConfirmDialog({
      open: true,
      title: 'Update Status',
      message: `Set ${ids.length} question${ids.length > 1 ? 's' : ''} to "${status}"?`,
      confirmLabel: 'Update',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await mutations.bulkSetStatus(ids, status);
        deselectAll();
      }
    });
  }, [selectedIds, mutations, deselectAll]);

  const handleCloseRightPanel = useCallback(() => {
    setRightPanelOpen(false);
    setSelectedQuestionId(null);
    setPanelMode('empty');
  }, []);

  // --- Render ---

  const rightPanelContent = panelMode === 'edit' || panelMode === 'create' ? (
    <QuestionEditPanel
      question={panelMode === 'edit' ? selectedQuestion : null}
      onSave={handleSave}
      onCancel={handleCancelEdit}
      isSaving={isSaving}
    />
  ) : (
    <QuestionPreviewPanel
      question={selectedQuestion}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
      onClose={handleCloseRightPanel}
    />
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link
              href={`/${locale}/admin/placement-test`}
              className="text-primary hover:text-primary-dark text-sm mb-1 inline-flex items-center gap-1"
            >
              <CaretLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Question Bank
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white cursor-pointer"
            >
              <ListIcon size={20} />
            </button>
            <Link
              href={`/${locale}/admin/placement-test/questions/import`}
              className="btn-authority btn-secondary-authority"
            >
              <Upload size={18} className="mr-2" />
              Import
            </Link>
            <button
              onClick={handleAddQuestion}
              className="btn-authority btn-primary-authority"
            >
              <Plus size={18} className="mr-2" />
              Add Question
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard
          stats={stats}
          collapsed={statsCollapsed}
          onToggle={() => setStatsCollapsed(!statsCollapsed)}
        />

        {/* Three-panel layout */}
        <div className="flex gap-0 authority-card overflow-hidden relative" style={{ height: 'calc(100vh - 260px)', minHeight: '500px' }}>
          {/* Sidebar */}
          <div className={`
            w-[260px] flex-shrink-0 border-r border-slate-700 bg-slate-800/50
            hidden lg:block
          `}>
            <SkillLevelSidebar
              stats={stats}
              filter={sidebarFilter}
              onFilterChange={handleSidebarFilterChange}
            />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-30 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-800 border-r border-slate-700 shadow-2xl z-10">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                  <span className="text-sm font-medium text-white">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-700 rounded cursor-pointer text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <SkillLevelSidebar
                  stats={stats}
                  filter={sidebarFilter}
                  onFilterChange={handleSidebarFilterChange}
                />
              </div>
            </div>
          )}

          {/* Middle: Question List */}
          <div className="flex-1 min-w-0 relative">
            <QuestionList
              questions={questions}
              total={total}
              totalPages={totalPages}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              page={page}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={handleSelectQuestion}
              isChecked={isSelected}
              onToggleCheck={toggle}
              onSelectAll={handleSelectAll}
              allChecked={allChecked}
              onAddQuestion={handleAddQuestion}
            />

            {/* Bulk action bar */}
            <BulkActionBar
              selectedCount={selectedCount}
              onDelete={handleBulkDelete}
              onSetStatus={handleBulkSetStatus}
              onDeselectAll={deselectAll}
            />
          </div>

          {/* Right Panel - desktop */}
          <div className="w-[420px] flex-shrink-0 border-l border-slate-700 bg-slate-800/50 hidden xl:block">
            {rightPanelContent}
          </div>

          {/* Right Panel - overlay for lg and below */}
          {rightPanelOpen && (
            <div className="fixed inset-0 z-30 xl:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={handleCloseRightPanel} />
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-[480px] bg-slate-800 border-l border-slate-700 shadow-2xl z-10">
                {rightPanelContent}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}
