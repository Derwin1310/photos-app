import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GalleryPhoto } from "@/lib/types/gallery";

const GALLERY_STORAGE_KEY = "galleryList";
const GALLERY_STORAGE_VERSION = 1;

type GalleryPayload = {
  version: typeof GALLERY_STORAGE_VERSION;
  photos: GalleryPhoto[];
};

type LegacyGalleryPhoto = {
  desc?: string;
  image: string;
};

function createPhotoId(uri: string) {
  return uri;
}

function migrateLegacyPhotos(photos: LegacyGalleryPhoto[]): GalleryPhoto[] {
  return photos.map((photo, index) => {
    const timestamp = new Date(Date.now() - index * 1000).toISOString();

    return {
      id: createPhotoId(photo.image),
      uri: photo.image,
      caption: photo.desc ?? "",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

function normalizePayload(value: unknown): GalleryPhoto[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return migrateLegacyPhotos(value as LegacyGalleryPhoto[]);
  }

  const payload = value as GalleryPayload;

  if (payload.version === GALLERY_STORAGE_VERSION && Array.isArray(payload.photos)) {
    return payload.photos;
  }

  return [];
}

export async function loadGalleryPhotos() {
  const rawValue = await AsyncStorage.getItem(GALLERY_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  const parsedValue = JSON.parse(rawValue) as GalleryPayload | LegacyGalleryPhoto[];
  const photos = normalizePayload(parsedValue);

  await saveGalleryPhotos(photos);

  return photos;
}

export async function saveGalleryPhotos(photos: GalleryPhoto[]) {
  const payload: GalleryPayload = {
    version: GALLERY_STORAGE_VERSION,
    photos,
  };

  await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(payload));
}

export function buildGalleryPhoto(uri: string, caption: string): GalleryPhoto {
  const timestamp = new Date().toISOString();

  return {
    id: createPhotoId(uri),
    uri,
    caption,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
