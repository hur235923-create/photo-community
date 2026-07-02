import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchPost } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPost(id).then((p) => {
      if (!p) return;
      if (user && p.user_id !== user.id) {
        toast.error("본인 글만 수정할 수 있습니다.");
        nav(`/posts/${id}`);
        return;
      }
      setTitle(p.title);
      setContent(p.content ?? "");
      setCategory(p.category);
      setReady(true);
    });
  }, [id, user, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("수정되었습니다.");
    nav(`/posts/${id}`);
  }

  if (!ready)
    return <p className="text-center text-muted-foreground">불러오는 중…</p>;

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <div className="space-y-1">
        <Label>제목</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>카테고리</Label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full rounded-md border border-[var(--input)] bg-background px-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label>내용</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full">
        저장
      </Button>
    </form>
  );
}
