import { supabase, supabaseAdmin } from './database';
import readingTime from 'reading-time';
import { generateSlug } from './utils';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_es?: string;
  excerpt: string;
  excerpt_es?: string;
  content: string;
  content_es?: string;
  featured_image?: string;
  author: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  view_count: number;
  reading_time_minutes?: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  name_es?: string;
  slug: string;
  description?: string;
  description_es?: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
  updated_at: string;
}

// Re-export utility functions for convenience
export { generateSlug } from './utils';

// Calculate reading time from content using reading-time library
export function calculateReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.ceil(stats.minutes);
}

// Fetch all published blog posts (public)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPublishedPosts(_locale: string = 'en'): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return data || [];
}

// Fetch blog post by slug (public)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }

  // Increment view count
  if (data) {
    await incrementViewCount(data.id);
  }

  return data;
}

// Increment view count for a post
export async function incrementViewCount(postId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { post_id: postId });
  
  if (error) {
    // Fallback if the RPC function doesn't exist
    const { data } = await supabase
      .from('blog_posts')
      .select('view_count')
      .eq('id', postId)
      .single();
      
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', postId);
    }
  }
}

// Fetch posts by category (public)
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return data || [];
}

// Fetch posts by tag (public)
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .contains('tags', [tag])
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  return data || [];
}

// Search blog posts (public)
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data || [];
}

// Fetch all categories (public)
export async function getCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

// Get recent posts (public)
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return data || [];
}

// Get popular posts (by view count) (public)
export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }

  return data || [];
}

// Admin functions (require authentication)

// Fetch all posts including drafts (admin)
export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }

  return data || [];
}

// Create new blog post (admin)
export async function createPost(post: Partial<BlogPost>): Promise<BlogPost | null> {
  // Generate slug if not provided
  if (!post.slug && post.title) {
    post.slug = generateSlug(post.title);
  }

  // Calculate reading time
  if (post.content) {
    post.reading_time_minutes = calculateReadingTime(post.content);
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data;
}

// Update blog post (admin)
export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  // Recalculate reading time if content is updated
  if (updates.content) {
    updates.reading_time_minutes = calculateReadingTime(updates.content);
  }

  // Update slug if title is changed
  if (updates.title && !updates.slug) {
    updates.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return null;
  }

  return data;
}

// Delete blog post (admin)
export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}

// Publish a draft post (admin)
export async function publishPost(id: string): Promise<BlogPost | null> {
  return updatePost(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}

// Unpublish a post (admin)
export async function unpublishPost(id: string): Promise<BlogPost | null> {
  return updatePost(id, {
    status: 'draft',
  });
}
