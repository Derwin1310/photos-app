import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { downloadUnsplashPhoto } from "@/lib/utils/download-unsplash-photo";
import { getErrorMessage, PhotoLibraryPermissionError } from "@/lib/utils/errors";

const showPermissionAlert = (error: PhotoLibraryPermissionError) => {
  Alert.alert("Photo access needed", error.message, [
    { text: "Not now", style: "cancel" },
    {
      text: "Open Settings",
      onPress: () => {
        void Linking.openSettings();
      },
    },
  ]);
};

export const usePhotoDownload = () => {
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
      Alert.alert("Photo saved", "The image was saved to your phone library.");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => undefined,
      );
      if (error instanceof PhotoLibraryPermissionError) {
        showPermissionAlert(error);
      } else {
        Alert.alert("Download failed", getErrorMessage(error));
      }
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  return { downloadingPhotoId, downloadPhoto };
};
