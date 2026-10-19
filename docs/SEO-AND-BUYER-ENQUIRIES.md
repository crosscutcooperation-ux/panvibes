# Buyer content, search and enquiries

Current status (19 October 2026): enquiries now save to SQLite and the assistant uses a server-side Gemini connection. Shipping is restricted to India, UK, USA, Europe and UAE. Earlier dated implementation notes below describe the previous offline version; see [current storage and AI setup](ENQUIRY-STORAGE-AND-AI.md).

Implemented 17 October 2026 using the owner's chemical PDF and marketing master document. The documents are product and positioning references, not authorization to connect accounts, publish private records, send outreach or invent claims.

## Content

- Eight distinct food ingredient/category pages under `/products/`: dehydrated vegetables, ginger, turmeric powder, moringa powder, makhana, fruit powders, banana powder and spices. Forms, grades, curcumin options and makhana selections follow the supplied document.
- `/products/chemicals`: all 51 source listings in nine groups. Repeated products remain in their original groups. Search normalizes Unicode subscripts so `H2SO4` finds `H₂SO₄`. The previous ethanol-only chemical listing has been replaced.
- `/quality`: procurement specifications, testing review and document requests. No claim that every test or certificate exists for every product.
- `/export-from-india`: target-market requirements, packaging questions, logistics and the buyer journey. Target markets are not represented as completed shipments or guaranteed supply destinations.
- Home and product catalog link to the new pages. Existing food/industrial separation and animated scenes remain.
- Potential products in the master document are not automatically represented as stocked products. Prices, MOQ, shelf life, numeric QC limits, lead times, certification IDs and manufacturing claims require owner confirmation.

## SEO, AEO and GEO

The request's AGO/EGO terminology is interpreted as AEO (answer engine optimization) and GEO (generative engine optimization), alongside SEO.

- Page-specific titles, descriptions, canonical URLs, Open Graph and Twitter cards, using the existing `https://www.panvibesexim.com` domain.
- `/robots.txt`, `/sitemap.xml`, a generated 1200 × 630 social image, and crawlable links from the homepage/catalog/footer.
- Server-rendered product information, chemical listings and FAQs, available without executing JavaScript.
- Escaped JSON-LD for Organization, Product, Article, BreadcrumbList, FAQPage and the chemical collection. Structured facts correspond to visible content. No invented price offers, reviews, ratings or certification schema.
- Visible product and procurement answers for buyers and search systems. No keyword-stuffed country-page duplication, hidden claims or AI prompt manipulation.
- Product schema without offers/reviews is descriptive; it does not promise eligibility for a Google product rich result. FAQ markup likewise does not promise a FAQ rich result for a commercial site.
- Google and Bing discoverability remains subject to deployment, crawling, indexing, content quality and their systems. No ranking, citation, traffic or sales outcome is guaranteed.

References checked during implementation:

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- Installed Next.js guides in `node_modules/next/dist/docs/` for metadata, JSON-LD, dynamic segments, robots, sitemap and ImageResponse.

## Contact features and API status

The compact side widget uses deterministic responses from website content and curated documentation guidance. It is explicitly labelled an automated catalog guide with no live agent or AI API connection. Conversation stays in component memory, is capped, and is discarded on reload; no chat transcript is stored or sent to a service. Clearing chat removes the visible history.

The side email shortcut uses `mailto:info@panvibesexim.com`. The enquiry form collects name, company, buyer country, email, phone, product, grade/form, quantity, application, delivery country, frequency, certification needs and message. Product, country and request-type links prefill the relevant fields. It displays a reviewable draft and offers mail-app handoff and copying. It does not send or save the enquiry to a server.

No Google, Gmail, Gemini, analytics, Search Console or other new API connection or credentials were added. Existing map and WhatsApp links remain as supplied. A future Google integration needs a defined service and server-side implementation; API keys must never be placed in browser code or `NEXT_PUBLIC_` variables. Gmail sending may also require OAuth or an authorized server setup rather than an API key alone.

