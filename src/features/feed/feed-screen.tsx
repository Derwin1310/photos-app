import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { withUnistyles } from "react-native-unistyles";
import { CollectionStrip } from "@/features/feed/components/collection-strip";
import { FeedCard } from "@/features/feed/components/feed-card";
import { useFeedPhotosQuery } from "@/features/feed/hooks/use-feed-photos-query";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { SectionHeader } from "@/lib/components/section-header";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { getErrorMessage } from "@/lib/utils/errors";
import { styles } from "./feed-screen.styles";

const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

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
      <View style={styles.centered}>
        <LoadingState />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </View>
    );
  }

  return (
    <StyledFlashList
      ref={listRef}
      ListHeaderComponent={
        <View style={styles.header}>
          <SectionHeader
            subtitle="Fresh photographs from people and places worth noticing."
            title="Discover"
          />
          <CollectionStrip />
        </View>
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
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
          <View style={styles.loadingFooter}>
            <LoadingState message="Fetching more inspiration..." />
          </View>
        ) : !hasNextPage ? (
          <View style={styles.footer}>
            <SectionHeader subtitle="You are up to date." title="That is everything" />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
      style={styles.list}
    />
  );
}
