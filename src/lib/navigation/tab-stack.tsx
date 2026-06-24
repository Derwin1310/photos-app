import type { ReactNode } from "react";
import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

type TabStackProps = {
  headerRight?: () => ReactNode;
  headerShown?: boolean;
  title: string;
};

export function TabStack({ headerRight, headerShown = true, title }: TabStackProps) {
  const { theme } = useUnistyles();

  return (
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
      <Stack.Screen name="index" options={{ headerRight, headerShown, title }} />
    </Stack>
  );
}
