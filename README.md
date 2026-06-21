# PhotoSearch

PhotoSearch is an Expo SDK 54 app for discovering photos, browsing themed collections, and saving camera captures locally.

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
- `/camera` Full-screen capture flow
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
pnpm exec expo prebuild
pnpm ios
pnpm android
pnpm typecheck
pnpm lint
pnpm check
```

This project uses Expo Continuous Native Generation (CNG): `app.json` is the
source of truth, and `ios/` and `android/` are generated locally when a native
build is needed.

## TestFlight

This repo includes [eas.json](/Users/derwin/Development/photos-app/eas.json) for production iOS builds with automatic build number increments.

Basic flow:

```bash
eas login
npx testflight
```

Before the first submission:

- Create the app in App Store Connect
- Make sure the bundle identifier matches `com.coderwin.photos-app`
- Ensure your Apple Developer credentials are available to EAS

If credentials need attention:

```bash
eas credentials -p ios
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
