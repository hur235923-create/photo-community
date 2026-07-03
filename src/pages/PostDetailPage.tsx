import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchPost,
  fetchPostImages,
  fetchLikes,
  toggleLike,
  incrementView,
  deletePost,
} from "@/lib/db";
import type { Post, PostImage } from "@/types/db";
import { getCategory } from "@/lib/category";
import { useAuth } from "@/context/AuthContext";
import ImageCarousel from "@/components/ImageCarousel";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<(Post & { nickname: string }) | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [likes, setLikes] = useState<{ user_id: string }[]>([]);

  useEffect(() => {
    if (!id) return;
    incrementView(id);
    fetchPost(id)
      .then(setPost)
      .catch((e) => toast.error(e.message));
    fetchPostImages(id).then(setImages);
    fetchLikes(id).then(setLikes);
  }, [id]);

  if (!post)
    return <p className="text-center text-muted-foreground">불러오는 중…</p>;

  const cat = getCategory(post.category);
  const liked = !!user && likes.some((l) => l.user_id === user.id);
  const isOwner = !!user && user.id === post.user_id;

  async function onLike() {
    if (!user) return toast.error("로그인이 필요합니다.");
    if (!id) return;
    await toggleLike(id, user.id, liked);
    fetchLikes(id).then(setLikes);
  }

  async function onDelete() {
    if (!id || !confirm("삭제하시겠습니까?")) return;
    try {
      await deletePost(id);
      toast.success("삭제되었습니다.");
      nav("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제 실패");
    }
  }

  return (
    <article className="mx-auto max-w-3xl">
      <ImageCarousel images={images} />
      <div className="mt-4 flex items-center gap-2">
        {cat && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: cat.color }}
          >
            {cat.emoji} {cat.label}
          </span>
        )}
        <span className="text-sm text-muted-foreground">조회 {post.view_count}</span>
      </div>
      <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
      <Link to={`/users/${post.user_id}`} className="text-sm text-primary">
        {post.nickname}
      </Link>
      <p className="mt-4 whitespace-pre-wrap text-neutral-800">{post.content}</p>

      <div className="mt-6 flex items-center gap-2">
        <Button variant={liked ? "default" : "outline"} onClick={onLike}>
          ♥ 좋아요 {likes.length}
        </Button>
        {isOwner && (
          <>
            <Button variant="outline" onClick={() => nav(`/posts/${post.id}/edit`)}>
              수정
            </Button>
            <Button variant="ghost" onClick={onDelete}>
              삭제
            </Button>
          </>
        )}
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
