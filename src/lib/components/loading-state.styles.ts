import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSubtle,
    borderColor: theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    borderWidth: theme.border.default,
    gap: theme.space.sm,
    justifyContent: "center",
    padding: theme.space.xl,
  },
}));
