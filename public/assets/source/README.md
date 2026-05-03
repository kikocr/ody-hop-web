# App art source files

SVG masters for the app icon and splash screen. The PNG exports that
Expo bundles live one directory up (`assets/icon.png`,
`assets/adaptive-icon.png`, `assets/splash.png`, `assets/favicon.png`).

## Regenerating the PNGs

Any SVG renderer works. From the repo root:

```sh
# rsvg-convert (librsvg) — fastest, good defaults
rsvg-convert -w 1024 -h 1024 assets/source/icon.svg  -o assets/icon.png
rsvg-convert -w 1024 -h 1024 assets/source/icon.svg  -o assets/adaptive-icon.png
rsvg-convert -w 1284 -h 2778 assets/source/splash.svg -o assets/splash.png
rsvg-convert -w  512 -h  512 assets/source/icon.svg  -o assets/favicon.png

# or, Inkscape CLI
inkscape assets/source/icon.svg  --export-type=png --export-filename=assets/icon.png  -w 1024 -h 1024
inkscape assets/source/splash.svg --export-type=png --export-filename=assets/splash.png -w 1284 -h 2778
```

### Design notes

- **Icon background:** leaf-green (#52b788) → jungle-dark (#0d2818) linear gradient, with a subtle gold (#f2b705) accent ring at r=380.
- **Icon mark:** palm tree silhouette — 8 fronds, 3 gold coconuts, bark-brown trunk.
- **Splash:** cloud-white (#faf9f6) background, sunset gradient fading in from the top, centered icon at 520×520, "Pura Vida Quest" in Playfair Display below.
- **Safe zone (adaptive icon):** keep all critical art inside a 60% centered circle — Android masks cover the corners aggressively.
- **No text in the icon** — Apple's HIG discourages text in icons because it's unreadable at 60×60.
