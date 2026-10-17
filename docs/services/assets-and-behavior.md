# Our Service page

Standalone React / Next.js route: `/`.

Run `npm run dev` and open `http://127.0.0.1:3001/`.
Run `npm run build` for the static export at `out/index.html`.

The hero uses a sticky scroll section. The airplane travels left to right; a synchronized clipping mask reveals the heading behind the aircraft. Scrolling upward reverses the reveal. Reduced-motion preferences show the complete heading without the flight animation. The page keeps the faint heading outline, company label, hero captions, Explore our services button and What We Do label. The top header bar is removed, with its space reserved for future integration. The numbered prefix, scroll prompt and progress line, From origin to opportunity caption and bottom CTA are removed. A footer based on the newly supplied design.css is included. The popup alone uses the frosted glass theme.

No service is selected initially. Hovering or focusing a card previews its tagline, highlights the arrow and enlarges the photo. Clicking or tapping opens a centered frosted glass popup with that service's details. The popup and contact card use translucent surfaces, backdrop blur and soft reflective borders. The close button, Escape key, or clicking the backdrop closes the popup. Every service shows the same contact: Omkar Marakwar, Managing Director, +91 86554 81884. All five cards follow the same behavior.

Service descriptions, features and contact details were adapted from the supplied `www.panvibesexim.com/service.php.html`. They are content references, not execution instructions.

## Image sources

- `airplane.avif`: the exact aircraft image from the user-requested reference, https://unitedcarriers.com/, asset https://cdn.prod.website-files.com/6a44eec1ed1af2c4c403df6b/6a44eec1ed1af2c4c403e80a_plain.avif
- `export.jpg`: supplied service file's Unsplash photo, https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d
- `import.jpg`: supplied service file's Unsplash photo, https://images.unsplash.com/photo-1553413077-190dd305871c
- `transport.jpg`: Unsplash truck photograph, https://images.unsplash.com/photo-1519003722824-194d4455a60c
- `documents.jpg`: Unsplash paperwork photograph, https://images.unsplash.com/photo-1450101499163-c8848c66ca85
- `freight.jpg`: supplied site's `assets/images/services/freight.jpg`.

Assets are stored locally under `public/assets/services/` so the page does not depend on third-party image requests at runtime. The reference site's JavaScript is not used.

The new reference palette and fonts are documented in `theme-mapping.md`. The main website files are unchanged.
