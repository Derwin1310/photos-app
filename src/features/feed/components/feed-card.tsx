import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Heart, MapPin } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "@/lib/components/app-text";
import type { UnsplashPhoto } from "@/lib/types/photos";

const AnimatedView = Animated.createAnimatedComponent(View);

type FeedCardProps = {
  photo: UnsplashPhoto;
};

export function FeedCard({ photo }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const heartScale = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartScale.value === 0 ? 0 : 1,
    transform: [{ scale: heartScale.value }],
  }));

  const likePhoto = () => {
    setLiked(true);
    Haptics.selectionAsync().catch(() => undefined);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(220)
    .onStart(() => {
      heartScale.value = withSequence(
        withSpring(0.92, { damping: 12, stiffness: 320, mass: 0.6 }),
        withTiming(0, { duration: 120 }),
      );
      runOnJS(likePhoto)();
    });

  return (
    <View className="gap-4 rounded-[32px] bg-surface px-4 py-4">
      <View className="flex-row items-center gap-3">
        <Image
          className="h-12 w-12 rounded-full border border-accent/20 bg-canvas"
          contentFit="cover"
          recyclingKey={`${photo.id}-avatar`}
          source={{ uri: photo.photographer.profileImageUrl }}
          transition={180}
        />
        <View className="flex-1">
          <AppText variant="subheading">
            {photo.photographer.name || "Anonymous"}
          </AppText>
          <View className="flex-row items-center gap-1">
            <MapPin color="#8a7d73" size={14} strokeWidth={2.2} />
            <AppText tone="muted" variant="caption">
              {photo.photographer.location || "Somewhere worth wandering"}
            </AppText>
          </View>
        </View>
      </View>

      <AppText>
        {photo.description || photo.altDescription || "No caption needed today."}
      </AppText>

      <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
        <View className="overflow-hidden rounded-[28px] bg-canvas">
          <Image
            className="aspect-[4/5] w-full"
            contentFit="cover"
            recyclingKey={`${photo.id}-photo`}
            source={{ uri: photo.imageUrl }}
            transition={220}
          />
          <AnimatedView className="absolute inset-0 items-center justify-center" style={heartStyle}>
            <View className="rounded-full bg-white/90 p-5">
              <Heart
                color="#b55151"
                fill="#b55151"
                size={40}
                strokeWidth={2.2}
              />
            </View>
          </AnimatedView>
          <Pressable
            accessibilityLabel={liked ? "Unlike photo" : "Like photo"}
            accessibilityRole="button"
            accessibilityState={{ selected: liked }}
            className="absolute bottom-4 right-4 rounded-full bg-white/90 p-3"
            hitSlop={8}
            onPress={() => setLiked((value) => !value)}
          >
            <Heart
              color={liked ? "#b55151" : "#3a3636"}
              fill={liked ? "#b55151" : "transparent"}
              size={22}
              strokeWidth={2.3}
            />
          </Pressable>
        </View>
      </GestureDetector>

      <AppText selectable tone="muted" variant="caption">
        Photo by {photo.photographer.name} (@{photo.photographer.username}) on
        Unsplash
      </AppText>
    </View>
  );
}
