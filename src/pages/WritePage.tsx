import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function WritePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (files.length === 0) return toast.error("사진을 1장 이상 올려주세요.");
    setBusy(true);
    try {
      // 1) 게시글 생성
      const { data: post, error: pErr } = await supabase
        .from("posts")
        .insert({ user_id: user.id, title, content, category })
        .select()
        .single();
      if (pErr) throw pErr;

      // 2) 이미지 업로드 → post_images insert
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = file.name.replace(/[^\w.\-]/g, "_");
        const path = `${user.id}/${post.id}/${Date.now()}_${i}_${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("post-images")
          .upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("post-images")
          .getPublicUrl(path);
        const { error: imgErr } = await supabase.from("post_images").insert({
          post_id: post.id,
          image_url: pub.publicUrl,
          storage_path: path,
          sort_order: i,
        });
        if (imgErr) throw imgErr;
      }
      toast.success("등록 완료!");
      nav(`/posts/${post.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "등록 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">글쓰기</h1>
      <div className="space-y-1">
        <Label>사진 (1장 이상)</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt=""
                className="h-20 w-20 rounded object-cover"
              />
            ))}
          </div>
        )}
      </div>
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
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "등록 중…" : "등록"}
      </Button>
    </form>
  );
}
