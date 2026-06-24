import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderCurve: "continuous",
    borderRadius: 28,
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
}));
