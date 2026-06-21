import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeedPhotos } from "@/lib/api/unsplash-client";

const FEED_PAGE_SIZE = 10;

export function useFeedPhotosQuery() {
  return useInfiniteQuery({
    queryKey: ["feed", "photos"],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => fetchFeedPhotos(pageParam, signal),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === FEED_PAGE_SIZE ? lastPageParam + 1 : undefined,
  });
}
