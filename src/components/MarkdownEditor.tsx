'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your markdown content here...',
  label = 'Content'
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);

  const insertText = (before: string, after = '') => {
    onChange(value + '\n\n' + before + after);
  };

  const insertImage = () => {
    if (imageUrl) {
      const imageMarkdown = `![Image description](${imageUrl})`;
      onChange(value + '\n\n' + imageMarkdown);
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const formatButtons = [
    { label: '# H1', action: () => insertText('# '), title: 'Heading 1' },
    { label: '## H2', action: () => insertText('## '), title: 'Heading 2' },
    { label: '### H3', action: () => insertText('### '), title: 'Heading 3' },
    { label: '**B**', action: () => insertText('**bold text**'), title: 'Bold' },
    { label: '*I*', action: () => insertText('*italic text*'), title: 'Italic' },
    { label: '`code`', action: () => insertText('`inline code`'), title: 'Inline code' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">{label}</label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showPreview ? '📝 Hide Preview' : '👁️ Show Preview'}
        </button>
      </div>

      {/* Format Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 self-center mr-2">Format:</span>
        {formatButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 border dark:border-gray-500 font-mono"
          >
            {btn.label}
          </button>
        ))}
        <span className="border-l dark:border-gray-600 mx-2"></span>
        <button
          type="button"
          onClick={() => insertText('- ')}
          title="Bullet list"
          className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 border dark:border-gray-500"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => insertText('1. ')}
          title="Numbered list"
          className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 border dark:border-gray-500"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => insertText('> ')}
          title="Quote"
          className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 border dark:border-gray-500"
        >
          💬 Quote
        </button>
        <button
          type="button"
          onClick={() => insertText('[Link text](https://example.com)')}
          title="Link"
          className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 border dark:border-gray-500"
        >
          🔗 Link
        </button>
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageDialog(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert Image</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (https://...)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 mb-4 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && insertImage()}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p className="font-semibold mb-2">💡 Tips for images:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Upload to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Imgur</a> (free, no account needed)</li>
                <li>Use <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudinary</a> or similar CDN</li>
                <li>Use images from your <code>/public/images/</code> folder</li>
                <li>Make sure URL ends in .jpg, .png, .gif, .webp, etc.</li>
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl('');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor and Preview Layout */}
      <div className={`grid ${showPreview ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[500px] px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-600 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border rounded-lg p-4 dark:border-gray-700 overflow-auto h-[500px] bg-white dark:bg-gray-800">
            <h3 className="text-sm font-semibold mb-4 pb-2 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
              Preview
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {value || '*No content yet. Start typing in the editor!*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Quick Insert Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center">Quick Insert:</span>
        <button
          type="button"
          onClick={() => insertText('```javascript\n// Your code here\nconst example = "Hello!";\n```')}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert code block"
        >
          � Code Block
        </button>
        <button
          type="button"
          onClick={() => insertText('| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |')}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert table"
        >
          � Table
        </button>
        <button
          type="button"
          onClick={() => setShowImageDialog(true)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert image"
        >
          🖼️ Image
        </button>
        <button
          type="button"
          onClick={() => insertText('---')}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert horizontal rule"
        >
          ➖ Divider
        </button>
      </div>

      {/* Help Text */}
      <details className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
        <summary className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 font-semibold">
          📖 Markdown Quick Reference
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2 pl-4">
          <div><code># Heading 1</code></div>
          <div><code>## Heading 2</code></div>
          <div><code>**bold text**</code></div>
          <div><code>*italic text*</code></div>
          <div><code>[link text](url)</code></div>
          <div><code>![alt text](image-url)</code></div>
          <div><code>`inline code`</code></div>
          <div><code>```language</code></div>
          <div><code>- bullet item</code></div>
          <div><code>1. numbered item</code></div>
          <div><code>&gt; blockquote</code></div>
          <div><code>---</code> (divider)</div>
        </div>
      </details>
    </div>
  );
}
