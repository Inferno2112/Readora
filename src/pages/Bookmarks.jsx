import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PostCard, Sidebar, RightSidebar, PageHeader } from "../components";
import appwriteService from "../appwrite/config";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!userData?.$id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    appwriteService
      .getBookmarkedPosts(userData.$id)
      .then((res) => {
        setPosts(res?.documents ?? []);
      })
      .finally(() => setLoading(false));
  }, [userData?.$id]);

  return (
    <div className="flex min-h-screen bg-black w-full overflow-x-hidden">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 min-w-0 w-full lg:w-[630px] lg:shrink-0 lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        <PageHeader onMenuOpen={() => setMobileMenuOpen(true)} title="Bookmarks" centerReadora={false} />

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-4 text-4xl">
              📑
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 text-center">No bookmarks yet</h2>
            <p className="text-zinc-400 text-sm text-center max-w-sm">
              Bookmark posts to find them easily here later.
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="divide-y divide-zinc-800/50 pb-6">
            {posts.map((post) => (
              <div key={post.$id} className="hover:bg-zinc-900/20 transition-colors">
                <PostCard {...post} userName={post.userName} userAvatarId={post.userAvatarId} isBookmarked />
              </div>
            ))}
          </div>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}
