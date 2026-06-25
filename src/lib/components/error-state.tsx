import { View } from "react-native";
import Animated from "react-native-reanimated";
import { AppButton } from "@/lib/components/app-button";
import { AppText } from "@/lib/components/app-text";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./error-state.styles";

const AnimatedView = Animated.createAnimatedComponent(View);

type ErrorStateProps = {
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message,
  actionLabel = "Try again",
  onRetry,
}: ErrorStateProps) {
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <AppText variant="headline">A small hiccup</AppText>
      <AppText selectable tone="muted">
        {message}
      </AppText>
      {onRetry ? (
        <AppButton label={actionLabel} onPress={onRetry} size="sm" />
      ) : null}
    </AnimatedView>
  );
}
