import type React from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppearancePreference } from "@/features/settings/appearance-provider";
import type { AppearancePreference } from "@/features/settings/appearance-repository";
import { useLanguagePreference } from "@/i18n/language-provider";
import type { LanguagePreference } from "@/i18n/language-repository";
import { AppText } from "@/lib/components/app-text";
import { SectionHeader } from "@/lib/components/section-header";
import { motion } from "@/lib/motion/motion";
import { useEntranceAnimation } from "@/lib/motion/use-entrance-animation";
import { styles } from "./appearance-screen.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

type PreferenceOption<TValue extends string> = {
  description: string;
  label: string;
  value: TValue;
};

type AppearanceChoiceProps = {
  description: string;
  index: number;
  label: string;
  onSelect: () => void;
  selected: boolean;
};

const AppearanceChoice: React.FC<AppearanceChoiceProps> = ({
  description,
  index,
  label,
  onSelect,
  selected,
}) => {
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
};

type SavedNoticeProps = {
  label: string;
};

const SavedNotice: React.FC<SavedNoticeProps> = ({ label }) => {
  const entranceStyle = useEntranceAnimation({ distance: 8 });

  return (
    <AnimatedView
      accessibilityLiveRegion="polite"
      style={[styles.savedNotice, entranceStyle]}
    >
      <AppText style={styles.savedNoticeText} variant="bodySmall">
        {label}
      </AppText>
    </AnimatedView>
  );
};

const AppearanceScreen: React.FC = () => {
  const { preference, setPreference } = useAppearancePreference();
  const { preference: languagePreference, setPreference: setLanguagePreference } =
    useLanguagePreference();
  const { t } = useTranslation();
  const [savedPreference, setSavedPreference] = useState<AppearancePreference | null>(null);
  const [savedLanguage, setSavedLanguage] = useState<LanguagePreference | null>(null);

  const appearanceOptions: Array<PreferenceOption<AppearancePreference>> = [
    {
      description: t("settings.systemAppearanceDescription"),
      label: t("settings.systemLabel"),
      value: "system",
    },
    {
      description: t("settings.lightDescription"),
      label: t("settings.lightLabel"),
      value: "light",
    },
    {
      description: t("settings.darkDescription"),
      label: t("settings.darkLabel"),
      value: "dark",
    },
  ];

  const languageOptions: Array<PreferenceOption<LanguagePreference>> = [
    {
      description: t("settings.systemLanguageDescription"),
      label: t("settings.systemLabel"),
      value: "system",
    },
    {
      description: t("settings.englishDescription"),
      label: t("settings.englishLabel"),
      value: "en",
    },
    {
      description: t("settings.spanishDescription"),
      label: t("settings.spanishLabel"),
      value: "es",
    },
  ];

  const choosePreference = (nextPreference: AppearancePreference) => {
    setPreference(nextPreference);
    setSavedPreference(nextPreference);
  };

  const chooseLanguage = (nextPreference: LanguagePreference) => {
    setLanguagePreference(nextPreference);
    setSavedLanguage(nextPreference);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <SectionHeader
          subtitle={t("settings.appearanceSubtitle")}
          title={t("settings.appearanceTitle")}
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
        {savedPreference && (
          <SavedNotice
            label={
              t("settings.appearanceSaved", {
                label:
                  appearanceOptions.find((option) => option.value === savedPreference)?.label ??
                  t("common.selected"),
              })
            }
          />
        )}
        <SectionHeader
          subtitle={t("settings.languageSubtitle")}
          title={t("settings.languageTitle")}
        />
        <View style={styles.section}>
          {languageOptions.map((option, index) => {
            const selected = languagePreference === option.value;

            return (
              <AppearanceChoice
                key={option.value}
                description={option.description}
                index={index}
                label={option.label}
                onSelect={() => chooseLanguage(option.value)}
                selected={selected}
              />
            );
          })}
        </View>
        {savedLanguage && (
          <SavedNotice
            label={t("settings.languageSaved", {
              label:
                languageOptions.find((option) => option.value === savedLanguage)?.label ??
                t("common.selected"),
            })}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppearanceScreen;
