import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [nickname, setN] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup(username, password, nickname);
      toast.success("가입 완료!");
      nav("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "가입 실패");
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">회원가입</h1>
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
      <div className="space-y-1">
        <Label>닉네임</Label>
        <Input value={nickname} onChange={(e) => setN(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        가입하기
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="text-primary">
          로그인
        </Link>
      </p>
    </form>
  );
}
