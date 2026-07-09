import { useAtom, useAtomValue } from "jotai";
import {
  languageHydratedAtom,
  languagePreferenceStateAtom,
  resolvedLanguageAtom,
} from "@/i18n/language-atoms";
import type { SupportedLanguage } from "@/i18n/i18n";
import type { LanguagePreference } from "@/i18n/language-repository";

type LanguageState = {
  isHydrated: boolean;
  preference: LanguagePreference;
  resolvedLanguage: SupportedLanguage;
  setPreference: (preference: LanguagePreference) => void;
};

export const useLanguage = (): LanguageState => {
  const isHydrated = useAtomValue(languageHydratedAtom);
  const [preference, setPreference] = useAtom(languagePreferenceStateAtom);
  const resolvedLanguage = useAtomValue(resolvedLanguageAtom);

  return {
    isHydrated,
    preference,
    resolvedLanguage,
    setPreference,
  };
};

type LanguagePreferenceState = Pick<LanguageState, "preference" | "setPreference">;

export const useLanguagePreference = (): LanguagePreferenceState => {
  const [preference, setPreference] = useAtom(languagePreferenceStateAtom);

  return { preference, setPreference };
};
