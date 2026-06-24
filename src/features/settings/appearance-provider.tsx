import {
  createContext,
  startTransition,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import {
  loadAppearancePreference,
  saveAppearancePreference,
  type AppearancePreference,
} from "./appearance-repository";

type AppearanceContextValue = {
  isHydrated: boolean;
  preference: AppearancePreference;
  resolvedTheme: "dark" | "light";
  setPreference: (preference: AppearancePreference) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function applyAppearancePreference(preference: AppearancePreference) {
  if (preference === "system") {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }

  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
}

export function AppearanceProvider({ children }: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [preference, setPreferenceState] = useState<AppearancePreference>("system");
  const { rt } = useUnistyles();

  useEffect(() => {
    let mounted = true;

    loadAppearancePreference()
      .then((storedPreference) => {
        if (!mounted) {
          return;
        }

        applyAppearancePreference(storedPreference);
        startTransition(() => {
          setPreferenceState(storedPreference);
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

  const setPreference = (nextPreference: AppearancePreference) => {
    applyAppearancePreference(nextPreference);
    startTransition(() => setPreferenceState(nextPreference));
    saveAppearancePreference(nextPreference).catch(() => undefined);
  };

  const value: AppearanceContextValue = {
    isHydrated,
    preference,
    resolvedTheme: rt.themeName === "dark" ? "dark" : "light",
    setPreference,
  };

  return <AppearanceContext value={value}>{children}</AppearanceContext>;
}

export function useAppearance() {
  const value = use(AppearanceContext);

  if (!value) {
    throw new Error("useAppearance must be used inside AppearanceProvider.");
  }

  return value;
}
