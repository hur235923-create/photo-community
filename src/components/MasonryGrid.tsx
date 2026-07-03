import type { PostCard } from "@/lib/db";
import PhotoTile from "@/components/PhotoTile";

interface MasonryGridProps {
  items: PostCard[];
  owner?: boolean;
  onDeleted?: (id: string) => void;
}

export default function MasonryGrid({ items, owner, onDeleted }: MasonryGridProps) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {items.map((post) => (
        <PhotoTile key={post.id} post={post} owner={owner} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
