import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppearance } from "@/features/settings/appearance-provider";
import type { AppearancePreference } from "@/features/settings/appearance-repository";
import { AppText } from "@/lib/components/app-text";
import { SectionHeader } from "@/lib/components/section-header";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./appearance-screen.styles";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

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

type AppearanceChoiceProps = {
  description: string;
  index: number;
  label: string;
  onSelect: () => void;
  selected: boolean;
};

function AppearanceChoice({
  description,
  index,
  label,
  onSelect,
  selected,
}: AppearanceChoiceProps) {
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const entranceStyle = useEntranceAnimation({
    delay: index * 32,
    distance: 10,
  });
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onSelect}
      onPressIn={() => {
        pressScale.value = withTiming(reducedMotion ? 1 : 0.98, {
          duration: motion.duration.fast,
          easing: motion.easing.quick,
        });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, {
          duration: motion.duration.fast,
          easing: motion.easing.out,
        });
      }}
      style={[styles.choice(selected), entranceStyle, pressStyle]}
    >
      <View style={styles.choiceCopy}>
        <AppText variant="title">{label}</AppText>
        <AppText tone="muted" variant="bodySmall">
          {description}
        </AppText>
      </View>
      <View style={styles.indicator(selected)}>
        {selected ? <View style={styles.indicatorDot} /> : null}
      </View>
    </AnimatedPressable>
  );
}

function SavedNotice({ label }: { label: string }) {
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView
      accessibilityLiveRegion="polite"
      style={[styles.savedNotice, entranceStyle]}
    >
      <AppText style={styles.savedNoticeText} variant="bodySmall">
        {label} appearance saved on this device.
      </AppText>
    </AnimatedView>
  );
}

export default function AppearanceScreen() {
  const { preference, setPreference } = useAppearance();
  const [savedPreference, setSavedPreference] = useState<AppearancePreference | null>(null);

  function choosePreference(nextPreference: AppearancePreference) {
    setPreference(nextPreference);
    setSavedPreference(nextPreference);
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <SectionHeader
          subtitle="Choose how PicXplorer should look on this device."
          title="Appearance"
        />
        <View style={styles.section}>
          {appearanceOptions.map((option, index) => {
            const selected = preference === option.value;

            return (
              <AppearanceChoice
                key={option.value}
                description={option.description}
                index={index}
                label={option.label}
                onSelect={() => choosePreference(option.value)}
                selected={selected}
              />
            );
          })}
        </View>
        {savedPreference ? (
          <SavedNotice
            label={
              appearanceOptions.find((option) => option.value === savedPreference)?.label ??
              "Selected"
            }
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
