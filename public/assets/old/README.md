# Ody Hop Mascot Assets

Place otter mascot PNGs here. Owner will add manually.

Required files:
- ody-splash.png — clean otter render, no frame (used for splash screen, recommended 1024x1024)
- ody-avatar-1.png — otter avatar option 1 (100x100 or larger, square)
- ody-avatar-2.png — otter avatar option 2
- ody-avatar-3.png — otter avatar option 3
- ody-avatar-4.png — otter avatar option 4

## Notes

- All filenames use lowercase `.png` (Metro's default `assetExts`
  registers `png` lowercase only — uppercase `.PNG` causes bundler
  errors). Keep new drops lowercase. iOS device builds are
  case-sensitive on disk; mismatched extensions break runtime asset
  resolution.
- The splash background colour is `#0A1628` (deep navy) — set in
  `app.json > expo.splash.backgroundColor`. Keep PNGs transparent so
  the navy shows through behind the otter.
- The four avatar PNGs are placeholders for emoji in
  `OnboardingScreen.tsx` / `EditProfileScreen.tsx` until the
  image-based avatar refactor lands. The emoji set already includes
  🦦 / 🪨 / 🐾 as mascot-themed options.
