import "@/lib/nativewind-interop";
import "../src/global.css";
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
import { AppProviders } from "@/providers/app-providers";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 250, fade: true });

export default function RootLayout() {
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
          contentStyle: {
            backgroundColor: "#f6efe8",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#f4dfca",
          },
          headerTintColor: "#3a3636",
          headerTitleStyle: {
            color: "#3a3636",
            fontFamily: "Jua_400Regular",
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
            contentStyle: {
              backgroundColor: "#f6efe8",
            },
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </AppProviders>
  );
}
