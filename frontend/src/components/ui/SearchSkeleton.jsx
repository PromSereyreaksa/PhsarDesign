const SearchSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
);

export default SearchSkeleton;
