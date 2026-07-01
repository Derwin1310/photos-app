import i18n from "@/i18n/i18n";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class PhotoLibraryPermissionError extends Error {
  constructor(
    message = i18n.t("downloads.photoAccessMessage"),
    public readonly canOpenSettings = true,
  ) {
    super(message);
    this.name = "PhotoLibraryPermissionError";
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "EMPTY_QUERY" || error.status === 400) {
      return i18n.t("errors.emptyQuery");
    }

    if (error.status === 401 || error.status === 403) {
      return i18n.t("errors.unsplashAuth");
    }

    if (error.status === 429) {
      return i18n.t("errors.unsplashRateLimited");
    }

    if (error.status >= 500) {
      return i18n.t("errors.unsplashServer");
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("errors.generic");
}
