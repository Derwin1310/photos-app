import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => ({
  background: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  card: {
    alignSelf: "center",
    backgroundColor: "rgba(61, 40, 25, 0.76)",
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    gap: theme.space.lg,
    maxWidth: theme.layout.welcomeCardMaxWidth,
    padding: theme.space.xl,
    width: rt.screen.width - theme.space.xl,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: rt.insets.bottom + theme.space.md,
    paddingHorizontal: theme.space.md,
    paddingTop: rt.insets.top,
  },
  brandRow: { alignItems: "center", flexDirection: "row", gap: theme.space.sm },
  copy: { gap: theme.space.sm },
  icon: { borderRadius: theme.radius.md, height: theme.size.touch, overflow: "hidden", width: theme.size.touch },
  iconImage: { height: "100%", width: "100%" },
  root: { backgroundColor: theme.colors.background, flex: 1 },
  title: { maxWidth: 384 },
  startExploringButton: {
    flexDirection: "row",
    gap: theme.space.xs,
    backgroundColor: "#FCEFE5",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: theme.space.md,
    minHeight: theme.size.touch,
    borderRadius: theme.radius.md,
  },
  textButton: {
    color: "#3D2D24",
    fontSize: theme.typography.title.fontSize,
    fontWeight: "600",
  }
}));
