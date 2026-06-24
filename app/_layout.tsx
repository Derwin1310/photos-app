import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Jua_400Regular } from "@expo-google-fonts/jua";
import {
  Kalam_300Light,
  Kalam_400Regular,
  Kalam_700Bold,
} from "@expo-google-fonts/kalam";
import { useFonts as useExpoFonts } from "expo-font";
import { useUnistyles } from "react-native-unistyles";
import { AppProviders } from "@/providers/app-providers";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 250, fade: true });

export default function RootLayout() {
  const { theme } = useUnistyles();
  const [fontsLoaded, fontError] = useExpoFonts({
    Jua_400Regular,
    Kalam_300Light,
    Kalam_400Regular,
    Kalam_700Bold,
  });

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
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.canvas },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.ink,
          headerTitleStyle: {
            color: theme.colors.ink,
            fontFamily: theme.fonts.jua,
            fontSize: 20,
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
            contentStyle: { backgroundColor: theme.colors.canvas },
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </AppProviders>
  );
}
