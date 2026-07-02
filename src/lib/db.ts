import { supabase } from "./supabase";
import type { Post, PostImage, Comment } from "@/types/db";

export const PAGE_SIZE = 12;

export interface PostCard extends Post {
  cover_url: string | null;
  nickname: string;
  like_count: number;
}

// 갤러리 목록: 카테고리/검색/페이지네이션. 총 개수와 목록을 함께 반환.
export async function fetchPosts(opts: {
  page: number;
  category?: string;
  search?: string;
  userId?: string;
}): Promise<{ items: PostCard[]; total: number }> {
  const from = (opts.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabase
    .from("posts")
    .select("*, users(nickname), post_images(image_url, sort_order), likes(id)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts.category) q = q.eq("category", opts.category);
  if (opts.userId) q = q.eq("user_id", opts.userId);
  if (opts.search)
    q = q.or(`title.ilike.%${opts.search}%,content.ilike.%${opts.search}%`);

  const { data, error, count } = await q;
  if (error) throw error;

  const items: PostCard[] = (data ?? []).map((row: any) => {
    const imgs = (row.post_images ?? []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    );
    return {
      ...row,
      cover_url: imgs[0]?.image_url ?? null,
      nickname: row.users?.nickname ?? "알 수 없음",
      like_count: (row.likes ?? []).length,
    };
  });
  return { items, total: count ?? 0 };
}

export async function fetchPost(
  id: string
): Promise<(Post & { nickname: string }) | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, users(nickname)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as any),
    nickname: (data as any).users?.nickname ?? "알 수 없음",
  };
}

export async function fetchPostImages(postId: string): Promise<PostImage[]> {
  const { data, error } = await supabase
    .from("post_images")
    .select("*")
    .eq("post_id", postId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function incrementView(postId: string): Promise<void> {
  await supabase.rpc("increment_view_count", { p_post_id: postId });
}

export async function fetchComments(
  postId: string
): Promise<(Comment & { nickname: string })[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, users(nickname)")
    .eq("post_id", postId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    ...r,
    nickname: r.users?.nickname ?? "?",
  }));
}

export async function addComment(
  postId: string,
  userId: string,
  content: string
) {
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: userId, content });
  if (error) throw error;
}

// 좋아요: HEAD count 이슈 회피 위해 전체 GET 후 클라이언트 계산(모여라 패턴).
export async function fetchLikes(
  postId: string
): Promise<{ user_id: string }[]> {
  const { data, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_id", postId);
  if (error) throw error;
  return data ?? [];
}

export async function toggleLike(
  postId: string,
  userId: string,
  liked: boolean
) {
  if (liked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}
