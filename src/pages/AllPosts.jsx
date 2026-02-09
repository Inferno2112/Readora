import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";

const AllPosts = () => {
    const [posts, setposts] = useState([]);
    const [loading, setLoading] = useState(true);

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
    <div className="relative min-h-screen w-full bg-black">
      {/* Background effects */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
      
      {/* Main content */}
      <div className="relative w-full py-4 sm:py-6 lg:py-8">
        <Container>
          {/* Header */}
          <div className="mb-6 sm:mb-8 px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              All Posts
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Discover the latest articles from our community
            </p>
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

          {/* Twitter-inspired feed layout */}
          {!loading && posts.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-0">
                {posts.map((post, index) => (
                  <div 
                    key={post.$id} 
                    className="border-b border-zinc-800/50 last:border-b-0 hover:bg-zinc-900/30 transition-colors duration-200"
                  >
                    <PostCard {...post} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default AllPosts
