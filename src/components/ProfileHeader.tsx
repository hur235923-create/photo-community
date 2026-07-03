import { getAvatar } from "@/lib/avatar";

interface ProfileHeaderProps {
  nickname: string;
  createdAt: string | null;
  postCount: number;
  likeTotal: number;
}

export default function ProfileHeader({
  nickname,
  createdAt,
  postCount,
  likeTotal,
}: ProfileHeaderProps) {
  const { initial, color } = getAvatar(nickname);
  const joined = createdAt
    ? `${new Date(createdAt).getFullYear()}.${String(
        new Date(createdAt).getMonth() + 1
      ).padStart(2, "0")} 가입`
    : "";

  return (
    <header className="-mx-4 mb-6 rounded-b-2xl bg-gradient-to-b from-violet-50 to-transparent px-4 pb-6 pt-8">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold">{nickname}</h1>
          <p className="text-sm text-muted-foreground">{joined}</p>
          <div className="mt-1 flex gap-4 text-sm">
            <span>
              <span className="font-semibold">📷 {postCount}</span> 작품
            </span>
            <span>
              <span className="font-semibold">♥ {likeTotal}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
