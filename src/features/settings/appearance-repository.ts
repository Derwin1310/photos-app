import AsyncStorage from "@react-native-async-storage/async-storage";

const APPEARANCE_STORAGE_KEY = "picxplorer.appearance-preference";

export type AppearancePreference = "dark" | "light" | "system";

const isAppearancePreference = (value: string | null): value is AppearancePreference =>
  value === "dark" || value === "light" || value === "system";

export async function loadAppearancePreference(): Promise<AppearancePreference> {
  const value = await AsyncStorage.getItem(APPEARANCE_STORAGE_KEY);

  return isAppearancePreference(value) ? value : "system";
}

export async function saveAppearancePreference(preference: AppearancePreference) {
  await AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, preference);
}
