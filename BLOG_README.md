# Blog System with MDX

## Overview

This portfolio now includes a complete blog system with MDX support and an admin dashboard. The blog is fully bilingual (English/Spanish) and includes all modern blogging features.

## Features

### ✅ Admin Dashboard
- **Full CRUD Operations**: Create, Read, Update, Delete blog posts
- **Rich Editor**: Write content in MDX with live preview
- **Draft Management**: Save posts as drafts before publishing
- **Bilingual Content**: Support for both English and Spanish content
- **SEO Controls**: Custom meta titles and descriptions
- **Category & Tag Management**: Organize content effectively
- **Status Control**: Draft, Published, and Archived states

### ✅ Public Blog
- **MDX Rendering**: Full support for MDX with syntax highlighting
- **Category Filtering**: Browse posts by category
- **Tag-based Navigation**: Find related content easily
- **Search Functionality**: Search across titles, excerpts, and content
- **View Counter**: Track post popularity
- **Reading Time**: Automatic calculation of reading time
- **Responsive Design**: Mobile-first, fully responsive
- **Bilingual**: Automatic language switching based on locale

### ✅ Technical Features
- **Static Generation**: SEO-optimized with Next.js App Router
- **Supabase Backend**: PostgreSQL database for reliability
- **JWT Authentication**: Secure admin access
- **MDX Plugins**: Syntax highlighting, auto-linking headings, GFM support
- **Incremental Views**: Optimistic view counter updates

## Database Setup

1. Run the SQL in `database_setup.sql` in your Supabase SQL editor
2. The following tables will be created:
   - `blog_posts` - Main blog content table
   - `blog_categories` - Category taxonomy
   - `blog_comments` - Optional comments (for future use)

## Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Individual blog post
│   │   └── admin/
│   │       └── blog/
│   │           └── page.tsx          # Admin dashboard
│   └── api/
│       └── blog/
│           ├── route.ts              # Public blog API
│           ├── [slug]/
│           │   └── route.ts          # Single post API
│           └── admin/
│               ├── route.ts          # Admin CRUD API
│               └── publish/
│                   └── route.ts      # Publish/unpublish API
├── components/
│   └── BlogCard.tsx                  # Blog post card component
├── lib/
│   └── blog.ts                       # Blog utility functions
└── i18n/
    └── translations/
        └── blog.ts                   # Blog translations
```

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/admin/certifications` to login (existing admin system)
2. After logging in, go to `/{locale}/admin/blog`
3. You'll see the blog admin dashboard

### Creating a Blog Post

1. Click "Create New Post" in the admin dashboard
2. Fill in all required fields:
   - Title (English and optionally Spanish)
   - Excerpt (short description)
   - Content (MDX format)
   - Category
   - Tags
   - Featured image URL (optional)
   - SEO metadata (optional)
3. Set status to "draft" while working
4. Click "Create Post" to save
5. Use "Publish" button to make it live

### Writing MDX Content

MDX allows you to write Markdown with embedded JSX. Example:

```mdx
# My Blog Post

This is a paragraph with **bold** and *italic* text.

## Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

> This is a blockquote

- List item 1
- List item 2

[Link to somewhere](https://example.com)

![Image alt text](https://example.com/image.jpg)
```

### Supported MDX Features

- ✅ GitHub Flavored Markdown (tables, task lists, strikethrough)
- ✅ Syntax highlighting for code blocks
- ✅ Auto-linked headings
- ✅ Custom components (extendable)
- ✅ Embedded HTML/JSX

## API Endpoints

### Public Endpoints

- `GET /api/blog` - Get all published posts
  - Query params: `category`, `tag`, `search`, `locale`
- `GET /api/blog/[slug]` - Get single post by slug

### Admin Endpoints (Authentication Required)

- `GET /api/blog/admin` - Get all posts (including drafts)
- `POST /api/blog/admin` - Create new post
- `PUT /api/blog/admin` - Update existing post
- `DELETE /api/blog/admin?id={postId}` - Delete post
- `POST /api/blog/admin/publish` - Publish/unpublish post

## Blog Functions

Available in `src/lib/blog.ts`:

### Public Functions
- `getPublishedPosts(locale)` - Get all published posts
- `getPostBySlug(slug)` - Get single post
- `getPostsByCategory(category)` - Filter by category
- `getPostsByTag(tag)` - Filter by tag
- `searchPosts(query)` - Search posts
- `getCategories()` - Get all categories
- `getRecentPosts(limit)` - Get recent posts
- `getPopularPosts(limit)` - Get popular posts by views

### Admin Functions
- `getAllPosts()` - Get all posts including drafts
- `createPost(post)` - Create new post
- `updatePost(id, updates)` - Update post
- `deletePost(id)` - Delete post
- `publishPost(id)` - Publish a draft
- `unpublishPost(id)` - Unpublish a post

### Utility Functions
- `generateSlug(title)` - Create URL-friendly slug
- `calculateReadingTime(content)` - Calculate reading time

## Customization

### Adding Custom MDX Components

You can extend MDX with custom React components:

```typescript
// In your blog post page
const components = {
  h1: (props) => <h1 className="custom-h1" {...props} />,
  img: (props) => <CustomImage {...props} />,
  // Add more custom components
};

<MDXRemote source={content} components={components} />
```

### Styling

The blog uses Tailwind CSS with dark mode support. Customize styles in:
- Blog post cards: `src/components/BlogCard.tsx`
- Blog post page: `src/app/[locale]/blog/[slug]/page.tsx`
- Admin dashboard: `src/app/[locale]/admin/blog/page.tsx`

### Adding More Categories

Either:
1. Use the admin interface (future enhancement)
2. Add directly to Supabase in the `blog_categories` table
3. Update the SQL in `database_setup.sql`

## Navigation Integration

Add blog link to your navbar in `src/components/Navbar.tsx`:

```tsx
<Link href={`/${locale}/blog`}>
  {locale === 'es' ? 'Blog' : 'Blog'}
</Link>
```

## Performance

- **Static Generation**: Blog posts are statically generated at build time
- **Incremental Static Regeneration**: Add `revalidate` to page for auto-updates
- **Optimized Queries**: Indexed database queries for fast performance
- **Image Optimization**: Use Next.js Image component for featured images

## Security

- ✅ JWT-based authentication for admin
- ✅ Server-side validation
- ✅ XSS protection via React
- ✅ SQL injection protection via Supabase client
- ✅ Rate limiting (recommended to add)

## Future Enhancements

Potential additions:
- [ ] Comment system (table already created)
- [ ] Rich text WYSIWYG editor
- [ ] Image upload to Supabase Storage
- [ ] Draft preview mode
- [ ] Scheduled publishing
- [ ] Post analytics dashboard
- [ ] RSS feed
- [ ] Social media sharing buttons
- [ ] Related posts algorithm
- [ ] Newsletter integration

## Troubleshooting

### TypeScript Errors
The TypeScript errors you see are expected during development. Run `npm install` to install all dependencies, then restart your dev server.

### Posts Not Showing
1. Check that posts have `status = 'published'`
2. Verify `published_at` is set
3. Check Supabase connection

### Admin Access Issues
1. Verify JWT_SECRET environment variable
2. Check that token is stored in localStorage
3. Ensure admin credentials are correct

## Support

For questions or issues with the blog system, refer to:
- Next.js App Router docs: https://nextjs.org/docs
- MDX documentation: https://mdxjs.com/
- Supabase docs: https://supabase.com/docs
