import { View } from "react-native";
import { AppText } from "@/lib/components/app-text";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="gap-3 rounded-[28px] bg-surface px-6 py-8">
      <AppText variant="headline">{title}</AppText>
      <AppText tone="muted">{message}</AppText>
    </View>
  );
}
