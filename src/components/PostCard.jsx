import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, $userName, $createdAt }) {
  // Format date - handles Appwrite timestamp format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  return (
    <Link to={`/post/${$id}`} className="group block">
      <article className="w-full p-3 sm:p-4 hover:bg-zinc-900/50 transition-colors duration-150">
        <div className="flex gap-3 sm:gap-4">
          {/* Avatar placeholder */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {($userName || 'A').charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Author name and timestamp */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm sm:text-base font-semibold text-white hover:underline">
                {$userName || 'Anonymous'}
              </span>
              <span className="text-zinc-500 text-xs sm:text-sm">·</span>
              <span className="text-zinc-500 text-xs sm:text-sm">
                {formatDate($createdAt)}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-sm sm:text-base lg:text-lg font-medium text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h2>

            {/* Featured Image */}
            {featuredImage && (
              <div className="relative overflow-hidden rounded-2xl mb-2 sm:mb-3 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                <img
                  src={appwriteService.getFilePreview(featuredImage)}
                  alt={title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Footer actions placeholder (Twitter-like) */}
            <div className="flex items-center gap-6 sm:gap-8 mt-2 sm:mt-3 text-zinc-500">
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 sm:gap-2 hover:text-blue-400 transition-colors group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs sm:text-sm">Read</span>
              </button>
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 sm:gap-2 hover:text-red-400 transition-colors group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs sm:text-sm">Like</span>
              </button>
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 sm:gap-2 hover:text-green-400 transition-colors group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-xs sm:text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard