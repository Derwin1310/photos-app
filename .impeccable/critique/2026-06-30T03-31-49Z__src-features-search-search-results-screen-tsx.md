---
target: download buttons in feed and search
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-06-30T03-31-49Z
slug: src-features-search-search-results-screen-tsx
---
# Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Feed shows per-card loading, but fullscreen Search has no visible saving/busy state. |
| 2 | Match System / Real World | 3 | Download/save is a familiar icon pattern; Search fullscreen placement is good on iOS. |
| 3 | User Control and Freedom | 2 | Users cannot cancel, retry from context, or recover from denied permission without leaving the flow. |
| 4 | Consistency and Standards | 2 | Feed, iOS Search, and Android Search expose the same action differently, with Android missing the fullscreen action. |
| 5 | Error Prevention | 3 | The feed button disables while saving, but global/concurrent download behavior is not communicated. |
| 6 | Recognition Rather Than Recall | 2 | Search users must discover that opening fullscreen is where download lives; Android users get no matching affordance. |
| 7 | Flexibility and Efficiency | 2 | Download exists in Feed and iOS fullscreen Search, but not as a consistent cross-platform workflow. |
| 8 | Aesthetic and Minimalist Design | 3 | The grid is clean and feed overlay is compact, though feed controls compete slightly with the photo. |
| 9 | Error Recovery | 2 | Error alerts are understandable, but permission denial lacks a direct Settings path or recovery CTA. |
| 10 | Help and Documentation | 2 | No hint explains “open image to save” or where saved files go beyond post-action alert copy. |
| **Total** | | **23/40** | **Useful v1, but platform consistency and feedback need polish.** |

# Anti-Patterns Verdict

**LLM assessment**: This does not read as AI slop. The feed action is visually restrained, tokenized, and native enough. The Search grid becoming cleaner after moving the button into fullscreen is the right photo-first instinct. The weakness is not aesthetics; it is interaction consistency. A user fluent in native gallery apps would expect the save action to be available in the same place on iOS and Android, and right now it is not.

**Deterministic scan**: `detect.mjs` returned `[]` for `feed-screen.tsx`, `feed-card.tsx`, and `search-results-screen.tsx`. No detector findings or ignored findings.

**Visual overlays**: Skipped. This is a native-only Expo development-client surface with no reliable web/browser route for the detector overlay.

# Overall Impression

The feature is directionally strong: Feed supports quick saving, Search preserves a clean grid and moves saving into the detailed viewer. The single biggest opportunity is to make “save to device” feel like one coherent product action across both platforms, with clear feedback before, during, and after the save.

# What's Working

- The Feed button has a real touch target, loading state, disabled state, accessibility role, and semantic label.
- Moving the Search download action out of the grid protects the gallery from clutter and matches the “inspect first, then act” behavior of modern photo apps.
- The shared download hook keeps success/failure behavior centralized, which is the right foundation for later toast/snackbar polish.

# Priority Issues

**[P1] Search fullscreen download is currently iOS-only**

Why it matters: Android users can open fullscreen Search images but cannot save from that fullscreen context, which breaks the mental model and makes the feature feel unfinished on one platform.

Fix: Either choose a fullscreen viewer path that supports custom cross-platform controls, or add a small app-owned fullscreen overlay/action layer that works on both platforms. If staying with Galeria, note that Android’s native module exposes `onIndexChange`, `onLongPress`, and `onDismiss`, but not `onPressRightNavItemIcon`; the current iOS right-nav API cannot be assumed cross-platform.

Suggested command: `$impeccable polish`

**[P1] System feedback is too modal and too late**

Why it matters: Downloading a remote full-resolution image can take time, and an `Alert` only appears after success or failure. Users do not get a clear “saving...” state in fullscreen Search, and feed users get a spinner only inside the tapped card.

Fix: Introduce a lightweight global saving surface, such as a native-feeling toast/snackbar: “Saving photo...”, then “Saved to Photos”. Keep alerts for permission denial or hard failures only.

Suggested command: `$impeccable harden`

**[P1] The action vocabulary differs by context**

Why it matters: Feed uses an always-visible overlay icon; Search uses a hidden fullscreen toolbar action; Android currently has neither in fullscreen. This creates recognition cost: users have to relearn where saving lives.

Fix: Define one product rule: quick-feed saves can be overlay buttons, but detailed-view saves always live in the viewer chrome. Then make that viewer chrome cross-platform and label it consistently as “Save to device” or “Save image”.

Suggested command: `$impeccable clarify`

**[P2] Permission denial recovery is under-designed**

Why it matters: If a user denies photo library access, the app tells them what went wrong but does not help them fix it. That is a high-friction dead end for a save feature.

Fix: Detect denied/canAskAgain states and show actionable copy: “Allow photo access in Settings to save images.” Add a Settings CTA if possible.

Suggested command: `$impeccable harden`

**[P2] Search image accessibility does not clearly announce that thumbnails open a viewer**

Why it matters: The thumbnail has a descriptive image label, but the interaction is really “open image viewer”. Screen reader users need the actionable role and hint, not only the photo description.

Fix: Add an accessibility role/hint to the tappable Galeria trigger or wrapper: “Open full screen image viewer. Download available in viewer.”

Suggested command: `$impeccable audit`

# Persona Red Flags

**Jordan, first-time casual browser**: Jordan taps Search thumbnails because they look attractive, but there is no explicit cue that fullscreen mode also contains save. On Android, even after discovering fullscreen, the save action is absent.

**Maya, social/photo saver**: Maya wants quick saves while browsing. Feed gives her a visible button, but the button uses an icon-only overlay with no pre-action confirmation about saving to the device library. If permission appears unexpectedly, the flow feels more like an interruption than a planned action.

**Alex, power user**: Alex expects consistent high-throughput behavior. Per-card state in Feed and screen-level state in Search are not a unified save queue, and there is no persistent confirmation/history that the selected full-resolution image was saved.

# Minor Observations

- Feed button placement is visually balanced with Like, but the two equal-weight floating controls make Download feel as emotionally primary as Like.
- `ActivityIndicator` inside a 48px pill is functional but visually generic; a compact “saving” toast would feel more modern.
- The success copy says “phone library”; iOS users usually think “Photos”, while Android users may think “Gallery” or “Photos”. “Saved to your photo library” is safer.
- The Search fullscreen button uses an SF Symbol, which is good on iOS but reinforces the platform-specific implementation gap.

# Questions to Consider

- Should “save to device” be treated as a primary action like Like, or a utility action that lives in viewer chrome and overflow menus?
- Do we want downloaded Unsplash images to feel separate from the personal PicXplorer gallery, or should the UI more explicitly explain that distinction?
- Is the priority native fidelity per platform, or identical feature availability across iOS and Android even if the control is custom?
