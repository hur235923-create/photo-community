import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(username, password);
      nav(loc.state?.from ?? "/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "로그인 실패");
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">로그인</h1>
      <div className="space-y-1">
        <Label>아이디</Label>
        <Input value={username} onChange={(e) => setU(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setP(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        로그인
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        계정이 없나요?{" "}
        <Link to="/signup" className="text-primary">
          회원가입
        </Link>
      </p>
    </form>
  );
}
