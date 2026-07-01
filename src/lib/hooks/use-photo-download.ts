import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { downloadUnsplashPhoto } from "@/lib/utils/download-unsplash-photo";
import { getErrorMessage, PhotoLibraryPermissionError } from "@/lib/utils/errors";

const showPermissionAlert = (
  error: PhotoLibraryPermissionError,
  t: TFunction,
) => {
  Alert.alert(t("downloads.photoAccessTitle"), error.message, [
    { text: t("common.notNow"), style: "cancel" },
    {
      text: t("common.openSettings"),
      onPress: () => {
        void Linking.openSettings();
      },
    },
  ]);
};

export const usePhotoDownload = () => {
  const { t } = useTranslation();
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(null);

  const downloadPhoto = async (photo: UnsplashPhoto) => {
    if (downloadingPhotoId) {
      return;
    }

    setDownloadingPhotoId(photo.id);

    try {
      await downloadUnsplashPhoto(photo);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
      Alert.alert(t("downloads.savedTitle"), t("downloads.savedMessage"));
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => undefined,
      );
      if (error instanceof PhotoLibraryPermissionError) {
        showPermissionAlert(error, t);
      } else {
        Alert.alert(t("downloads.failedTitle"), getErrorMessage(error));
      }
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  return { downloadingPhotoId, downloadPhoto };
};
