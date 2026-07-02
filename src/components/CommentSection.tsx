import { useEffect, useState } from "react";
import { fetchComments, addComment } from "@/lib/db";
import type { Comment } from "@/types/db";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<(Comment & { nickname: string })[]>([]);
  const [text, setText] = useState("");

  function load() {
    fetchComments(postId)
      .then(setComments)
      .catch((e) => toast.error(e.message));
  }
  useEffect(load, [postId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.error("로그인이 필요합니다.");
    if (!text.trim()) return;
    try {
      await addComment(postId, user.id, text.trim());
      setText("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "댓글 등록 실패");
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-bold">댓글 {comments.length}</h2>
      {user && (
        <form onSubmit={submit} className="mb-4 space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={2}
          />
          <Button type="submit" className="ml-auto block">
            등록
          </Button>
        </form>
      )}
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border bg-white p-3">
            <p className="text-sm font-semibold">{c.nickname}</p>
            <p className="text-sm text-neutral-700">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
