# Blog Setup Complete! 🎉

## What's Been Set Up

Your portfolio now has a complete **MDX-powered blog** with an **admin dashboard** for managing posts.

## Features

### Blog Features
- ✅ **MDX Support** - Write blog posts with Markdown and embedded React components
- ✅ **Syntax Highlighting** - Code blocks with GitHub Dark theme
- ✅ **SEO Optimized** - Meta tags, Open Graph, and structured data
- ✅ **Bilingual Support** - English and Spanish content
- ✅ **Featured Images** - Optimized with Next.js Image component
- ✅ **Categories & Tags** - Organize and filter posts
- ✅ **Draft/Published States** - Full post lifecycle management
- ✅ **View Counts** - Track post popularity
- ✅ **Reading Time** - Estimated reading duration

### Admin Dashboard Features
- ✅ **Rich Text Editor** - Write MDX with live preview
- ✅ **Post Management** - Create, edit, delete, publish, unpublish
- ✅ **Status Filtering** - Filter by draft, published, or archived
- ✅ **Image Upload Support** - Add featured images
- ✅ **SEO Settings** - Customize meta titles and descriptions
- ✅ **Bilingual Editor** - Manage both English and Spanish content
- ✅ **JWT Authentication** - Secure admin access

## Database Setup

Run the following SQL in your Supabase dashboard:

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_es TEXT,
  excerpt TEXT,
  excerpt_es TEXT,
  content TEXT NOT NULL,
  content_es TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT DEFAULT 'Admin',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS (Row Level Security)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public to read published posts
CREATE POLICY "Public can view published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users (admins) full access
CREATE POLICY "Authenticated users have full access"
  ON public.blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret for admin authentication
JWT_SECRET=your_secure_random_string_here
```

## How to Use

### 1. Access Admin Dashboard

Navigate to: `http://localhost:3000/en/admin/blog`

You'll use the same authentication as your certifications admin (already set up).

### 2. Create Your First Blog Post

1. Click **"Create New Post"**
2. Fill in the post details:
   - **Title** (required)
   - **Slug** (URL-friendly, auto-generated from title)
   - **Content** (MDX format)
   - **Featured Image** (URL)
   - **Category** (e.g., "Technology", "Education")
   - **Tags** (comma-separated)
   - **SEO Settings** (meta title, description)
3. Add Spanish translation (optional)
4. Click **"Save as Draft"**
5. Preview the post
6. Click **"Publish"** when ready

### 3. Writing MDX Content

MDX supports all Markdown features plus React components:

```mdx
# My Blog Post

This is regular **Markdown** content.

## Code Examples

```javascript
function hello() {
  console.log("Hello, world!");
}
```

## Lists

- Item 1
- Item 2
- Item 3

## Links and Images

[Visit my site](https://example.com)

![Alt text](https://example.com/image.jpg)

## Quotes

> This is a blockquote
> - Author Name
```

### 4. Blog Pages

- **Blog Index**: `/en/blog` (lists all published posts)
- **Single Post**: `/en/blog/[slug]` (individual post page)
- **Spanish Version**: `/es/blog` and `/es/blog/[slug]`

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── admin/blog/
│   │   │   └── page.tsx          # Admin dashboard
│   │   └── blog/
│   │       ├── page.tsx          # Blog listing
│   │       └── [slug]/
│   │           └── page.tsx      # Single post
│   └── api/
│       └── blog/
│           ├── route.ts          # Public blog API
│           ├── [slug]/
│           │   └── route.ts      # Single post API
│           └── admin/
│               ├── route.ts      # Admin CRUD operations
│               └── publish/
│                   └── route.ts  # Publish/unpublish
├── components/
│   └── BlogCard.tsx              # Blog post card component
├── lib/
│   └── blog.ts                   # Blog utility functions
└── i18n/
    └── translations/
        └── blog.ts               # Blog translations
```

## API Routes

### Public APIs
- `GET /api/blog` - Get published posts
- `GET /api/blog/[slug]` - Get single post by slug

### Admin APIs (require JWT token)
- `GET /api/blog/admin` - Get all posts (including drafts)
- `POST /api/blog/admin` - Create new post
- `PUT /api/blog/admin?id=xxx` - Update post
- `DELETE /api/blog/admin?id=xxx` - Delete post
- `POST /api/blog/admin/publish` - Publish/unpublish post

## Customization

### Styling

The blog uses Tailwind CSS with dark mode support. Customize colors in `tailwind.config.js` or update the components directly.

### MDX Plugins

Current plugins (in `src/app/[locale]/blog/[slug]/page.tsx`):
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-highlight` - Syntax highlighting
- `rehype-slug` - Auto-generate heading IDs
- `rehype-autolink-headings` - Auto-link headings

Add more plugins by installing them and adding to the `mdxOptions`:

```bash
npm install remark-math rehype-katex
```

### Adding Custom Components

Create components in `src/components/mdx/` and pass them to MDXRemote:

```tsx
const components = {
  CustomButton: () => <button>Click me</button>,
};

<MDXRemote source={content} components={components} />
```

## Testing

1. **Create a test post**:
   - Title: "Getting Started with Next.js"
   - Slug: "getting-started-with-nextjs"
   - Category: "Technology"
   - Tags: ["nextjs", "react", "tutorial"]

2. **Test the workflow**:
   - Create as draft
   - Preview on blog page (should not appear)
   - Publish
   - View on blog listing
   - Click to read full post
   - Check view count increments

## Troubleshooting

### "Unauthorized" errors
- Check JWT_SECRET is set in `.env.local`
- Clear localStorage and login again: `localStorage.removeItem('adminToken')`

### Posts not showing
- Check post status is "published"
- Check `published_at` date is set
- Verify database RLS policies

### Images not loading
- Use absolute URLs (https://...)
- Or set up Next.js Image domains in `next.config.ts`

### MDX syntax errors
- Validate your MDX syntax at https://mdxjs.com/playground/
- Check for unclosed tags or invalid JSX

## Next Steps

1. ✅ Create your first blog post
2. ✅ Customize the blog design to match your brand
3. ✅ Add more MDX plugins for enhanced functionality
4. ✅ Set up RSS feed (optional)
5. ✅ Add comments system (optional - Disqus, Giscus, etc.)
6. ✅ Set up blog post sitemap (already included in `/sitemap.ts`)
7. ✅ Add newsletter signup (optional)

## Resources

- [MDX Documentation](https://mdxjs.com/)
- [Next.js MDX Remote](https://github.com/hashicorp/next-mdx-remote)
- [Rehype Plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)

---

**Your blog is ready to use!** 🚀

Access the admin dashboard at `/en/admin/blog` and start creating content.
