import { useAtomValue, useSetAtom } from "jotai";
import {
  likePhotoAtom,
  likedPhotosAtom,
  likedPhotosErrorAtom,
  likedPhotosHydratedAtom,
  toggleLikedPhotoAtom,
  unlikePhotoAtom,
} from "@/features/likes/liked-photos-atoms";
import type { LikedPhoto } from "@/features/likes/liked-photos-repository";
import type { UnsplashPhoto } from "@/lib/types/photos";

type LikedPhotosState = {
  error: string | null;
  hydrated: boolean;
  photos: LikedPhoto[];
  isLiked: (photoId: string) => boolean;
  likePhoto: (photo: UnsplashPhoto) => Promise<void>;
  toggleLike: (photo: UnsplashPhoto) => Promise<void>;
  unlikePhoto: (photoId: string) => Promise<void>;
};

export const useLikedPhotos = (): LikedPhotosState => {
  const error = useAtomValue(likedPhotosErrorAtom);
  const hydrated = useAtomValue(likedPhotosHydratedAtom);
  const photos = useAtomValue(likedPhotosAtom);
  const likePhoto = useSetAtom(likePhotoAtom);
  const toggleLike = useSetAtom(toggleLikedPhotoAtom);
  const unlikePhoto = useSetAtom(unlikePhotoAtom);

  return {
    error,
    hydrated,
    photos,
    isLiked: (photoId) => photos.some((photo) => photo.id === photoId),
    likePhoto,
    toggleLike,
    unlikePhoto,
  };
};
