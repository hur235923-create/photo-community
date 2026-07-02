import { CATEGORIES } from "@/lib/category";

export default function CategoryFilter({
  active,
  onChange,
}: {
  active?: string;
  onChange: (slug?: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        className={`rounded-full border px-3 py-1 text-sm transition ${
          !active ? "bg-primary text-primary-foreground" : "bg-white hover:bg-accent"
        }`}
      >
        전체
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.slug}
          onClick={() => onChange(c.slug)}
          className={`rounded-full border px-3 py-1 text-sm transition ${
            active === c.slug ? "text-white" : "bg-white hover:bg-accent"
          }`}
          style={active === c.slug ? { backgroundColor: c.color } : undefined}
        >
          {c.emoji} {c.label}
        </button>
      ))}
    </div>
  );
}
