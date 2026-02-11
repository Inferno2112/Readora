import React, {useState, useEffect} from 'react'
import { PostCard, Sidebar, RightSidebar } from '../components'
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from 'react-redux'

const AllPosts = () => {
    const [posts, setposts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts([
            Query.orderDesc("$createdAt")
        ]).then(response => {
            if(response && response.documents){
                setposts(response.documents);
            }
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, []);

  return (
    <div className="flex min-h-screen bg-black w-full overflow-x-hidden">
      {/* Left Sidebar - hidden on mobile, drawer opens via hamburger */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Feed - full width on mobile, constrained on lg+ */}
      <main className="flex-1 min-w-0 w-full lg:w-[630px] lg:shrink-0 lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors touch-manipulation"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white">Home</h1>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
              <p className="text-zinc-400 text-sm sm:text-base">Loading posts...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="text-center">
              <div className="text-6xl sm:text-7xl mb-4">📝</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                No posts yet
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                Be the first to share your thoughts with the community!
              </p>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {!loading && posts.length > 0 && (
          <div className="divide-y divide-zinc-800/50 pb-6 sm:pb-8">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="hover:bg-zinc-900/20 backdrop-blur-sm transition-colors duration-200"
              >
                <PostCard {...post} userName={post.userName} userAvatarId={post.userAvatarId} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  )
}

export default AllPosts
