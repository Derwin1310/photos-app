import { memo, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Heart, MapPin } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "@/lib/components/app-text";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { styles } from "./feed-card.styles";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledImage = withUnistyles(Image);

type FeedCardProps = {
  index?: number;
  photo: UnsplashPhoto;
};

export const FeedCard = memo(function FeedCard({ index = 0, photo }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const heartScale = useSharedValue(0);
  const likeScale = useSharedValue(1);
  const reducedMotion = useReducedMotion();
  const { theme } = useUnistyles();
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

  function likePhoto() {
    setLiked(true);
  }

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(220)
    .onStart(() => {
      runOnJS(likePhoto)();
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
            {photo.photographer.name || "Anonymous"}
          </AppText>
          <View style={styles.location}>
            <MapPin color={theme.colors.textTertiary} size={theme.size.iconXs} strokeWidth={2.2} />
            <AppText tone="muted" variant="bodySmall">
              {photo.photographer.location || "Somewhere worth wandering"}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.storyLine}>
        <View style={styles.storyDot} />
        <AppText style={styles.storyLabel} variant="label">
          Fresh perspective
        </AppText>
      </View>

      <AppText>
        {photo.description || photo.altDescription || "No caption needed today."}
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
            accessibilityLabel={liked ? "Unlike photo" : "Like photo"}
            accessibilityRole="button"
            accessibilityState={{ selected: liked }}
            hitSlop={8}
            onPress={() => setLiked((value) => !value)}
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

      <AppText selectable tone="muted" variant="bodySmall">
        Photo by {photo.photographer.name} (@{photo.photographer.username}) on
        Unsplash
      </AppText>
    </AnimatedView>
  );
});
