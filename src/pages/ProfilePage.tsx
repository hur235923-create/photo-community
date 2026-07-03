import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchUserPosts, fetchCommentCount, type PostCard } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import MasonryGallery from "@/components/MasonryGallery";
import { toast } from "sonner";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [items, setItems] = useState<PostCard[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("users")
      .select("nickname, created_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setNickname(data?.nickname ?? "알 수 없음");
        setCreatedAt(data?.created_at ?? null);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchUserPosts(id), fetchCommentCount(id)])
      .then(([posts, comments]) => {
        setItems(posts);
        setCommentCount(comments);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = !!user && user.id === id;
  const photos = items.reduce((s, p) => s + p.image_count, 0);
  const likeTotal = items.reduce((s, p) => s + p.like_count, 0);
  const viewTotal = items.reduce((s, p) => s + p.view_count, 0);

  function onDeleted(postId: string) {
    setItems((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div>
      <ProfileHeader nickname={nickname} createdAt={createdAt} />
      <ProfileStats
        photos={photos}
        posts={items.length}
        comments={commentCount}
        likes={likeTotal}
        views={viewTotal}
      />
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
        전시된 작품 {items.length}점
      </h2>
      {loading ? (
        <p className="mt-10 text-center text-muted-foreground">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          아직 전시된 작품이 없습니다.
        </p>
      ) : (
        <MasonryGallery items={items} isOwner={isOwner} onDeleted={onDeleted} />
      )}
    </div>
  );
}
