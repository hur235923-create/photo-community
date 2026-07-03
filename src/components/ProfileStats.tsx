interface ProfileStatsProps {
  photos: number;
  posts: number;
  comments: number;
  likes: number;
  views: number;
}

export default function ProfileStats({
  photos,
  posts,
  comments,
  likes,
  views,
}: ProfileStatsProps) {
  const cells = [
    { icon: "📷", label: "사진", value: photos },
    { icon: "📝", label: "게시글", value: posts },
    { icon: "💬", label: "댓글", value: comments },
    { icon: "♥", label: "받은 좋아요", value: likes },
    { icon: "👁", label: "누적 조회", value: views },
  ];
  return (
    <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border bg-white p-3 text-center shadow-sm"
        >
          <div className="text-2xl font-extrabold text-primary">{c.value}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {c.icon} {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
