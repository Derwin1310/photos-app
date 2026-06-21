import { useQueries } from "@tanstack/react-query";
import { collections } from "@/features/feed/feed-data";
import { fetchCollectionPreview } from "@/lib/api/unsplash-client";

export function useCollectionPreviews() {
  const results = useQueries({
    queries: collections.map((collection) => ({
      queryKey: ["feed", "collection-preview", collection],
      queryFn: ({ signal }: { signal?: AbortSignal }) =>
        fetchCollectionPreview(collection, signal),
      staleTime: 1000 * 60 * 30,
    })),
  });

  return collections.map((collection, index) => ({
    collection,
    preview: results[index]?.data ?? null,
  }));
}
