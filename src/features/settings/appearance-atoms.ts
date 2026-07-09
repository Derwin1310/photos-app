import { startTransition } from "react";
import { atom } from "jotai";
import { UnistylesRuntime } from "react-native-unistyles";
import {
  loadAppearancePreference,
  saveAppearancePreference,
  type AppearancePreference,
} from "@/features/settings/appearance-repository";

export const appearanceHydratedAtom = atom(false);
export const appearancePreferenceAtom = atom<AppearancePreference>("system");
const appearanceHydratingAtom = atom(false);

const applyAppearancePreference = (preference: AppearancePreference) => {
  if (preference === "system") {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }

  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
};

export const hydrateAppearanceAtom = atom(null, async (get, set) => {
  if (get(appearanceHydratedAtom) || get(appearanceHydratingAtom)) {
    return;
  }

  set(appearanceHydratingAtom, true);

  try {
    const storedPreference = await loadAppearancePreference();

    applyAppearancePreference(storedPreference);
    startTransition(() => {
      set(appearancePreferenceAtom, storedPreference);
      set(appearanceHydratedAtom, true);
    });
  } catch {
    startTransition(() => {
      set(appearanceHydratedAtom, true);
    });
  } finally {
    set(appearanceHydratingAtom, false);
  }
});

export const setAppearancePreferenceAtom = atom(
  null,
  (_get, set, preference: AppearancePreference) => {
    applyAppearancePreference(preference);
    startTransition(() => {
      set(appearancePreferenceAtom, preference);
      set(appearanceHydratedAtom, true);
    });
    saveAppearancePreference(preference).catch(() => undefined);
  },
);
