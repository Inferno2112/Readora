import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import { Query } from "appwrite";

import appwriteService from "../appwrite/config";
import { Container } from "../components";
import { Button } from "@/components/ui/button";

export default function Post() {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
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

  if (!post) return null;

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background effects */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
    
      <div className="relative py-8 sm:py-12 lg:py-16">
        <Container>

          {/* Featured Image */}
          <div className="relative mb-8 sm:mb-12">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="w-full max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-cover rounded-xl sm:rounded-2xl"
            />

            {isAuthor && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col sm:flex-row gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" onClick={deletePost} className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* 70 / 30 Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">

            {/* LEFT — MAIN CONTENT (70%) */}
            <article className="lg:col-span-8">
              <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white px-2 sm:px-0">
                {post.title}
              </h1>

              <div className="prose prose-invert text-white prose-zinc max-w-none px-2 sm:px-0 prose-sm sm:prose-base">
                {parse(post.content)}
              </div>
            </article>

            {/* RIGHT — SIDEBAR (30%) */}
            <aside className="lg:col-span-4 space-y-4 sm:space-y-6 px-2 sm:px-0">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-200">
                Related posts
              </h3>

              {relatedPosts.length === 0 && (
                <p className="text-xs sm:text-sm text-zinc-500">
                  No related posts found.
                </p>
              )}

              {relatedPosts.map((item) => (
                <Link
                  key={item.$id}
                  to={`/post/${item.$id}`}
                  className="group block"
                >
                  <div className="flex gap-3 sm:gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-600 transition">
                    <img
                      src={appwriteService.getFileView(item.featuredImage)}
                      alt={item.title}
                      className="h-14 w-16 sm:h-16 sm:w-20 rounded-md object-cover flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-zinc-100 line-clamp-2 group-hover:text-zinc-300">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </aside>
          </div>
        </Container>
      </div>
    </div>
  );
}
