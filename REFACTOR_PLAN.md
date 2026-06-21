# Expo Router and TypeScript Refactor Plan

## Objective

Modernize this Expo SDK 56 app without changing its core product: a photo-discovery feed, collection search, map, camera capture, and local profile gallery. The refactor will use Expo Router, strict TypeScript, Oxlint, NativeWind, current Expo camera APIs, and a smaller, feature-oriented component structure.

This is an implementation plan only. No application source code is changed by this document.

## Current-state inventory

The app is already on Expo SDK 56, React 19, and React Native 0.85, but its application code still uses older patterns:

- `App.js` owns a React Navigation stack and nests the custom tab navigator in a `NavigationContainer`.
- `src/routes/TabNavigator.jsx` uses React Navigation v6, `Dimensions.get`, navigation listeners, and several `@expo/vector-icons` icon sets.
- `src/context/store.js` combines search navigation state, gallery persistence, modal state, editable input state, and a feed-list ref into one untyped context.
- `src/views/Camera.jsx` and `src/hooks/useCamera.js` use the legacy `Camera` component/API and request media permission before it is needed.
- `src/helpers/fetch.js` hard-codes an Unsplash access key and the home/search feeds have hand-written pagination, no cancellation, no error UI, and no cache.
- Most screen and component files use static `Dimensions` values, legacy `TouchableOpacity`, React Native `Image` for remote imagery, elevation-only shadows, a font hook inside every `StyledText` render, and local `StyleSheet.create` objects.
- There is no TypeScript configuration, linter, type-check script, test setup, or route-level not-found state.

The worktree already has user-owned dependency changes (`package.json`, `pnpm-lock.yaml`, and the removed `yarn.lock`). Preserve those changes and reconcile them only as part of the dependency-install phase.

## Target navigation architecture

Use Expo Router's file-based routing and remove the handwritten navigation layer entirely. Keep `app/` exclusively for route and layout files; implementation components, hooks, types, services, and assets stay under `src/`.

```text
app/
  _layout.tsx                    # Root providers + root Stack
  index.tsx                      # Landing / welcome screen (/)
  +not-found.tsx                 # Recoverable unmatched-route screen
  (tabs)/
    _layout.tsx                  # Tabs: Feed, Map, Camera, Updates, Profile
    feed.tsx                     # Current Posts screen
    map.tsx                      # Current Map screen
    camera.tsx                   # Full-screen capture flow (header hidden)
    updates.tsx                  # Current unavailable screen, renamed “Updates”
    profile.tsx                  # Local photo gallery
  search/
    [query].tsx                  # Current PhotosList; typed query parameter
  (modals)/
    edit-photo.tsx               # Caption editor, presented as a Stack modal
```

Implementation decisions:

1. Set `package.json#main` to `expo-router/entry`, install Router with Expo-compatible versions, add an app scheme, and enable `typedRoutes`.
2. Use a root `Stack` for the landing screen, tabs, search results, and the caption-editor modal. Use a Router `Tabs` layout for the five primary destinations. This keeps the existing Android/iOS tab experience while gaining deep links and typed navigation.
3. Replace `navigation.navigate`, React Navigation `Link`, and `useIsFocused` with `Link`, `router.push`, typed `Href` values, and route-local component lifecycle. A collection card will link directly to `/search/[query]`; `listTitle` is no longer global state.
4. Move the feed scroll-to-top behavior into the feed route/tab implementation. It must safely handle a missing or empty `FlatList` ref rather than calling `scrollToIndex` unconditionally.
5. Remove `App.js`, `src/routes/TabNavigator.jsx`, and all direct `@react-navigation/*` imports after the Router routes are proven working. Expo Router still manages its compatible native navigation dependencies internally.

## Source architecture and imports

Use a simple screaming architecture: the source tree should describe the app's capabilities, not React technical categories. `app/` remains the thin Expo Router adapter; every route file only exports a default route component or layout and imports its implementation from `src/`.

