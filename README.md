# PanVibes Exim — complete website

One Next.js application contains all six supplied pages, with a shared transparent header that hides on downward scrolling and returns on upward scrolling anywhere on the page, centered navigation, footer, blue/coral theme and animated ship cursor. Home plays a 1080p copy of the latest supplied `1016_1.mp4`, with independently decodable frames optimized for smooth scroll seeking; the 1440p/60 fps source is preserved. Hero copy starts white and blends to blue over the pale overhead scene. Products are separated into food/nutrition and a compact row of three industrial categories with vertical expansion. Categories and types open enquiry popups, the globes rotate on hover, and the office-map button dives into the globe before revealing the Google map.

| Order | Page | URL | Source |
| --- | --- | --- | --- |
| 01 | Home | `/` | `app/page.tsx` |
| 02 | About Us | `/about` | `app/about/` |
| 03 | Services | `/services` | `app/services/` |
| 04 | Products | `/products` | `app/products/` |
| 05 | Blog | `/blog` | `app/blog/` |
| 06 | Contact | `/contact` | `app/contact/` |

The blog also includes the supplied individual articles at `/blog/[slug]`.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm start`. Check code with `npm run lint`.

## File organization

- `app/`: routes, route-specific components, styles and About animations.
- `components/`: shared navbar, footer, page shell, motion and homepage sections.
- `lib/`: shared content, contact information, product data and animation helpers.
- `public/images/` and `public/media/`: homepage/product/contact images, fonts and video.
- `public/assets/`: supplied About, Services and Blog photographs and their font licenses.
- `scripts/`: importing source content and preparing animation frames.
- `docs/`: website review and source notes for the supplied pages.
- `delete files/`: original standalone projects and confirmed unused files preserved for manual deletion. See its README and manifest.

Change navigation order and destinations in `lib/site-content.ts`. Shared navbar/footer changes apply to every page. The mobile menu exposes all six pages and both company documents. Services in the navbar opens the complete Services page; the original homepage services animation and detail dialogs remain available.

The contact form prepares an email draft and lets the visitor open their email app or copy the enquiry. It does not send directly to a server. Social profile destinations still need the company's actual profile URLs; no profiles have been invented. Brochure/profile buttons in the header, mobile menu and footer serve the supplied premium PDFs from `public/documents/`, using the shared URLs in `lib/site-content.ts`.

The homepage video, reversible journey, product ingredient formation, About 3D scenes, service dialogs, blog filters and interactive footer map are retained. Reduced-motion and touch behavior remain available. The outlined dot cursor applies on mouse devices, including dialogs, without an animation loop or artificial pointer delay.

See `docs/REFINEMENTS.md` for the latest screenshot refinements, validation and logo-edit provenance. `docs/WEBSITE-REVIEW.md` records the earlier integration review; its preview screenshots predate the refinements.

## Responsive review

Open `http://127.0.0.1:3000/` for the actual website. It adapts to the available phone, tablet or desktop width. The old `/mobile-preview` link redirects to the website, with no review controls or device frame. See `docs/MOBILE-OPTIMIZATION.md` for the mobile layout, media and verification details.
