import { startTransition } from "react";
import { atom } from "jotai";
import i18n, { getSystemLanguage, type SupportedLanguage } from "@/i18n/i18n";
import {
  loadLanguagePreference,
  saveLanguagePreference,
  type LanguagePreference,
} from "@/i18n/language-repository";

export const languageHydratedAtom = atom(false);
export const languagePreferenceAtom = atom<LanguagePreference>("system");
export const resolvedLanguageAtom = atom<SupportedLanguage>(getSystemLanguage());
const languageHydratingAtom = atom(false);

const resolveLanguagePreference = (
  preference: LanguagePreference,
): SupportedLanguage => (preference === "system" ? getSystemLanguage() : preference);

export const hydrateLanguageAtom = atom(null, async (get, set) => {
  if (get(languageHydratedAtom) || get(languageHydratingAtom)) {
    return;
  }

  set(languageHydratingAtom, true);

  try {
    const storedPreference = await loadLanguagePreference();
    const nextLanguage = resolveLanguagePreference(storedPreference);

    await i18n.changeLanguage(nextLanguage);
    startTransition(() => {
      set(languagePreferenceAtom, storedPreference);
      set(resolvedLanguageAtom, nextLanguage);
      set(languageHydratedAtom, true);
    });
  } catch {
    startTransition(() => {
      set(languageHydratedAtom, true);
    });
  } finally {
    set(languageHydratingAtom, false);
  }
});

export const setLanguagePreferenceAtom = atom(
  null,
  (_get, set, preference: LanguagePreference) => {
    const nextLanguage = resolveLanguagePreference(preference);

    void i18n.changeLanguage(nextLanguage);
    startTransition(() => {
      set(languagePreferenceAtom, preference);
      set(resolvedLanguageAtom, nextLanguage);
      set(languageHydratedAtom, true);
    });
    saveLanguagePreference(preference).catch(() => undefined);
  },
);

export const refreshSystemLanguageAtom = atom(null, (get, set) => {
  if (get(languagePreferenceAtom) !== "system") {
    return;
  }

  const nextLanguage = getSystemLanguage();

  if (nextLanguage === get(resolvedLanguageAtom)) {
    return;
  }

  void i18n.changeLanguage(nextLanguage);
  startTransition(() => {
    set(resolvedLanguageAtom, nextLanguage);
  });
});
