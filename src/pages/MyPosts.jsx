import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import PostCard from "../components/PostCard";

export default function MyPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.$id) return;

    appwriteService.getMyPosts(userData.$id).then((res) => {
      if (res?.documents) {
        setPosts(res.documents);
      }
      setLoading(false);
    });
  }, [userData]);

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background effects */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
      
      <section className="relative py-8 sm:py-12 lg:py-16">
      <Container>

        {/* Header */}
          <div className="mb-8 sm:mb-12 max-w-2xl px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            My posts
          </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Articles you've written on Readora.
          </p>
        </div>

        {/* Loading */}
        {loading && (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                <p className="text-zinc-400 text-sm sm:text-base">Loading your posts…</p>
              </div>
            </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
              <div className="text-center">
                <div className="text-6xl sm:text-7xl mb-4">📝</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  No posts yet
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                  You haven't written any posts yet. Start sharing your thoughts!
          </p>
              </div>
            </div>
        )}

          {/* Posts Grid - Twitter-inspired layout */}
        {!loading && posts.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-0">
            {posts.map((post) => (
                  <div 
                    key={post.$id} 
                    className="border-b border-zinc-800/50 last:border-b-0 hover:bg-zinc-900/30 transition-colors duration-200"
                  >
              <PostCard
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage}
                      userName={post.userName}
                      $createdAt={post.$createdAt}
                      userAvatarId={post.userAvatarId}
              />
                  </div>
            ))}
              </div>
          </div>
        )}

      </Container>
    </section>
    </div>
  );
}