```text
app/                              # Expo Router routes and layouts only
  _layout.tsx
  index.tsx                       # → @/features/welcome/welcome-screen
  (tabs)/
    _layout.tsx
    feed.tsx                      # → @/features/feed/feed-screen
    map.tsx                       # → @/features/map/map-screen
    camera.tsx                    # → @/features/camera/camera-screen
    updates.tsx                   # → @/features/updates/updates-screen
    profile.tsx                   # → @/features/gallery/profile-screen
  search/[query].tsx              # → @/features/search/search-results-screen
  (modals)/edit-photo.tsx         # → @/features/gallery/edit-photo-screen

src/
  assets/                         # UI-only assets; manifest assets stay at root
  features/
    welcome/
    feed/
    search/
    camera/
    gallery/                      # Persistent gallery model + profile/edit UI
    map/
    updates/
  lib/
    components/                   # Reusable UI: AppText, AppIcon, buttons, loading/error/empty states
    utils/                        # Pure shared functions: cn, formatters, guards, typed errors
    hooks/                        # Only hooks reused by unrelated features
    query-client.ts               # Small app-wide infrastructure
  providers/                      # AppProviders composition only
  global.css
```

Rules:

1. Co-locate a feature's screen, feature-specific components, query hooks, data adapters, and types inside its feature folder. Create nested `components/` or `hooks/` directories only when the feature has more than one file of that kind.
2. Put a component in `src/lib/components/` only when two or more unrelated features need the same well-defined UI behavior; examples are `AppText`, `AppIcon`, `IconButton`, and loading/error/empty states. Put pure, framework-free helpers in `src/lib/utils/`; examples are `cn`, formatting, input guards, and typed error helpers. Shared hooks belong in `src/lib/hooks/` only when their contract is feature-neutral.
3. Apply KISS and the Single Responsibility Principle: extract after a real repeated use (or when a cohesive abstraction is clearly established), keep each function/component focused on one job, and prefer a small direct helper over a generic abstraction with configuration flags. `lib` may depend on other `lib` code, but it must never import a feature or route; features may import from `lib`. This one-way dependency rule prevents cycles and keeps reusable code reusable.
4. Move the current folders as part of the conversion: `views`, `feedList`, and `collections` become their owning feature; camera/profile/map components move alongside their screen; map fixture data moves to `features/map`; and `helpers/fetch`, `helpers/storage`, and the broad context disappear into the relevant feature or the small `lib/`/`providers` boundary.
5. Keep `assets/icon.png`, splash, adaptive icon, and favicon at the project root because `app.json` consumes them. Move UI-only image assets such as feed, profile, and header imagery into `src/assets/` so their source imports can use the same root alias.
6. Use exactly one code alias: `@/*` → `src/*`, configured in `tsconfig.json` with `baseUrl: "."`. Expo/Metro resolves this natively, so do not add a Babel module-resolver plugin. Use `@/…` for every cross-folder import; `./` is acceptable only for a sibling file within the same feature. Never climb directories with `../../`.

Example route adapter:

```tsx
// app/(tabs)/feed.tsx
export { default } from "@/features/feed/feed-screen";
```

## Phase 0 — establish a safe baseline

1. Confirm the package-manager decision is pnpm and retain the committed lockfile as the single source of truth.
2. Run `pnpm install`, `npx expo install --fix`, `npx expo-doctor`, and a clean `npx expo start --clear` before changing behavior. Record Expo Doctor findings rather than papering over version mismatches.
3. Smoke-test the current flow on a physical iOS and Android device in Expo Go: landing → feed; a collection → results; each tab; camera permission/capture/save; profile edit/share/delete; and map markers.
4. Inventory the current Unsplash app key and rotate it before work starts because it is committed in `src/helpers/fetch.js`. Restrict the new key in Unsplash's dashboard.

## Phase 1 — dependencies and project configuration

