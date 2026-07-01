import type React from "react";
import {
  createContext,
  startTransition,
  use,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import i18n, { getSystemLanguage, type SupportedLanguage } from "@/i18n/i18n";
import {
  loadLanguagePreference,
  saveLanguagePreference,
  type LanguagePreference,
} from "@/i18n/language-repository";

type LanguageContextValue = {
  isHydrated: boolean;
  preference: LanguagePreference;
  resolvedLanguage: SupportedLanguage;
  setPreference: (preference: LanguagePreference) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const resolveLanguagePreference = (preference: LanguagePreference): SupportedLanguage =>
  preference === "system" ? getSystemLanguage() : preference;

type LanguageProviderProps = React.PropsWithChildren;

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [preference, setPreferenceState] = useState<LanguagePreference>("system");
  const [resolvedLanguage, setResolvedLanguage] = useState<SupportedLanguage>(
    getSystemLanguage(),
  );

  useEffect(() => {
    let mounted = true;

    loadLanguagePreference()
      .then(async (storedPreference) => {
        const nextLanguage = resolveLanguagePreference(storedPreference);

        await i18n.changeLanguage(nextLanguage);

        if (!mounted) {
          return;
        }

        startTransition(() => {
          setPreferenceState(storedPreference);
          setResolvedLanguage(nextLanguage);
          setIsHydrated(true);
        });
      })
      .catch(() => {
        if (mounted) {
          startTransition(() => setIsHydrated(true));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        return;
      }

      const nextLanguage = getSystemLanguage();

      if (nextLanguage === resolvedLanguage) {
        return;
      }

      void i18n.changeLanguage(nextLanguage);
      startTransition(() => setResolvedLanguage(nextLanguage));
    });

    return () => subscription.remove();
  }, [preference, resolvedLanguage]);

  const setPreference = (nextPreference: LanguagePreference) => {
    const nextLanguage = resolveLanguagePreference(nextPreference);

    void i18n.changeLanguage(nextLanguage);
    startTransition(() => {
      setPreferenceState(nextPreference);
      setResolvedLanguage(nextLanguage);
    });
    saveLanguagePreference(nextPreference).catch(() => undefined);
  };

  const value: LanguageContextValue = {
    isHydrated,
    preference,
    resolvedLanguage,
    setPreference,
  };

  return <LanguageContext value={value}>{children}</LanguageContext>;
};

export function useLanguage() {
  const value = use(LanguageContext);

  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return value;
}
