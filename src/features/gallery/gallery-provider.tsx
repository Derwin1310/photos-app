import type React from "react";
import {
  createContext,
  startTransition,
  use,
  useEffect,
  useState,
} from "react";
import type { GalleryPhoto } from "@/lib/types/gallery";
import {
  buildGalleryPhoto,
  loadGalleryPhotos,
  saveGalleryPhotos,
} from "@/features/gallery/gallery-repository";

type DraftPhoto = { caption: string; uri: string };

type GalleryContextValue = {
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

const GalleryContext = createContext<GalleryContextValue | null>(null);

const commitPhotos = async (
  nextPhotos: GalleryPhoto[],
  rollback: () => void,
  apply: (photos: GalleryPhoto[]) => void,
) => {
  apply(nextPhotos);

  try {
    await saveGalleryPhotos(nextPhotos);
  } catch (error) {
    rollback();
    throw error;
  }
};

type GalleryProviderProps = React.PropsWithChildren;

export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
  const [draftPhoto, setDraftPhoto] = useState<DraftPhoto | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadGalleryPhotos()
      .then((loadedPhotos) => {
        if (!mounted) {
          return;
        }

        startTransition(() => {
          setPhotos(loadedPhotos);
          setHydrated(true);
        });
      })
      .catch((galleryError) => {
        if (!mounted) {
          return;
        }

        startTransition(() => {
          setError(
            galleryError instanceof Error
              ? galleryError.message
              : "Could not load your saved gallery.",
          );
          setHydrated(true);
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const applyPhotos = (nextPhotos: GalleryPhoto[]) => {
    startTransition(() => {
      setPhotos(nextPhotos);
      setError(null);
    });
  };

  const createDraftPhoto = (uri: string) => {
    startTransition(() => {
      setDraftPhoto({ caption: "", uri });
      setError(null);
    });
  };

  const clearDraftPhoto = () => {
    startTransition(() => {
      setDraftPhoto(null);
    });
  };

  const updateDraftCaption = (caption: string) => {
    startTransition(() => {
      setDraftPhoto((currentDraft) =>
        currentDraft ? { ...currentDraft, caption } : currentDraft,
      );
    });
  };

  const addPhoto = async (uri: string, caption: string) => {
    const newPhoto = buildGalleryPhoto(uri, caption.trim());
    const previousPhotos = photos;
    const nextPhotos = [newPhoto, ...previousPhotos];

    try {
      await commitPhotos(nextPhotos, () => applyPhotos(previousPhotos), applyPhotos);
    } catch (galleryError) {
      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Could not save your photo.",
      );
      throw galleryError;
    }

    return newPhoto;
  };

  const deletePhoto = async (photoId: string) => {
    const previousPhotos = photos;
    const nextPhotos = previousPhotos.filter((photo) => photo.id !== photoId);

    try {
      await commitPhotos(nextPhotos, () => applyPhotos(previousPhotos), applyPhotos);
    } catch (galleryError) {
      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Could not delete that photo.",
      );
      throw galleryError;
    }
  };

  const restorePhoto = async (photo: GalleryPhoto) => {
    const previousPhotos = photos;
    const nextPhotos = [
      photo,
      ...previousPhotos.filter((currentPhoto) => currentPhoto.id !== photo.id),
    ];

    try {
      await commitPhotos(nextPhotos, () => applyPhotos(previousPhotos), applyPhotos);
    } catch (galleryError) {
      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Could not restore that photo.",
      );
      throw galleryError;
    }
  };

  const updatePhoto = async (photoId: string, caption: string) => {
    const previousPhotos = photos;
    const nextPhotos = previousPhotos.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            caption: caption.trim(),
            updatedAt: new Date().toISOString(),
          }
        : photo,
    );

    try {
      await commitPhotos(nextPhotos, () => applyPhotos(previousPhotos), applyPhotos);
    } catch (galleryError) {
      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Could not update that caption.",
      );
      throw galleryError;
    }
  };

  const value: GalleryContextValue = {
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

  return <GalleryContext value={value}>{children}</GalleryContext>;
};

export function useGallery() {
  const value = use(GalleryContext);

  if (!value) {
    throw new Error("useGallery must be used inside GalleryProvider.");
  }

  return value;
}
