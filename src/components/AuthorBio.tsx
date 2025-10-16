import Image from 'next/image';

interface AuthorBioProps {
  author: string;
  locale: string;
}

export default function AuthorBio({ author, locale }: AuthorBioProps) {
  const authorData = {
    name: author,
    bio: locale === 'es' 
      ? 'Educador apasionado y desarrollador con años de experiencia en tecnología educativa y enseñanza de idiomas.'
      : 'Passionate educator and developer with years of experience in educational technology and language teaching.',
    role: locale === 'es' ? 'Educador & Desarrollador' : 'Educator & Developer',
    image: '/images/profile1.webp',
    social: {
      linkedin: 'https://linkedin.com/in/ammaron',
    }
  };

  return (
    <div className="mt-20 mb-16">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {locale === 'es' ? 'Sobre el Autor' : 'About the Author'}
        </span>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>

      {/* Author Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-xl">
                  <Image
                    src={authorData.image}
                    alt={authorData.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Verified badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-grow">
              <div className="mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {authorData.name}
                </h3>
                <p className="text-base text-blue-600 dark:text-blue-400 font-semibold">
                  {authorData.role}
                </p>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base md:text-lg">
                {authorData.bio}
              </p>

              {/* LinkedIn Link */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={authorData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>{locale === 'es' ? 'Conectar en LinkedIn' : 'Connect on LinkedIn'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
