-- ============================================
-- Blog Tables Setup
-- Run this AFTER restoring your backup
-- This will add blog functionality to your existing database
-- ============================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_es VARCHAR(500),
    excerpt TEXT NOT NULL,
    excerpt_es TEXT,
    content TEXT NOT NULL,
    content_es TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(255) DEFAULT 'Kirby McDonald',
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    name_es VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    description_es TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog comments table (optional, for future use)
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for blog performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_tags ON public.blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_comment_post ON public.blog_comments(post_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Sample blog categories
INSERT INTO public.blog_categories (name, name_es, slug, description, description_es) VALUES
('Teaching', 'Enseñanza', 'teaching', 'Tips and insights about teaching English', 'Consejos e ideas sobre la enseñanza del inglés'),
('Language Learning', 'Aprendizaje de Idiomas', 'language-learning', 'Strategies and resources for language learners', 'Estrategias y recursos para estudiantes de idiomas'),
('Technology', 'Tecnología', 'technology', 'Educational technology and digital tools', 'Tecnología educativa y herramientas digitales'),
('Culture', 'Cultura', 'culture', 'Cultural insights and cross-cultural communication', 'Perspectivas culturales y comunicación intercultural'),
('Professional Development', 'Desarrollo Profesional', 'professional-development', 'Career growth and professional skills', 'Crecimiento profesional y habilidades profesionales')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public can view published posts" ON public.blog_posts;
CREATE POLICY "Public can view published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users have full access" ON public.blog_posts;
CREATE POLICY "Authenticated users have full access"
  ON public.blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Blog tables created successfully!';
  RAISE NOTICE 'You can now use the blog system.';
END $$;
