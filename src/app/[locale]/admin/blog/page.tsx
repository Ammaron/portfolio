'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import type { BlogPost } from '@/lib/blog';
import { generateSlug } from '@/lib/utils';
import MarkdownEditor from '@/components/MarkdownEditor';
import '@/styles/components/blog-admin.css';

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
      <div className="admin-login-container flex items-center justify-center p-4">
        <div className="admin-login-card max-w-md w-full rounded-2xl p-8 transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Blog Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to manage your blog posts</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading your blog posts...</p>
        </div>
      </div>
    );
  }

  if (showEditor) {
    return <BlogEditor post={editingPost} onSave={handleSavePost} onCancel={() => setShowEditor(false)} />;
  }

  return (
    <div className="admin-dashboard min-h-screen pt-20">
      {/* Header */}
      <div className="admin-header text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="admin-header-content max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">Blog Admin Dashboard</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Manage your blog posts with our powerful markdown editor and live preview system
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">System Online</span>
                </div>
                <div className="text-sm text-blue-100">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
                </div>
              </div>
            </div>
            <button
              onClick={handleCreateNew}
              className="create-post-btn px-8 py-4 text-white font-bold rounded-xl shadow-xl flex items-center gap-3 focus-ring"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="filter-tabs flex gap-3 mb-8 overflow-x-auto pb-2">
          {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-tab px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap focus-ring ${
                filterStatus === status
                  ? 'active text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="capitalize">{status}</span>
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                {posts.filter(p => status === 'all' ? true : p.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Empty state or Posts table */}
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No blog posts yet</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start sharing your thoughts with the world by creating your first blog post!
              </p>
              <button
                onClick={handleCreateNew}
                className="create-post-btn px-8 py-4 text-white font-bold rounded-xl shadow-xl inline-flex items-center gap-3 focus-ring"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
              </button>
            </div>
          </div>
        ) : (
          <div className="posts-table overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-6">Title</th>
                    <th className="text-left p-6">Status</th>
                    <th className="text-left p-6">Category</th>
                    <th className="text-left p-6">Views</th>
                    <th className="text-left p-6">Published</th>
                    <th className="text-left p-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-12 text-gray-500 dark:text-gray-400">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">No posts found</p>
                        <p>Try creating a new post or changing the filter</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-6">
                          <div className="flex flex-col gap-1">
                            {post.status === 'published' ? (
                              <a
                                href={`/${locale}/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                                title="View published post"
                              >
                                {post.title}
                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <div className="font-semibold text-gray-900 dark:text-white">{post.title}</div>
                            )}
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{post.slug}</div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`status-badge ${post.status}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            {post.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium text-gray-900 dark:text-white">{post.view_count}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : (
                              <span className="text-gray-400">Not published</span>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(post)}
                              className="action-btn edit focus-ring"
                              title="Edit post"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handlePublishToggle(post.id, post.status)}
                              className={`action-btn publish focus-ring`}
                              title={post.status === 'published' ? 'Unpublish post' : 'Publish post'}
                            >
                              {post.status === 'published' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="action-btn delete focus-ring"
                              title="Delete post"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post ? 'Edit Post' : 'Create New Post'}</h1>
              <p className="text-blue-100">
                {post ? 'Make changes to your blog post' : 'Share your thoughts with the world'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your blog post title"
                />
              </div>

              {/* Spanish Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Title (Spanish)</label>
                <input
                  type="text"
                  value={formData.title_es}
                  onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa el título de tu blog"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                URL Slug *
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-2">(This will be the URL: /blog/your-slug)</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="my-blog-post-slug"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerateSlug}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
                  title="Auto-generate slug from title"
                >
                  <span className="flex items-center gap-2">
                    ✨ Generate
                  </span>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Preview: <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">/blog/{formData.slug || 'your-slug-here'}</code>
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Content
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Excerpt English */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Excerpt (English) *</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Brief description of your blog post..."
                />
              </div>

              {/* Excerpt Spanish */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Excerpt (Spanish)</label>
                <textarea
                  value={formData.excerpt_es}
                  onChange={(e) => setFormData({ ...formData, excerpt_es: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Breve descripción de tu blog..."
                />
              </div>
            </div>

            {/* Content English */}
            <div className="mt-6">
              <MarkdownEditor
                label="Content (English - MDX/Markdown)"
                value={formData.content || ''}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog post content in Markdown/MDX format..."
              />
            </div>

            {/* Content Spanish */}
            <div className="mt-6">
              <MarkdownEditor
                label="Content (Spanish - MDX/Markdown)"
                value={formData.content_es || ''}
                onChange={(content_es) => setFormData({ ...formData, content_es })}
                placeholder="Escribe el contenido de tu blog en formato Markdown/MDX..."
              />
            </div>
          </div>

          {/* Media & Organization Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Media & Organization
            </h2>

            {/* Featured Image */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
              {formData.featured_image && (
                <div className="mt-3">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="h-32 w-auto rounded-lg shadow-md object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Language Learning">Language Learning</option>
                  <option value="Technology">Technology</option>
                  <option value="Culture">Culture</option>
                  <option value="Professional Development">Professional Development</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">🚀 Published</option>
                  <option value="archived">📦 Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Tags
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-2">(Separate multiple tags with commas)</span>
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g. teaching, education, tips"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              SEO Settings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">SEO Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Leave empty to use post title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">SEO Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Leave empty to use excerpt"
                />
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {post ? '📝 Update Post' : '🚀 Create Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}