1. Add Expo Router using Expo's installer, which selects SDK-56-compatible versions of `expo-router`, `expo-linking`, `expo-constants`, `expo-status-bar`, `react-native-safe-area-context`, and `react-native-screens`.
2. Add TypeScript toolchain dependencies with Expo's installer: `typescript` and `@types/react`. React Native supplies its own types, so do not add the obsolete `@types/react-native` package.
3. Add `oxlint` as a development dependency. Use a JSON `.oxlintrc.json` (rather than `oxlint.config.ts`) so linter configuration does not impose a newer Node runtime requirement. Enable correctness, React, TypeScript, import, and promise rules gradually; configure React Native/Expo globals and ignore generated `.expo/`, build output, and dependencies.
4. Install `react-native-svg` with `npx expo install react-native-svg`, then add `lucide-react-native`. Lucide will be the sole icon library used in application code.
5. Use the stable NativeWind v4 / Tailwind CSS v3 setup documented in this repository's `nativewind.md`: add `nativewind` and ensure its Expo peer dependencies (`react-native-reanimated` and `react-native-safe-area-context`) remain Expo-compatible; add `tailwindcss@^3.4.17` as a development dependency. Do not use NativeWind v5 preview, Tailwind v4, `react-native-css`, or the v5 lightningcss pin for this project.
6. Add scripts:

   ```json
   {
     "lint": "oxlint --tsconfig tsconfig.json .",
     "lint:fix": "oxlint --fix --tsconfig tsconfig.json .",
     "typecheck": "tsc --noEmit",
     "check": "pnpm typecheck && pnpm lint"
   }
   ```

7. Create a strict `tsconfig.json` extending `expo/tsconfig.base`, include Expo-generated route types, and define `@/*` → `src/*` aliases. Add `nativewind-env.d.ts` with `/// <reference types="nativewind/types" />`; do not call the file `nativewind.d.ts`, which would prevent the declaration merge from loading. Configure the app with `experiments.typedRoutes: true` and retain Metro as the web bundler.
8. Update the app config with an explicit deep-link scheme and clear camera/media-library permission wording. Add the `expo-camera` config plugin only if the project remains in Continuous Native Generation; do not create native projects solely for this refactor.
9. Remove direct dependencies only after source migration and `expo-doctor` verification:
   - all direct `@react-navigation/*` packages;
   - `@expo/vector-icons` if it becomes a direct dependency during reconciliation;
   - `react-native-prompt-android` (unused);
   - `@expo-google-fonts/inter` (unused);
   - any other package found unused by the final import audit.

   Keep `@react-native-async-storage/async-storage`: it is the maintained community package, not the removed React Native core AsyncStorage API. Keep Gesture Handler, Reanimated, Safe Area Context, Screens, Camera, Media Library, Sharing, and the two font families while they are still used.

## Phase 1a — NativeWind foundation

1. Create `tailwind.config.js` with the NativeWind preset and content globs for every route and source file that may contain classes (`./app/**/*.{js,jsx,ts,tsx}` and `./src/**/*.{js,jsx,ts,tsx}`). Define the existing palette and font families as semantic Tailwind theme tokens (`canvas`, `surface`, `ink`, `muted`, `accent`, `danger`; plus Kalam and Jua) so component class strings never repeat raw palette hex values.
2. Create `src/global.css` with NativeWind v4's Tailwind directives: `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`. There is no Tailwind v4 CSS import layer or PostCSS configuration in this v4 setup.
3. Create `metro.config.js` from Expo's default config and wrap it with NativeWind v4's `withNativeWind(config, { input: "./src/global.css" })`. Update `babel.config.js` to use the documented NativeWind/Babel Expo configuration (`babel-preset-expo` with `jsxImportSource: "nativewind"`, plus `nativewind/babel`). Remove the handwritten Reanimated plugin: Expo's current Babel preset configures Reanimated v4/worklets automatically.
4. Import `../src/global.css` once in `app/_layout.tsx`, before rendering providers. Configure `app.json#userInterfaceStyle` as `automatic` and use NativeWind's default system-driven dark mode; do not add a manual theme preference until the product needs one.
5. Use `className` directly on React Native primitives and project components after the NativeWind JSX transform. Use `remapProps` for multi-style-prop components (notably `FlatList` content/header/footer/column wrapper classes) and `cssInterop` only where a custom or third-party component does not safely forward `style`—for example `MapView`, `CameraView`, Expo Image, or a Lucide SVG adapter if testing proves it necessary. Do not create v5-style component wrappers.
6. Keep conditional classes explicit and locally readable; use string arrays or a minimal `clsx` helper only when a conditional is genuinely complex. Dynamic runtime values such as Reanimated animated styles, map regions, camera activity, and calculated image transforms remain typed `style` props.
7. Prove the foundation before the bulk migration: render a styled route using ordinary `Text`, `View`, `Pressable`, `FlatList`, and Expo Image; verify class application on iOS, Android, and Metro web; then verify the existing Reanimated double-tap animation still executes. Do not start bulk style conversion until this gate passes.

