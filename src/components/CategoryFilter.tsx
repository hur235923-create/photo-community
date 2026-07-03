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
        className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
          !active
            ? "border-transparent bg-primary text-primary-foreground"
            : "bg-transparent hover:bg-accent"
        }`}
      >
        전체
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.slug}
          onClick={() => onChange(c.slug)}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
            active === c.slug
              ? "border-transparent text-white"
              : "bg-transparent hover:bg-accent"
          }`}
          style={active === c.slug ? { backgroundColor: c.color } : undefined}
        >
          {c.emoji} {c.label}
        </button>
      ))}
    </div>
  );
}
