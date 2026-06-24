import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: (
    variant: "destructive" | "primary" | "secondary" | "tertiary",
    size: "md" | "sm",
    fullWidth: boolean,
  ) => ({
    alignItems: "center",
    alignSelf: fullWidth ? "stretch" : "flex-start",
    backgroundColor:
      variant === "primary"
        ? theme.colors.accent
        : variant === "destructive"
          ? theme.colors.danger
          : variant === "secondary"
            ? theme.colors.surfaceSubtle
            : "transparent",
    borderColor: variant === "tertiary" ? theme.colors.border : "transparent",
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    borderWidth: variant === "tertiary" ? theme.border.default : 0,
    flexDirection: "row",
    gap: theme.space.xs,
    justifyContent: "center",
    minHeight: size === "md" ? theme.size.touch : theme.size.compactTouch,
    paddingHorizontal: size === "md" ? theme.space.md : theme.space.sm,
  }),
  label: (variant: "destructive" | "primary" | "secondary" | "tertiary") => ({
    color:
      variant === "primary"
        ? theme.colors.onAccent
        : variant === "destructive"
          ? theme.colors.onDanger
          : theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: "600",
  }),
  pressed: { opacity: 0.78 },
}));
