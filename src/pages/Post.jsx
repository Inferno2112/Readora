import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import { Query } from "appwrite";

import appwriteService from "../appwrite/config";
import { Sidebar, RightSidebar, PostCard } from "../components";
import { Button } from "@/components/ui/button";

export default function Post() {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    // Fetch current post
    appwriteService.getPost(slug).then((res) => {
      if (res) setPost(res);
      else navigate("/");
    });

    // Fetch related posts (simple version) - sorted by newest first
    appwriteService.getPosts([
      Query.orderDesc("$createdAt")
    ]).then((res) => {
      if (res?.documents) {
        setRelatedPosts(res.documents.slice(0, 4));
      }
    });
  }, [slug, navigate]);

  const deletePost = async () => {
    const status = await appwriteService.deletePost(post.$id);
    if (status) {
      await appwriteService.deleteFile(post.featuredImage);
      navigate("/");
    }
  };

  if (!post) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="flex-1 flex items-center justify-center border-x border-zinc-800 lg:ml-[400px] xl:mr-[400px]">
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
        {/* Header */}
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
            <h1 className="text-xl font-bold text-white">Post</h1>
          </div>
        </div>

        {/* Post Content */}
        <article className="border-b border-zinc-800/50">
          {/* Author Info */}
          <div className="p-4 flex items-center gap-3">
            <Link to={`/profile/${post.userId || 'user'}`} className="flex-shrink-0">
              {post.userAvatarId ? (
                <img 
                  src={appwriteService.getFilePreview(post.userAvatarId)} 
                  alt={post.userName || 'User'} 
                  className="w-12 h-12 rounded-full object-cover border border-zinc-800"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {(post.userName || (post.userId ? post.userId.charAt(0) : 'U')).charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div className="flex-1">
              <Link to={`/profile/${post.userId || 'user'}`} className="text-white font-semibold hover:underline">
                {post.userName || (post.userId ? post.userId.substring(0, 8) + '...' : 'User')}
              </Link>
              <p className="text-zinc-500 text-sm">
                {new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={deletePost}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Post Title */}
          <div className="px-4 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {post.title}
            </h1>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-invert prose-zinc max-w-none text-white">
              {parse(post.content)}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="p-4 border-b border-zinc-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">Related posts</h3>
            <div className="space-y-2">
              {relatedPosts.map((item) => (
                <PostCard key={item.$id} {...item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}
