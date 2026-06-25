import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/lib/components/app-text";
import { useUnistyles } from "react-native-unistyles";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./loading-state.styles";

const AnimatedView = Animated.createAnimatedComponent(View);

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading fresh photos...",
}: LoadingStateProps) {
  const { theme } = useUnistyles();
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <ActivityIndicator color={theme.colors.accent} size="small" />
      <AppText center tone="muted">
        {message}
      </AppText>
    </AnimatedView>
  );
}
