import { startTransition } from "react";
import { atom } from "jotai";
import i18n from "@/i18n/i18n";
import type { GalleryPhoto } from "@/lib/types/gallery";
import {
  buildGalleryPhoto,
  loadGalleryPhotos,
  saveGalleryPhotos,
} from "@/features/gallery/gallery-repository";

export type DraftPhoto = { caption: string; uri: string };

export const galleryDraftPhotoAtom = atom<DraftPhoto | null>(null);
export const galleryErrorAtom = atom<string | null>(null);
export const galleryHydratedAtom = atom(false);
const galleryHydratingAtom = atom(false);
export const galleryPhotosAtom = atom<GalleryPhoto[]>([]);

const applyGalleryPhotosAtom = atom(null, (_get, set, nextPhotos: GalleryPhoto[]) => {
  startTransition(() => {
    set(galleryPhotosAtom, nextPhotos);
    set(galleryErrorAtom, null);
  });
});

export const hydrateGalleryAtom = atom(null, async (get, set) => {
  if (get(galleryHydratedAtom) || get(galleryHydratingAtom)) {
    return;
  }

  set(galleryHydratingAtom, true);

  try {
    const loadedPhotos = await loadGalleryPhotos();

    startTransition(() => {
      set(galleryPhotosAtom, loadedPhotos);
      set(galleryHydratedAtom, true);
      set(galleryErrorAtom, null);
    });
  } catch (galleryError) {
    startTransition(() => {
      set(
        galleryErrorAtom,
        galleryError instanceof Error
          ? galleryError.message
          : i18n.t("gallery.couldNotLoadGallery"),
      );
      set(galleryHydratedAtom, true);
    });
  } finally {
    set(galleryHydratingAtom, false);
  }
});

export const createDraftPhotoAtom = atom(null, (_get, set, uri: string) => {
  startTransition(() => {
    set(galleryDraftPhotoAtom, { caption: "", uri });
    set(galleryErrorAtom, null);
  });
});

export const clearDraftPhotoAtom = atom(null, (_get, set) => {
  startTransition(() => {
    set(galleryDraftPhotoAtom, null);
  });
});

export const updateDraftCaptionAtom = atom(null, (_get, set, caption: string) => {
  startTransition(() => {
    set(galleryDraftPhotoAtom, (currentDraft) =>
      currentDraft ? { ...currentDraft, caption } : currentDraft,
    );
  });
});

export const addGalleryPhotoAtom = atom(
  null,
  async (get, set, uri: string, caption: string) => {
    const newPhoto = buildGalleryPhoto(uri, caption.trim());
    const previousPhotos = get(galleryPhotosAtom);
    const nextPhotos = [newPhoto, ...previousPhotos];

    set(applyGalleryPhotosAtom, nextPhotos);

    try {
      await saveGalleryPhotos(nextPhotos);
    } catch (galleryError) {
      set(applyGalleryPhotosAtom, previousPhotos);
      set(
        galleryErrorAtom,
        galleryError instanceof Error
          ? galleryError.message
          : i18n.t("gallery.couldNotSavePhoto"),
      );
      throw galleryError;
    }

    return newPhoto;
  },
);

export const deleteGalleryPhotoAtom = atom(
  null,
  async (get, set, photoId: string) => {
    const previousPhotos = get(galleryPhotosAtom);
    const nextPhotos = previousPhotos.filter((photo) => photo.id !== photoId);

    set(applyGalleryPhotosAtom, nextPhotos);

    try {
      await saveGalleryPhotos(nextPhotos);
    } catch (galleryError) {
      set(applyGalleryPhotosAtom, previousPhotos);
      set(
        galleryErrorAtom,
        galleryError instanceof Error
          ? galleryError.message
          : i18n.t("gallery.couldNotDelete"),
      );
      throw galleryError;
    }
  },
);

export const restoreGalleryPhotoAtom = atom(
  null,
  async (get, set, photo: GalleryPhoto) => {
    const previousPhotos = get(galleryPhotosAtom);
    const nextPhotos = [
      photo,
      ...previousPhotos.filter((currentPhoto) => currentPhoto.id !== photo.id),
    ];

    set(applyGalleryPhotosAtom, nextPhotos);

    try {
      await saveGalleryPhotos(nextPhotos);
    } catch (galleryError) {
      set(applyGalleryPhotosAtom, previousPhotos);
      set(
        galleryErrorAtom,
        galleryError instanceof Error
          ? galleryError.message
          : i18n.t("gallery.couldNotRestore"),
      );
      throw galleryError;
    }
  },
);

export const updateGalleryPhotoAtom = atom(
  null,
  async (get, set, photoId: string, caption: string) => {
    const previousPhotos = get(galleryPhotosAtom);
    const nextPhotos = previousPhotos.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            caption: caption.trim(),
            updatedAt: new Date().toISOString(),
          }
        : photo,
    );

    set(applyGalleryPhotosAtom, nextPhotos);

    try {
      await saveGalleryPhotos(nextPhotos);
    } catch (galleryError) {
      set(applyGalleryPhotosAtom, previousPhotos);
      set(
        galleryErrorAtom,
        galleryError instanceof Error
          ? galleryError.message
          : i18n.t("gallery.couldNotSaveCaption"),
      );
      throw galleryError;
    }
  },
);