## Phase 2 — TypeScript conversion and feature boundaries

Convert in small compiling batches rather than renaming every file at once:

1. Add shared domain types first: `UnsplashPhoto`, `GalleryPhoto` (with a stable `id`, URI, caption, and timestamps), `Photographer`, map marker data, and UI prop types. Store a versioned gallery payload so existing `galleryList` data can be read and migrated safely.
2. Convert and relocate by feature in compiling batches: pure data/storage/network adapters first; then each feature's hooks/components/screens; then providers; then the thin route adapters. Delete the current technical-category folders (`views`, `routes`, broad `context`, generic `helpers`) as their contents move. Promote repeated, feature-neutral code into `@/lib/components/...`, `@/lib/utils/...`, or `@/lib/hooks/...`; otherwise keep it in the feature. Delete barrel files where they hide ownership or create cycles; use direct absolute imports instead.
3. Replace the broad `store` context with small, typed feature APIs:
   - `GalleryProvider`/`useGallery` for persisted personal photos and mutations;
   - route params for search query and modal-photo identity;
   - local component state for camera preview, flash, caption draft, and liked state;
   - a feed ref owned by the feed route rather than globally.

   Use React 19's `use(Context)` inside the custom context hook if the final React version supports it cleanly; consumers must never access a nullable context directly.
4. Move font loading to the root layout/splash-screen lifecycle. Replace the prop-flag-heavy `StyledText` API with a typed `AppText` primitive and named variants, so screens do not independently call `useFonts` and silently render empty text while fonts load.
5. Replace static window measurements with flex layout, `aspectRatio`, percentage/max-width constraints, and `useWindowDimensions` only where a live measurement is truly needed. This improves rotation, split-screen/tablet, and web behavior.
6. Migrate visual styling component by component to NativeWind utilities. Remove application-owned `StyleSheet.create` files/objects once their values are represented by semantic theme tokens and `className` utilities. Preserve `style` only for values that cannot be static utilities: Reanimated animated styles, `MapView`/`Marker` and `CameraView` adapters, calculated image dimensions/transforms, and libraries that need a documented `cssInterop` boundary.

## Phase 3 — data, persistence, and API correctness

1. Add `@tanstack/react-query` and place a single `QueryClientProvider` in `app/_layout.tsx`. Replace `usePhotos` with typed query hooks:
   - a cached/refetchable feed query;
   - an infinite search query keyed by the typed search term;
   - explicit loading, empty, error, retry, and end-of-list states;
   - stable photo IDs as list keys instead of array indices.
2. Implement the Unsplash client with `expo/fetch`/`fetch`, `response.ok` checks, a typed error class, query validation, and cancellation-aware requests. Do not introduce Axios.
3. Move the access key to a local `.env` value named `EXPO_PUBLIC_UNSPLASH_ACCESS_KEY`, document it in `.env.example`, and never commit the actual replacement value. Because `EXPO_PUBLIC_*` values are readable in the client bundle, use an application-restricted Unsplash key; use a server proxy later if a truly secret credential or per-user authorization is required.
4. Replace the duplicated storage calls and stale `loadData`/`galleryImg` states with one gallery repository. Mutations should optimistically update the typed gallery state, persist atomically, surface an error if persistence fails, and reload once on provider startup.
5. Repair current behavioral bugs during the move: the feed fetch ignores pagination, search passes an argument array into `getPhotos`, `usePhotos` can append stale state and leave loading true after errors, and profile edits/deletes operate against a potentially stale `loadData` list.

