import { useAtom, useAtomValue } from "jotai";
import { useUnistyles } from "react-native-unistyles";
import {
  appearanceHydratedAtom,
  appearancePreferenceStateAtom,
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
  const [preference, setPreference] = useAtom(appearancePreferenceStateAtom);
  const { rt } = useUnistyles();

  return {
    isHydrated,
    preference,
    resolvedTheme: rt.themeName === "dark" ? "dark" : "light",
    setPreference,
  };
};

type AppearancePreferenceState = Pick<AppearanceState, "preference" | "setPreference">;

export const useAppearancePreference = (): AppearancePreferenceState => {
  const [preference, setPreference] = useAtom(appearancePreferenceStateAtom);

  return { preference, setPreference };
};
