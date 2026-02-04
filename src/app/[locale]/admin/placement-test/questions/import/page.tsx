'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  CaretLeft,
  UploadSimple,
  FileArrowDown,
  Warning,
  CheckCircle,
  XCircle,
  Spinner,
  X,
  Table,
  FileCsv,
  FileXls
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Valid values for validation
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const VALID_SKILLS = ['reading', 'listening', 'writing', 'speaking'];
const VALID_TYPES = ['mcq', 'true_false', 'gap_fill', 'matching', 'open_response', 'form_filling', 'short_message', 'picture_description', 'interview'];

interface ParsedQuestion {
  row: number;
  question_code: string;
  cefr_level: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  correct_answer: string;
  max_points?: number;
  options?: string;
  passage_text?: string;
  audio_url?: string;
  image_url?: string;
  errors: string[];
}

interface ImportResult {
  success: boolean;
  imported?: number;
  total_submitted?: number;
  validation_errors?: string[];
  import_errors?: string[];
  error?: string;
}

export default function ImportQuestionsPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showAllRows, setShowAllRows] = useState(false);

  // Validate a single row
  const validateRow = (row: Record<string, unknown>, rowNum: number): ParsedQuestion => {
    const errors: string[] = [];

    const question_code = String(row.question_code || '').trim();
    const cefr_level = String(row.cefr_level || '').trim().toUpperCase();
    const skill_type = String(row.skill_type || '').trim().toLowerCase();
    const question_type = String(row.question_type || '').trim().toLowerCase();
    const question_text = String(row.question_text || '').trim();
    const correct_answer = String(row.correct_answer || '').trim();
    const max_points = row.max_points ? Number(row.max_points) : 1;
    const options = row.options ? String(row.options).trim() : undefined;
    const passage_text = row.passage_text ? String(row.passage_text).trim() : undefined;
    const audio_url = row.audio_url ? String(row.audio_url).trim() : undefined;
    const image_url = row.image_url ? String(row.image_url).trim() : undefined;

    // Validate required fields
    if (!question_code) errors.push('Missing question_code');
    if (!cefr_level) errors.push('Missing cefr_level');
    else if (!VALID_LEVELS.includes(cefr_level)) errors.push(`Invalid cefr_level "${cefr_level}"`);
    if (!skill_type) errors.push('Missing skill_type');
    else if (!VALID_SKILLS.includes(skill_type)) errors.push(`Invalid skill_type "${skill_type}"`);
    if (!question_type) errors.push('Missing question_type');
    else if (!VALID_TYPES.includes(question_type)) errors.push(`Invalid question_type "${question_type}"`);
    if (!question_text) errors.push('Missing question_text');
    if (!correct_answer) errors.push('Missing correct_answer');

    // Validate MCQ has options
    if (question_type === 'mcq' && !options) {
      errors.push('MCQ requires options');
    }

    return {
      row: rowNum,
      question_code,
      cefr_level,
      skill_type,
      question_type,
      question_text,
      correct_answer,
      max_points,
      options,
      passage_text,
      audio_url,
      image_url,
      errors
    };
  };

  // Parse uploaded file
  const parseFile = useCallback(async (uploadedFile: File) => {
    setIsLoading(true);
    setImportResult(null);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast.error('File is empty or has no data rows');
        setFile(null);
        setParsedData([]);
        return;
      }

      const parsed = jsonData.map((row, index) =>
        validateRow(row as Record<string, unknown>, index + 2) // +2 for 1-indexed + header row
      );

      setParsedData(parsed);
      setFile(uploadedFile);

      const errorCount = parsed.filter(p => p.errors.length > 0).length;
      if (errorCount > 0) {
        toast.error(`${errorCount} row(s) have validation errors`);
      } else {
        toast.success(`Parsed ${parsed.length} questions successfully`);
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Failed to parse file');
      setFile(null);
      setParsedData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
        parseFile(droppedFile);
      } else {
        toast.error('Please upload a CSV or Excel file');
      }
    }
  }, [parseFile]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      parseFile(selectedFile);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const templateData = [
      {
        question_code: 'R-A1-001',
        cefr_level: 'A1',
        skill_type: 'reading',
        question_type: 'mcq',
        question_text: 'What is the main topic of the passage?',
        correct_answer: 'A',
        max_points: 1,
        options: 'Weather|Animals|Food|Sports',
        passage_text: 'The sun is shining today. Birds are singing in the trees.',
        audio_url: '',
        image_url: ''
      },
      {
        question_code: 'L-B1-001',
        cefr_level: 'B1',
        skill_type: 'listening',
        question_type: 'true_false',
        question_text: 'The speaker mentions going to the beach.',
        correct_answer: 'true',
        max_points: 1,
        options: '',
        passage_text: '',
        audio_url: 'https://example.com/audio.mp3',
        image_url: ''
      },
      {
        question_code: 'W-B2-001',
        cefr_level: 'B2',
        skill_type: 'writing',
        question_type: 'picture_description',
        question_text: 'Describe what you see in the picture.',
        correct_answer: 'See rubric',
        max_points: 5,
        options: '',
        passage_text: '',
        audio_url: '',
        image_url: 'https://example.com/image.jpg'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // question_code
      { wch: 10 }, // cefr_level
      { wch: 12 }, // skill_type
      { wch: 15 }, // question_type
      { wch: 50 }, // question_text
      { wch: 15 }, // correct_answer
      { wch: 12 }, // max_points
      { wch: 40 }, // options
      { wch: 50 }, // passage_text
      { wch: 30 }, // audio_url
      { wch: 30 }  // image_url
    ];

    XLSX.writeFile(workbook, 'question_import_template.xlsx');
    toast.success('Template downloaded');
  };

  // Submit import
  const handleImport = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push(`/${locale}/admin/placement-test`);
      return;
    }

    const validQuestions = parsedData.filter(p => p.errors.length === 0);
    if (validQuestions.length === 0) {
      toast.error('No valid questions to import');
      return;
    }

    setIsImporting(true);

    try {
      const questionsToImport = validQuestions.map(q => ({
        question_code: q.question_code,
        cefr_level: q.cefr_level,
        skill_type: q.skill_type,
        question_type: q.question_type,
        question_text: q.question_text,
        correct_answer: q.correct_answer,
        max_points: q.max_points || 1,
        options: q.options || null,
        passage_text: q.passage_text || null,
        audio_url: q.audio_url || null,
        image_url: q.image_url || null
      }));

      const response = await fetch('/api/placement-test/admin/questions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questions: questionsToImport })
      });

      const result: ImportResult = await response.json();
      setImportResult(result);

      if (result.success) {
        toast.success(`Successfully imported ${result.imported} question(s)`);
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Network error during import');
    } finally {
      setIsImporting(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    setShowAllRows(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedData.filter(p => p.errors.length === 0).length;
  const errorCount = parsedData.filter(p => p.errors.length > 0).length;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/admin/placement-test/questions`}
            className="text-primary hover:text-primary-dark text-sm mb-2 inline-flex items-center gap-1"
          >
            <CaretLeft size={16} />
            Back to Question Bank
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Questions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bulk upload questions from CSV or Excel files
          </p>
        </div>

        {/* Success Result */}
        {importResult?.success && (
          <div className="authority-card p-6 mb-6 border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Import Complete</h3>
                <p className="text-gray-300 mt-1">
                  Successfully imported {importResult.imported} of {importResult.total_submitted} question(s).
                </p>
                {importResult.validation_errors && importResult.validation_errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-amber-400 text-sm font-medium">Validation Warnings:</p>
                    <ul className="text-sm text-gray-400 mt-1 list-disc list-inside">
                      {importResult.validation_errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {importResult.validation_errors.length > 5 && (
                        <li>...and {importResult.validation_errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/${locale}/admin/placement-test/questions`}
                    className="btn-authority btn-primary-authority"
                  >
                    View Question Bank
                  </Link>
                  <button
                    onClick={handleReset}
                    className="btn-authority btn-secondary-authority"
                  >
                    Import More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Result */}
        {importResult && !importResult.success && (
          <div className="authority-card p-6 mb-6 border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Import Failed</h3>
                <p className="text-gray-300 mt-1">{importResult.error}</p>
                <button
                  onClick={handleReset}
                  className="btn-authority btn-secondary-authority mt-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!importResult?.success && (
          <>
            {/* Upload Zone */}
            <div className="authority-card p-6 mb-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {isLoading ? (
                  <div className="py-4">
                    <Spinner size={48} className="text-blue-500 animate-spin mx-auto" />
                    <p className="text-gray-400 mt-3">Parsing file...</p>
                  </div>
                ) : file ? (
                  <div className="py-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {file.name.endsWith('.csv') ? (
                        <FileCsv size={48} className="text-green-500" />
                      ) : (
                        <FileXls size={48} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {parsedData.length} row(s) parsed
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                    >
                      <X size={14} />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <UploadSimple size={48} className="text-gray-500 mx-auto" />
                    <p className="text-white font-medium mt-3">
                      Drop your CSV or Excel file here
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      or click to browse
                    </p>
                    <p className="text-gray-500 text-xs mt-3">
                      Supports .csv, .xlsx, .xls
                    </p>
                  </div>
                )}
              </div>

              {/* Template Download */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
                >
                  <FileArrowDown size={18} />
                  Download Template
                </button>
                <div className="text-xs text-gray-500">
                  Required columns: question_code, cefr_level, skill_type, question_type, question_text, correct_answer
                </div>
              </div>
            </div>

            {/* Preview Table */}
            {parsedData.length > 0 && (
              <div className="authority-card overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Table size={20} className="text-gray-400" />
                    <span className="font-medium text-white">
                      Preview
                    </span>
                    <span className="text-sm text-gray-400">
                      (showing {showAllRows ? parsedData.length : Math.min(10, parsedData.length)} of {parsedData.length} rows)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle size={16} weight="fill" />
                      {validCount} valid
                    </span>
                    {errorCount > 0 && (
                      <span className="flex items-center gap-1.5 text-red-400">
                        <XCircle size={16} weight="fill" />
                        {errorCount} with errors
                      </span>
                    )}
                  </div>
                </div>

                <div className={`overflow-x-auto overflow-y-auto ${showAllRows ? 'max-h-[70vh]' : 'max-h-[400px]'}`}>
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-800">
                      <tr className="border-b border-slate-600 bg-slate-800/50">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Row</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Code</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Level</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Skill</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Type</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Question</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-600/50">
                      {(showAllRows ? parsedData : parsedData.slice(0, 10)).map((q) => (
                        <tr
                          key={q.row}
                          className={q.errors.length > 0 ? 'bg-red-900/10' : 'hover:bg-slate-700/30'}
                        >
                          <td className="py-3 px-4 text-sm text-gray-400">{q.row}</td>
                          <td className="py-3 px-4">
                            <code className="text-xs bg-slate-700 text-gray-200 px-2 py-1 rounded">
                              {q.question_code || '-'}
                            </code>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-300">{q.cefr_level || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">{q.skill_type || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">{q.question_type || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-200 max-w-xs truncate">
                            {q.question_text || '-'}
                          </td>
                          <td className="py-3 px-4">
                            {q.errors.length === 0 ? (
                              <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                                <CheckCircle size={14} weight="fill" />
                                Valid
                              </span>
                            ) : (
                              <div className="group relative">
                                <span className="inline-flex items-center gap-1 text-red-400 text-xs cursor-help">
                                  <Warning size={14} weight="fill" />
                                  {q.errors.length} error(s)
                                </span>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-3 shadow-xl max-w-xs">
                                    <ul className="text-xs text-red-300 space-y-1">
                                      {q.errors.map((err, i) => (
                                        <li key={i}>• {err}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parsedData.length > 10 && (
                  <div className="px-6 py-3 border-t border-slate-600 text-center">
                    <button
                      onClick={() => setShowAllRows(!showAllRows)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {showAllRows
                        ? `Show Less (first 10 rows)`
                        : `Show All ${parsedData.length} Rows`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {parsedData.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {errorCount > 0 && (
                    <span className="text-amber-400">
                      <Warning size={16} className="inline mr-1" />
                      {errorCount} row(s) with errors will be skipped
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-slate-500 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isImporting || validCount === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Spinner size={18} className="animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <UploadSimple size={18} />
                        Import {validCount} Question{validCount !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        <div className="authority-card p-6 mt-8">
          <h3 className="font-semibold text-white mb-4">Column Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 px-3 text-gray-400">Column</th>
                  <th className="text-left py-2 px-3 text-gray-400">Required</th>
                  <th className="text-left py-2 px-3 text-gray-400">Valid Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/50 text-gray-300">
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">question_code</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">Unique code (e.g., R-B1-001)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">cefr_level</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">A1, A2, B1, B2, C1, C2</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">skill_type</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">reading, listening, writing, speaking</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">question_type</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">mcq, true_false, gap_fill, matching, open_response, form_filling, short_message, picture_description, interview</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">question_text</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">The question text</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">correct_answer</td>
                  <td className="py-2 px-3"><span className="text-green-400">Yes</span></td>
                  <td className="py-2 px-3">Correct answer (e.g., A, true, text)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">max_points</td>
                  <td className="py-2 px-3"><span className="text-gray-500">No</span></td>
                  <td className="py-2 px-3">Default: 1</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">options</td>
                  <td className="py-2 px-3"><span className="text-gray-500">No</span></td>
                  <td className="py-2 px-3">Pipe-delimited options (A|B|C|D) - required for MCQ</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">passage_text</td>
                  <td className="py-2 px-3"><span className="text-gray-500">No</span></td>
                  <td className="py-2 px-3">Reading passage for context</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">audio_url</td>
                  <td className="py-2 px-3"><span className="text-gray-500">No</span></td>
                  <td className="py-2 px-3">URL for listening questions</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">image_url</td>
                  <td className="py-2 px-3"><span className="text-gray-500">No</span></td>
                  <td className="py-2 px-3">URL for picture description questions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
