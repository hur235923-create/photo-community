import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "@/lib/category";
import { deletePost, type PostCard } from "@/lib/db";
import { useReveal } from "@/lib/useReveal";
import { toast } from "sonner";

interface PhotoTileProps {
  post: PostCard;
  owner?: boolean;
  onDeleted?: (id: string) => void;
}

export default function PhotoTile({ post, owner = false, onDeleted }: PhotoTileProps) {
  const nav = useNavigate();
  const cat = getCategory(post.category);
  const ref = useReveal<HTMLAnchorElement>();

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 작품을 삭제하시겠습니까?")) return;
    try {
      await deletePost(post.id);
      toast.success("삭제되었습니다.");
      onDeleted?.(post.id);
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
      ref={ref}
      to={`/posts/${post.id}`}
      className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-xl bg-muted"
    >
      {post.cover_url ? (
        <img
          src={post.cover_url}
          alt={post.title}
          loading="lazy"
          className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          이미지 없음
        </div>
      )}

      {/* 데스크톱 호버 오버레이 (모바일은 hover가 없어 표시되지 않음) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {cat && (
          <span
            className="mb-1 w-fit rounded-full px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
            style={{ backgroundColor: `${cat.color}cc` }}
          >
            {cat.emoji} {cat.label}
          </span>
        )}
        <h3 className="truncate text-sm font-semibold text-white">{post.title}</h3>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-white/85">
          <span className="truncate">{post.nickname}</span>
          <span className="ml-auto shrink-0">♥ {post.like_count}</span>
          <span className="shrink-0">👁 {post.view_count}</span>
        </div>
      </div>

      {/* 본인 프로필 전용 관리 버튼 */}
      {owner && (
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
