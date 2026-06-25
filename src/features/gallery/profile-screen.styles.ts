import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: theme.space.xs },
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    borderWidth: theme.border.default,
    gap: theme.space.md,
    padding: theme.space.md,
  },
  centered: { flex: 1, justifyContent: "center", paddingHorizontal: theme.layout.screenGutter },
  content: { paddingBottom: theme.space.xxxl, paddingHorizontal: theme.layout.screenGutter },
  header: { gap: theme.space.xl, paddingBottom: theme.space.lg, paddingTop: theme.space.lg },
  image: {
    backgroundColor: theme.colors.imagePlaceholder,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    height: theme.size.galleryThumbnail,
    width: theme.size.galleryThumbnail,
  },
  info: { flex: 1, gap: theme.space.sm, justifyContent: "space-between" },
  list: { backgroundColor: theme.colors.background, flex: 1 },
  photoRow: { flexDirection: "row", gap: theme.space.md },
  profileCard: {
    backgroundColor: theme.colors.surfaceBrand,
    borderColor: theme.colors.border,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    borderWidth: theme.border.default,
    gap: theme.space.lg,
    padding: theme.space.lg,
  },
  profileImage: {
    backgroundColor: theme.colors.imagePlaceholder,
    borderRadius: theme.radius.full,
    height: theme.size.profileAvatar,
    width: theme.size.profileAvatar,
  },
  profileInfo: { flex: 1, gap: theme.space.xxs },
  profileRow: { alignItems: "center", flexDirection: "row", gap: theme.space.md },
  separator: { height: theme.space.sm },
  stat: (index: number) => ({
    backgroundColor:
      index === 0
        ? theme.colors.accentSoft
        : index === 1
          ? theme.colors.accentSecondarySoft
          : theme.colors.accentTertiarySoft,
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    flex: 1,
    padding: theme.space.sm,
  }),
  statRow: { flexDirection: "row", gap: theme.space.xs, justifyContent: "space-between" },
  statValue: { marginTop: theme.space.sm },
}));
