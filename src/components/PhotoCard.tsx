import { Link } from "react-router-dom";
import { getCategory } from "@/lib/category";
import type { PostCard } from "@/lib/db";

export default function PhotoCard({ post }: { post: PostCard }) {
  const cat = getCategory(post.category);
  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            이미지 없음
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          {cat && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            ♥ {post.like_count}
          </span>
        </div>
        <h3 className="mt-2 truncate font-semibold">{post.title}</h3>
        <p className="truncate text-sm text-muted-foreground">{post.nickname}</p>
      </div>
    </Link>
  );
}
