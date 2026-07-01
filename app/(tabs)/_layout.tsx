import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUnistyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

const tabs = [
  {
    icon: { md: { default: "home", selected: "home" }, sf: { default: "house", selected: "house.fill" } },
    name: "feed",
    titleKey: "navigation.feed",
  },
  {
    icon: { md: { default: "photo_camera", selected: "photo_camera" }, sf: { default: "camera", selected: "camera.fill" } },
    name: "camera",
    titleKey: "navigation.camera",
  },
  {
    icon: { md: { default: "person", selected: "person" }, sf: { default: "person", selected: "person.fill" } },
    name: "profile",
    titleKey: "navigation.profile",
  },
] as const;

export default function TabsLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={theme.colors.accent}
      backgroundColor={theme.colors.surface}
      indicatorColor={theme.isDark ? theme.colors.accentSoft : theme.colors.accentSecondarySoft}
      rippleColor={theme.isDark ? theme.colors.accentPressed : theme.colors.accent}
    >
      {tabs.map(({ icon, name, titleKey }) => (
        <NativeTabs.Trigger
          disableTransparentOnScrollEdge={name === "camera"}
          key={name}
          name={name}
        >
          <NativeTabs.Trigger.Icon md={icon.md} sf={icon.sf} />
          <NativeTabs.Trigger.Label>{t(titleKey)}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
