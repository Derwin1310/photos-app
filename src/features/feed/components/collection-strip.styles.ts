import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceBrand,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    gap: theme.space.xs,
    padding: theme.space.xs,
    width: theme.layout.collectionCard,
  },
  image: {
    backgroundColor: theme.colors.imagePlaceholder,
    borderCurve: "continuous",
    borderRadius: theme.radius.sm,
    height: theme.layout.collectionCard - theme.space.md,
    width: theme.layout.collectionCard - theme.space.md,
  },
  list: { paddingLeft: theme.space.none, paddingRight: theme.layout.screenGutter },
  root: { gap: theme.space.md },
  separator: { width: theme.space.sm },
  title: { color: theme.colors.accent, paddingHorizontal: theme.space.xxs, textTransform: "capitalize" },
}));
