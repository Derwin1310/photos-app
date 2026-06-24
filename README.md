# PicXplorer

PicXplorer is an Expo SDK 56 native photo gallery for discovering photos, browsing themed collections, and saving camera captures locally.

## Stack

- Expo Router for file-based navigation
- TypeScript in strict mode
- React Native Unistyles v3 with typed light and dark themes
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
  theme/
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
pnpm ios
pnpm android
pnpm typecheck
pnpm lint
pnpm check
```

This project uses Expo Continuous Native Generation (CNG): `app.json` is the
source of truth, and `ios/` and `android/` are generated locally when a native
build is needed.

Unistyles v3 uses native modules, so use a development client rather than Expo
Go. `pnpm start` runs Metro with the dev-client target.

## TestFlight

This repo includes [eas.json](/Users/derwin/Development/photos-app/eas.json) for production iOS builds with automatic build number increments.

Basic flow:

```bash
eas login
npx testflight
```

Before the first submission:

- Create the app in App Store Connect
- Make sure the bundle identifier matches `com.coderwin.picxplorer`
- Ensure your Apple Developer credentials are available to EAS

If credentials need attention:

```bash
eas credentials -p ios
```

## Styling

This project uses Unistyles v3 with semantic tokens in `src/theme/tokens.ts`
and registered light/dark themes in `src/theme/unistyles.ts`. Styles live beside
the component that owns them:

```text
feed-card.tsx
feed-card.styles.ts
```

Each stylesheet imports `StyleSheet` directly from `react-native-unistyles`.
Do not spread Unistyles styles or re-export `StyleSheet` through a barrel.

Appearance defaults to the device setting. Users can choose `System`, `Light`,
or `Dark` from the Profile appearance sheet; the preference is stored locally.
Use theme tokens (`theme.colors`, `theme.space`, `theme.radius`, and
`theme.typography`) instead of literal visual values. Navigator options and
other non-style props should use `useUnistyles()` rather than bound styles.

## Notes

- Camera permission is requested in the camera route.
- Media library permission is requested only when saving a captured image.
- Gallery data is stored locally and migrated from the legacy `galleryList` payload if present.
- Build and install a development client after native dependency changes, then run `pnpm start`.
