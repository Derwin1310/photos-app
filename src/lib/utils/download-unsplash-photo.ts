import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { saveToLibraryAsync } from "expo-media-library/legacy";
import { Platform } from "react-native";
import type { UnsplashPhoto } from "@/lib/types/photos";
import { getUnsplashAccessKey } from "@/lib/utils/env";
import { ApiError, PhotoLibraryPermissionError } from "@/lib/utils/errors";

type UnsplashDownloadResponse = {
  url?: string;
};

const getFilename = (photo: UnsplashPhoto, url: string) => {
  const extension = new URL(url).pathname.split(".").at(-1);
  const safeExtension = extension && extension.length <= 5 ? extension : "jpg";

  return `picxplorer-${photo.id}-${Date.now()}.${safeExtension}`;
};

const trackUnsplashDownload = async (photo: UnsplashPhoto) => {
  const response = await fetch(photo.downloadLocation, {
    headers: {
      Authorization: `Client-ID ${getUnsplashAccessKey()}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    throw new ApiError("Could not register this Unsplash download.", response.status);
  }

  const data = (await response.json()) as UnsplashDownloadResponse;

  return data.url;
};

const ensureMediaLibraryPermission = async () => {
  if (Platform.OS === "ios") {
    return;
  }

  const permission = await MediaLibrary.requestPermissionsAsync(false, ["photo"]);

  if (!permission.granted) {
    throw new PhotoLibraryPermissionError();
  }
};

const saveDownloadedFile = async (uri: string) => {
  try {
    await saveToLibraryAsync(uri);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (/permission|access|authorize|denied/i.test(message)) {
      throw new PhotoLibraryPermissionError();
    }

    throw error;
  }
};

export const downloadUnsplashPhoto = async (photo: UnsplashPhoto) => {
  await ensureMediaLibraryPermission();

  const trackedDownloadUrl = await trackUnsplashDownload(photo);
  const downloadUrl = trackedDownloadUrl ?? (photo.fullImageUrl || photo.imageUrl);
  const file = new File(Paths.cache, getFilename(photo, downloadUrl));
  const downloadedFile = await File.downloadFileAsync(downloadUrl, file, {
    idempotent: true,
  });

  await saveDownloadedFile(downloadedFile.uri);
};
