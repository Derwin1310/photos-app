import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 32,
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  screen: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
}));
