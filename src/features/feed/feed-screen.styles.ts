import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  centered: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  content: { paddingBottom: 40, paddingHorizontal: 20 },
  footer: { alignItems: "center", paddingVertical: 24 },
  header: { gap: 24, paddingBottom: 24, paddingTop: 24 },
  intro: { gap: 8 },
  list: { backgroundColor: theme.colors.canvas, flex: 1 },
  loadingFooter: { paddingTop: 12 },
  separator: { height: 20 },
}));
