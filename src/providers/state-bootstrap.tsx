import type React from "react";
import { useEffect } from "react";
import { AppState } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { hydrateGalleryAtom } from "@/features/gallery/gallery-atoms";
import { hydrateLikedPhotosAtom } from "@/features/likes/liked-photos-atoms";
import { hydrateAppearanceAtom } from "@/features/settings/appearance-atoms";
import {
  hydrateLanguageAtom,
  languagePreferenceAtom,
  refreshSystemLanguageAtom,
} from "@/i18n/language-atoms";

type StateBootstrapProps = React.PropsWithChildren;

export const StateBootstrap: React.FC<StateBootstrapProps> = ({ children }) => {
  const hydrateAppearance = useSetAtom(hydrateAppearanceAtom);
  const hydrateGallery = useSetAtom(hydrateGalleryAtom);
  const hydrateLanguage = useSetAtom(hydrateLanguageAtom);
  const hydrateLikedPhotos = useSetAtom(hydrateLikedPhotosAtom);
  const languagePreference = useAtomValue(languagePreferenceAtom);
  const refreshSystemLanguage = useSetAtom(refreshSystemLanguageAtom);

  useEffect(() => {
    void hydrateAppearance();
    void hydrateGallery();
    void hydrateLanguage();
    void hydrateLikedPhotos();
  }, [hydrateAppearance, hydrateGallery, hydrateLanguage, hydrateLikedPhotos]);

  useEffect(() => {
    if (languagePreference !== "system") {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshSystemLanguage();
      }
    });

    return () => subscription.remove();
  }, [languagePreference, refreshSystemLanguage]);

  return children;
};
