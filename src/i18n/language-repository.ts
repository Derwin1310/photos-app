import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_STORAGE_KEY = "picxplorer.language-preference";

export type LanguagePreference = "en" | "es" | "system";

const isLanguagePreference = (value: string | null): value is LanguagePreference =>
  value === "en" || value === "es" || value === "system";

export async function loadLanguagePreference(): Promise<LanguagePreference> {
  const value = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isLanguagePreference(value) ? value : "system";
}

export async function saveLanguagePreference(preference: LanguagePreference) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, preference);
}
