'use client';

import { useState, useRef } from 'react';
import { SpeakerHigh, Trash, Spinner } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function CompactAudioUpload({
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
