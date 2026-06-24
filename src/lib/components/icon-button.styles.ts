import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: (
    variant: "ghost" | "overlay" | "primary" | "surface",
    size: "md" | "sm",
    showLabel: boolean,
  ) => ({
    alignItems: "center",
    backgroundColor:
      variant === "primary"
        ? theme.colors.accent
        : variant === "overlay"
          ? theme.colors.cameraScrim
          : variant === "surface"
            ? theme.colors.surfaceSubtle
            : "transparent",
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: showLabel ? theme.space.xs : theme.space.none,
    justifyContent: "center",
    minHeight: size === "md" ? theme.size.touch : theme.size.compactTouch,
    minWidth: size === "md" ? theme.size.touch : theme.size.compactTouch,
    paddingHorizontal: showLabel ? (size === "md" ? theme.space.md : theme.space.sm) : theme.space.none,
  }),
  label: (variant: "ghost" | "overlay" | "primary" | "surface") => ({
    color: variant === "primary" || variant === "overlay" ? theme.colors.textInverse : theme.colors.text,
    fontWeight: "600",
  }),
  pressed: { opacity: 0.8 },
}));
