import { useAtomValue, useSetAtom } from "jotai";
import {
  addGalleryPhotoAtom,
  clearDraftPhotoAtom,
  createDraftPhotoAtom,
  deleteGalleryPhotoAtom,
  galleryDraftPhotoAtom,
  galleryErrorAtom,
  galleryHydratedAtom,
  galleryPhotoByIdAtom,
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
  const getPhoto = useAtomValue(galleryPhotoByIdAtom);
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
    getPhoto,
    restorePhoto,
    updateDraftCaption,
    updatePhoto,
  };
};

type GalleryDraftState = {
  clearDraftPhoto: () => void;
  createDraftPhoto: (uri: string) => void;
  draftPhoto: DraftPhoto | null;
};

export const useGalleryDraft = (): GalleryDraftState => {
  const draftPhoto = useAtomValue(galleryDraftPhotoAtom);
  const clearDraftPhoto = useSetAtom(clearDraftPhotoAtom);
  const createDraftPhoto = useSetAtom(createDraftPhotoAtom);

  return { clearDraftPhoto, createDraftPhoto, draftPhoto };
};

type GalleryPhotosState = {
  error: string | null;
  hydrated: boolean;
  photos: GalleryPhoto[];
  deletePhoto: (photoId: string) => Promise<void>;
  restorePhoto: (photo: GalleryPhoto) => Promise<void>;
};

export const useGalleryPhotos = (): GalleryPhotosState => {
  const error = useAtomValue(galleryErrorAtom);
  const hydrated = useAtomValue(galleryHydratedAtom);
  const photos = useAtomValue(galleryPhotosAtom);
  const deletePhoto = useSetAtom(deleteGalleryPhotoAtom);
  const restorePhoto = useSetAtom(restoreGalleryPhotoAtom);

  return { deletePhoto, error, hydrated, photos, restorePhoto };
};

type GalleryEditorState = {
  addPhoto: (uri: string, caption: string) => Promise<GalleryPhoto>;
  clearDraftPhoto: () => void;
  draftPhoto: DraftPhoto | null;
  getPhoto: (photoId: string) => GalleryPhoto | undefined;
  updateDraftCaption: (caption: string) => void;
  updatePhoto: (photoId: string, caption: string) => Promise<void>;
};

export const useGalleryEditor = (): GalleryEditorState => {
  const draftPhoto = useAtomValue(galleryDraftPhotoAtom);
  const getPhoto = useAtomValue(galleryPhotoByIdAtom);
  const addPhoto = useSetAtom(addGalleryPhotoAtom);
  const clearDraftPhoto = useSetAtom(clearDraftPhotoAtom);
  const updateDraftCaption = useSetAtom(updateDraftCaptionAtom);
  const updatePhoto = useSetAtom(updateGalleryPhotoAtom);

  return {
    addPhoto,
    clearDraftPhoto,
    draftPhoto,
    getPhoto,
    updateDraftCaption,
    updatePhoto,
  };
};
