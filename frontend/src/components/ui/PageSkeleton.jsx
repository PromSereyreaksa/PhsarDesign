const PageSkeleton = ({ categoryName }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
    <div className="pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-700/30 rounded w-40 mb-8"></div>
        
        <div className="text-center mb-8">
          {/* Title skeleton */}
          <div className="h-12 bg-gray-700/30 rounded w-80 mx-auto mb-4"></div>
          {/* Subtitle skeleton */}
          <div className="h-6 bg-gray-700/30 rounded w-96 mx-auto"></div>
        </div>
      </div>
    </div>

    {/* Search and Filter Section Skeleton */}
    <div className="pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar skeleton */}
          <div className="flex-1 h-12 bg-gray-700/30 rounded-xl"></div>
          
          {/* Tab Switch skeleton */}
          <div className="w-48 h-12 bg-gray-700/30 rounded-xl"></div>
          
          {/* Sort Filter skeleton */}
          <div className="w-40 h-12 bg-gray-700/30 rounded-xl"></div>
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="max-w-6xl mx-auto px-6 pb-16">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-gray-700/30 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-700/30 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-700/30 rounded w-32"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Image skeleton */}
            <div className="h-40 bg-gray-700/30"></div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title and price */}
              <div className="flex justify-between items-start">
                <div className="h-5 bg-gray-700/30 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700/30 rounded w-16"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-700/30 rounded w-full"></div>
                <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
              </div>
              
              {/* Skills */}
              <div className="flex gap-2 pt-1">
                <div className="h-6 bg-gray-700/30 rounded-full w-16"></div>
                <div className="h-6 bg-gray-700/30 rounded-full w-20"></div>
                <div className="h-6 bg-gray-700/30 rounded-full w-14"></div>
              </div>
              
              {/* Footer */}
              <div className="pt-3 border-t border-gray-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700/30 rounded w-1/4"></div>
                </div>
                
                {/* Button */}
                <div className="h-10 bg-gray-700/30 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PageSkeleton;
