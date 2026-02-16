'use client';

import { Info, Plus, Trash, DotsSixVertical } from '@phosphor-icons/react';
import { useState } from 'react';

interface FormField {
  label: string;
  expectedAnswer: string;
}

function syncToParent(
  title: string,
  fields: FormField[],
  onPassageTextChange: (text: string) => void,
  onCorrectAnswerChange: (answer: string) => void,
  onMaxPointsChange: (points: number) => void,
) {
  const passageLines = [title || 'Form'];
  fields.forEach(f => {
    if (f.label.trim()) {
      passageLines.push(`${f.label.trim()}:`);
    }
  });
  onPassageTextChange(passageLines.join('\n'));

  const answerObj: Record<string, string> = {};
  fields.forEach(f => {
    if (f.label.trim()) {
      const key = f.label.trim().toLowerCase().replace(/\s+/g, '_');
      answerObj[key] = f.expectedAnswer;
    }
  });
  onCorrectAnswerChange(JSON.stringify(answerObj));
  onMaxPointsChange(fields.filter(f => f.label.trim()).length);
}

export default function FormFillingEditor({
  passageText,
  correctAnswer,
  onPassageTextChange,
  onCorrectAnswerChange,
  onMaxPointsChange,
}: {
  passageText: string;
  correctAnswer: string;
  onPassageTextChange: (text: string) => void;
  onCorrectAnswerChange: (answer: string) => void;
  onMaxPointsChange: (points: number) => void;
}) {
  const [formTitle, setFormTitle] = useState(() => {
    if (!passageText) return '';
    const lines = passageText.split('\n').map(l => l.trim()).filter(Boolean);
    return lines[0] || '';
  });

  const [fields, setFields] = useState<FormField[]>(() => {
    if (!passageText) {
      return [{ label: '', expectedAnswer: '' }];
    }

    const lines = passageText.split('\n').map(l => l.trim()).filter(Boolean);
    const fieldLabels = lines.slice(1).map(line =>
      line.endsWith(':') ? line.slice(0, -1) : line
    );

    let answers: Record<string, string> = {};
    if (correctAnswer) {
      try {
        answers = JSON.parse(correctAnswer);
      } catch {
        // Not JSON, ignore
      }
    }

    if (fieldLabels.length === 0) {
      return [{ label: '', expectedAnswer: '' }];
    }

    return fieldLabels.map(label => {
      const key = label.toLowerCase().replace(/\s+/g, '_');
      return {
        label,
        expectedAnswer: answers[key] || '',
      };
    });
  });

  const handleTitleChange = (title: string) => {
    setFormTitle(title);
    syncToParent(title, fields, onPassageTextChange, onCorrectAnswerChange, onMaxPointsChange);
  };

  const handleFieldsChange = (newFields: FormField[]) => {
    setFields(newFields);
    syncToParent(formTitle, newFields, onPassageTextChange, onCorrectAnswerChange, onMaxPointsChange);
  };

  const addField = () => {
    handleFieldsChange([...fields, { label: '', expectedAnswer: '' }]);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    handleFieldsChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof FormField, value: string) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p>Define the form fields students will fill out.</p>
          <p className="mt-1">Expected answers are used for auto-grading. Leave blank for manual grading.</p>
        </div>
      </div>

      {/* Form Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Form Title</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Registration Form, Hotel Booking, Library Card Application"
        />
      </div>

      {/* Fields */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Form Fields ({fields.filter(f => f.label.trim()).length})
          </label>
          <button
            type="button"
            onClick={addField}
            className="text-xs px-2.5 py-1 bg-slate-600 text-gray-300 rounded hover:bg-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={12} weight="bold" />
            Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2.5 bg-slate-700/50 rounded-lg border border-slate-600/50 group"
            >
              <DotsSixVertical size={16} className="text-gray-500 mt-2.5 flex-shrink-0" />

              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, 'label', e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Field label"
                />
                <input
                  type="text"
                  value={field.expectedAnswer}
                  onChange={(e) => updateField(index, 'expectedAnswer', e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Expected answer"
                />
              </div>

              <button
                type="button"
                onClick={() => removeField(index)}
                disabled={fields.length <= 1}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed mt-1"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      {fields.some(f => f.label.trim()) && (
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <label className="block text-xs font-medium text-gray-400 mb-2">Preview</label>
          <div className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-base">📝</span>
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  {formTitle || 'Form'}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {fields.filter(f => f.label.trim()).map((field, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-24 text-right text-xs text-gray-400 flex-shrink-0">
                    {field.label}:
                  </span>
                  <div className="flex-1 px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-green-400">
                    {field.expectedAnswer || <span className="text-gray-500 italic">empty</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
