import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: { gap: 8, width: 112 },
  image: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 24,
    height: 112,
    width: 112,
  },
  list: { flexDirection: "row", gap: 16, paddingRight: 24 },
  root: { gap: 16 },
  title: { textTransform: "capitalize" },
  titleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
}));
