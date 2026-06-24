import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 28,
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
}));
