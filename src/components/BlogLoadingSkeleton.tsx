export default function BlogLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-300 to-gray-400 h-96">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="h-12 bg-gray-300 rounded-lg w-48 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded-lg w-96 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post Skeleton */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-300 rounded-lg w-32 mx-auto mb-3"></div>
            <div className="w-20 h-1 bg-gray-300 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-80 bg-gray-300"></div>
            <div className="p-8">
              <div className="h-4 bg-gray-300 rounded-full w-24 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded-lg w-full mb-4"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-3/4 mb-6"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded-lg w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded-lg w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded-lg w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="h-10 bg-gray-300 rounded-full w-20"></div>
            <div className="h-10 bg-gray-300 rounded-full w-24"></div>
            <div className="h-10 bg-gray-300 rounded-full w-28"></div>
            <div className="h-10 bg-gray-300 rounded-full w-20"></div>
          </div>
        </div>

        {/* Recent Posts Skeleton */}
        <div>
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-300 rounded-lg w-40 mx-auto mb-3"></div>
            <div className="w-20 h-1 bg-gray-300 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded-lg w-full mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="h-3 bg-gray-300 rounded-lg w-20 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded-lg w-16"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded-lg w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}