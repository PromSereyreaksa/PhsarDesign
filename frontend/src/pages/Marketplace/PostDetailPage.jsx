"use client"

import { ArrowLeft, Clock, MapPin, Star, Tag, User } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthNavbar from "../../components/layout/AuthNavbar";
import SimplePostCard from "../../components/marketplace/SimplePostCard";
import { useAppDispatch, useAppSelector } from "../../hook/useRedux";
import {
  selectActiveTab,
  selectAvailabilityPosts,
  selectJobPosts
} from "../../store/slices/postsSlice";

// Make sure to import your API functions if needed

// Helper function to extract image URLs
const getImageUrls = (attachments) => {
  if (!attachments || !Array.isArray(attachments)) return [];
  return attachments.map(att => att.url);
};

// Helper to format price
const formatPrice = (value) => `$${parseFloat(value).toFixed(2)}`;

const PostDetailPage = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Use the same selectors as MarketplacePage
  const activeTab = useAppSelector(selectActiveTab);
  const availabilityPosts = useAppSelector(selectAvailabilityPosts);
  const jobPosts = useAppSelector(selectJobPosts);

  // Use postsToDisplay logic from MarketplacePage
  const postsToDisplay = useMemo(() => {
    return activeTab === "availability" ? availabilityPosts : jobPosts;
  }, [activeTab, availabilityPosts, jobPosts]);

  // Find the post by slug
  const currentPost = useMemo(() => {
    return postsToDisplay.find(p => p.slug === slug) || null;
  }, [slug, postsToDisplay]);

  // Related posts: filter by same artist/client, exclude current
  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    if (activeTab === "availability" && currentPost.artist?.artistId) {
      return postsToDisplay.filter(
        p => p.artist?.artistId === currentPost.artist.artistId && p.slug !== slug
      );
    }
    if (activeTab === "jobs" && currentPost.clientId) {
      return postsToDisplay.filter(
        p => p.clientId === currentPost.clientId && p.slug !== slug
      );
    }
    return [];
  }, [currentPost, postsToDisplay, activeTab, slug]);

  const handleBack = () => navigate("/marketplace");

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Post not found</h3>
              <p className="text-gray-400">The post you're looking for doesn't exist or may have been removed.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ...existing code...




  const imageUrls = getImageUrls(currentPost?.attachments);
  const artistName = currentPost?.artist?.user ? `${currentPost.artist.user.firstName} ${currentPost.artist.user.lastName}` : "Artist";
  const avatarUrl = currentPost?.artist?.avatar || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="pt-28 max-w-7xl mx-auto px-6 pb-12">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl overflow-hidden flex items-center justify-center">
              {imageUrls.length > 0 ? (
                <img src={imageUrls[0]} alt={currentPost.title} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-8xl">🎨</div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">{currentPost.title}</h1>
            <div className="text-3xl font-bold text-[#A95BAB]">{formatPrice(currentPost.budget)}</div>

            {currentPost.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">{currentPost.category.name}</span>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-400 my-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
              </div>
              {currentPost.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentPost.location}</span>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-gray-700/40 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={artistName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#A95BAB]/80 to-[#A95BAB]/60 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">{artistName}</h3>
                <p className="text-sm text-gray-400">Creative Professional</p>
                {currentPost.artist?.rating && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-300">{currentPost.artist.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium text-white">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{currentPost.description || "No description available."}</p>
            </div>

            {currentPost.skills && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4">
                <h3 className="text-base font-medium text-white mb-3 flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Skills Required</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPost.skills.split(',').map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600/30">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">More from this {activeTab === "availability" ? "Artist" : "Client"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((post) => (
                <SimplePostCard key={post.id || post.jobId} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
