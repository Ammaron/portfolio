import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts, getCategories } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog | Kirby McDonald',
  description: 'Insights on teaching, language learning, and educational technology',
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getPublishedPosts(locale);
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            {locale === 'es' ? 'Blog' : 'Blog'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {locale === 'es' 
              ? 'Reflexiones sobre enseñanza, aprendizaje de idiomas y tecnología educativa'
              : 'Insights on teaching, language learning, and educational technology'}
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`/${locale}/blog`}
                className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {locale === 'es' ? 'Todos' : 'All'}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/blog?category=${category.slug}`}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {locale === 'es' ? category.name_es || category.name : category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              {locale === 'es' 
                ? 'No hay publicaciones todavía. ¡Vuelve pronto!'
                : 'No posts yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
