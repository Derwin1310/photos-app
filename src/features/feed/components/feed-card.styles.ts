import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  avatar: {
    backgroundColor: theme.colors.canvas,
    borderColor: "rgba(171, 126, 87, 0.2)",
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    width: 48,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderCurve: "continuous",
    borderRadius: 32,
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  details: { flex: 1 },
  heartCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 999,
    padding: 20,
  },
  heartOverlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  image: { aspectRatio: 4 / 5, width: "100%" },
  imageContainer: {
    backgroundColor: theme.colors.canvas,
    borderCurve: "continuous",
    borderRadius: 28,
    overflow: "hidden",
  },
  likeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 999,
    bottom: 16,
    padding: 12,
    position: "absolute",
    right: 16,
  },
  location: { alignItems: "center", flexDirection: "row", gap: 4 },
  profile: { alignItems: "center", flexDirection: "row", gap: 12 },
}));
