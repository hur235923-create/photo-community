import { getAvatar } from "@/lib/avatar";

interface AvatarProps {
  nickname: string;
  size?: "sm" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-sm",
  lg: "h-16 w-16 text-2xl",
} as const;

export default function Avatar({ nickname, size = "lg" }: AvatarProps) {
  const { initial, color } = getAvatar(nickname);
  return (
    <div
      className={`flex ${SIZES[size]} shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
