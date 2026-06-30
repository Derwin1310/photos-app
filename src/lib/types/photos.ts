export type Photographer = {
  name: string;
  username: string;
  location: string | null;
  profileImageUrl: string;
};

export type UnsplashPhoto = {
  id: string;
  altDescription: string | null;
  description: string | null;
  downloadLocation: string;
  fullImageUrl: string;
  width: number;
  height: number;
  imageUrl: string;
  thumbUrl: string;
  photographer: Photographer;
};

export type UnsplashSearchPage = {
  page: number;
  totalPages: number;
  totalResults: number;
  photos: UnsplashPhoto[];
};
