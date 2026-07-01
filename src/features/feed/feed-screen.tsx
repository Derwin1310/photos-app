import type React from "react";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated from "react-native-reanimated";
import { CollectionStrip } from "@/features/feed/components/collection-strip";
import { FeedCard } from "@/features/feed/components/feed-card";
import { useFeedPhotosQuery } from "@/features/feed/hooks/use-feed-photos-query";
import { AppIcon } from "@/lib/components/app-icon";
import { AppText } from "@/lib/components/app-text";
import { EmptyState } from "@/lib/components/empty-state";
import { ErrorState } from "@/lib/components/error-state";
import { LoadingState } from "@/lib/components/loading-state";
import { SectionHeader } from "@/lib/components/section-header";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { getErrorMessage } from "@/lib/utils/errors";
import { styles } from "./feed-screen.styles";

const AnimatedView = Animated.View;
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

const FeedListHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const headerEntranceStyle = useEntranceAnimation({ distance: 10 });

  const trimmedSearchQuery = searchQuery.trim();

  const submitSearch = () => {
    if (!trimmedSearchQuery) {
      return;
    }

    router.push({
      pathname: "/search/[query]",
      params: { query: trimmedSearchQuery },
    });
  };

  return (
    <AnimatedView style={[styles.header, headerEntranceStyle]}>
      <SectionHeader
        subtitle={t("feed.discoverSubtitle")}
        title={t("feed.discoverTitle")}
      />
      <View style={styles.searchCard}>
        <View style={styles.searchInputRow}>
          <AppIcon color={theme.colors.textTertiary} icon={Search} size={theme.size.iconMd} />
          <TextInput
            accessibilityLabel={t("feed.searchAccessibility")}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            onSubmitEditing={submitSearch}
            placeholder={t("feed.searchPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
        </View>
        <Pressable
          accessibilityLabel={t("feed.searchButton")}
          accessibilityRole="button"
          accessibilityState={{ disabled: !trimmedSearchQuery }}
          disabled={!trimmedSearchQuery}
          hitSlop={8}
          onPress={submitSearch}
          style={({ pressed }) => [
            styles.searchButton,
            !trimmedSearchQuery && styles.searchButtonDisabled,
            pressed && trimmedSearchQuery && styles.searchButtonPressed,
          ]}
        >
          <AppText
            style={[
              styles.searchButtonText,
              !trimmedSearchQuery && styles.searchButtonTextDisabled,
            ]}
            variant="bodySmall"
          >
            {t("common.search")}
          </AppText>
        </Pressable>
      </View>
      <CollectionStrip />
    </AnimatedView>
  )
}

const FeedScreen: React.FC = () => {
  const listRef = useRef<FlashListRef<UnsplashPhoto>>(null);
  const { t } = useTranslation();

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
      ListHeaderComponent={FeedListHeader}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={photos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message={t("feed.emptyMessage")}
          title={t("feed.emptyTitle")}
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.loadingFooter}>
            <LoadingState message={t("feed.loadingMore")} />
          </View>
        ) : !hasNextPage ? (
          <View style={styles.footer}>
            <SectionHeader subtitle={t("feed.footerSubtitle")} title={t("feed.footerTitle")} />
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
      renderItem={({ index, item }) => <FeedCard index={index} photo={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
};

export default FeedScreen;
