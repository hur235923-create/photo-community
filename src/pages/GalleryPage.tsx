import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPosts, PAGE_SIZE, type PostCard } from "@/lib/db";
import MasonryGrid from "@/components/MasonryGrid";
import Hero from "@/components/Hero";
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

  const showHero = !category && !search && page === 1;

  return (
    <div>
      {showHero && <Hero />}
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold tracking-tight">
          {search ? `"${search}" 검색 결과` : "전체 작품"}
        </h1>
        <CategoryFilter
          active={category}
          onChange={(slug) => update({ category: slug, page: "1" })}
        />
      </div>
      {loading ? (
        <p className="mt-10 text-center text-muted-foreground">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">게시글이 없습니다.</p>
      ) : (
        <MasonryGrid items={items} />
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
