'use client';

import { Plus, Trash, CheckCircle, Circle, Info } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function MultipleChoiceEditor({
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
    const nextId = String.fromCharCode(65 + options.length);
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
    const reletteredOptions = newOptions.map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i)
    }));
    onOptionsChange(reletteredOptions);
    if (correctAnswer === removedId) {
      onCorrectAnswerChange('');
    } else if (correctAnswer > removedId) {
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
        <p className="text-sm text-blue-300">Click on an option to mark it as the correct answer.</p>
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
              onChange={(e) => { e.stopPropagation(); updateOption(index, e.target.value); }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={`Option ${option.id}`}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeOption(index); }}
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
