import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceRaised,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.card,
    gap: theme.space.sm,
    justifyContent: "center",
    padding: theme.space.xl,
  },
}));
