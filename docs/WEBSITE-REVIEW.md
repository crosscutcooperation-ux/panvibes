# PanVibes website review

This is the original integration review. See [the latest screenshot refinements](REFINEMENTS.md) for the current header, logo, interactions and validation limitations; the screenshots below predate those refinements.

Reviewed on 15 October 2026. The project root is the complete, integrated website. Start the preview at http://127.0.0.1:3000.

## Six connected pages

| Order | Page | Route | Retained content and behavior |
| --- | --- | --- | --- |
| 01 | Home | `/` | Supplied video, reversible truck/container journey, service details, industries and globe |
| 02 | About Us | `/about` | 3D container entrance, company introduction, founder/team, crane and five feature cards |
| 03 | Services | `/services` | Airplane reveal, five service cards and detailed contact popups |
| 04 | Products | `/products` | Ingredient animation and 13 expandable product categories |
| 05 | Blog | `/blog` | Animated title, category/search filters and all 27 supplied articles |
| 06 | Contact | `/contact` | Interactive globe/map, business contacts and email-draft enquiry form |

All pages use the shared homepage Navbar and Footer components. Inner pages retain the fixed white header variant already used by Products and Contact. The six destinations appear in the same order in the desktop navbar, mobile menu and footer. Services now opens its dedicated page; homepage service popups remain intact.

The supplied royal blue `#104e87`, deep blue `#0a3866`, coral `#e5643d` and white palette carry across the pages. The existing frosted service popup is retained with a coral accent. The round dot cursor has an outlined ring and a contrasting white edge; it uses the browser's native cursor mechanism and applies on mouse devices, including the About shadow-DOM scenes. Touch interactions remain native.

## Verification

- Production build and TypeScript check passed.
- ESLint completed with **0 errors** and **16 image-optimization warnings** from the supplied native image elements. Their existing sizing/layout is retained.
- `npm run check:site` verified all six main routes and all 27 article routes return 200, contain shared navigation/footer and link to every main page. It also verified 58 directly referenced assets/scripts/styles return 200, CSS module classes are present, and invalid articles render the not-found page with `noindex`.
- At **1280 × 800** and **390 × 844**, every main page rendered with a header/footer and no horizontal document overflow. No broken loaded images or undefined CSS module classes were found in the desktop checks.
- Browser checks covered mobile menu navigation and automatic closing, Services popup opening and Escape dismissal, Blog search (`ginger` returns three stories) and article navigation, About canvas re-entry, keyboard expansion of product types, and Contact enquiry preparation with synthetic test data. No message was sent.
- Browser diagnostics found a platform shader precision warning, without a rendering failure. A removed Three.js shadow-map option was replaced with its supported counterpart.

The existing CSS loader was overriding native CSS Module handling. It was removed after browser testing exposed missing Services/Blog styles. The integrated site now uses Next.js's built-in CSS handling. About reveal/card effects now initialize on route entry and clean up their listeners; the standalone page's global scroll-reset behavior was removed so navigation/history can work normally.

Unknown article URLs can have HTTP 200 after the Next.js streaming shell has begun, while rendering the not-found UI with `noindex`. The check script validates that behavior explicitly.

## Items that still need business input or hosting work

1. **Enquiries:** the supplied Contact form prepares an email draft or copies the enquiry. Direct website delivery needs an email/backend service. It currently does not claim to send automatically.
2. **Social profiles:** footer social buttons remain inactive because verified company URLs were not supplied. The About team links still point to the generic social sites provided in the original page; replace these with actual individual profile URLs when available.
3. **Company PDFs:** brochure and profile buttons now use the two URLs already present in the company data. This environment timed out while trying to verify those external PDFs; confirm them on the production host or supply local PDFs.
4. **Performance:** the image-optimization recommendations and existing large animation/video payloads can be addressed separately. This integration retains the supplied media and animation designs.
5. **Copyright:** the shared footer retains the supplied 2025 copyright value.

## Files preserved for deletion review

`delete files/` contains the original standalone projects, ZIP backups, generated builds/dependencies, previous hero renderer/media, unused placeholder components, starter SVGs and old cursors. Nothing was permanently deleted. `delete files/manifest.json` records **34 moved entries**, some of which are whole directories; the previous root README is also preserved there.

The active project does not import from that folder. Git, TypeScript and ESLint exclude the archive. The complete folder may be manually deleted after review; retain it if the older standalone versions or source media are useful.

## Visual previews

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | [View](previews/home-desktop.jpg) | [View](previews/home-mobile.jpg) |
| About | [View](previews/about-desktop.jpg) | [View](previews/about-mobile.jpg) |
| Services | [View](previews/services-desktop.jpg) | [View](previews/services-mobile.jpg) |
| Products | [View](previews/products-desktop.jpg) | [View](previews/products-mobile.jpg) |
| Blog | [View](previews/blog-desktop.jpg) | [View](previews/blog-mobile.jpg) |
| Contact | [View](previews/contact-desktop.jpg) | [View](previews/contact-mobile.jpg) |

Animated pages should also be reviewed live: a single screenshot shows only one point in the animation.
