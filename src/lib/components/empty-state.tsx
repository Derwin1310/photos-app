import type React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/lib/components/app-text";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./empty-state.styles";

const AnimatedView = Animated.createAnimatedComponent(View);

type EmptyStateProps = {
  title: string;
  message: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <AppText variant="headline">{title}</AppText>
      <AppText tone="muted">{message}</AppText>
    </AnimatedView>
  );
};
