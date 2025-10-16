import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const title = locale === 'es' && post.title_es ? post.title_es : post.title;
  const excerpt = locale === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt;

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video overflow-hidden relative">
            <Image
              src={post.featured_image}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category badge */}
          {post.category && (
            <div className="mb-3">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span>{post.author}</span>
              {post.reading_time_minutes && (
                <span>{post.reading_time_minutes} {locale === 'es' ? 'min' : 'min'}</span>
              )}
            </div>
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString(
                  locale === 'es' ? 'es-ES' : 'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' }
                )}
              </time>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
