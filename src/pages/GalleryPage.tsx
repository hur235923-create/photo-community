import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPosts, PAGE_SIZE, type PostCard } from "@/lib/db";
import PhotoCard from "@/components/PhotoCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

export default function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const category = params.get("category") ?? undefined;
  const search = params.get("search") ?? undefined;

  const [items, setItems] = useState<PostCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts({ page, category, search })
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [page, category, search]);

  function update(next: Record<string, string | undefined>) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p);
  }

  return (
    <div>
      <CategoryFilter
        active={category}
        onChange={(slug) => update({ category: slug, page: "1" })}
      />
      {search && (
        <p className="mt-3 text-sm text-muted-foreground">"{search}" 검색 결과</p>
      )}
      {loading ? (
        <p className="mt-10 text-center text-muted-foreground">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">게시글이 없습니다.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <PhotoCard key={p.id} post={p} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onChange={(p) => update({ page: String(p) })}
      />
    </div>
  );
}
