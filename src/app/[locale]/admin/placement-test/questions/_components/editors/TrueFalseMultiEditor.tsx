'use client';

import { Plus, X, Info } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { TFMultiStatement } from '../types';

export default function TrueFalseMultiEditor({
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
    const nextId = String.fromCharCode(65 + statements.length);
    onChange([...statements, { id: nextId, text: '', isTrue: true }]);
  };

  const removeStatement = (index: number) => {
    if (statements.length <= 2) {
      toast.error('Minimum 2 statements required');
      return;
    }
    const newStatements = statements.filter((_, i) => i !== index);
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
              <span className="text-sm font-medium text-gray-300">Statement {statement.id}</span>
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

      <div className="p-3 bg-slate-700/30 rounded-lg text-sm text-gray-400">
        {statements.length} statements = {statements.length} max points (1 point per correct statement)
      </div>
    </div>
  );
}
