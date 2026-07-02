import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchPosts, PAGE_SIZE, type PostCard } from "@/lib/db";
import PhotoCard from "@/components/PhotoCard";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

export default function ProfilePage() {
  const { id } = useParams();
  const [nickname, setNickname] = useState("");
  const [items, setItems] = useState<PostCard[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("users")
      .select("nickname")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setNickname(data?.nickname ?? "알 수 없음"));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchPosts({ page, userId: id })
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch((e) => toast.error(e.message));
  }, [id, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{nickname} 님의 사진</h1>
      <p className="text-sm text-muted-foreground">총 {total}개</p>
      {items.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          아직 올린 사진이 없습니다.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <PhotoCard key={p.id} post={p} />
          ))}
        </div>
      )}
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
