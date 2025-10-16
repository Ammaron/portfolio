import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPublishedPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/components/ShareButtons';
import BlogEnhancements from '@/components/BlogEnhancements';
import TableOfContents from '@/components/TableOfContents';
import AuthorBio from '@/components/AuthorBio';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getPublishedPosts('en');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: postUrl,
      siteName: 'Ammaron Portfolio',
      images: post.featured_image ? [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Choose content based on locale
  const title = locale === 'es' && post.title_es ? post.title_es : post.title;
  const content = locale === 'es' && post.content_es ? post.content_es : post.content;

  const mdxOptions = {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [rehypeAutolinkHeadings, { behavior: 'wrap' }] as any,
      ],
    },
  };

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Reading Progress Bar & Scroll to Top */}
      <BlogEnhancements />

      {/* Back button - outside main container for full width background */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale === 'es' ? 'Volver al blog' : 'Back to blog'}
          </Link>
        </div>
      </div>

      {/* Featured image - full width, cinematic */}
      {post.featured_image && (
        <div className="relative w-full h-[60vh] max-h-[500px] bg-gray-100 dark:bg-gray-900">
          <Image
            src={post.featured_image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Main content container - optimal reading width */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Table of Contents - sticky sidebar on large screens */}
        <TableOfContents />

        {/* Post header */}
        <header className={`${post.featured_image ? '-mt-32' : 'mt-16'} mb-12 relative z-10`}>
          {/* Category badge */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight ${
            post.featured_image 
              ? 'text-white drop-shadow-2xl' 
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {title}
          </h1>
          
          {/* Meta information */}
          <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${
            post.featured_image 
              ? 'text-gray-200' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{post.author}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
            {post.reading_time_minutes && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{post.reading_time_minutes} {locale === 'es' ? 'min de lectura' : 'min read'}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{post.view_count} {locale === 'es' ? 'vistas' : 'views'}</span>
            </div>
          </div>
        </header>

        {/* Tags - after header, before content */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* MDX content - Enhanced typography */}
        <div 
          className="blog-content prose prose-xl max-w-none
          [&_*]:text-gray-900 dark:[&_*]:!text-white
          [&_p]:text-gray-900 dark:[&_p]:!text-white
          [&_li]:text-gray-900 dark:[&_li]:!text-white
          [&_h1]:!text-5xl [&_h1]:!font-bold [&_h1]:!mb-8 [&_h1]:!mt-16 [&_h1]:text-gray-900 dark:[&_h1]:!text-white
          [&_h2]:!text-4xl [&_h2]:!font-bold [&_h2]:!mb-6 [&_h2]:!mt-14 [&_h2]:text-gray-900 dark:[&_h2]:!text-white
          [&_h3]:!text-3xl [&_h3]:!font-bold [&_h3]:!mb-5 [&_h3]:!mt-12 [&_h3]:text-gray-900 dark:[&_h3]:!text-white
          [&_h4]:!text-2xl [&_h4]:!font-bold [&_h4]:!mb-4 [&_h4]:!mt-10 [&_h4]:text-gray-900 dark:[&_h4]:!text-white
          [&_h5]:!text-xl [&_h5]:!font-bold [&_h5]:!mb-3 [&_h5]:!mt-8 [&_h5]:text-gray-900 dark:[&_h5]:!text-white
          [&_blockquote]:text-gray-900 dark:[&_blockquote]:!text-white
          [&_td]:text-gray-900 dark:[&_td]:!text-white
          [&_th]:text-gray-900 dark:[&_th]:!text-white
          [&_a]:text-blue-600 dark:[&_a]:!text-blue-400
          [&_code:not(pre_code)]:text-pink-700 dark:[&_code:not(pre_code)]:!text-pink-400
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-16
          prose-h2:text-4xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-blue-200 dark:prose-h2:border-blue-700
          prose-h3:text-3xl prose-h3:mb-4 prose-h3:mt-10
          prose-h4:text-2xl prose-h4:mb-3 prose-h4:mt-8
          prose-p:text-[1.125rem] prose-p:leading-[1.8] prose-p:mb-8
          prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-a:transition-all
          prose-strong:font-bold prose-strong:bg-yellow-100 dark:prose-strong:bg-yellow-900/30 prose-strong:px-1
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-transparent dark:prose-blockquote:from-blue-900/20 
          prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:my-8 prose-blockquote:shadow-md
          prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30
          prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-semibold prose-code:text-base
          prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:border prose-pre:border-gray-700 
          prose-pre:shadow-2xl prose-pre:rounded-xl prose-pre:my-10 prose-pre:p-6
          prose-ul:my-8 prose-ul:space-y-3 prose-ol:my-8 prose-ol:space-y-3
          prose-li:my-3 prose-li:text-[1.125rem] prose-li:leading-relaxed
          prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-12 prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700
          prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-16 prose-hr:border-t-2
          first-letter:text-7xl first-letter:font-bold first-letter:text-blue-600 dark:first-letter:text-blue-400
          first-letter:float-left first-letter:mr-3 first-letter:leading-[0.7] first-letter:mt-1"
        >
          <MDXRemote source={content} options={mdxOptions} />
        </div>

        {/* Author Bio */}
        <AuthorBio author={post.author} locale={locale} />

        {/* Share section */}
        <ShareButtons title={title} excerpt={post.excerpt} locale={locale} />
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </article>
  );
}
