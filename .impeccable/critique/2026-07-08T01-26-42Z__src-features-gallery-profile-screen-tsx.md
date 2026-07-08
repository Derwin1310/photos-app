---
target: new liked photos feature in Profile screen
total_score: 24
p0_count: 0
p1_count: 2
timestamp: 2026-07-08T01-26-42Z
slug: src-features-gallery-profile-screen-tsx
---
# Profile Liked Photos Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Active tab and download busy state exist, but remove has no success/undo feedback. |
| 2 | Match System / Real World | 3 | Captures/Liked is understandable and native enough. |
| 3 | User Control and Freedom | 2 | Removing a like is instant and irreversible in the moment. |
| 4 | Consistency and Standards | 2 | Liked rows use a heavier two-button action treatment than similar photo surfaces. |
| 5 | Error Prevention | 2 | Remove is easy to tap beside Save and has no confirmation or undo. |
| 6 | Recognition Rather Than Recall | 3 | Tabs, stats, and labels are clear. |
| 7 | Flexibility and Efficiency | 3 | Inline tabs keep the workflow efficient without extra routing. |
| 8 | Aesthetic and Minimalist Design | 2 | The liked-card hierarchy is more action-led than image-led. |
| 9 | Error Recovery | 2 | Download errors recover well; remove errors exist, but successful removal has no recovery. |
| 10 | Help and Documentation | 3 | Empty state explains how liked photos appear. |
| **Total** | | **24/40** | **Solid foundation, needs polish before it feels native-grade** |

## Anti-Patterns Verdict

**LLM assessment**: This does not scream AI-generated. The chosen pattern, Profile inline tabs, is familiar and task-oriented. The risk is more product awkwardness than slop: the liked rows look like generic management cards instead of a photo collection, and the action hierarchy makes Remove feel too loud.

**Deterministic scan**: `detect.mjs` returned `[]` for `src/features/gallery/profile-screen.tsx`; no automated slop-pattern findings.

**Visual overlays**: Skipped. This is a native React Native dev-client surface, not a browser-renderable page in this repo, so no reliable browser overlay was available.

## Overall Impression

The feature lands in the right place. Profile as a personal dashboard with Captures/Liked tabs is the correct IA move. The main opportunity is to make liked photos feel like a saved visual collection, not a settings-style list of rows with administrative actions.

## What's Working

- The inline tabs avoid navigation bloat and keep Profile as the single personal gallery hub.
- Persisting likes makes the feed heart action finally meaningful; that closes a product loop users already expect.
- Empty-state copy teaches the behavior clearly: heart photos in the feed, find them in Profile.

## Priority Issues

**[P1] Liked rows are too action-led, not photo-led**

**Why it matters**: Users liked the photo because of the image, but the current row makes the thumbnail small and gives Save/Remove strong visual competition. The emotional object should be the image, not the controls.

**Fix**: Give liked cards a larger image presence, either a wider thumbnail or a compact image-leading card. Keep Save available but quieter; make Remove secondary/destructive but not visually equal to Save.

**Suggested command**: `$impeccable layout`

**[P1] Remove has no recovery path**

**Why it matters**: Removing a liked photo is easy to do accidentally, especially beside Save. Without undo, the user has to hunt through the feed to recover it, which breaks trust.

**Fix**: Add undo feedback after removal, ideally a small inline/snackbar-style restore action. If no snackbar pattern exists, reuse Alert only for errors and use local temporary undo state in the list.

**Suggested command**: `$impeccable harden`

**[P2] The section title and segmented control order feels slightly inverted**

**Why it matters**: The title changes with the active tab, but the control that changes it appears after the title. Users may read “Saved captures” first, then discover the switcher underneath.

**Fix**: Move the segmented control above the dynamic section title, or merge the control and count into the section header area so the mode switch reads as the controller for the content below.

**Suggested command**: `$impeccable layout`

**[P2] Stats duplicate the tabs without adding enough insight**

**Why it matters**: The Profile card now has Captures and Liked stats, and the tabs are also Captures and Liked. That repetition is understandable, but it spends visual weight twice on the same structure.

**Fix**: Keep the stats but make them more dashboard-like, or move counts into tab badges and simplify the profile card. The leaner option is tab badges: `Captures 0`, `Liked 3`.

**Suggested command**: `$impeccable distill`

**[P2] Copy and action labels are clear but not specific enough**

**Why it matters**: “Save” could mean save to app, save to device, or keep liked. “Remove” could mean delete the photo itself. Existing download flows say device/library; this card should match that clarity.

**Fix**: Use labels like “Save to device” and “Unlike” or “Remove like”. Keep accessibility labels explicit in both English and Spanish.

**Suggested command**: `$impeccable clarify`

## Persona Red Flags

**Jordan (First-Time Photo Explorer)**: Jordan understands “Liked” and the empty state, but when a liked card appears, “Save” vs “Remove” requires interpretation. “Remove” may sound like deleting the actual image rather than removing the like.

**Maya (Casual Visual Collector)**: Maya wants to scan beautiful photos quickly. The liked row currently makes the image too small and text/actions too dominant, so the collection feels less inspirational than the feed that created it.

**Alex (Returning Power User)**: Alex benefits from inline tabs, but duplicate stats and tabs make the dashboard feel a little repetitive. Alex would likely prefer counts in the segmented control and denser visual browsing.

## Minor Observations

- The segmented control is a good pattern, but it should feel like the primary content switcher, not an afterthought below the heading.
- The destructive button styling on every liked card can create visual anxiety in a collection meant to feel personal and enjoyable.
- The liked-card date is useful, but the photographer username or Unsplash attribution could help preserve source trust.

## Questions to Consider

- What if liked photos were visually closer to a mini gallery than a management list?
- Should removing a like feel destructive, or should it feel as light as toggling a heart off?
- Do the profile stats need to exist separately once the tabs can show counts?
