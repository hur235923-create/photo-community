export default function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="mt-6 flex justify-center gap-1">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 w-9 rounded-md border text-sm transition ${
            p === page ? "bg-primary text-primary-foreground" : "bg-white hover:bg-accent"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
