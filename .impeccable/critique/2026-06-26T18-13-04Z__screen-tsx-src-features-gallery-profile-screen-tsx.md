---
target: src/features/welcome/welcome-screen.tsx + src/features/gallery/profile-screen.tsx
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-06-26T18-13-04Z
slug: screen-tsx-src-features-gallery-profile-screen-tsx
---
# Auth UI Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Profile loading/delete feedback is clear; sign-in only changes button text and does not show a stronger loading or retry state. |
| 2 | Match System / Real World | 3 | Google login is familiar; "Signed in with Auth0" and "Shareable" are system/provider language leaking into user-facing UI. |
| 3 | User Control and Freedom | 3 | Logout and delete undo exist; logout is visually buried in the identity card instead of an account/settings area. |
| 4 | Consistency and Standards | 3 | Shared primitives are mostly used; welcome has a one-off hardcoded CTA instead of AppButton/theme tokens. |
| 5 | Error Prevention | 3 | Delete confirmation and disabled sign-in state help; auth failure recovery is under-designed. |
| 6 | Recognition Rather Than Recall | 3 | Actions are labeled and visible; profile stat meaning is partly ambiguous. |
| 7 | Flexibility and Efficiency | 2 | Basic mobile flow works; dense gallery actions may become repetitive and cramped for larger galleries. |
| 8 | Aesthetic and Minimalist Design | 3 | Welcome is focused and profile is compact; the profile card tries to carry identity, stats, bio, and logout at once. |
| 9 | Error Recovery | 3 | Gallery errors are handled; auth errors need a clearer recovery path. |
| 10 | Help and Documentation | 2 | Empty state teaches capture flow, but sign-in has no help/fallback path if Google/Auth0 fails. |
| **Total** | | **28/40** | **Good foundation, with auth-specific polish needed.** |

## Anti-Patterns Verdict

**LLM assessment**: This does not read as obvious AI slop. The welcome screen has a clear product promise and the profile screen now benefits from real identity data. The main weakness is not over-decoration; it is a few product-detail mismatches that make the UI feel less native and less trustworthy than the rest of the app.

**Deterministic scan**: `detect.mjs` returned `[]` for `src/features/welcome/welcome-screen.tsx` and `src/features/gallery/profile-screen.tsx`. No automated slop patterns were detected.

**Visual overlays**: Skipped. These are native React Native surfaces, not reliable browser DOM targets for the overlay injector.

## Overall Impression

The Auth0 change is directionally right: login now feels like the front door, and profile finally has real account identity. The biggest opportunity is to make authentication feel like a first-class product flow rather than a button swap: tokenized CTA, stronger progress/recovery, and an account area that separates personal identity from local gallery stats.

## What's Working

- The welcome screen keeps a single focused action: sign in. The copy at `src/features/welcome/welcome-screen.tsx:48` frames the app as personal and photo-first without explaining too much.
- Profile uses real Auth0 identity data at `src/features/gallery/profile-screen.tsx:120`, which immediately makes the app feel more personal and less like a static demo.
- Gallery destructive actions are thoughtfully guarded with confirmation and undo at `src/features/gallery/profile-screen.tsx:200`, which is strong product behavior.

## Priority Issues

**[P1] Welcome CTA is not theme-safe**

Why it matters: The button uses hardcoded cream/dark text colors in `src/features/welcome/welcome-screen.styles.ts:28`, but the icon color comes from `theme.colors.text` at `src/features/welcome/welcome-screen.tsx:85`. In dark theme, that can become a very light icon on a cream button. It also bypasses the shared AppButton vocabulary.

Fix: Replace the custom CTA styling with `AppButton` or create a dedicated `authPrimary` button style with semantic theme tokens for background, text, icon, pressed, disabled, and loading states.

Suggested command: `$impeccable polish`

**[P1] Auth error recovery is too quiet**

Why it matters: Auth is the gate to the entire app. A plain inverse body line at `src/features/welcome/welcome-screen.tsx:58` can be missed against the image/card, and it gives no practical recovery path beyond "try the same button again."

Fix: Use an inline error panel with a clear title, plain-language message, and retry action. Add a visible loading spinner or progress affordance while `isSigningIn` is true, and keep the button disabled visually as well as semantically.

Suggested command: `$impeccable harden`

**[P1] Profile mixes account controls with gallery identity**

Why it matters: The profile card currently holds avatar, name, email, bio, stats, and logout in one container at `src/features/gallery/profile-screen.tsx:118`. Logout becomes a large full-width control inside the user’s public-ish identity card, which feels heavier than its frequency deserves.

Fix: Move logout into a small account/settings section, gear menu, or bottom account row. Keep the hero card focused on identity and gallery summary. Consider a destructive/tertiary visual treatment for logout rather than secondary.

Suggested command: `$impeccable layout`

**[P2] Profile stats contain a trust-breaking duplicate metric**

Why it matters: `Shareable` equals `photos.length` at `src/features/gallery/profile-screen.tsx:108`, so it does not communicate a real product state. Users notice fake stats quickly.

Fix: Either remove the third stat until sharing is tracked, rename it to something truthful like "Saved", or replace the stat row with two meaningful metrics: captures and captioned.

Suggested command: `$impeccable clarify`

**[P2] Gallery item actions may become cramped on small screens**

Why it matters: Each card shows three labeled buttons beside a 104px thumbnail at `src/features/gallery/profile-screen.tsx:71`. On narrow devices or long localized labels, the action row can wrap awkwardly and compete with the photo.

Fix: Keep primary action visible and move secondary actions into a compact menu, or switch to icon buttons with accessible labels once the user is in the gallery list context.

Suggested command: `$impeccable adapt`

## Persona Red Flags

**Jordan (First-Timer)**: The sign-in action is clear, but an Auth0/Google failure would leave Jordan reading a short error line with no explanation or next step. The profile fallback `"Signed in with Auth0"` also exposes provider language that does not help a casual user.

**Sam (Accessibility-Dependent User)**: The button has an accessibility label and disabled state, which is good. The likely dark-theme icon contrast bug on the welcome CTA is the risk; state also relies mostly on changing button text to `"Opening Google..."` rather than a stronger announced loading pattern.

**Casey (Distracted Mobile User)**: The welcome CTA sits in the lower screen area, which is thumb-friendly. Profile logout as a full-width button in the hero area can be accidentally prominent during quick scanning, while repeated three-button card actions create more tap targets than Casey wants in a scrollable gallery.

## Minor Observations

- `startExploringButton` is still named after the old flow; rename it to `signInButton` or remove it via `AppButton`.
- The welcome card background is a fixed rgba brown rather than a theme token, which makes future palette changes harder.
- The profile bio is still generic product copy; now that real auth exists, a future pass could let users edit this or remove it.

## Questions to Consider

- Should profile feel like a social profile, an account/settings screen, or a personal gallery dashboard? Right now it is a little of all three.
- Is Google the only intended auth path long-term, or should the welcome CTA copy leave room for other Auth0 connections later?
- Do stats need to communicate social value, or should they simply summarize saved local captures honestly?
