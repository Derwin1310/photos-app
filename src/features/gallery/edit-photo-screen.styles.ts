import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  actions: { flexDirection: "row", gap: theme.space.sm, justifyContent: "flex-end" },
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    borderWidth: theme.border.default,
    gap: theme.space.lg,
    padding: theme.space.lg,
  },
  error: {
    backgroundColor: theme.colors.dangerSoft,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    padding: theme.space.sm,
  },
  errorText: { color: theme.colors.onDangerSoft },
  form: { gap: theme.space.xs },
  image: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.imagePlaceholder,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    width: "100%",
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.inputBorder,
    borderWidth: theme.border.default,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    minHeight: theme.layout.captionInputMinHeight,
    padding: theme.space.md,
  },
  root: { backgroundColor: theme.colors.background, flex: 1 },
  screen: { flex: 1, justifyContent: "center", paddingBottom: theme.space.xxl, paddingHorizontal: theme.layout.screenGutter, paddingTop: theme.space.xl },
}));
