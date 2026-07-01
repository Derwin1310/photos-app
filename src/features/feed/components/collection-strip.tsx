import type React from "react";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { SectionHeader } from "@/lib/components/section-header";
import { useCollectionPreviews } from "@/features/feed/hooks/use-collection-previews";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./collection-strip.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledImage = withUnistyles(Image);
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

type CollectionCardProps = {
  collection: string;
  index: number;
  preview: ReturnType<typeof useCollectionPreviews>[number]["preview"];
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  index,
  preview,
}) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index, 5) * 34,
    distance: 10,
  });
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityHint={t("feed.browseCollection", { collection })}
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: "/search/[query]",
          params: { query: collection },
        })
      }
      onPressIn={() => {
        pressScale.value = withTiming(reducedMotion ? 1 : 0.97, {
          duration: motion.duration.fast,
          easing: motion.easing.quick,
        });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, {
          duration: motion.duration.fast,
          easing: motion.easing.out,
        });
      }}
      style={[styles.card, entranceStyle, pressStyle]}
    >
      <StyledImage
        contentFit="cover"
        recyclingKey={preview?.id ?? collection}
        source={preview ? { uri: preview.thumbUrl || preview.imageUrl } : images.collectionPlaceholder}
        style={styles.image}
        transition={180}
      />
      <AppText style={styles.title} variant="bodySmall">
        {collection}
      </AppText>
    </AnimatedPressable>
  );
};

export const CollectionStrip: React.FC = () => {
  const { t } = useTranslation();
  const collectionPreviews = useCollectionPreviews();

  return (
    <View style={styles.root}>
      <SectionHeader subtitle={t("feed.collectionsSubtitle")} title={t("feed.collectionsTitle")} />
      <StyledFlashList
        contentContainerStyle={styles.list}
        data={collectionPreviews}
        horizontal
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={({ collection }) => collection}
        renderItem={({ index, item }) => (
          <CollectionCard collection={item.collection} index={index} preview={item.preview} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
