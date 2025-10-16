'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import type { BlogPost } from '@/lib/blog';
import { generateSlug } from '@/lib/utils';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function BlogAdminPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const fetchPosts = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/admin', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        setToken(null);
        setShowLogin(true);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/certificates/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setShowLogin(false);
        toast.success('Login successful!');
        fetchPosts(data.token);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Check for admin token
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setShowLogin(true);
      setLoading(false);
    } else {
      setToken(adminToken);
      fetchPosts(adminToken);
    }
  }, []);

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    if (!token) return;

    try {
      const response = await fetch(`/api/blog/admin?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        fetchPosts(token);
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post');
    }
  };

  const handlePublishToggle = async (postId: string, currentStatus: string) => {
    if (!token) return;

    const action = currentStatus === 'published' ? 'unpublish' : 'publish';

    try {
      const response = await fetch('/api/blog/admin/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: postId, action }),
      });

      if (response.ok) {
        toast.success(`Post ${action}ed successfully`);
        fetchPosts(token);
      } else {
        toast.error(`Failed to ${action} post`);
      }
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      toast.error(`Error ${action}ing post`);
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    if (!token) return;

    try {
      const isEditing = editingPost !== null;
      const url = '/api/blog/admin';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(isEditing ? { id: editingPost.id, ...postData } : postData),
      });

      if (response.ok) {
        toast.success(`Post ${isEditing ? 'updated' : 'created'} successfully`);
        setShowEditor(false);
        setEditingPost(null);
        fetchPosts(token);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} post`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error saving post');
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filterStatus === 'all') return true;
    return post.status === filterStatus;
  });

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Blog Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (showEditor) {
    return <BlogEditor post={editingPost} onSave={handleSavePost} onCancel={() => setShowEditor(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your blog posts with markdown editor and live preview</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-2xl">+</span>
            Create New Post
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status} ({posts.filter(p => status === 'all' ? true : p.status === status).length})
            </button>
          ))}
        </div>

        {/* Empty state or Posts table */}
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No blog posts yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first blog post!</p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold inline-flex items-center gap-2"
            >
              <span className="text-2xl">+</span>
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Title</th>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Status</th>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Category</th>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Views</th>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Published</th>
                <th className="text-left p-4 text-gray-900 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500 dark:text-gray-400">
                    No posts found. Create your first post!
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t dark:border-gray-700">
                    <td className="p-4">
                      {post.status === 'published' ? (
                        <a 
                          href={`/${locale}/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                          title="View published post"
                        >
                          {post.title} 🔗
                        </a>
                      ) : (
                        <div className="font-medium text-gray-900 dark:text-gray-200">{post.title}</div>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400">{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-gray-200">{post.category || 'Uncategorized'}</td>
                    <td className="p-4 text-gray-900 dark:text-gray-200">{post.view_count}</td>
                    <td className="p-4 text-gray-900 dark:text-gray-200">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePublishToggle(post.id, post.status)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

// Blog Editor Component
function BlogEditor({ 
  post, 
  onSave, 
  onCancel 
}: { 
  post: BlogPost | null; 
  onSave: (post: Partial<BlogPost>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: post?.title || '',
    title_es: post?.title_es || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    excerpt_es: post?.excerpt_es || '',
    content: post?.content || '',
    content_es: post?.content_es || '',
    featured_image: post?.featured_image || '',
    category: post?.category || '',
    tags: post?.tags || [],
    status: post?.status || 'draft',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleAutoGenerateSlug = () => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData({ ...formData, slug: newSlug });
      toast.success('Slug generated!');
    } else {
      toast.error('Please enter a title first');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Split by comma and trim each tag
      const newTags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !formData.tags?.includes(tag));
      
      if (newTags.length > 0) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), ...newTags],
        });
        toast.success(`Added ${newTags.length} tag(s)`);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post ? 'Edit Post' : 'Create New Post'}</h1>
          <button
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 space-y-6">
          {/* English Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Title (English)</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Spanish Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Title (Spanish)</label>
            <input
              type="text"
              value={formData.title_es}
              onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              URL Slug <span className="text-gray-500 dark:text-gray-400 text-xs">(This will be the URL: /blog/your-slug)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 font-mono text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="my-blog-post-slug"
              />
              <button
                type="button"
                onClick={handleAutoGenerateSlug}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
                title="Auto-generate slug from title"
              >
                ✨ Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Preview: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/blog/{formData.slug || 'your-slug-here'}</code>
            </p>
          </div>

          {/* Excerpt English */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Excerpt (English)</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Excerpt Spanish */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Excerpt (Spanish)</label>
            <textarea
              value={formData.excerpt_es}
              onChange={(e) => setFormData({ ...formData, excerpt_es: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Content English */}
          <MarkdownEditor
            label="Content (English - MDX/Markdown)"
            value={formData.content || ''}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your blog post content in Markdown/MDX format..."
          />

          {/* Content Spanish */}
          <MarkdownEditor
            label="Content (Spanish - MDX/Markdown)"
            value={formData.content_es || ''}
            onChange={(content_es) => setFormData({ ...formData, content_es })}
            placeholder="Escribe el contenido de tu blog en formato Markdown/MDX..."
          />

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Featured Image URL</label>
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Select a category</option>
              <option value="Teaching">Teaching</option>
              <option value="Language Learning">Language Learning</option>
              <option value="Technology">Technology</option>
              <option value="Culture">Culture</option>
              <option value="Professional Development">Professional Development</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Tags <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">(Separate multiple tags with commas)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="e.g. teaching, education, tips (or comma separated)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Fields */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">SEO Meta Title</label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Leave empty to use post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">SEO Meta Description</label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Leave empty to use excerpt"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              {post ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}