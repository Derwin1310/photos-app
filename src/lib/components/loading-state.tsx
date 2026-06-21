import { ActivityIndicator, View } from "react-native";
import { AppText } from "@/lib/components/app-text";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading fresh photos...",
}: LoadingStateProps) {
  return (
    <View className="items-center justify-center gap-3 rounded-[28px] bg-surface/80 px-6 py-8">
      <ActivityIndicator color="#ab7e57" size="large" />
      <AppText center tone="muted">
        {message}
      </AppText>
    </View>
  );
}
