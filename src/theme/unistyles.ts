import { StyleSheet } from "react-native-unistyles";

export const lightTheme = {
  colors: {
    accent: "#ab7e57",
    canvas: "#f6efe8",
    danger: "#b55151",
    dangerOverlay: "rgba(181, 81, 81, 0.9)",
    ink: "#3a3636",
    inverse: "#ffffff",
    muted: "#8a7d73",
    overlay: "rgba(0, 0, 0, 0.55)",
    overlayStrong: "rgba(0, 0, 0, 0.6)",
    surface: "#f4dfca",
    surfaceMuted: "rgba(244, 223, 202, 0.8)",
    surfaceTranslucent: "rgba(244, 223, 202, 0.9)",
  },
  fonts: {
    jua: "Jua_400Regular",
    kalam: "Kalam_400Regular",
    kalamBold: "Kalam_700Bold",
    kalamLight: "Kalam_300Light",
  },
} as const;

declare module "react-native-unistyles" {
  export interface UnistylesThemes {
    light: typeof lightTheme;
  }
}

StyleSheet.configure({
  settings: { initialTheme: "light" },
  themes: { light: lightTheme },
});
