import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import appwriteService from '../appwrite/config'

const FOLLOWING_STORAGE_KEY = 'readora_following'

function RightSidebar() {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [following, setFollowing] = useState(() => {
    try {
      const raw = localStorage.getItem(FOLLOWING_STORAGE_KEY)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    if (!userData?.$id) return
    setLoadingSuggestions(true)
    appwriteService.getSuggestedUsers(userData.$id, 5).then((users) => {
      setSuggestions(users)
      setLoadingSuggestions(false)
    }).catch(() => setLoadingSuggestions(false))
  }, [userData?.$id])

  const handleFollow = (e, userId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userData?.$id) return
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      try {
        localStorage.setItem(FOLLOWING_STORAGE_KEY, JSON.stringify([...next]))
      } catch (_) {}
      return next
    })
    if (following.has(userId)) {
      appwriteService.unfollowUser(userData.$id, userId)
    } else {
      appwriteService.followUser(userData.$id, userId)
    }
  }

  if (!authStatus) {
    return null
  }

  return (
    <aside className="hidden xl:block w-[400px] h-screen fixed right-0 top-0 z-40 border-l border-zinc-800 px-6 py-4 overflow-y-auto scrollbar-hide">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-full py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Post Button */}
      <button
        onClick={() => navigate('/add-post')}
        className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-full transition-colors mb-4 shadow-lg shadow-zinc-500/50"
      >
        Post
      </button>

      {/* User Profile */}
      {userData && (
        <button
          onClick={() => navigate(`/profile/${userData.$id}`)}
          className="mb-4 p-3 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-black flex items-center justify-center text-white font-semibold">
                {(userData.name || userData.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {userData.prefs?.username || userData.name || 'User'}
                </p>
                <p className="text-zinc-400 text-xs truncate">
                  @{userData.prefs?.username || userData.email?.split('@')[0] || 'user'}
                </p>
              </div>
            </div>
        </button>
      )}

      {/* Who to follow */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Who to follow</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {loadingSuggestions ? (
            <div className="p-4 text-zinc-500 text-sm">Loading...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-zinc-500 text-sm">No suggestions right now. Post something to see others here.</div>
          ) : (
            suggestions.map((user) => {
              const isFollowing = following.has(user.userId)
              const displayName = user.userName || `user_${(user.userId || '').slice(-6)}`
              const handle = user.userName ? `@${user.userName.replace(/\s+/g, '').toLowerCase().slice(0, 15)}` : `@user_${(user.userId || '').slice(-6)}`
              return (
                <div
                  key={user.userId}
                  onClick={() => navigate(`/profile/${user.userId}`)}
                  className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {user.userAvatarId ? (
                        <img
                          src={appwriteService.getFilePreview(user.userAvatarId)}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                        <p className="text-zinc-500 text-xs truncate">{handle}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleFollow(e, user.userId)}
                      className={`shrink-0 font-semibold px-4 py-1.5 rounded-full text-sm transition-colors ${
                        isFollowing
                          ? 'bg-transparent border border-zinc-600 text-white hover:border-red-500 hover:text-red-500'
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar
