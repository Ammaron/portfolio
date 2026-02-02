import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';
import { stripMarkdown } from '@/lib/markdown';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const title = locale === 'es' && post.title_es ? post.title_es : post.title;
  const excerpt = stripMarkdown(locale === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt);

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700">
        {/* Featured Image */}
        {post.featured_image ? (
          <div className="aspect-video overflow-hidden relative">
            <Image
              src={post.featured_image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Category badge overlay */}
            {post.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full shadow-lg">
                  {post.category}
                </span>
              </div>
            )}
            
            {/* Reading time badge */}
            {post.reading_time_minutes && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {post.reading_time_minutes} {locale === 'es' ? 'min' : 'min'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Category badge for no image */}
            {post.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full shadow-lg">
                  {post.category}
                </span>
              </div>
            )}
            
            {/* Reading time badge for no image */}
            {post.reading_time_minutes && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {post.reading_time_minutes} {locale === 'es' ? 'min' : 'min'}
                </span>
              </div>
            )}
            
            {/* Icon for no image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
            {excerpt}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                {post.published_at && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.published_at).toLocaleDateString(
                      locale === 'es' ? 'es-ES' : 'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </p>
                )}
              </div>
            </div>
            
            {/* View count */}
            {post.view_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.view_count}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Read more indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              {locale === 'es' ? 'Leer más' : 'Read more'}
            </span>
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
