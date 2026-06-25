import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { Camera } from "lucide-react-native";
import { styles } from "./welcome-screen.styles";
import { AppIcon } from "@/lib/components/app-icon";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;
const StyledImage = withUnistyles(Image);

export default function WelcomeScreen() {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const cardEntranceStyle = useEntranceAnimation({ distance: 18 });
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <View style={styles.root}>
      <StyledImage contentFit="cover" source={images.homeBackground} style={styles.background} />
      <View style={styles.content}>
        <AnimatedView style={[styles.card, cardEntranceStyle]}>
          <View style={styles.brandRow}>
            <View style={styles.icon}>
              <StyledImage contentFit="cover" source={images.logo} style={styles.iconImage} />
            </View>
            <AppText tone="inverse" variant="display">
              PicXplorer
            </AppText>
          </View>

          <View style={styles.copy}>
            <AppText style={styles.title} tone="inverse" variant="headline">
              A personal gallery for the places and people you notice.
            </AppText>
            <AppText tone="inverse" variant="bodySmall">
              Browse editorial collections, capture a new frame, and keep the
              moments that matter close.
            </AppText>
          </View>


          <AnimatedPressable
            accessibilityLabel="Start exploring"
            accessibilityRole="button"
            hitSlop={8}
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
            onPress={() => router.push("/feed")}
            style={[styles.startExploringButton, pressStyle]}
          >
            <AppIcon color={theme.colors.text} icon={Camera} size={20} />
            <AppText style={styles.textButton}>Start exploring</AppText>
          </AnimatedPressable>
        </AnimatedView>
      </View>
    </View>
  );
}
