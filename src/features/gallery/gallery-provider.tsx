import { useAtomValue, useSetAtom } from "jotai";
import {
  addGalleryPhotoAtom,
  clearDraftPhotoAtom,
  createDraftPhotoAtom,
  deleteGalleryPhotoAtom,
  galleryDraftPhotoAtom,
  galleryErrorAtom,
  galleryHydratedAtom,
  galleryPhotosAtom,
  restoreGalleryPhotoAtom,
  updateDraftCaptionAtom,
  updateGalleryPhotoAtom,
  type DraftPhoto,
} from "@/features/gallery/gallery-atoms";
import type { GalleryPhoto } from "@/lib/types/gallery";

type GalleryState = {
  clearDraftPhoto: () => void;
  createDraftPhoto: (uri: string) => void;
  draftPhoto: DraftPhoto | null;
  error: string | null;
  hydrated: boolean;
  photos: GalleryPhoto[];
  addPhoto: (uri: string, caption: string) => Promise<GalleryPhoto>;
  deletePhoto: (photoId: string) => Promise<void>;
  getPhoto: (photoId: string) => GalleryPhoto | undefined;
  restorePhoto: (photo: GalleryPhoto) => Promise<void>;
  updateDraftCaption: (caption: string) => void;
  updatePhoto: (photoId: string, caption: string) => Promise<void>;
};

export const useGallery = (): GalleryState => {
  const draftPhoto = useAtomValue(galleryDraftPhotoAtom);
  const error = useAtomValue(galleryErrorAtom);
  const hydrated = useAtomValue(galleryHydratedAtom);
  const photos = useAtomValue(galleryPhotosAtom);
  const addPhoto = useSetAtom(addGalleryPhotoAtom);
  const clearDraftPhoto = useSetAtom(clearDraftPhotoAtom);
  const createDraftPhoto = useSetAtom(createDraftPhotoAtom);
  const deletePhoto = useSetAtom(deleteGalleryPhotoAtom);
  const restorePhoto = useSetAtom(restoreGalleryPhotoAtom);
  const updateDraftCaption = useSetAtom(updateDraftCaptionAtom);
  const updatePhoto = useSetAtom(updateGalleryPhotoAtom);

  return {
    clearDraftPhoto,
    createDraftPhoto,
    draftPhoto,
    error,
    hydrated,
    photos,
    addPhoto,
    deletePhoto,
    getPhoto: (photoId) => photos.find((photo) => photo.id === photoId),
    restorePhoto,
    updateDraftCaption,
    updatePhoto,
  };
};
