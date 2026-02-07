'use client';

import { useState, useEffect } from 'react';
import { X, Spinner, CaretDown, CaretRight } from '@phosphor-icons/react';
import {
  Question,
  MatchingPair,
  TFMultiStatement,
  createEmptyPair,
  parseOptionsToPairs,
  parseOptionsToTFMultiStatements
} from './types';
import MultipleChoiceEditor from './editors/MultipleChoiceEditor';
import TrueFalseEditor from './editors/TrueFalseEditor';
import TrueFalseMultiEditor from './editors/TrueFalseMultiEditor';
import GapFillEditor from './editors/GapFillEditor';
import MatchingPairsEditor from './editors/MatchingPairsEditor';
import OpenResponseEditor from './editors/OpenResponseEditor';
import AudioUploadField from './editors/AudioUploadField';
import ImageUploadField from './editors/ImageUploadField';

interface QuestionEditPanelProps {
  question: Question | null; // null = create mode
  onSave: (
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
  ) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function QuestionEditPanel({
  question,
  onSave,
  onCancel,
  isSaving
}: QuestionEditPanelProps) {
  const [formData, setFormData] = useState({
    question_code: question?.question_code || '',
    cefr_level: question?.cefr_level || 'B1',
    skill_type: question?.skill_type || 'reading',
    question_type: question?.question_type || 'mcq',
    question_text: question?.question_text || '',
    correct_answer: question?.correct_answer || '',
    max_points: question?.max_points || 1,
    options: question?.options as { id: string; text: string }[] || [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ],
    audio_url: question?.audio_url || '',
    passage_text: question?.passage_text || '',
    image_url: question?.image_url || '',
    status: question?.status || 'active'
  });

  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>(() => {
    if (question?.question_type === 'matching' && question.options) {
      return parseOptionsToPairs(
        question.options as { id: string; text: string; text_es?: string; audio_url?: string }[]
      );
    }
    return [createEmptyPair(1), createEmptyPair(2)];
  });

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

  const [mediaExpanded, setMediaExpanded] = useState(
    !!(question?.audio_url || question?.image_url)
  );

  // Reset form when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        question_code: question.question_code,
        cefr_level: question.cefr_level,
        skill_type: question.skill_type,
        question_type: question.question_type,
        question_text: question.question_text,
        correct_answer: question.correct_answer,
        max_points: question.max_points,
        options: question.options as { id: string; text: string }[] || [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        audio_url: question.audio_url || '',
        passage_text: question.passage_text || '',
        image_url: question.image_url || '',
        status: question.status || 'active'
      });

      if (question.question_type === 'matching' && question.options) {
        setMatchingPairs(parseOptionsToPairs(
          question.options as { id: string; text: string; text_es?: string; audio_url?: string }[]
        ));
      }
      if (question.question_type === 'true_false_multi' && question.options) {
        setTfMultiStatements(parseOptionsToTFMultiStatements(
          question.options as { id: string; text: string; text_es?: string }[],
          question.correct_answer
        ));
      }
    }
  }, [question]);

  const handleSubmit = () => {
    onSave(
      formData,
      formData.question_type === 'matching' ? matchingPairs : undefined,
      formData.question_type === 'true_false_multi' ? tfMultiStatements : undefined
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-bold text-white">
          {question ? 'Edit Question' : 'New Question'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form - scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metadata section */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Code *</label>
              <input
                type="text"
                value={formData.question_code}
                onChange={(e) => setFormData({ ...formData, question_code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="R-B1-001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Points</label>
              <input
                type="number"
                value={formData.max_points}
                onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Skill *</label>
              <select
                value={formData.skill_type}
                onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
                className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm cursor-pointer focus:border-blue-500"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Level *</label>
              <select
                value={formData.cefr_level}
                onChange={(e) => setFormData({ ...formData, cefr_level: e.target.value })}
                className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm cursor-pointer focus:border-blue-500"
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
              <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm cursor-pointer focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Type *</label>
            <select
              value={formData.question_type}
              onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm cursor-pointer focus:border-blue-500"
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

        {/* Content section */}
        {formData.question_type !== 'gap_fill' && (
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Question Text *</label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Passage/Context <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={formData.passage_text}
            onChange={(e) => setFormData({ ...formData, passage_text: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={2}
            placeholder="Reading passage or context..."
          />
        </div>

        {/* Media section (collapsible) */}
        <div className="border border-slate-600/50 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setMediaExpanded(!mediaExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-700/30 text-sm text-gray-300 cursor-pointer hover:bg-slate-700/50"
          >
            <span className="font-medium">Media (Audio & Image)</span>
            {mediaExpanded ? <CaretDown size={14} /> : <CaretRight size={14} />}
          </button>
          {mediaExpanded && (
            <div className="p-3 space-y-4">
              <AudioUploadField
                audioUrl={formData.audio_url}
                onAudioChange={(url) => setFormData({ ...formData, audio_url: url })}
                isListening={formData.skill_type === 'listening'}
              />
              <ImageUploadField
                imageUrl={formData.image_url}
                onImageChange={(url) => setFormData({ ...formData, image_url: url })}
                isPictureDescription={formData.question_type === 'picture_description'}
              />
            </div>
          )}
        </div>

        {/* Answer editors */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            {formData.question_type === 'gap_fill' ? 'Gap Fill Configuration' :
             formData.question_type === 'matching' ? 'Matching Pairs' :
             formData.question_type === 'true_false_multi' ? 'Statements' :
             'Answer Configuration'}
          </label>

          {formData.question_type === 'mcq' && (
            <MultipleChoiceEditor
              options={formData.options}
              correctAnswer={formData.correct_answer}
              onOptionsChange={(options) => setFormData({ ...formData, options })}
              onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
            />
          )}

          {formData.question_type === 'true_false' && (
            <TrueFalseEditor
              correctAnswer={formData.correct_answer}
              onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
            />
          )}

          {formData.question_type === 'true_false_multi' && (
            <TrueFalseMultiEditor
              statements={tfMultiStatements}
              onChange={setTfMultiStatements}
            />
          )}

          {formData.question_type === 'gap_fill' && (
            <GapFillEditor
              questionText={formData.question_text}
              correctAnswer={formData.correct_answer}
              onQuestionTextChange={(text) => setFormData({ ...formData, question_text: text })}
              onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
            />
          )}

          {formData.question_type === 'matching' && (
            <MatchingPairsEditor
              pairs={matchingPairs}
              onChange={setMatchingPairs}
            />
          )}

          {formData.question_type === 'open_response' && (
            <OpenResponseEditor
              correctAnswer={formData.correct_answer}
              onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
            />
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-700 bg-slate-800">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-500 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer text-sm flex items-center gap-2"
        >
          {isSaving && <Spinner size={14} className="animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </div>
  );
}
