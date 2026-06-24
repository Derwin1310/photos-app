import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  accent: { color: theme.colors.accent },
  body: { fontFamily: theme.fonts.kalam, fontSize: 16 },
  caption: { fontFamily: theme.fonts.kalamLight, fontSize: 14 },
  center: { textAlign: "center" },
  danger: { color: theme.colors.danger },
  default: { color: theme.colors.ink },
  headline: { fontFamily: theme.fonts.jua, fontSize: 24, lineHeight: 29 },
  inverse: { color: theme.colors.inverse },
  label: {
    fontFamily: theme.fonts.kalamBold,
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  muted: { color: theme.colors.muted },
  subheading: { fontFamily: theme.fonts.kalamBold, fontSize: 18 },
  title: { fontFamily: theme.fonts.jua, fontSize: 36, lineHeight: 43 },
}));
