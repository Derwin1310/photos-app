import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  actions: { flexDirection: "row", gap: 12, justifyContent: "flex-end" },
  button: { backgroundColor: theme.colors.canvas, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  card: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 32,
    gap: 20,
    padding: 20,
  },
  error: {
    backgroundColor: theme.colors.dangerOverlay,
    borderCurve: "continuous",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  form: { gap: 8 },
  image: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.canvas,
    borderCurve: "continuous",
    borderRadius: 26,
    width: "100%",
  },
  input: {
    backgroundColor: theme.colors.canvas,
    borderCurve: "continuous",
    borderRadius: 24,
    color: theme.colors.ink,
    fontFamily: theme.fonts.kalam,
    fontSize: 16,
    minHeight: 112,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryButton: { backgroundColor: theme.colors.accent },
  root: { backgroundColor: theme.colors.canvas, flex: 1 },
  screen: { flex: 1, justifyContent: "center", paddingBottom: 32, paddingHorizontal: 20, paddingTop: 24 },
}));
