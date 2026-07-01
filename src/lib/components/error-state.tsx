import type React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
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

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  actionLabel,
  onRetry,
}) => {
  const { t } = useTranslation();
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView style={[styles.card, entranceStyle]}>
      <AppText variant="headline">{t("states.errorTitle")}</AppText>
      <AppText selectable tone="muted">
        {message}
      </AppText>
      {onRetry ? (
        <AppButton label={actionLabel ?? t("common.tryAgain")} onPress={onRetry} size="sm" />
      ) : null}
    </AnimatedView>
  );
};
