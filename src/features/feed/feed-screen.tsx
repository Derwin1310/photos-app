import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { CollectionStrip } from "@/features/feed/components/collection-strip";
import { FeedCard } from "@/features/feed/components/feed-card";
import { useFeedPhotosQuery } from "@/features/feed/use-feed-photos-query";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { getErrorMessage } from "@/lib/utils/errors";

export default function FeedScreen() {
  const listRef = useRef<FlashListRef<UnsplashPhoto>>(null);
  const navigation = useNavigation();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = useFeedPhotosQuery();

  useEffect(() => {
    const tabNavigation = navigation as typeof navigation & {
      addListener: (event: "tabPress", callback: () => void) => () => void;
    };
    const unsubscribe = tabNavigation.addListener("tabPress", () => {
      listRef.current?.scrollToOffset?.({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation]);

  const photos = data?.pages.flat() ?? [];

  if (isPending) {
    return (
      <View className="flex-1 justify-center px-5">
        <LoadingState />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center px-5">
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </View>
    );
  }

  return (
    <FlashList
      ref={listRef}
      ListHeaderComponent={
        <View className="gap-6 pb-6 pt-6">
          <View className="gap-2">
            <AppText variant="headline">Activity feed</AppText>
            <AppText tone="muted">
              A warm stream of portraits, travel, and city stories.
            </AppText>
          </View>
          <CollectionStrip />
        </View>
      }
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message="The feed is quiet right now. Pull again for a fresh batch."
          title="No photos yet"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="pt-3">
            <LoadingState message="Fetching more inspiration..." />
          </View>
        ) : !hasNextPage ? (
          <View className="items-center py-6">
            <AppText tone="muted">You reached the end of this batch.</AppText>
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      onEndReached={() => {
        if (!hasNextPage || isFetchingNextPage) {
          return;
        }

        void fetchNextPage();
      }}
      onEndReachedThreshold={0.6}
      onRefresh={() => void refetch()}
      refreshing={isRefetching}
      renderItem={({ item }) => <FeedCard photo={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
