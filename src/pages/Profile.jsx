import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Sidebar, RightSidebar, PostCard } from '../components'
import appwriteService from '../appwrite/config'
import authService from '../appwrite/auth'
import { Query } from 'appwrite'
import { Button } from '@/components/ui/button'
import { login } from '../store/authSlice'

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.userData)
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBanner, setEditBanner] = useState(null)
  const [editAvatar, setEditAvatar] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const isOwnProfile = currentUser?.$id === userId

  useEffect(() => {
    if (!userId) return

    // Fetch user profile (simplified - using current user for now)
    if (isOwnProfile) {
      setProfileUser(currentUser)
      setEditName(currentUser?.name || '')
      
      // Load saved avatar and banner from preferences
      if (currentUser?.prefs?.avatarId) {
        setEditAvatar(appwriteService.getFilePreview(currentUser.prefs.avatarId))
      }
      if (currentUser?.prefs?.bannerId) {
        setEditBanner(appwriteService.getFilePreview(currentUser.prefs.bannerId))
      }
    } else {
      // TODO: Fetch other user's profile
      setProfileUser({ name: 'User', email: 'user@example.com' })
    }

    // Fetch user posts
    appwriteService.getPosts([
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt')
    ]).then((res) => {
      if (res?.documents) {
        setPosts(res.documents)
      }
      setLoading(false)
    }).catch((error) => {
      console.error(error)
      setLoading(false)
    })
  }, [userId, currentUser, isOwnProfile])

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    // TODO: Implement follow API
    setIsFollowing(!isFollowing)
    setFollowers(prev => isFollowing ? prev - 1 : prev + 1)
  }

  const handleSaveProfile = async () => {
    if (!currentUser || !isOwnProfile) return
    
    setSaving(true)
    try {
      const prefs = { ...currentUser.prefs }
      
      // Upload avatar if changed
      if (avatarFile) {
        // Delete old avatar if exists
        if (currentUser.prefs?.avatarId) {
          try {
            await appwriteService.deleteFile(currentUser.prefs.avatarId)
          } catch (error) {
            console.error('Error deleting old avatar:', error)
          }
        }
        
        const avatarUpload = await appwriteService.uploadFile(avatarFile)
        if (avatarUpload) {
          prefs.avatarId = avatarUpload.$id
        }
      }
      
      // Upload banner if changed
      if (bannerFile) {
        // Delete old banner if exists
        if (currentUser.prefs?.bannerId) {
          try {
            await appwriteService.deleteFile(currentUser.prefs.bannerId)
          } catch (error) {
            console.error('Error deleting old banner:', error)
          }
        }
        
        const bannerUpload = await appwriteService.uploadFile(bannerFile)
        if (bannerUpload) {
          prefs.bannerId = bannerUpload.$id
        }
      }
      
      // Update name if changed
      if (editName !== currentUser.name) {
        prefs.fullName = editName
      }
      
      // Update preferences in Appwrite
      await authService.updatePreferences(prefs)
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUser()
      if (updatedUser) {
        dispatch(login({ userData: updatedUser }))
        setProfileUser(updatedUser)
      }
      
      setIsEditing(false)
      setBannerFile(null)
      setAvatarFile(null)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setEditAvatar(URL.createObjectURL(file))
    }
  }

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerFile(file)
      setEditBanner(URL.createObjectURL(file))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="flex-1 flex items-center justify-center lg:ml-[400px] xl:mr-[400px]">
          <div className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
        </div>
        <RightSidebar />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 lg:w-[600px] lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto scrollbar-hide">
        {/* Profile Header */}
        <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-zinc-900 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{profileUser?.name || 'User'}</h1>
              <p className="text-sm text-zinc-500">{posts.length} posts</p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-black">
          {(editBanner || (profileUser?.prefs?.bannerId && !isEditing)) && (
            <img 
              src={editBanner || (profileUser?.prefs?.bannerId ? appwriteService.getFilePreview(profileUser.prefs.bannerId) : null)} 
              alt="Banner" 
              className="w-full h-full object-cover" 
            />
          )}
          {isEditing && (
            <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full cursor-pointer transition-colors">
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              Change banner
            </label>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4 border-b border-zinc-800">
          <div className="flex justify-between items-start -mt-16 mb-4">
            {/* Avatar */}
            <div className="relative">
              {(editAvatar || (profileUser?.prefs?.avatarId && !isEditing)) ? (
                <img 
                  src={editAvatar || (profileUser?.prefs?.avatarId ? appwriteService.getFilePreview(profileUser.prefs.avatarId) : null)} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full border-4 border-black object-cover" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-black bg-gradient-to-br from-blue-500 to-black flex items-center justify-center text-white text-4xl font-semibold">
                  {(profileUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-20 flex gap-2">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false)
                        setBannerFile(null)
                        setAvatarFile(null)
                        // Reset to saved values
                        if (currentUser?.prefs?.avatarId) {
                          setEditAvatar(appwriteService.getFilePreview(currentUser.prefs.avatarId))
                        } else {
                          setEditAvatar(null)
                        }
                        if (currentUser?.prefs?.bannerId) {
                          setEditBanner(appwriteService.getFilePreview(currentUser.prefs.bannerId))
                        } else {
                          setEditBanner(null)
                        }
                        setEditName(currentUser?.name || '')
                      }} 
                      variant="outline"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-zinc-700 text-black hover:bg-zinc-200">
                      Edit profile
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                          await authService.logout();
                          dispatch(logout());
                          navigate("/", { replace: true });
                        } catch (error) {
                          console.error("Logout failed", error);
                        }
                      }}
                      variant="outline" 
                      className="border-zinc-700 text-black hover:bg-zinc-200"
                    >
                      Logout
                    </Button>
                  </>
                )
              ) : (
                <Button
                  onClick={handleFollow}
                  className={isFollowing ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white hover:bg-zinc-200 text-black'}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-bold text-white bg-zinc-900 border border-zinc-700 rounded px-3 py-2 mb-2 w-full"
                placeholder="Name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white mb-1">{profileUser?.prefs?.username || profileUser?.name || 'User'}</h2>
            )}
            <p className="text-zinc-500">@{profileUser?.prefs?.username || profileUser?.email?.split('@')[0] || 'user'}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <button className="hover:underline">
              <span className="font-semibold text-white">{following}</span>
              <span className="text-zinc-500 ml-1">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-semibold text-white">{followers}</span>
              <span className="text-zinc-500 ml-1">Followers</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="divide-y divide-zinc-800/50">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <p className="text-zinc-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.$id} className="hover:bg-zinc-900/20 backdrop-blur-sm transition-colors">
                <PostCard {...post} userName={post.userName} userAvatarId={post.userAvatarId} />
              </div>
            ))
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}

export default Profile
