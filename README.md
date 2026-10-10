# APS Jet Fleet – WP Sync

Self-hosted 360° jet viewer for the Air Partners fleet page (Elementor), served via GitHub Pages.

## Structure
- `viewer/AP_Viewer.html` – spin viewer. Resolves assets relative to its own location (`../`).
- `EXT_xxx/`, `INT_xxx/` – 90-frame WebP spins (`frame_0000.webp` …) per aircraft.
- `*.png` – viewer icons and slider cursor.
- `Air2Air/`, `Section/`, `Animation/` – static CGIs and clip.
- `index.html` – standalone preview of the fleet render (viewer + interior gallery). `?jet=VDN`

Keep the folder structure: the viewer builds `<base>/<slug>/frame_NNNN.webp`.

## Elementor
Point the fleet HTML widget to:

```js
const urlBase = "https://hookladder.github.io/aps-jet-fleet-wp-sync/viewer/AP_Viewer.html?slug=EXT_";
const urlParams = "&ext=webp&mode=eager";
```

## Local preview
`fetch()` needs HTTP, not `file://`:

```bash
python3 -m http.server 8765
```
