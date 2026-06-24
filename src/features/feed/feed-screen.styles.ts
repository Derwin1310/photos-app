import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  centered: { flex: 1, justifyContent: "center", paddingHorizontal: theme.layout.screenGutter },
  content: { paddingBottom: theme.space.xxxl, paddingHorizontal: theme.layout.screenGutter },
  footer: { alignItems: "center", paddingVertical: theme.space.xl },
  header: { gap: theme.space.xl, paddingBottom: theme.space.xl, paddingTop: theme.space.lg },
  list: { backgroundColor: theme.colors.background, flex: 1 },
  loadingFooter: { paddingTop: theme.space.sm },
  separator: { height: theme.space.lg },
}));
