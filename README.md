# PanVibes Exim — complete website

The catalog now includes nine ingredient sourcing pages, a searchable nine-group chemical directory, quality/documentation and export guidance, plus a side catalog assistant and email shortcut. Nutraceuticals contains only Moringa Powder and Ashwagandha; dehydrated fruits contains only Banana Powder. Dehydrated Sprouts and Indian ready-made food have been removed from the catalog. Gemini is connected server-side, and submitted enquiries are saved in SQLite. Shipping is limited to India, UK, USA, Europe and UAE. See [storage and AI setup](docs/ENQUIRY-STORAGE-AND-AI.md). See [buyer content and search implementation notes](docs/SEO-AND-BUYER-ENQUIRIES.md) for scope, source boundaries, API status and validation.

One Next.js application contains all six supplied pages, with a shared transparent header that hides on downward scrolling and returns on upward scrolling anywhere on the page, centered navigation, footer, blue/coral theme and normal browser cursors. Home uses the restored desert-road film with perspective-tracked transparent PanVibes branding on its container. Separate 720p desktop and 432p mobile H.264 web copies follow scrolling in either direction and stay paused when scrolling stops; the original footage and masters are preserved. Short keyframe intervals keep seeking responsive while reducing desktop video transfer by 84%. The original PNG truck silhouette carries matching branding into the journey below, with its landing aligned to the following canvas. Hero copy starts white and blends to blue over the pale overhead scene, without a title background gradient. Food panels expand to fit every option. The industrial section has a chemical group selector and adjacent Name / Formula table, followed by aggregate and construction admixture cards. Ingredient landing-page links follow the product range. Categories and types open enquiry popups, the globes rotate on hover, and the office-map button dives into the globe before revealing the Google map. See [Lightsail deployment and video performance](docs/LIGHTSAIL.md) for bounded loading, media fallback, static serving and production runtime settings.

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

The shared enquiry form opens over the current page from the side Enquiry button, product and chemical actions, service dialogs, quote buttons and chat handoffs. It prefills the selected product or service and preserves the page and scroll position. The contact page uses the same form. It saves each submitted enquiry in SQLite and returns a unique reference. Visitors can optionally open or copy an email summary after submission. Navigation text samples its underlying background and switches between brand blue and white for visibility. Social profile destinations still need the company's actual profile URLs; no profiles have been invented. Brochure/profile buttons in the header, mobile menu and footer serve the supplied premium PDFs from public/documents/, using the shared URLs in lib/site-content.ts.

The homepage video, reversible journey, product ingredient formation, About 3D scenes, service dialogs, blog filters and interactive footer map are retained. Reduced-motion and touch behavior remain available. Normal browser cursors apply across the site, including links, inputs and dialogs. Shared mono labels use consistent letter and word spacing, and the About container lands at the bottom of its scene.

See `docs/REFINEMENTS.md` for the latest screenshot refinements, validation and logo-edit provenance. `docs/WEBSITE-REVIEW.md` records the earlier integration review; its preview screenshots predate the refinements.

## Responsive review

Open `http://127.0.0.1:3000/` for the actual website. It adapts to the available phone, tablet or desktop width. The old `/mobile-preview` link redirects to the website, with no review controls or device frame. See `docs/MOBILE-OPTIMIZATION.md` for the mobile layout, media and verification details.
