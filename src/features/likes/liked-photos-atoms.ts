import { startTransition } from "react";
import { atom } from "jotai";
import i18n from "@/i18n/i18n";
import type { UnsplashPhoto } from "@/lib/types/photos";
import {
  buildLikedPhoto,
  loadLikedPhotos,
  saveLikedPhotos,
  type LikedPhoto,
} from "@/features/likes/liked-photos-repository";

export const likedPhotosAtom = atom<LikedPhoto[]>([]);
export const likedPhotosErrorAtom = atom<string | null>(null);
export const likedPhotosHydratedAtom = atom(false);
const likedPhotosHydratingAtom = atom(false);
export const likedPhotoIdsAtom = atom(
  (get) => new Set(get(likedPhotosAtom).map((photo) => photo.id)),
);

const applyLikedPhotosAtom = atom(null, (_get, set, nextPhotos: LikedPhoto[]) => {
  startTransition(() => {
    set(likedPhotosAtom, nextPhotos);
    set(likedPhotosErrorAtom, null);
  });
});

export const hydrateLikedPhotosAtom = atom(null, async (get, set) => {
  if (get(likedPhotosHydratedAtom) || get(likedPhotosHydratingAtom)) {
    return;
  }

  set(likedPhotosHydratingAtom, true);

  try {
    const loadedPhotos = await loadLikedPhotos();

    startTransition(() => {
      set(likedPhotosAtom, loadedPhotos);
      set(likedPhotosHydratedAtom, true);
      set(likedPhotosErrorAtom, null);
    });
  } catch (likedPhotosError) {
    startTransition(() => {
      set(
        likedPhotosErrorAtom,
        likedPhotosError instanceof Error
          ? likedPhotosError.message
          : i18n.t("likes.couldNotLoad"),
      );
      set(likedPhotosHydratedAtom, true);
    });
  } finally {
    set(likedPhotosHydratingAtom, false);
  }
});

export const likePhotoAtom = atom(null, async (get, set, photo: UnsplashPhoto) => {
  const previousPhotos = get(likedPhotosAtom);

  if (previousPhotos.some((likedPhoto) => likedPhoto.id === photo.id)) {
    return;
  }

  const nextPhotos = [
    buildLikedPhoto(photo),
    ...previousPhotos.filter((likedPhoto) => likedPhoto.id !== photo.id),
  ];

  set(applyLikedPhotosAtom, nextPhotos);

  try {
    await saveLikedPhotos(nextPhotos);
  } catch (likedPhotosError) {
    set(applyLikedPhotosAtom, previousPhotos);
    set(
      likedPhotosErrorAtom,
      likedPhotosError instanceof Error
        ? likedPhotosError.message
        : i18n.t("likes.couldNotSave"),
    );
    throw likedPhotosError;
  }
});

export const unlikePhotoAtom = atom(null, async (get, set, photoId: string) => {
  const previousPhotos = get(likedPhotosAtom);
  const nextPhotos = previousPhotos.filter((photo) => photo.id !== photoId);

  set(applyLikedPhotosAtom, nextPhotos);

  try {
    await saveLikedPhotos(nextPhotos);
  } catch (likedPhotosError) {
    set(applyLikedPhotosAtom, previousPhotos);
    set(
      likedPhotosErrorAtom,
      likedPhotosError instanceof Error
        ? likedPhotosError.message
        : i18n.t("likes.couldNotRemove"),
    );
    throw likedPhotosError;
  }
});

export const toggleLikedPhotoAtom = atom(
  null,
  async (get, set, photo: UnsplashPhoto) => {
    const isLiked = get(likedPhotosAtom).some(
      (likedPhoto) => likedPhoto.id === photo.id,
    );

    if (isLiked) {
      await set(unlikePhotoAtom, photo.id);
      return;
    }

    await set(likePhotoAtom, photo);
  },
);
