import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => ({
  background: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  card: {
    alignSelf: "center",
    backgroundColor: theme.colors.overlayStrong,
    borderCurve: "continuous",
    borderRadius: 36,
    gap: 20,
    maxWidth: 460,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: rt.screen.width - 32,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: rt.insets.bottom + 16,
    paddingHorizontal: 16,
    paddingTop: rt.insets.top,
  },
  copy: { gap: 12 },
  icon: { borderRadius: 999, height: 48, overflow: "hidden", width: 48 },
  iconImage: { height: "100%", width: "100%" },
  primaryButton: { alignSelf: "flex-start", backgroundColor: theme.colors.inverse, paddingHorizontal: 20, paddingVertical: 12 },
  root: { backgroundColor: "#000000", flex: 1 },
  title: { maxWidth: 384 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 12 },
}));
