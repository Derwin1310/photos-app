import { View } from "react-native";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./empty-state.styles";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <AppText variant="headline">{title}</AppText>
      <AppText tone="muted">{message}</AppText>
    </View>
  );
}
