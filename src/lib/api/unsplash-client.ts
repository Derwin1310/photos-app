import { getUnsplashAccessKey } from "@/lib/utils/env";
import { ApiError } from "@/lib/utils/errors";
import type { UnsplashPhoto, UnsplashSearchPage } from "@/lib/types/photos";

type UnsplashPhotoResponse = {
  id: string;
  alt_description: string | null;
  description: string | null;
  width: number;
  height: number;
  urls: {
    regular: string;
    small: string;
  };
  user: {
    name: string;
    username: string;
    location: string | null;
    profile_image: {
      small: string;
    };
  };
};

type UnsplashSearchResponse = {
  page: number;
  total_pages: number;
  total: number;
  results: UnsplashPhotoResponse[];
};

const API_BASE_URL = "https://api.unsplash.com";
const FEED_PAGE_SIZE = 10;
const SEARCH_PAGE_SIZE = 12;
const COLLECTION_PREVIEW_PAGE_SIZE = 1;

function mapPhoto(photo: UnsplashPhotoResponse): UnsplashPhoto {
  return {
    id: photo.id,
    altDescription: photo.alt_description,
    description: photo.description,
    width: photo.width,
    height: photo.height,
    imageUrl: photo.urls.regular,
    thumbUrl: photo.urls.small,
    photographer: {
      name: photo.user.name,
      username: photo.user.username,
      location: photo.user.location,
      profileImageUrl: photo.user.profile_image.small,
    },
  };
}

async function requestJson<T>(
  path: string,
  searchParams: Record<string, string>,
  signal?: AbortSignal,
) {
  const url = new URL(path, API_BASE_URL);

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${getUnsplashAccessKey()}`,
      "Accept-Version": "v1",
    },
    signal,
  });

  if (!response.ok) {
    let message = "Unsplash request failed.";

    try {
      const data = (await response.json()) as { errors?: string[] };
      message = data.errors?.[0] ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export async function fetchFeedPhotos(page: number, signal?: AbortSignal) {
  const photos = await requestJson<UnsplashPhotoResponse[]>(
    "/photos",
    {
      order_by: "popular",
      page: String(page),
      per_page: String(FEED_PAGE_SIZE),
    },
    signal,
  );

  return photos.map(mapPhoto);
}

export async function fetchSearchPhotos(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<UnsplashSearchPage> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new ApiError("Search query cannot be empty.", 400, "EMPTY_QUERY");
  }

  const response = await requestJson<UnsplashSearchResponse>(
    "/search/photos",
    {
      page: String(page),
      per_page: String(SEARCH_PAGE_SIZE),
      query: normalizedQuery,
    },
    signal,
  );

  return {
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total,
    photos: response.results.map(mapPhoto),
  };
}

export async function fetchCollectionPreview(
  query: string,
  signal?: AbortSignal,
): Promise<UnsplashPhoto | null> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return null;
  }

  const response = await requestJson<UnsplashSearchResponse>(
    "/search/photos",
    {
      page: "1",
      per_page: String(COLLECTION_PREVIEW_PAGE_SIZE),
      query: normalizedQuery,
    },
    signal,
  );

  const preview = response.results[0];

  return preview ? mapPhoto(preview) : null;
}
