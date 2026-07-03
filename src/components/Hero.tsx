import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { fetchFeaturedPost, type PostCard } from "@/lib/db";

export default function Hero() {
  const [post, setPost] = useState<PostCard | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedPost()
      .then(setPost)
      .catch(() => setPost(null));
  }, []);

  useEffect(() => {
    if (!post) return;
    const tl = gsap.timeline();
    if (imgRef.current)
      tl.fromTo(
        imgRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    if (textRef.current)
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
  }, [post]);

  if (!post || !post.cover_url) return null;

  return (
    <Link to={`/posts/${post.id}`} className="mb-10 block">
      <div ref={imgRef} className="relative overflow-hidden rounded-2xl">
        <img
          src={post.cover_url}
          alt={post.title}
          className="max-h-[60vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div ref={textRef} className="absolute bottom-0 left-0 p-6 sm:p-8">
          <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
            오늘의 사진
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h2>
          <p className="mt-1 text-sm text-white/85">
            {post.nickname} · ♥ {post.like_count} · 👁 {post.view_count}
          </p>
        </div>
      </div>
    </Link>
  );
}
