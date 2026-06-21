import { Pressable, View } from "react-native";
import { AppText } from "@/lib/components/app-text";

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
    <View className="gap-4 rounded-[28px] bg-surface px-6 py-8">
      <AppText variant="headline">A small hiccup</AppText>
      <AppText selectable tone="muted">
        {message}
      </AppText>
      {onRetry ? (
        <Pressable
          accessibilityRole="button"
          className="self-start rounded-full bg-accent px-5 py-3"
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
