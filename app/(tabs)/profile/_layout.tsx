import { Settings } from "lucide-react-native";
import { router } from "expo-router";
import { TabStack } from "@/lib/navigation/tab-stack";
import { IconButton } from "@/lib/components/icon-button";

export default function ProfileTabLayout() {
  return (
    <TabStack
      headerRight={() => (
        <IconButton
          icon={Settings}
          label="Appearance settings"
          onPress={() => router.push("/(modals)/appearance")}
          variant="ghost"
        />
      )}
      title="Profile"
    />
  );
}
