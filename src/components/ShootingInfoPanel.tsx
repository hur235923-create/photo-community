import type { ShootingInfo } from "@/types/db";

const ROWS: { key: keyof ShootingInfo; label: string; icon: string }[] = [
  { key: "camera", label: "카메라", icon: "📷" },
  { key: "lens", label: "렌즈", icon: "🔭" },
  { key: "aperture", label: "조리개", icon: "🎯" },
  { key: "shutter_speed", label: "셔터 속도", icon: "⏱️" },
  { key: "iso", label: "ISO", icon: "🌗" },
  { key: "taken_at", label: "촬영 날짜", icon: "📅" },
];

export default function ShootingInfoPanel({ info }: { info: ShootingInfo }) {
  const rows = ROWS.filter((r) => info[r.key]);
  if (rows.length === 0) return null; // 전부 비면 패널 숨김

  return (
    <section className="rounded-xl border bg-muted/30 p-4">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">촬영 정보</h2>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-2 text-sm">
            <dt className="w-24 shrink-0 text-muted-foreground">
              {r.icon} {r.label}
            </dt>
            <dd className="font-medium">{info[r.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
