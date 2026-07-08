import type React from "react";
import {
  createContext,
  startTransition,
  use,
  useEffect,
  useState,
} from "react";
import i18n from "@/i18n/i18n";
import type { UnsplashPhoto } from "@/lib/types/photos";
import {
  buildLikedPhoto,
  loadLikedPhotos,
  saveLikedPhotos,
  type LikedPhoto,
} from "./liked-photos-repository";

type LikedPhotosContextValue = {
  error: string | null;
  hydrated: boolean;
  photos: LikedPhoto[];
  isLiked: (photoId: string) => boolean;
  likePhoto: (photo: UnsplashPhoto) => Promise<void>;
  toggleLike: (photo: UnsplashPhoto) => Promise<void>;
  unlikePhoto: (photoId: string) => Promise<void>;
};

const LikedPhotosContext = createContext<LikedPhotosContextValue | null>(null);

const commitLikedPhotos = async (
  nextPhotos: LikedPhoto[],
  rollback: () => void,
  apply: (photos: LikedPhoto[]) => void,
) => {
  apply(nextPhotos);

  try {
    await saveLikedPhotos(nextPhotos);
  } catch (error) {
    rollback();
    throw error;
  }
};

type LikedPhotosProviderProps = React.PropsWithChildren;

export const LikedPhotosProvider: React.FC<LikedPhotosProviderProps> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<LikedPhoto[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadLikedPhotos()
      .then((loadedPhotos) => {
        if (!mounted) {
          return;
        }

        startTransition(() => {
          setPhotos(loadedPhotos);
          setHydrated(true);
        });
      })
      .catch((likedPhotosError) => {
        if (!mounted) {
          return;
        }

        startTransition(() => {
          setError(
            likedPhotosError instanceof Error
              ? likedPhotosError.message
              : i18n.t("likes.couldNotLoad"),
          );
          setHydrated(true);
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const applyPhotos = (nextPhotos: LikedPhoto[]) => {
    startTransition(() => {
      setPhotos(nextPhotos);
      setError(null);
    });
  };

  const isLiked = (photoId: string) =>
    photos.some((photo) => photo.id === photoId);

  const likePhoto = async (photo: UnsplashPhoto) => {
    if (isLiked(photo.id)) {
      return;
    }

    const previousPhotos = photos;
    const nextPhotos = [
      buildLikedPhoto(photo),
      ...previousPhotos.filter((likedPhoto) => likedPhoto.id !== photo.id),
    ];

    try {
      await commitLikedPhotos(
        nextPhotos,
        () => applyPhotos(previousPhotos),
        applyPhotos,
      );
    } catch (likedPhotosError) {
      setError(
        likedPhotosError instanceof Error
          ? likedPhotosError.message
          : i18n.t("likes.couldNotSave"),
      );
      throw likedPhotosError;
    }
  };

  const unlikePhoto = async (photoId: string) => {
    const previousPhotos = photos;
    const nextPhotos = previousPhotos.filter((photo) => photo.id !== photoId);

    try {
      await commitLikedPhotos(
        nextPhotos,
        () => applyPhotos(previousPhotos),
        applyPhotos,
      );
    } catch (likedPhotosError) {
      setError(
        likedPhotosError instanceof Error
          ? likedPhotosError.message
          : i18n.t("likes.couldNotRemove"),
      );
      throw likedPhotosError;
    }
  };

  const toggleLike = async (photo: UnsplashPhoto) => {
    if (isLiked(photo.id)) {
      await unlikePhoto(photo.id);
      return;
    }

    await likePhoto(photo);
  };

  const value: LikedPhotosContextValue = {
    error,
    hydrated,
    photos,
    isLiked,
    likePhoto,
    toggleLike,
    unlikePhoto,
  };

  return <LikedPhotosContext value={value}>{children}</LikedPhotosContext>;
};

export const useLikedPhotos = () => {
  const value = use(LikedPhotosContext);

  if (!value) {
    throw new Error("useLikedPhotos must be used inside LikedPhotosProvider.");
  }

  return value;
};