## Phase 4 — modern Expo APIs and component updates

1. Migrate the camera from `Camera`/`Camera.Constants` to `CameraView`, `CameraType`, and `useCameraPermissions`. Use `facing`, `flash`, `enableTorch`, `active`, and a correctly typed `CameraView` ref.
2. Request camera access in the camera route with a useful denied-permission state. Request media-library access only when the user saves an image, then save through the current `MediaLibrary` namespace API. Keep camera preview unmounted or inactive outside its tab so there is never more than one live preview.
3. Use Expo Router's full-screen route configuration for the camera and a stack modal/form sheet for caption editing instead of a globally mounted React Native `Modal`.
4. Use `expo-image` for remote Unsplash images and local-photo rendering where its caching, content-fit behavior, and placeholders help. Keep a deliberately selected React Native `Image` only where Expo Image offers no advantage.
5. Replace every `@expo/vector-icons` import with named components from `lucide-react-native`; no screen or component may import `AntDesign`, `Entypo`, `Ionicons`, `MaterialIcons`, or `@expo/vector-icons` afterward. Use the following semantic replacements as the starting registry:
   - tabs: `House`, `MapPinned`, `Camera`, `Bell`, `UserRound`;
   - camera controls/review: `Flashlight`, `FlashlightOff`, `Circle`, `RotateCcw`, `Trash2`, `Type`, `Check`;
   - profile and dialogs: `Share2`, `Pencil`, `Users`, `Heart`, `X`, `Check`, `Camera`.

   Import icons by name from `lucide-react-native` (or expose a small local registry composed of named imports). Do **not** use `import * as icons` or a string-to-package dynamic icon component; Lucide documents that approach as a significant bundle-size cost. Standardize icon defaults—`size`, `strokeWidth`, colors, and pressed/disabled states—in a typed local `AppIcon` wrapper only if it removes repeated styling without hiding the icon choice.
6. Replace `TouchableOpacity` with accessible `Pressable` controls, add labels/hints to icon-only controls, use `hitSlop` for compact buttons, and add `accessibilityRole`/state to likes, save, share, edit, delete, and tabs. Each Lucide icon remains decorative when adjacent to a text label and receives an accessible label through its parent control when it is the only visible affordance.
7. Make Reanimated gesture callbacks safe for UI-thread execution and update liked state through a deliberate JS handoff when necessary. Add haptic feedback only to meaningful camera, like, and destructive actions, with platform/availability guards.
8. Use safe-area-aware `ScrollView`/`FlatList` content insets, stack titles rather than custom duplicate headers, continuous-corner cards, current `boxShadow` styles where supported, and `contentFit="cover"` rather than image stretching.
9. Add explicit NativeWind `cssInterop`/`remapProps` adapters only for third-party surfaces that testing shows do not receive a class-derived style (`MapView`, `CameraView`, Expo Image, Router `Link`, or Lucide SVGs). Keep their platform-specific imperative props—including camera `facing`/`active`, map region, and image `contentFit`—as typed props. This avoids a deceptively complete migration that leaves some screens silently unstyled.

## Phase 5 — focused UX/UI improvements

Keep the warm photo-journal visual identity, but make it feel intentional and resilient:

1. Landing: preserve the hero image but make its call to action accessible, respect safe areas, and use a responsive bottom sheet/card rather than a fixed `Dimensions` height.
2. Feed: add skeleton/loading treatment, a friendly error + retry, an empty state, visible photo attribution, consistent image crops, and a reliable double-tap/like affordance.
3. Collections/search: make collection cards clear press targets, show the query in the navigation title, add a results count/end state, and present image-loading placeholders.
4. Camera: provide pending/denied permission explanations, visible flash/facing state, a clear review screen after capture, caption character feedback, save progress/failure feedback, and safe-area-aware controls.
5. Profile: fix the empty-gallery experience, make photo actions clear icon buttons, confirm deletion, update the photo count from real gallery data, and correct visible spelling (`Notifications`, `available`, `feature`).
6. Map and updates: retain the existing static marker data but label it as sample content, ensure map controls and marker cards are accessible, and convert the unavailable tab into an honest “Updates coming soon” state rather than a dead screen.
7. Use the semantic NativeWind tokens for all refreshed UI: no raw palette hex values in screen/component files. Respect platform-specific system color fallbacks and dark mode through the global CSS theme rather than duplicating color conditionals in each component.

