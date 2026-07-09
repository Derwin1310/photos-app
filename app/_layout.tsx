import type React from "react";
import { useEffect } from "react";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Jua_400Regular } from "@expo-google-fonts/jua";
import { useFonts as useExpoFonts } from "expo-font";
import { useUnistyles } from "react-native-unistyles";
import { AppProviders } from "@/providers/app-providers";
import { Platform, View } from "react-native";
import { useAuthSession } from "@/features/auth/auth-provider";
import { LoadingState } from "@/lib/components/loading-state";
import { useTranslation } from "react-i18next";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 250, fade: true });

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthSession();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
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

  if (isLoading) {
    return (
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
          <LoadingState message={t("auth.checkingSession")} />
        </View>
      </ThemeProvider>
    );
  }

  return (
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
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[query]"
            options={{
              title: t("navigation.search"),
            }}
          />
          <Stack.Screen
            name="(modals)/edit-photo"
            options={{
              title: t("navigation.editPhoto"),
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
              sheetAllowedDetents: "fitToContents",
              sheetGrabberVisible: true,
            }}
          />
        </Stack.Protected>
        <Stack.Screen name="+not-found" options={{ title: t("navigation.notFound") }} />
      </Stack>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useExpoFonts({ Jua_400Regular });

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
      <RootNavigator />
    </AppProviders>
  );
}
