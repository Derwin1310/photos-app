# PhotoSearch

PhotoSearch is an Expo SDK 56 app for discovering photos, browsing themed collections, saving camera captures locally, and exploring a sample photographer map.

## Stack

- Expo Router for file-based navigation
- TypeScript in strict mode
- NativeWind v4 with semantic theme tokens
- React Query for feed and search data
- Expo Camera, Media Library, Sharing, Image, and Splash Screen
- Oxlint for linting

## Routes

- `/` Welcome screen
- `/feed` Main photo-discovery feed
- `/map` Sample photographer map
- `/camera` Full-screen capture flow
- `/updates` Updates coming soon state
- `/profile` Local photo gallery
- `/search/[query]` Typed collection search
- `/edit-photo` Caption editor modal

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  +not-found.tsx
  (tabs)/
  (modals)/
  search/

src/
  assets/
  features/
  lib/
  providers/
  global.css
```

## Environment

Create a local `.env` file with:

```bash
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

`EXPO_PUBLIC_*` values are bundled into the client, so use an Unsplash key restricted for app usage.

## Commands

```bash
pnpm install
pnpm start
pnpm typecheck
pnpm lint
pnpm check
```

## NativeWind Setup

This project uses the stable NativeWind v4 and Tailwind CSS v3 setup:

- `tailwind.config.js`
- `metro.config.js`
- `babel.config.js`
- `src/global.css`
- `nativewind-env.d.ts`

## Notes

- Camera permission is requested in the camera route.
- Media library permission is requested only when saving a captured image.
- Gallery data is stored locally and migrated from the legacy `galleryList` payload if present.
- Expo Go should be the first validation target; create a custom build only if a native limitation requires it.
