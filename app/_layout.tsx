import { useEffect } from "react";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Jua_400Regular } from "@expo-google-fonts/jua";
import { useFonts as useExpoFonts } from "expo-font";
import { useUnistyles } from "react-native-unistyles";
import { AppProviders } from "@/providers/app-providers";
import { Platform } from "react-native"

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 250, fade: true });

export default function RootLayout() {
  const { theme } = useUnistyles();
  const [fontsLoaded, fontError] = useExpoFonts({ Jua_400Regular });
  const baseNavigationTheme = theme.isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      background: theme.colors.background,
      border: theme.colors.border,
      card: theme.colors.surface,
      notification: theme.colors.accentSecondary,
      primary: theme.colors.accent,
      text: theme.colors.text,
    },
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProviders>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.background },
            headerShadowVisible: false,
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              color: theme.colors.text,
              fontSize: theme.typography.title.fontSize,
              fontWeight: "700",
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[query]"
            options={{
              title: "Search",
            }}
          />
          <Stack.Screen
            name="(modals)/edit-photo"
            options={{
              title: "Edit photo",
              presentation: "fullScreenModal",
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          />
          <Stack.Screen
            name="(modals)/appearance"
            options={{
              contentStyle: { backgroundColor: theme.colors.background },
              headerShown: false,
              presentation: Platform.OS === "ios" ? "formSheet" : "modal",
              sheetAllowedDetents: [0.42],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
        </Stack>
      </ThemeProvider>
    </AppProviders>
  );
}
