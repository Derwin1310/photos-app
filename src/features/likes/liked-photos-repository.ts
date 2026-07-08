import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UnsplashPhoto } from "@/lib/types/photos";

const LIKED_PHOTOS_STORAGE_KEY = "picxplorer.liked-photos";
const LIKED_PHOTOS_STORAGE_VERSION = 1;

export type LikedPhoto = UnsplashPhoto & {
  likedAt: string;
};

type LikedPhotosPayload = {
  version: typeof LIKED_PHOTOS_STORAGE_VERSION;
  photos: LikedPhoto[];
};

const sortLikedPhotos = (photos: LikedPhoto[]) =>
  [...photos].sort(
    (firstPhoto, secondPhoto) =>
      new Date(secondPhoto.likedAt).getTime() - new Date(firstPhoto.likedAt).getTime(),
  );

const normalizePayload = (value: unknown): LikedPhoto[] => {
  if (!value) {
    return [];
  }

  const payload = value as Partial<LikedPhotosPayload>;

  if (
    payload.version === LIKED_PHOTOS_STORAGE_VERSION &&
    Array.isArray(payload.photos)
  ) {
    return sortLikedPhotos(payload.photos);
  }

  return [];
};

export const loadLikedPhotos = async () => {
  const rawValue = await AsyncStorage.getItem(LIKED_PHOTOS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  const parsedValue = JSON.parse(rawValue) as LikedPhotosPayload;
  const photos = normalizePayload(parsedValue);

  await saveLikedPhotos(photos);

  return photos;
};

export const saveLikedPhotos = async (photos: LikedPhoto[]) => {
  const payload: LikedPhotosPayload = {
    version: LIKED_PHOTOS_STORAGE_VERSION,
    photos: sortLikedPhotos(photos),
  };

  await AsyncStorage.setItem(LIKED_PHOTOS_STORAGE_KEY, JSON.stringify(payload));
};

export const buildLikedPhoto = (photo: UnsplashPhoto): LikedPhoto => ({
  ...photo,
  likedAt: new Date().toISOString(),
});
