import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/Avatar";
import { useState } from "react";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3">
          <Link
            to="/"
            className="shrink-0 whitespace-nowrap text-base font-extrabold text-primary sm:text-xl"
          >
            📷 사진공유
          </Link>
          <form
            className="ml-auto flex min-w-0 items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              nav(q ? `/?search=${encodeURIComponent(q)}` : "/");
            }}
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색"
              className="w-24 sm:w-56"
            />
          </form>
          {user ? (
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button className="shrink-0" onClick={() => nav("/write")}>
                글쓰기
              </Button>
              <Link
                to={`/users/${user.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-accent"
              >
                <Avatar nickname={user.nickname} size="sm" />
                <span className="hidden text-sm font-medium sm:inline">
                  {user.nickname}
                </span>
              </Link>
              <Button variant="ghost" className="shrink-0" onClick={logout}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button className="shrink-0" onClick={() => nav("/login")}>
              로그인
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
