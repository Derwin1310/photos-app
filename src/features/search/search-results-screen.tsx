import { FlashList } from "@shopify/flash-list";
import { useDeferredValue } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { ChevronLeft } from "lucide-react-native";
import { useSearchPhotosQuery } from "@/features/search/hooks/use-search-photos-query";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { formatCompactNumber } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/errors";

// ponytail: native back is unreliable after repeated collection routes; dismissTo always returns to Feed.
function BackToFeedButton() {
  return (
    <Link asChild dismissTo href="/feed">
      <Pressable
        accessibilityLabel="Back to feed"
        accessibilityRole="button"
        className="items-center justify-center rounded-full p-2"
        hitSlop={10}
      >
        <ChevronLeft color="#3a3636" size={26} strokeWidth={2.4} />
      </Pressable>
    </Link>
  );
}

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const query = params.query ?? "";
  const deferredQuery = useDeferredValue(query);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useSearchPhotosQuery(deferredQuery);

  const pages = data?.pages ?? [];
  const photos = pages.flatMap((page) => page.photos);
  const totalResults = pages[0]?.totalResults ?? 0;
  const normalizedTitle = deferredQuery.trim() || "Search";

  return (
    <View className="flex-1 bg-canvas">
      <Stack.Screen
        options={{
          title: normalizedTitle,
          headerBackVisible: false,
          headerLeft: () => <BackToFeedButton />,
        }}
      />

      <FlashList
        ListHeaderComponent={
          <View className="gap-2 px-5 pb-5 pt-6">
            <AppText variant="headline" className="capitalize">
              {normalizedTitle}
            </AppText>
            <AppText tone="muted">
              {totalResults > 0
                ? `${formatCompactNumber(totalResults)} results ready to browse`
                : "Browse a tidy grid of photo results"}
            </AppText>
          </View>
        }
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-5 pb-10"
        data={photos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isPending ? (
            <LoadingState message={`Searching for “${normalizedTitle}”...`} />
          ) : error ? (
            <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
          ) : (
            <EmptyState
              message="Try another collection name or a more specific scene."
              title="No photos found"
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <LoadingState message="Loading more results..." />
          ) : !hasNextPage && photos.length > 0 ? (
            <View className="items-center py-4">
              <AppText tone="muted">You made it to the end of the results.</AppText>
            </View>
          ) : null
        }
        numColumns={3}
        onEndReached={() => {
          if (!hasNextPage || isFetchingNextPage) {
            return;
          }

          void fetchNextPage();
        }}
        onEndReachedThreshold={0.65}
        renderItem={({ item }) => (
          <View className="flex-1 px-1.5 pb-3">
            <View className="overflow-hidden rounded-[22px] bg-surface">
              <Image
                className="aspect-[3/4] w-full"
                contentFit="cover"
                recyclingKey={item.id}
                source={{ uri: item.thumbUrl }}
                transition={180}
              />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
