import { Camera, House, UserRound } from "lucide-react-native";
import { Tabs } from "expo-router";
import { AppIcon } from "@/lib/components/app-icon";

const tabs = [
  { name: "feed", title: "Feed", icon: House },
  { name: "camera", title: "Camera", icon: Camera },
  { name: "profile", title: "Profile", icon: UserRound },
] as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3a3636",
        tabBarInactiveTintColor: "#8a7d73",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#f4dfca",
          borderTopWidth: 0,
          height: 74,
        },
        headerStyle: {
          backgroundColor: "#f4dfca",
        },
        headerTitleStyle: {
          color: "#3a3636",
          fontFamily: "Jua_400Regular",
          fontSize: 20,
        },
        headerShadowVisible: false,
        sceneStyle: {
          backgroundColor: "#f6efe8",
        },
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
