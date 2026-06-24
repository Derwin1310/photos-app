import { View } from "react-native";
import { AppButton } from "@/lib/components/app-button";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./error-state.styles";

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
  return (
    <View style={styles.card}>
      <AppText variant="headline">A small hiccup</AppText>
      <AppText selectable tone="muted">
        {message}
      </AppText>
      {onRetry ? (
        <AppButton label={actionLabel} onPress={onRetry} size="sm" />
      ) : null}
    </View>
  );
}
