import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  accent: { color: theme.colors.accent },
  body: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  bodySmall: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
  center: { textAlign: "center" },
  danger: { color: theme.colors.danger },
  default: { color: theme.colors.text },
  display: {
    color: theme.colors.text,
    fontFamily: theme.font.brand,
    fontSize: theme.typography.display.fontSize,
    lineHeight: theme.typography.display.lineHeight,
  },
  headline: {
    color: theme.colors.text,
    fontSize: theme.typography.headline.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.headline.lineHeight,
  },
  inverse: { color: theme.colors.textInverse },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: "600",
    letterSpacing: theme.typography.label.letterSpacing,
    lineHeight: theme.typography.label.lineHeight,
    textTransform: "uppercase" as const,
  },
  muted: { color: theme.colors.textSecondary },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: "600",
    lineHeight: theme.typography.title.lineHeight,
  },
}));
