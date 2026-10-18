# Mobile optimization — 18 October 2026

Mobile preserves the desktop animation sequence: scroll-scrubbed home film, continuous truck journey, container loading, truck rotation, road bend, industries, ship and globe. It does not replace those scenes with static cards or autoplay video.

## Live review

Run `npm run dev`, then open `http://127.0.0.1:3000/`. Review the real page at phone, tablet, landscape and desktop widths. The old `/mobile-preview` URL now redirects to the real website: there are no review controls or simulated device frames in the visitor experience.

## Implementation

- The same 40-phase journey renderer and source animation frames run on desktop and mobile. Portrait layout changes position and size, without dropping phases. Mobile uses 19 viewport lengths for the complete journey; desktop retains 27.
- The home text overlays the transport scene. The film stays paused: scrolling seeks its frames forwards or backwards. The truck handoff continues into the original canvas journey. There are no autoplay or play/pause controls.
- The phone scroll-video copy is 960 × 540 at 30 fps, H.264, all-intra, no B frames, CRF 24, and fast-start metadata. It is 6,192,603 bytes versus 33,782,248 for desktop (82% smaller), while retaining independently seekable frames.
- All 191 journey frames/stills have mobile derivatives at up to 640 px. They are resized from the original photographic assets, with transparency retained. Their combined download is 2,372,224 bytes versus 7,878,260 (70% smaller). Mobile also bounds the decoded frame cache to 30–40 images. Regenerate with `node scripts/prepare-mobile-journey.mjs`.
- The About container drop, crane lowering/rotation and horizontal feature rail respond to vertical mobile scrolling. Desktop behavior is preserved. Mobile keeps crane shadows at 512 px and caps render pixel ratios.
- The Services aircraft still crosses the screen and reveals the title as the visitor scrolls. It is not replaced with a static plane.
- Products retain the ingredient flight, lettering formation and interaction. Portrait and landscape both run the scroll sequence. Mobile uses a shorter scroll distance, tighter catalogue gaps and shorter cards/photos below the hero.
- Touch controls, growing product panels, 16 px contact inputs, menu focus management and safe-area support are retained. The existing enquiry workflow prepares an email draft.
- The operating system's explicit reduced-motion preference still provides an accessible fallback. Regular mobile visitors receive the animations.

## Mobile layout refinements

- A single 65 px transparent header now shows only the logo and Menu button. Its white fill, border and backdrop blur are removed. The Menu label switches between white and blue for contrast, and opening the menu reveals its readable white dropdown. Products, Blog, WhatsApp and the document links are inside the dropdown. The mobile review controls and framed preview have been removed; `/mobile-preview` redirects to the real website. Keyboard focus, Escape handling and scroll locking while the menu is open are retained.
- The footer uses a compact two-column layout, a smaller interactive map and grouped contact details. Its links now have 44 px touch targets. The measured 390 px layout is about 720 px tall, fitting inside a phone viewport with the header. No company links or contact details were removed in this optimization pass.
- The mobile film-to-canvas handoff waits for the final decoded frame, then transfers visibility to one truck. It does not crossfade two different truck frames. Reverse scrolling restores video ownership.
- The container-to-services transition now brings the blue surface and its text in together, finishing at phase 17.1 instead of leaving an empty blue interval. Duplicate foundation-container painting was removed.
- On mobile the ship reveal blends the white surface into the ocean instead of raising white panels. The cloud passes are softened while preserving their scroll movement. Desktop choreography remains unchanged.

## Verification

- Production build, TypeScript and route checks pass; the route check covers six main pages, 27 articles, 74 assets and unknown-article handling. ESLint has no errors; existing raw-image advisories remain.
- Mobile home verified with `continuous-motion` active, the compressed scroll source selected, and video paused. At hero progress 0.300 the decoded film time was 3.433 seconds; entering the journey left it paused at 9.8 seconds.
- Inspected truck turn at phase 8, service cards with the truck at phase 19, road turn at phase 26 and final globe at phase 39.
- Services aircraft/title reveal verified at scroll position 334 px and 39% reveal. Products verified with flying ingredients and all 395 letter particles forming PRODUCTS.
- About container verified at scroll progress 0.495 / animation time 2.881. Crane verified with lift progress 0.860 and rotation 234.2 degrees at its corresponding scroll position.
- Latest navigation/footer checks also cover 320 × 700 with no document horizontal overflow. Single-truck ownership was verified at hero progress 0.910 and restored to video at 0.840 on reverse scrolling. Container merge at phase 17 and ship reveal at 33.4 were visually checked.
- Responsive layout checks cover 360 × 800, 390 × 844, 430 × 932, 768 × 1024 and 844 × 390, plus desktop breakpoint restoration. Contact draft preparation, mobile navigation and product enquiry dialogs were also checked.

These are browser viewport/interaction checks, not physical iPhone/Android or throttled-network benchmarks. Device performance has not been measured on the client's phone.

## Latest performance and layout pass

- 58 derived WebP assets total 8.5 MB versus 49.4 MB for their sources, an 83% reduction for this image batch. Originals are retained. Run `node scripts/optimize-site-media.mjs` to regenerate them. `docs/media-optimization.json` records every input/output size.
- Product sprites, transparent bowls and the truck handoff use lossless WebP. Raw-pixel verification confirms identical dimensions, alpha and every visible pixel for all four animation assets.
- The home globe defers the Three.js module, textures and geometry until its journey phase approaches. A fresh desktop home page was verified with no initialized globe. Globe and About render loops stop when off screen or the document is hidden. The crane also skips out-of-view scroll rendering.
- The transparent mobile header follows the current scene contrast, and hero contrast avoids the unnecessary second pixel readback on mobile. Guards prevent zero-size canvas sampling during navigation.
- The full-screen route loading overlay has been removed, with no replacement loading bar. Content and posters remain usable while heavier assets initialize.
- Catalogue cards, service cards, About section spacing, the journal filters and Contact layout are more compact. Product panels still grow to show all types and grades. Globe controls are separated from the office caption.
- Phone checks covered menu open/close, About container scrolling, Services flight and details dialog, product lettering and expandable types/enquiry dialog, journal search (three ginger stories), and Contact fields. No enquiry was submitted.
- Reviewed 320 px, 390 px, 768 px and 1440 px viewports; observed document widths match their viewports. The old review URL returns a relative 307 redirect, preserving whichever host the visitor used, including a phone's LAN URL.
