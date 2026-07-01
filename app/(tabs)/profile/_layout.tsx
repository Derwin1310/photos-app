import { Settings } from "lucide-react-native";
import { router } from "expo-router";
import { TabStack } from "@/lib/navigation/tab-stack";
import { IconButton } from "@/lib/components/icon-button";
import { useTranslation } from "react-i18next";

export default function ProfileTabLayout() {
  const { t } = useTranslation();

  return (
    <TabStack
      headerRight={() => (
        <IconButton
          icon={Settings}
          label={t("navigation.appearanceSettings")}
          onPress={() => router.push("/(modals)/appearance")}
          variant="ghost"
        />
      )}
      title={t("navigation.profile")}
    />
  );
}
