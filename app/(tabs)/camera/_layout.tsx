import { TabStack } from "@/lib/navigation/tab-stack";
import { useTranslation } from "react-i18next";

export default function CameraTabLayout() {
  const { t } = useTranslation();

  return <TabStack headerShown={false} title={t("navigation.camera")} />;
}
