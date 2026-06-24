import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  backButton: { alignItems: "center", borderRadius: theme.radius.full, justifyContent: "center", padding: theme.space.xs },
  content: { paddingBottom: theme.space.xxxl, paddingHorizontal: theme.layout.screenGutter },
  footer: { alignItems: "center", paddingVertical: theme.space.md },
  gridItem: { flex: 1, paddingBottom: theme.space.sm, paddingHorizontal: theme.space.xxs },
  gridImage: { aspectRatio: 3 / 4, width: "100%" },
  gridSurface: {
    backgroundColor: theme.colors.imagePlaceholder,
    borderColor: theme.colors.accentSoft,
    borderCurve: "continuous",
    borderRadius: theme.radius.sm,
    borderWidth: theme.border.default,
    overflow: "hidden",
  },
  header: { gap: theme.space.xs, paddingBottom: theme.space.lg, paddingTop: theme.space.lg },
  list: { flex: 1 },
  loading: { alignItems: "center", paddingVertical: theme.space.md },
  root: { backgroundColor: theme.colors.background, flex: 1 },
}));
