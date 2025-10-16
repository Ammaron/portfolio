interface KeyTakeawaysProps {
  points: string[];
  locale: string;
}

export default function KeyTakeaways({ points, locale }: KeyTakeawaysProps) {
  return (
    <div className="my-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {locale === 'es' ? 'Puntos Clave' : 'Key Takeaways'}
        </h3>
      </div>
      
      <ul className="space-y-4">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold shadow-md">
              {index + 1}
            </span>
            <span className="text-gray-800 dark:text-gray-200 leading-relaxed pt-0.5 text-lg">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
