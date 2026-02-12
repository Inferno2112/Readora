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
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  const fetchComments = (postId) => {
    appwriteService.getComments(postId).then((res) => {
      setComments(res?.documents ?? []);
    });
  };

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    // Fetch current post
    appwriteService.getPost(slug).then((res) => {
      if (res) {
        setPost(res);
        fetchComments(res.$id);
        if (userData?.$id) {
          appwriteService.isBookmarked(res.$id, userData.$id).then(setBookmarked);
        }
      } else {
        navigate("/");
      }
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

  useEffect(() => {
    if (post?.$id && userData?.$id) {
      appwriteService.isBookmarked(post.$id, userData.$id).then(setBookmarked);
    }
  }, [post?.$id, userData?.$id]);

  const deletePost = async () => {
    const status = await appwriteService.deletePost(post.$id);
    if (status) {
      await appwriteService.deleteFile(post.featuredImage);
      navigate("/");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || !userData?.$id || !post?.$id) return;
    setSendingComment(true);
    try {
      await appwriteService.addComment(
        post.$id,
        userData.$id,
        text,
        userData.prefs?.username || userData.name || null,
        userData.prefs?.avatarId || null
      );
      setCommentText("");
      fetchComments(post.$id);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingComment(false);
    }
  };

  const handleBookmark = async () => {
    if (!userData?.$id || !post?.$id) return;
    if (bookmarked) {
      await appwriteService.unbookmarkPost(post.$id, userData.$id);
      setBookmarked(false);
    } else {
      await appwriteService.bookmarkPost(post.$id, userData.$id);
      setBookmarked(true);
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
        <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-10 shrink-0">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-zinc-900 transition-colors" aria-label="Back">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl font-bold text-white">Post</h1>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 shrink-0 p-1 rounded-full hover:bg-zinc-900" aria-label="Open menu">
              {userData?.prefs?.avatarId ? (
                <img src={appwriteService.getFilePreview(userData.prefs.avatarId)} alt="" className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {(userData?.name || userData?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            <div className="hidden lg:block w-10 shrink-0" aria-hidden />
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
            <div className="flex items-center gap-2">
              {userData?.$id && (
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${bookmarked ? "text-blue-400 bg-blue-400/10" : "text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"}`}
                  title={bookmarked ? "Remove bookmark" : "Bookmark"}
                >
                  <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
              {isAuthor && (
                <>
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={deletePost}>
                    Delete
                  </Button>
                </>
              )}
            </div>
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

        {/* Comments */}
        <div className="p-4 border-b border-zinc-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>

          {userData?.$id ? (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                {(userData.name || userData.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  disabled={sendingComment}
                />
                <Button type="submit" disabled={sendingComment || !commentText.trim()} size="sm">
                  {sendingComment ? "..." : "Reply"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-zinc-500 text-sm mb-4">Log in to comment.</p>
          )}

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-zinc-500 text-sm">No comments yet.</p>
            )}
            {comments.map((c) => (
              <div key={c.$id} className="flex gap-3">
                {c.userAvatarId ? (
                  <img
                    src={appwriteService.getFilePreview(c.userAvatarId)}
                    alt={c.userName || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm shrink-0">
                    {(c.userName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{c.userName || "User"}</span>
                    <span className="text-zinc-500 text-xs">
                      {new Date(c.$createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm mt-0.5 whitespace-pre-wrap">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
