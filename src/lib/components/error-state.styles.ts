import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderColor: theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    borderWidth: theme.border.default,
    gap: theme.space.md,
    padding: theme.space.xl,
  },
}));
