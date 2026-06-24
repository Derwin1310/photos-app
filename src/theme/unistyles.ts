import { StyleSheet } from "react-native-unistyles";
import { darkColors, designTokens, lightColors } from "./tokens";

export const lightTheme = {
  ...designTokens,
  colors: lightColors,
  isDark: false,
} as const;

export const darkTheme = {
  ...designTokens,
  colors: darkColors,
  isDark: true,
} as const;

declare module "react-native-unistyles" {
  export interface UnistylesThemes {
    light: typeof lightTheme;
    dark: typeof darkTheme;
  }
}

StyleSheet.configure({
  settings: { adaptiveThemes: true },
  themes: { dark: darkTheme, light: lightTheme },
});
