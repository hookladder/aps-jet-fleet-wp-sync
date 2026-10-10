# APS Jet Fleet – WP Sync

Self-hosted 360° jet viewer for the Air Partners fleet page (Elementor), served via GitHub Pages.

## Structure
- `viewer/AP_Viewer.html` – spin viewer. Resolves assets relative to its own location (`../`).
- `EXT_xxx/`, `INT_xxx/` – 90-frame WebP spins (`frame_0000.webp` …) per aircraft.
- `*.png` – viewer icons and slider cursor.
- `Air2Air/`, `Section/`, `Animation/` – static CGIs and clip.
- `fleet/fleet.js`, `fleet/fleet.css` – fleet render (viewer iframe, interior gallery, lightbox) used by Elementor.
- `index.html` – local preview using the same files. `?jet=VDN`

Keep the folder structure: the viewer builds `<base>/<slug>/frame_NNNN.webp`.

## Elementor
One HTML widget replaces both old widgets (viewer + gallery + lightbox):

```html
<link rel="stylesheet" href="https://hookladder.github.io/aps-jet-fleet-wp-sync/fleet/fleet.css">
<div id="aps-fleet" data-jet="VDN"></div>
<script src="https://hookladder.github.io/aps-jet-fleet-wp-sync/fleet/fleet.js" defer></script>
```

- Fleet menu items with `id="f_xxx"` (e.g. `f_vdn`) switch the jet.
- `?jet=XXX` in the page URL overrides `data-jet`.
- Gallery photos are listed in `fleet/fleet.js` (`GALLERY`); jets without photos hide the gallery.

## Local preview
`fetch()` needs HTTP, not `file://`:

```bash
python3 -m http.server 8765
```
