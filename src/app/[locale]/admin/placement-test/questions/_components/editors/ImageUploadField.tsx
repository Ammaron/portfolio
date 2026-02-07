'use client';

import { useState, useRef } from 'react';
import {
  Trash,
  CloudArrowUp,
  Link as LinkIcon,
  Spinner,
  Image as ImageIcon
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function ImageUploadField({
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
        headers: { 'Authorization': `Bearer ${token}` },
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        {isPictureDescription ? (
          <span className="text-amber-400 font-normal ml-2">(recommended for picture description)</span>
        ) : (
          <span className="text-gray-500 font-normal ml-2">(optional)</span>
        )}
      </label>

      <div className="flex gap-1 mb-3 bg-slate-700/50 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <CloudArrowUp size={16} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
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
                    <span className="text-sm text-gray-400">Click or drag to upload image</span>
                    <span className="text-xs text-gray-500">JPG, PNG, GIF, WebP (max 5MB)</span>
                  </div>
                )}
              </div>
              {uploadError && <p className="mt-2 text-sm text-red-400">{uploadError}</p>}
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
