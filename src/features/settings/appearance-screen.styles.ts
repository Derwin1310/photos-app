import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  choice: (selected: boolean) => ({
    alignItems: "center",
    backgroundColor: selected ? theme.colors.accentSoft : theme.colors.surfaceSubtle,
    borderColor: selected ? theme.colors.accent : theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    borderWidth: theme.border.default,
    flexDirection: "row",
    gap: theme.space.sm,
    minHeight: theme.size.touch,
    paddingHorizontal: theme.space.md,
  }),
  choiceCopy: { flex: 1, gap: theme.space.xxs },
  content: { gap: theme.space.xl, padding: theme.space.xl },
  indicator: (selected: boolean) => ({
    alignItems: "center",
    backgroundColor: selected ? theme.colors.accent : "transparent",
    borderColor: selected ? theme.colors.accent : theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: theme.border.focus,
    height: theme.size.iconMd,
    justifyContent: "center",
    width: theme.size.iconMd,
  }),
  indicatorDot: {
    backgroundColor: theme.colors.onAccent,
    borderRadius: theme.radius.full,
    height: theme.space.xs,
    width: theme.space.xs,
  },
  root: { backgroundColor: theme.colors.background, flex: 1 },
  section: { gap: theme.space.sm },
}));
