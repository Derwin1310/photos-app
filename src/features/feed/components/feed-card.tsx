import type React from "react";
import { memo, useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Download, Heart, MapPin } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "@/lib/components/app-text";
import { useLikedPhotos } from "@/features/likes/liked-photos-provider";
import { usePhotoDownload } from "@/lib/hooks/use-photo-download";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { styles } from "./feed-card.styles";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledImage = withUnistyles(Image);

type FeedCardProps = {
  index?: number;
  photo: UnsplashPhoto;
};

const FeedCardBase: React.FC<FeedCardProps> = ({ index = 0, photo }) => {
  const { t } = useTranslation();
  const heartScale = useSharedValue(0);
  const likeScale = useSharedValue(1);
  const reducedMotion = useReducedMotion();
  const { theme } = useUnistyles();
  const { isLiked, likePhoto, toggleLike } = useLikedPhotos();
  const { downloadingPhotoId, downloadPhoto } = usePhotoDownload();
  const liked = isLiked(photo.id);
  const isDownloading = downloadingPhotoId === photo.id;
  const entranceStyle = useEntranceAnimation({
    delay: Math.min(index, 6) * 36,
    distance: 18,
  });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartScale.value === 0 ? 0 : 1,
    transform: [{ scale: heartScale.value }],
  }));

  const likeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: likeScale.value },
      { rotate: `${(likeScale.value - 1) * 20}deg` },
    ],
  }));

  useEffect(() => {
    if (reducedMotion) {
      likeScale.value = 1;
      return;
    }

    if (liked) {
      likeScale.value = withSequence(
        withTiming(1.18, {
          duration: motion.duration.fast,
          easing: motion.easing.quick,
        }),
        withTiming(1, {
          duration: motion.duration.fast,
          easing: motion.easing.out,
        }),
      );
    }
  }, [likeScale, liked, reducedMotion]);

  const persistLike = () => {
    if (liked) {
      return;
    }

    void likePhoto(photo).catch(() => undefined);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(220)
    .onStart(() => {
      scheduleOnRN(persistLike);
      heartScale.value = withSequence(
        withSpring(reducedMotion ? 0 : 0.92, { damping: 13, stiffness: 380, mass: 0.55 }),
        withTiming(0, { duration: reducedMotion ? 0 : 110 }),
      );
    });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <View style={styles.profile}>
        <StyledImage
          contentFit="cover"
          recyclingKey={`${photo.id}-avatar`}
          source={{ uri: photo.photographer.profileImageUrl }}
          style={styles.avatar}
          transition={180}
        />
        <View style={styles.details}>
          <AppText variant="title">
            {photo.photographer.name || t("feed.anonymous")}
          </AppText>
          <View style={styles.location}>
            <MapPin color={theme.colors.textTertiary} size={theme.size.iconXs} strokeWidth={2.2} />
            <AppText tone="muted" variant="bodySmall">
              {photo.photographer.location || t("feed.somewhere")}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.storyLine}>
        <View style={styles.storyDot} />
        <AppText style={styles.storyLabel} variant="label">
          {t("feed.freshPerspective")}
        </AppText>
      </View>

      <AppText>
        {photo.description || photo.altDescription || t("feed.noCaption")}
      </AppText>

      <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
        <View style={styles.imageContainer}>
          <StyledImage
            contentFit="cover"
            recyclingKey={`${photo.id}-photo`}
            source={{ uri: photo.imageUrl }}
            style={styles.image}
            transition={220}
          />
          <AnimatedView style={[styles.heartOverlay, heartStyle]}>
            <View style={styles.heartCircle}>
              <Heart
                color={theme.colors.accent}
                fill={theme.colors.accent}
                size={40}
                strokeWidth={2.2}
              />
            </View>
          </AnimatedView>
          <AnimatedPressable
            accessibilityLabel={liked ? t("feed.unlikePhoto") : t("feed.likePhoto")}
            accessibilityRole="button"
            accessibilityState={{ selected: liked }}
            hitSlop={8}
            onPress={() => void toggleLike(photo).catch(() => undefined)}
            style={[styles.likeButton, likeStyle]}
          >
            <Heart
              color={liked ? theme.colors.accentSecondary : theme.colors.text}
              fill={liked ? theme.colors.accentSecondary : "transparent"}
              size={22}
              strokeWidth={2.3}
            />
          </AnimatedPressable>
        </View>
      </GestureDetector>

      <View style={styles.mediaFooter}>
        <AppText
          numberOfLines={2}
          selectable
          style={styles.credit}
          tone="muted"
          variant="bodySmall"
        >
          {t("feed.photoCredit", {
            name: photo.photographer.name,
            username: photo.photographer.username,
          })}
        </AppText>
        <Pressable
          accessibilityLabel={t("downloads.saveImage")}
          accessibilityRole="button"
          accessibilityState={{ busy: isDownloading, disabled: isDownloading }}
          disabled={isDownloading}
          hitSlop={8}
          onPress={() => void downloadPhoto(photo)}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            isDownloading && styles.saveButtonDisabled,
          ]}
        >
          {isDownloading ? (
            <ActivityIndicator color={theme.colors.textSecondary} size="small" />
          ) : (
            <Download color={theme.colors.textSecondary} size={theme.size.iconSm} strokeWidth={2.3} />
          )}
          <AppText style={styles.saveButtonLabel} variant="bodySmall">
            {isDownloading ? t("common.saving") : t("common.save")}
          </AppText>
        </Pressable>
      </View>
    </AnimatedView>
  );
};

export const FeedCard = memo(FeedCardBase);
