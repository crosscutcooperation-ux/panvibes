# Product page, navigation and brand metadata

Deployed application release: `fa158151d0629001649b7b88c1a85f49220fdd6c` at
https://16.176.182.103/products on 22 October 2026. The Linux build, public
desktop/mobile navigation and product checks, site metadata/catalog checks,
icon delivery and SQLite integrity check passed. Nginx serves the versioned
product images with immutable yearly caching. Previous service/Nginx
configuration and a SQLite snapshot are retained at
`/var/backups/panvibes-products-20261022T072245Z/`. Runtime credentials, database
location, HTTPS and DNS settings were preserved.

The product hero retains the original six-bowl composition, ingredient flight,
PRODUCTS lettering, hover burst and reverse scrolling. Offline-generated WebP
copies keep alpha and the same aspect ratios, sized for the rendered sprites:

| Three hero images | Bytes |
| --- | ---: |
| Original sprites + table sources | 2,607,198 |
| Desktop copies | 273,012 |
| Mobile copies | 93,516 |

These are source-image byte totals, not an overall page-speed multiplier. The
old table also passed through Next's image optimizer, so its transfer could vary.
The new pre-encoded table bypasses request-time transformation. Viewport-specific
HTML image hints and a picture source select only the appropriate three images.
Sprites respond to breakpoint changes. Food-letter target sampling is reused
across client-side visits, and desktop canvas pixel density is capped at 1.5.
Original source files remain for future editing.

`SiteLink` wraps Next Link with a descendant `useLinkStatus` signal. Pending
navigation renders a small accessible blue/coral spinner in a body portal;
completion/cancellation lets Next remove it. It does not intercept click events,
use guessed route timers, delay cached transitions or change links opening in
new tabs. Internal pill links now use the same client-side navigation. Header,
footer, journal, product and other existing Next links use the shared wrapper.
Reduced-motion visitors see a stationary indicator. The homepage's full
animation readiness screen remains separate.

Browser titles lead with `PanVibes Exim`. The homepage is
`PanVibes Exim | Your Vision, Our Expert Execution`; page/product titles use
their human-readable names. SEO descriptions, canonical URLs and structured
data remain descriptive. The stock favicon is replaced by the existing
PanVibes mark, with 16/32/48px ICO, 192px PNG and 180px Apple touch icons.

Asset generation is offline:

```sh
node scripts/prepare-product-assets.mjs
node scripts/prepare-brand-icons.mjs
```

Production verification includes build/TypeScript/lint, desktop/mobile asset
selection without duplicate downloads, food formation and reverse scrolling,
complete Makhana types and enquiry pop-ups, a held navigation response proving
spinner visibility and cleanup, back navigation, mobile menu navigation,
brand-first titles, icon delivery, public-page/catalog/SEO checks and unchanged
unknown-page handling. Run `scripts/check-products-navigation.mjs` with
`BASE_URL` and an installed Playwright module (`PLAYWRIGHT_MODULE` if external).
