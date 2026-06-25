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

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "EMPTY_QUERY" || error.status === 400) {
      return "Enter a collection, mood, or scene to search.";
    }

    if (error.status === 401 || error.status === 403) {
      return "PicXplorer could not reach Unsplash with the current access key. Check EXPO_PUBLIC_UNSPLASH_ACCESS_KEY and try again.";
    }

    if (error.status === 429) {
      return "Unsplash is rate limiting requests right now. Wait a moment, then try again.";
    }

    if (error.status >= 500) {
      return "Unsplash is having trouble right now. Try again in a little bit.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
