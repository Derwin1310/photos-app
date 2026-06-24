import { Camera, House, UserRound } from "lucide-react-native";
import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";
import { AppIcon } from "@/lib/components/app-icon";

const tabs = [
  { name: "feed", title: "Feed", icon: House },
  { name: "camera", title: "Camera", icon: Camera },
  { name: "profile", title: "Profile", icon: UserRound },
] as const;

export default function TabsLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.ink,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          height: 74,
        },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: {
          color: theme.colors.ink,
          fontFamily: theme.fonts.jua,
          fontSize: 20,
        },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: theme.colors.canvas },
      }}
    >
      {tabs.map(({ icon, name, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            headerShown: name !== "camera",
            tabBarIcon: ({ color, focused }) => (
              <AppIcon
                color={color}
                icon={icon}
                size={focused ? 25 : 22}
                strokeWidth={focused ? 2.4 : 2.15}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
