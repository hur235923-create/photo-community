import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "@/lib/category";
import { deletePost, type PostCard } from "@/lib/db";
import { toast } from "sonner";

interface ExhibitionCardProps {
  post: PostCard;
  isOwner: boolean;
  onDeleted: (postId: string) => void;
}

export default function ExhibitionCard({
  post,
  isOwner,
  onDeleted,
}: ExhibitionCardProps) {
  const nav = useNavigate();
  const cat = getCategory(post.category);

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 작품을 삭제하시겠습니까?")) return;
    try {
      await deletePost(post.id);
      toast.success("삭제되었습니다.");
      onDeleted(post.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제 실패");
    }
  }

  function onEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    nav(`/posts/${post.id}/edit`);
  }

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="overflow-hidden bg-muted">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            loading="lazy"
            className="w-full transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            이미지 없음
          </div>
        )}
      </div>

      {/* 하단 캡션 (호버 시 슬라이드 업) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center gap-2">
          {cat && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
          )}
          <span className="ml-auto text-xs text-white">♥ {post.like_count}</span>
        </div>
        <h3 className="mt-1 truncate font-semibold text-white">{post.title}</h3>
      </div>

      {/* 본인 전용 관리 버튼 (호버 시 노출) */}
      {isOwner && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium shadow hover:bg-white"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-destructive shadow hover:bg-white"
          >
            삭제
          </button>
        </div>
      )}
    </Link>
  );
}
