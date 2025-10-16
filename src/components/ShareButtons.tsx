'use client';

import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  title: string;
  excerpt: string;
  locale: string;
}

export default function ShareButtons({ title, excerpt, locale }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
    setMounted(true);
  }, []);

  const handleCopyLink = () => {
    const shareText = `${title}\n\n${excerpt}\n\n${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    alert(locale === 'es' ? '¡Enlace copiado!' : 'Link copied!');
  };

  // For LinkedIn, we'll construct a post body that the user can paste
  const handleLinkedInShare = () => {
    // LinkedIn's new sharing - opens with pre-filled text
    const text = `${title}\n\n${excerpt}\n\n${shareUrl}`;
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  // For Facebook, handle the share
  const handleFacebookShare = () => {
    // Facebook sharer with quote parameter
    const text = `${title}\n\n${excerpt}`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-16 mb-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center shadow-lg">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {locale === 'es' 
            ? '¿Te gustó este artículo?' 
            : 'Enjoyed this article?'}
        </p>
        <p className="text-gray-700 dark:text-gray-200 mb-6">
          {locale === 'es' 
            ? 'Compártelo con tus amigos y colegas'
            : 'Share it with your friends and colleagues'}
        </p>
        
        {/* Social share buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${excerpt}`)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-lg font-medium transition-all transform hover:scale-105 shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {locale === 'es' ? 'Compartir' : 'Share'}
          </a>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            disabled={!mounted || !shareUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            disabled={!mounted || !shareUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {locale === 'es' ? 'Copiar' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
