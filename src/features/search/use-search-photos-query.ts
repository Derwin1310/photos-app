import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSearchPhotos } from "@/lib/api/unsplash-client";

export function useSearchPhotosQuery(query: string) {
  return useInfiniteQuery({
    enabled: query.trim().length > 0,
    initialPageParam: 1,
    queryKey: ["search", query.trim().toLowerCase()],
    queryFn: ({ pageParam, signal }) =>
      fetchSearchPhotos(query, pageParam, signal),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
