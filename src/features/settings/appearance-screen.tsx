import { Pressable, View } from "react-native";
import { useAppearance } from "@/features/settings/appearance-provider";
import type { AppearancePreference } from "@/features/settings/appearance-repository";
import { AppText } from "@/lib/components/app-text";
import { SectionHeader } from "@/lib/components/section-header";
import { styles } from "./appearance-screen.styles";
import { SafeAreaView } from "react-native-safe-area-context";

const appearanceOptions: Array<{
  description: string;
  label: string;
  value: AppearancePreference;
}> = [
  {
    description: "Match the appearance selected in your device settings.",
    label: "System",
    value: "system",
  },
  {
    description: "Use a bright, high-contrast gallery surface.",
    label: "Light",
    value: "light",
  },
  {
    description: "Use a dimmed interface designed for lower-light viewing.",
    label: "Dark",
    value: "dark",
  },
];

export default function AppearanceScreen() {
  const { preference, setPreference } = useAppearance();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <SectionHeader
          subtitle="Choose how PicXplorer should look on this device."
          title="Appearance"
        />
        <View style={styles.section}>
          {appearanceOptions.map((option) => {
            const selected = preference === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setPreference(option.value)}
                style={styles.choice(selected)}
              >
                <View style={styles.choiceCopy}>
                  <AppText variant="title">{option.label}</AppText>
                  <AppText tone="muted" variant="bodySmall">
                    {option.description}
                  </AppText>
                </View>
                <View style={styles.indicator(selected)}>
                  {selected ? <View style={styles.indicatorDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
