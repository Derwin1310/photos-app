import type React from "react";
import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { AppText } from "@/lib/components/app-text";
import { useUnistyles } from "react-native-unistyles";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./loading-state.styles";

const AnimatedView = Animated.createAnimatedComponent(View);

type LoadingStateProps = {
  message?: string;
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
}) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <ActivityIndicator color={theme.colors.accent} size="small" />
      <AppText center tone="muted">
        {message ?? t("common.loadingFreshPhotos")}
      </AppText>
    </AnimatedView>
  );
};
