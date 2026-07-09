import { useAtomValue, useSetAtom } from "jotai";
import { useUnistyles } from "react-native-unistyles";
import {
  appearanceHydratedAtom,
  appearancePreferenceAtom,
  setAppearancePreferenceAtom,
} from "@/features/settings/appearance-atoms";
import type { AppearancePreference } from "@/features/settings/appearance-repository";

type AppearanceState = {
  isHydrated: boolean;
  preference: AppearancePreference;
  resolvedTheme: "dark" | "light";
  setPreference: (preference: AppearancePreference) => void;
};

export const useAppearance = (): AppearanceState => {
  const isHydrated = useAtomValue(appearanceHydratedAtom);
  const preference = useAtomValue(appearancePreferenceAtom);
  const setPreference = useSetAtom(setAppearancePreferenceAtom);
  const { rt } = useUnistyles();

  return {
    isHydrated,
    preference,
    resolvedTheme: rt.themeName === "dark" ? "dark" : "light",
    setPreference,
  };
};
