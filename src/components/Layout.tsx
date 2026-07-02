import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="text-xl font-extrabold text-primary">
            📷 사진공유
          </Link>
          <form
            className="ml-auto flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              nav(q ? `/?search=${encodeURIComponent(q)}` : "/");
            }}
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색"
              className="w-36 sm:w-56"
            />
          </form>
          {user ? (
            <>
              <Button onClick={() => nav("/write")}>글쓰기</Button>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.nickname}
              </span>
              <Button variant="ghost" onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={() => nav("/login")}>로그인</Button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
