import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.card,
    gap: theme.space.md,
    padding: theme.space.xl,
  },
}));
