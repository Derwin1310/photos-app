import type React from "react";
import { FlashList } from "@shopify/flash-list";
import { useDeferredValue } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { ChevronLeft } from "lucide-react-native";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated from "react-native-reanimated";
import { useSearchPhotosQuery } from "@/features/search/hooks/use-search-photos-query";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { SectionHeader } from "@/lib/components/section-header";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { formatCompactNumber } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/errors";
import { styles } from "./search-results-screen.styles";

const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

const BackToFeedButton: React.FC = () => {
  const { theme } = useUnistyles();

  return (
    <Link asChild dismissTo href="/feed">
      <Pressable
        accessibilityLabel="Back to feed"
        accessibilityRole="button"
        hitSlop={10}
        style={styles.backButton}
      >
        <ChevronLeft color={theme.colors.text} size={theme.size.iconLg} strokeWidth={2.4} />
      </Pressable>
    </Link>
  );
};

type SearchGridItemProps = {
  index: number;
  photo: UnsplashPhoto;
};

const SearchGridItem: React.FC<SearchGridItemProps> = ({ index, photo }) => {
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index % 12, 8) * 24,
    distance: 12,
  });

  return (
    <AnimatedView style={[styles.gridItem, entranceStyle]}>
      <View style={styles.gridSurface}>
        <StyledImage
          contentFit="cover"
          recyclingKey={photo.id}
          source={{ uri: photo.thumbUrl }}
          style={styles.gridImage}
          transition={180}
        />
      </View>
    </AnimatedView>
  );
};

const SearchResultsScreen: React.FC = () => {
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
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: normalizedTitle,
          headerBackVisible: false,
          headerLeft: () => <BackToFeedButton />,
        }}
      />

      <StyledFlashList
        ListHeaderComponent={
          <View style={styles.header}>
            <SectionHeader
              subtitle={
                totalResults > 0
                  ? `${formatCompactNumber(totalResults)} results ready to browse`
                  : "Browse a clean grid of photo results"
              }
              title={normalizedTitle}
            />
          </View>
        }
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
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
            <View style={styles.footer}>
              <AppText tone="muted" variant="bodySmall">You made it to the end of the results.</AppText>
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
        renderItem={({ index, item }) => <SearchGridItem index={index} photo={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchResultsScreen;
