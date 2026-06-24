# Repository Guidelines

## Project Structure & Module Organization

PicXplorer is an Expo SDK 56 React Native app. Keep `app/` limited to Expo Router
route files and layouts; it is not a general source directory. Put screens,
feature components, hooks, and data helpers under `src/features/<feature>/`.
Shared UI, API clients, types, and utilities live in `src/lib/`. Theme setup is
in `src/theme/unistyles.ts`, and static assets are in `assets/` (with typed
references in `src/assets/images.ts`).

Co-locate component styles using plural filenames: `feed-card.tsx` and
`feed-card.styles.ts`. Do not place `.styles.ts` files in `app/`, since Expo
Router treats them as routes.

## Build, Test, and Development Commands

- `pnpm install` installs locked dependencies.
- `pnpm start` starts Metro for the Expo development client.
- `pnpm ios` and `pnpm android` build and install native development clients.
- `pnpm typecheck` runs strict TypeScript validation.
- `pnpm lint` runs Oxlint.
- `pnpm check` runs typechecking and linting together.
- `npx expo-doctor` verifies Expo SDK dependency alignment.

Use `npx expo prebuild --clean` after changing native dependencies or app
configuration. Generated `ios/` and `android/` directories are local build
artifacts; `app.json` is the source of truth.

## Coding Style & Naming Conventions

Use TypeScript, double quotes, semicolons, and kebab-case filenames. Prefer
the `@/` alias for `src/` imports. Use Unistyles `StyleSheet.create` from
`react-native-unistyles` in sibling stylesheet files. Combine styles with
arrays, never object spreads. Use `useUnistyles()` only for theme values passed
to non-style props, such as navigator options or icon colors.

## Testing Guidelines

There is no automated test framework yet. Before opening a change, run
`pnpm check` and `npx expo-doctor`. For UI or native changes, also exercise the
affected flow in both iOS and Android development clients; verify camera,
gallery, feed/search, and navigation behavior where relevant.

## Commit & Pull Request Guidelines

Follow the existing history: short, capitalized summary lines such as
`Updated hooks to hooks folders`. Keep commits focused. Pull requests should
state the user-visible change, list validation commands, link related issues,
and include iOS/Android screenshots for visual changes. Never commit `.env` or
Unsplash keys; only `EXPO_PUBLIC_UNSPLASH_ACCESS_KEY` belongs in local setup.