## Owner information still needed

- Confirmed product specifications, MOQ, packing sizes, shelf life, sourcing capacity, prices and lead times.
- Actual certificates and reports with product scope, dates, validity and permission to share.
- Confirmed destinations supplied, ports, FCL/LCL options, Incoterms and payment terms.
- Approved photographs, social profile URLs and any updated company identity/contact details.

After deployment, the owner can submit the sitemap to Google Search Console and Bing Webmaster Tools, validate structured data against the public URLs and monitor qualified enquiries. These external account actions were not performed.

## Verification

`npm run build`, `npm run lint` and `npm run check:site` are the repository checks. The site check covers existing and new routes, unique titles/descriptions, route-specific canonicals, JSON-LD, all chemical listings, CTAs, sitemap, robots, social image and assets. `node scripts/check-buyer-ui.mjs` additionally covers chemical filtering, chat, email draft preparation, same-route enquiry links and 320/390-pixel layouts. The browser script needs an existing Playwright installation (or `PLAYWRIGHT_MODULE` pointing to one); `SITE_URL` selects the running preview. Screenshots are written to ignored `.next/buyer-review/`.

Validation completed on 17 October 2026: production build passed; full lint passed with zero errors and 16 existing image warnings; site checks passed for 17 pages, 27 articles and 59 assets; all browser checks passed with no runtime errors. Every chemical group and listing was also compared against the PDF's extracted text. Production preview uses port 3001 because the pre-existing development server on port 3000 did not respond during verification.

Visual follow-up: restored the original “Your Vision, Our Expert Execution” homepage title; moved ingredient links after the product range; let desktop food panels grow with all types and grades; lowered the About container to the bottom of its scene; applied shared mono-label tracking; replaced the dot cursor with a lightweight SVG ship. The chemical catalog now pairs category controls with a Name / Formula sheet on both the product page and chemical directory. Base formulas are identification aids rather than product specifications; variable polymers, unspecified oxide/oxidation states and hydration require confirmation.

18 October interaction refinement: on the product page, Chemicals starts as a compact card alongside the two other industrial cards. Hovering reveals the groups with a downward slide; hovering a group opens its adjacent Name / Formula flyout. The pointer can move into the flyout without dismissing it. Button, keyboard and Escape controls are provided; narrow screens use tap-to-toggle inline sheets. The dedicated searchable directory remains available. Production build, targeted lint, site checks and browser checks at 1440, 390 and 320 pixels passed, including product enquiry actions.

18 October catalog and enquiry update: removed Dehydrated Sprouts and Indian Flavours Ready in Minutes. Spices remains. Nutraceuticals now lists only Moringa Powder and Ashwagandha, and dehydrated fruits only Banana Powder. Added an Ashwagandha sourcing page without unsupported medicinal claims or assumed specifications; the Fruit Powders page now describes Banana Powder only. Navigation text samples the backdrop beneath individual links and chooses blue or white for visibility, including media backgrounds. The shared enquiry dialog opens on the current screen from product/chemical actions, service dialogs, quote buttons and chat handoffs, with context prefilled. The global side Enquiry button opens the same form. Escape, close and outside-click controls preserve the underlying route and scroll position. No API connection was added. `scripts/check-navigation-enquiry.mjs` covers background contrast, catalog contents, form prefilling and mobile dialog bounds; `scripts/header-contrast.test.mjs` covers contrast selection.

Final validation for this update: production build passed; full lint passed with zero errors and 16 existing image warnings; site checks passed for 18 pages, 27 articles, 51 chemical listings and 59 assets. Both browser scripts passed at desktop, 390 and 320 pixels, including product and service form prefilling, unchanged route/scroll, chat handoff, chemical hover/tap controls, all makhana options, and no runtime errors or API mutations. Contrast unit checks passed.
