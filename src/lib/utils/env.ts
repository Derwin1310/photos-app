export function getUnsplashAccessKey() {
  const accessKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_UNSPLASH_ACCESS_KEY. Add it to your local .env file.",
    );
  }

  return accessKey;
}
