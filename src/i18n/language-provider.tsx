import { useAtomValue, useSetAtom } from "jotai";
import {
  languageHydratedAtom,
  languagePreferenceAtom,
  resolvedLanguageAtom,
  setLanguagePreferenceAtom,
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
  const preference = useAtomValue(languagePreferenceAtom);
  const resolvedLanguage = useAtomValue(resolvedLanguageAtom);
  const setPreference = useSetAtom(setLanguagePreferenceAtom);

  return {
    isHydrated,
    preference,
    resolvedLanguage,
    setPreference,
  };
};
