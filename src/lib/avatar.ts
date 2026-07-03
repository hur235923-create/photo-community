export const AVATAR_COLORS = [
  "#6D3BEA", // violet
  "#0288D1", // blue
  "#2E7D32", // green
  "#EF6C00", // orange
  "#00897B", // teal
  "#C2185B", // pink
];

export interface Avatar {
  initial: string;
  color: string;
}

export function getAvatar(nickname: string): Avatar {
  const trimmed = nickname.trim();
  const initial = trimmed ? trimmed[0].toUpperCase() : "?";
  let sum = 0;
  for (let i = 0; i < trimmed.length; i++) sum += trimmed.charCodeAt(i);
  const color = AVATAR_COLORS[sum % AVATAR_COLORS.length];
  return { initial, color };
}
