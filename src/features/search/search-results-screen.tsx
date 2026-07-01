import type React from "react";
import { FlashList } from "@shopify/flash-list";
import { useDeferredValue, useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated from "react-native-reanimated";
import { SearchPhotoViewer } from "@/features/search/components/search-photo-viewer";
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
  const { t } = useTranslation();

  return (
    <Link asChild dismissTo href="/feed">
      <Pressable
        accessibilityLabel={t("search.backToFeed")}
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
  onOpen: (index: number) => void;
  photo: UnsplashPhoto;
};

const getPhotoAccessibilityLabel = (photo: UnsplashPhoto, fallback: string) =>
  photo.altDescription ??
  photo.description ??
  fallback;

const SearchGridItem: React.FC<SearchGridItemProps> = ({
  index,
  onOpen,
  photo,
}) => {
  const { t } = useTranslation();
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index % 12, 8) * 24,
    distance: 12,
  });
  const photoLabel = getPhotoAccessibilityLabel(
    photo,
    t("search.photoBy", { name: photo.photographer.name }),
  );

  return (
    <AnimatedView style={[styles.gridItem, entranceStyle]}>
      <View style={styles.gridSurface}>
        <Pressable
          accessibilityHint={t("search.openPhotoHint")}
          accessibilityLabel={t("search.openPhoto", { label: photoLabel })}
          accessibilityRole="button"
          onPress={() => onOpen(index)}
          style={({ pressed }) => [
            styles.gridViewerTarget,
            pressed && styles.gridPressed,
          ]}
        >
          <StyledImage
            accessibilityLabel={photoLabel}
            contentFit="cover"
            recyclingKey={photo.id}
            source={{ uri: photo.thumbUrl }}
            style={styles.gridImage}
            transition={180}
          />
        </Pressable>
      </View>
    </AnimatedView>
  );
};

const SearchResultsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
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
  const normalizedTitle = deferredQuery.trim() || t("navigation.search");
  const openViewer = (photoIndex: number) => {
    setViewerIndex(photoIndex);
    setViewerVisible(true);
  };

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
                  ? t("search.resultsReady", { formattedCount: formatCompactNumber(totalResults) })
                  : t("search.browseGrid")
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
            <LoadingState message={t("search.searchingFor", { query: normalizedTitle })} />
          ) : error ? (
            <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
          ) : (
            <EmptyState
              message={t("search.noPhotosMessage")}
              title={t("search.noPhotosTitle")}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <LoadingState message={t("search.loadingMore")} />
          ) : !hasNextPage && photos.length > 0 ? (
            <View style={styles.footer}>
              <AppText tone="muted" variant="bodySmall">{t("search.endMessage")}</AppText>
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
        renderItem={({ index, item }) => (
          <SearchGridItem
            index={index}
            onOpen={openViewer}
            photo={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <SearchPhotoViewer
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
        photos={photos}
        visible={viewerVisible}
      />
    </View>
  );
};

export default SearchResultsScreen;
