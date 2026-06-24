import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  backButton: { alignItems: "center", borderRadius: 999, justifyContent: "center", padding: 8 },
  content: { paddingBottom: 40, paddingHorizontal: 20 },
  footer: { alignItems: "center", paddingVertical: 16 },
  gridItem: { flex: 1, paddingBottom: 12, paddingHorizontal: 6 },
  gridImage: { aspectRatio: 3 / 4, width: "100%" },
  gridSurface: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 22,
    overflow: "hidden",
  },
  header: { gap: 8, paddingBottom: 20, paddingHorizontal: 20, paddingTop: 24 },
  list: { flex: 1 },
  loading: { alignItems: "center", paddingVertical: 16 },
  root: { backgroundColor: theme.colors.canvas, flex: 1 },
  title: { textTransform: "capitalize" },
}));
