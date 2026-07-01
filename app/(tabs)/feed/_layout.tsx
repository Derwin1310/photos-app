import { TabStack } from "@/lib/navigation/tab-stack";
import { useTranslation } from "react-i18next";

export default function FeedTabLayout() {
  const { t } = useTranslation();

  return <TabStack title={t("navigation.feed")} />;
}
