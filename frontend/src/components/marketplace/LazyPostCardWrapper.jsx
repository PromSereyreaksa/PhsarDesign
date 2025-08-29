import { lazy, Suspense } from "react";

// Lazy load the PostCard component
const LazyPostCard = lazy(() => import("./PostCard"));

const PostCardSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-4">
    {/* Image skeleton */}
    <div className="aspect-[4/3] bg-gray-700/30 rounded-xl mb-4"></div>
    
    {/* Content skeleton */}
    <div className="space-y-3">
      {/* Title */}
      <div className="h-5 bg-gray-700/30 rounded w-3/4"></div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-700/30 rounded w-full"></div>
        <div className="h-3 bg-gray-700/30 rounded w-2/3"></div>
      </div>
      
      {/* Price */}
      <div className="h-6 bg-gray-700/30 rounded w-1/2"></div>
      
      {/* Footer */}
      <div className="pt-3 border-t border-gray-700/30">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
          <div className="h-3 bg-gray-700/30 rounded w-1/4"></div>
        </div>
      </div>
      
      {/* Button */}
      <div className="h-10 bg-gray-700/30 rounded-xl mt-3"></div>
    </div>
  </div>
);

const LazyPostCardWrapper = ({ post, ...props }) => {
  return (
    <Suspense fallback={<PostCardSkeleton />}>
      <LazyPostCard post={post} {...props} />
    </Suspense>
  );
};

export default LazyPostCardWrapper;
