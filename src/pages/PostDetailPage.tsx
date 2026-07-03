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
import ShootingInfoPanel from "@/components/ShootingInfoPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <article className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageCarousel images={images} />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">{post.title}</h1>
          <Link
            to={`/users/${post.user_id}`}
            className="mt-1 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            {post.nickname}
          </Link>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/90">
            {post.content}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <Button
              variant={liked ? "default" : "outline"}
              className={liked ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={onLike}
            >
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
        </div>

        <aside className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {cat && (
                <Badge className="text-white" style={{ backgroundColor: cat.color }}>
                  {cat.emoji} {cat.label}
                </Badge>
              )}
              <span>👁 {post.view_count}</span>
            </div>
            <ShootingInfoPanel
              info={{
                camera: post.camera,
                lens: post.lens,
                aperture: post.aperture,
                shutter_speed: post.shutter_speed,
                iso: post.iso,
                taken_at: post.taken_at,
              }}
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
