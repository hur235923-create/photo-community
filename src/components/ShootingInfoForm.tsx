import type { ShootingInfo } from "@/types/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShootingInfoFormProps {
  value: ShootingInfo;
  onChange: (next: ShootingInfo) => void;
}

const FIELDS: {
  key: keyof ShootingInfo;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "camera", label: "카메라", placeholder: "예: SONY ILCE-7M3" },
  { key: "lens", label: "렌즈", placeholder: "예: FE 24-70mm F2.8 GM" },
  { key: "aperture", label: "조리개(F값)", placeholder: "예: f/1.8" },
  { key: "shutter_speed", label: "셔터 속도", placeholder: "예: 1/250s" },
  { key: "iso", label: "ISO", placeholder: "예: ISO 100" },
  { key: "taken_at", label: "촬영 날짜", placeholder: "", type: "date" },
];

export default function ShootingInfoForm({ value, onChange }: ShootingInfoFormProps) {
  function set(key: keyof ShootingInfo, v: string) {
    onChange({ ...value, [key]: v === "" ? null : v });
  }
  return (
    <fieldset className="space-y-3 rounded-xl border p-4">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">
        📷 촬영 정보 (선택)
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1">
            <Label>{f.label}</Label>
            <Input
              type={f.type ?? "text"}
              value={value[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
