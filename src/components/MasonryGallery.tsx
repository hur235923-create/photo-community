import type { PostCard } from "@/lib/db";
import ExhibitionCard from "@/components/ExhibitionCard";

interface MasonryGalleryProps {
  items: PostCard[];
  isOwner: boolean;
  onDeleted: (postId: string) => void;
}

export default function MasonryGallery({
  items,
  isOwner,
  onDeleted,
}: MasonryGalleryProps) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {items.map((post) => (
        <ExhibitionCard
          key={post.id}
          post={post}
          isOwner={isOwner}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
