import { ActivityIndicator, View } from "react-native";
import { AppText } from "@/lib/components/app-text";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./loading-state.styles";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading fresh photos...",
}: LoadingStateProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.card}>
      <ActivityIndicator color={theme.colors.accent} size="large" />
      <AppText center tone="muted">
        {message}
      </AppText>
    </View>
  );
}
