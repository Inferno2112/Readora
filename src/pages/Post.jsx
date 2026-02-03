import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

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

    // Fetch related posts (simple version)
    appwriteService.getPosts().then((res) => {
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
    <div class="relative h-full w-full bg-black"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div><div class="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
    
    <div className="py-16">
      <Container>

        {/* Featured Image */}
        <div className="relative mb-12">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full max-h-[420px] object-cover rounded-2xl"
          />

          {isAuthor && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="destructive" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* 70 / 30 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT — MAIN CONTENT (70%) */}
          <article className="lg:col-span-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight text-zinc-100">
              {post.title}
            </h1>

            <div className="prose prose-invert text-white prose-zinc max-w-none">
              {parse(post.content)}
            </div>
          </article>

          {/* RIGHT — SIDEBAR (30%) */}
          <aside className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-semibold text-zinc-200">
              Related posts
            </h3>

            {relatedPosts.length === 0 && (
              <p className="text-sm text-zinc-500">
                No related posts found.
              </p>
            )}

            {relatedPosts.map((item) => (
              <Link
                key={item.$id}
                to={`/post/${item.$id}`}
                className="group block"
              >
                <div className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 hover:border-zinc-600 transition">
                  <img
                    src={appwriteService.getFileView(item.featuredImage)}
                    alt={item.title}
                    className="h-16 w-20 rounded-md object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-medium text-zinc-100 line-clamp-2 group-hover:text-zinc-300">
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
