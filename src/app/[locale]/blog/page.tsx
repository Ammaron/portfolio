import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts, getCategories } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import BackToTop from '@/components/BackToTop';
import { stripMarkdown } from '@/lib/markdown';
import '@/styles/components/blog-page.css';

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
  const posts = await getPublishedPosts();
  const categories = await getCategories();

  // Featured post (first post)
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              {locale === 'es' ? 'Blog' : 'Blog'}
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-blue-100">
              {locale === 'es'
                ? 'Reflexiones sobre enseñanza, aprendizaje de idiomas y tecnología educativa'
                : 'Insights on teaching, language learning, and educational technology'}
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {locale === 'es' ? 'Destacado' : 'Featured'}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <Link href={`/${locale}/blog/${featuredPost.slug}`} className="block">
                {featuredPost.featured_image ? (
                  <div className="relative h-64 sm:h-80 lg:h-96">
                    <Image
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        {featuredPost.category && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                            {featuredPost.category}
                          </span>
                        )}
                        {featuredPost.reading_time_minutes && (
                          <span className="text-white/90 text-sm">
                            {featuredPost.reading_time_minutes} {locale === 'es' ? 'min de lectura' : 'min read'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2">
                        {locale === 'es' && featuredPost.title_es ? featuredPost.title_es : featuredPost.title}
                      </h3>
                      <p className="text-white/90 line-clamp-3 text-lg">
                        {stripMarkdown(locale === 'es' && featuredPost.excerpt_es ? featuredPost.excerpt_es : featuredPost.excerpt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      {featuredPost.category && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full">
                          {featuredPost.category}
                        </span>
                      )}
                      {featuredPost.reading_time_minutes && (
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {featuredPost.reading_time_minutes} {locale === 'es' ? 'min de lectura' : 'min read'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">
                      {locale === 'es' && featuredPost.title_es ? featuredPost.title_es : featuredPost.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-lg mb-6">
                      {stripMarkdown(locale === 'es' && featuredPost.excerpt_es ? featuredPost.excerpt_es : featuredPost.excerpt)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{featuredPost.author}</p>
                          {featuredPost.published_at && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(featuredPost.published_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                        {locale === 'es' ? 'Leer más' : 'Read more'}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          </section>
        )}

        {/* Categories Filter */}
        {categories.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`/${locale}/blog`}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
              >
                {locale === 'es' ? 'Todos' : 'All'}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/blog?category=${category.slug}`}
                  className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                >
                  {locale === 'es' ? category.name_es || category.name : category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {otherPosts.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {locale === 'es' ? 'Publicaciones Recientes' : 'Recent Posts'}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <BlogCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {/* No posts state */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {locale === 'es' ? 'No hay publicaciones todavía' : 'No posts yet'}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {locale === 'es'
                ? '¡Vuelve pronto para ver las últimas reflexiones y consejos!'
                : 'Check back soon for the latest insights and tips!'}
            </p>
          </div>
        )}
      </div>
      
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
