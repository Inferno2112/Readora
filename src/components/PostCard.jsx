import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostCard({ $id, title, featuredImage, $userName, userName, $createdAt, userId, userAvatarId, likes = 0, comments = 0, shares = 0, isLiked = false, isBookmarked: initialBookmarked = false }) {
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)

  // Username: post attributes first, then current user if this is their post, then userId slice or "User"
  const displayUserName =
    userName ||
    $userName ||
    (userData && userId === userData.$id ? (userData.prefs?.username || userData.name || userData.email?.split('@')[0] || 'User') : null) ||
    (userId ? `user_${String(userId).slice(-6)}` : 'User')

  // Avatar: use post's userAvatarId, or current user's avatar (prefs.avatarId) if this is their post
  const effectiveAvatarId =
    userAvatarId ||
    (userData && userId === userData.$id ? userData.prefs?.avatarId : null)
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes || 0)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [commentCount] = useState(comments || 0)
  const [shareCount] = useState(shares || 0)

  useEffect(() => {
    if ($id && userData?.$id) {
      appwriteService.isBookmarked($id, userData.$id).then(setBookmarked);
    } else {
      setBookmarked(initialBookmarked);
    }
  }, [$id, userData?.$id, initialBookmarked])

  // Format date - handles Appwrite timestamp format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userData) {
      navigate('/login')
      return
    }
    // TODO: Implement like API call
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleComment = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/post/${$id}`)
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: `${window.location.origin}/post/${$id}`
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/post/${$id}`)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userData) {
      navigate('/login')
      return
    }
    const next = !bookmarked;
    setBookmarked(next);
    if (next) {
      appwriteService.bookmarkPost($id, userData.$id).catch(() => setBookmarked(false));
    } else {
      appwriteService.unbookmarkPost($id, userData.$id).catch(() => setBookmarked(true));
    }
  }

  const handlePostClick = (e) => {
    // Only navigate if the click wasn't on a link or button
    if (e.target.tagName !== 'A' && e.target.closest('a') === null && e.target.closest('button') === null) {
      navigate(`/post/${$id}`)
    }
  }

  return (
    <article
      onClick={handlePostClick}
      className="w-full p-3 sm:p-4 cursor-pointer hover:bg-zinc-900/20 backdrop-blur-sm transition-colors duration-150"
    >
      <div className="flex gap-2 sm:gap-3">
        {/* Avatar */}
        <Link 
          to={userId ? `/profile/${userId}` : '#'}
          onClick={(e) => {
            e.stopPropagation()
            if (userId) navigate(`/profile/${userId}`)
          }}
          className="shrink-0"
        >
          {effectiveAvatarId ? (
            <img 
              src={appwriteService.getFilePreview(effectiveAvatarId)} 
              alt={displayUserName} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-zinc-800"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border border-zinc-800 ${effectiveAvatarId ? 'hidden' : ''}`}
            aria-hidden={!!effectiveAvatarId}
          >
            {displayUserName.charAt(0).toUpperCase()}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Author name and timestamp */}
          <div className="flex items-center gap-2 mb-1">
            <Link 
              to={userId ? `/profile/${userId}` : '#'}
              onClick={(e) => {
                e.stopPropagation()
                if (userId) navigate(`/profile/${userId}`)
              }}
              className="text-sm font-semibold text-white hover:underline"
            >
              {displayUserName}
            </Link>
            <span className="text-zinc-500 text-sm">·</span>
            <span className="text-zinc-500 text-sm">
              {formatDate($createdAt)}
            </span>
          </div>

          {/* Title/Content */}
          <p className="text-sm text-white mb-3 whitespace-pre-wrap wrap-break-word">
            {title}
          </p>

          {/* Featured Image - click goes to post */}
          {featuredImage && (
            <div
              className="relative overflow-hidden rounded-2xl mb-3 border border-zinc-800 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/post/${$id}`)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/post/${$id}`)
                }
              }}
              aria-label={`View post: ${title}`}
            >
              <img
                src={appwriteService.getFilePreview(featuredImage)}
                alt={title}
                className="w-full max-h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-between max-w-md mt-2">
            {/* Comment */}
            <button 
              onClick={handleComment}
              className="group flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              {commentCount > 0 && <span className="text-sm">{commentCount}</span>}
            </button>

            {/* Share */}
            <button 
              onClick={handleShare}
              className="group flex items-center gap-2 text-zinc-500 hover:text-green-400 transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              {shareCount > 0 && <span className="text-sm">{shareCount}</span>}
            </button>

            {/* Like */}
            <button 
              onClick={handleLike}
              className={`group flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}
            >
              <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-red-500/10' : 'group-hover:bg-red-500/10'}`}>
                {liked ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </div>
              {likeCount > 0 && <span className="text-sm">{likeCount}</span>}
            </button>

            {/* Bookmark */}
            <button 
              onClick={handleBookmark}
              className={`group flex items-center gap-2 transition-colors ${bookmarked ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-400'}`}
            >
              <div className={`p-2 rounded-full transition-colors ${bookmarked ? 'bg-blue-400/10' : 'group-hover:bg-blue-400/10'}`}>
                {bookmarked ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard