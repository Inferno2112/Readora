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
    <section className="py-16">
      <Container>

        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-3xl font-bold text-zinc-100">
            My posts
          </h1>
          <p className="mt-2 text-zinc-400">
            Articles you’ve written on Readora.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-zinc-500">Loading your posts…</p>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <p className="text-zinc-500">
            You haven’t written any posts yet.
          </p>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.$id}
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage}
              />
            ))}
          </div>
        )}

      </Container>
    </section>
  );
}
