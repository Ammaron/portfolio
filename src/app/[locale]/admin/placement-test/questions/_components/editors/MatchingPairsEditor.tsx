'use client';

import { Plus, X, Info, ArrowRight } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { MatchingPair, createEmptyPair } from '../types';
import CompactAudioUpload from './CompactAudioUpload';

export default function MatchingPairsEditor({
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

            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-600 px-2 py-0.5 rounded text-gray-300">{pair.leftId}</span>
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

              <div className="flex items-center justify-center pt-8">
                <ArrowRight size={24} className="text-gray-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-600 px-2 py-0.5 rounded text-gray-300">{pair.rightId}</span>
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
