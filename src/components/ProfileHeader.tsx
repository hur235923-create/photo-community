import Avatar from "@/components/Avatar";

interface ProfileHeaderProps {
  nickname: string;
  createdAt: string | null;
}

export default function ProfileHeader({ nickname, createdAt }: ProfileHeaderProps) {
  const joined = createdAt
    ? `${new Date(createdAt).getFullYear()}.${String(
        new Date(createdAt).getMonth() + 1
      ).padStart(2, "0")} 가입`
    : "";

  return (
    <header className="-mx-4 mb-6 rounded-b-2xl bg-gradient-to-b from-violet-50 to-transparent px-4 pb-6 pt-8">
      <div className="flex items-center gap-4">
        <Avatar nickname={nickname} size="lg" />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold">{nickname}</h1>
          <p className="text-sm text-muted-foreground">{joined}</p>
        </div>
      </div>
    </header>
  );
}