## Phase 6 — validation and delivery gates

1. Add focused tests for the gallery repository/migration, Unsplash response/error mapping, query hooks, and camera permission-state rendering. Use the Expo-compatible React Native test setup selected during implementation; do not add a browser-only test stack.
2. Run `pnpm check`, `npx expo-doctor`, and a clean Metro start. Treat lint/type failures as blockers, not warnings to be silenced.
3. Verify the NativeWind build chain before functional QA: global CSS loads once; the NativeWind Babel and Metro transforms succeed without warnings; light/dark semantic tokens resolve; class strings compile for primitives and documented interop adapters; and no `StyleSheet.create` remains in migrated app UI outside documented adapter/animation cases.
4. Validate on Expo Go first, then make a development build only if a package or native configuration proves Expo Go insufficient.
5. Manually validate on current iOS and Android devices:
   - deep link to `/`, a tab route, and `/search/<query>`;
   - fresh launch, offline/error/retry, paging, and collection search;
   - camera permission grant/deny, capture, caption, save, app relaunch persistence, edit, share, and delete;
   - feed double-tap/like and tab reselect scroll-to-top;
   - map rendering, safe areas, compact/large screens, and dark/light system settings where supported.
   - every tab and action icon at normal and large text/display settings, including pressed, disabled, and destructive states.
6. Verify the web build independently for routes, responsive layouts, and graceful camera/map limitations. Device-only features must show an explanatory fallback rather than a crash.
7. Update `README.md` with pnpm setup, the NativeWind v4 configuration files, required `.env` variable, commands, routing map, platform caveats, and the new quality gate.

## Completion criteria

- No JavaScript application source remains; all production code is strict `.ts`/`.tsx` with zero `typecheck` errors.
- Expo Router owns all navigation; there is no `NavigationContainer`, custom React Navigation navigator, or direct `@react-navigation/*` import in application code.
- NativeWind owns static layout, spacing, typography, color, border, and shadow styling through semantic theme tokens; no app UI `StyleSheet.create` remains except documented adapter/animation cases.
- The source tree is feature-named, `app/` contains only Expo Router routes/layouts, and all cross-folder code imports resolve from the single `@/` → `src/` alias.
- `pnpm lint`, `pnpm typecheck`, and Expo Doctor pass on the final dependency graph.
- Search, camera gallery CRUD, sharing, map, and tab navigation work on iOS and Android, including permission/error/empty states.
- The Unsplash key is no longer hard-coded or committed, stale/deprecated code has been removed, and the refreshed UI is responsive and accessible.

## Reference guidance used for this plan

- [Expo Router manual installation](https://docs.expo.dev/router/installation/) — Router entry point, compatible installation command, typed routes, scheme, and TypeScript aliases.
- [Expo TypeScript migration guide](https://docs.expo.dev/guides/typescript/) — strict Expo base configuration and staged JS-to-TS conversion.
- [Expo Camera SDK 56 documentation](https://docs.expo.dev/versions/latest/sdk/camera/) — `CameraView`, permission hook, active preview, and camera configuration.
- [NativeWind project guide](nativewind.md) and [NativeWind installation guide](https://www.nativewind.dev/docs/getting-started/installation) — the project-selected stable v4 setup, Tailwind config, Babel/Metro transforms, CSS interop, and TypeScript declaration requirements.
- [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) and [Expo SVG](https://docs.expo.dev/versions/latest/sdk/svg/) — named Lucide component imports and Expo-compatible SVG support.
- [Oxlint documentation](https://oxc.rs/docs/guide/usage/linter.html) and [configuration reference](https://oxc.rs/docs/guide/usage/linter/config.html) — dev dependency, scripts, TypeScript support, and project config.
