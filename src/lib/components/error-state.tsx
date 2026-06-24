import { Pressable, View } from "react-native";
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
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={onRetry}
        >
          <AppText tone="inverse" variant="subheading">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
