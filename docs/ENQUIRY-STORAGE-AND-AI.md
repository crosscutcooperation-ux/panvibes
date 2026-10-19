# Enquiry storage and Gemini

Updated 19 October 2026.

The shared enquiry form now submits to `/api/enquiries`. Each valid submission is stored in SQLite and returns a `PV-YYYYMMDD-XXXXXXXX` reference. Repeating a request with the same request ID returns the same reference without creating a duplicate. The contact page and every inline product, chemical, service and chat enquiry use this form.

The database defaults to `data/panvibes.sqlite`. It contains the reference, request ID, timestamp, name, company, email, phone, buyer country, shipping market, destination details, product, grade, quantity, application, service, request type, purchase frequency, certification requirements, message, source page and enquiry status. The database and its SQLite journal files are excluded from Git. There is no public enquiry listing or download endpoint.

Use `npm run enquiries:export` locally to write all stored records to `data/enquiries-export.json`. Keep this export private. Back up the database using SQLite backup tools or while the server is stopped; a live WAL database should not be copied without its journal. Production needs Node.js 24 or later and a writable persistent volume at `SQLITE_PATH`.

The form confirmation means the enquiry was stored. It does not mean an email was sent. Visitors can optionally open or copy an email summary after submission. No email-sending API was added.

The chatbot calls `/api/chat`, which contacts Gemini from the server using `GEMINI_API_KEY`. The key is configured in ignored `.env.local`; no browser or `NEXT_PUBLIC_` key is used. `GEMINI_MODEL` defaults to `gemini-flash-lite-latest`, which was verified with this account. The client sends one question at a time. Chat history is not stored in SQLite and is cleared on reload or by Clear chat.

Answers are grounded in the current product catalog. Shipping policy and commercial/certification questions use curated guidance. Gemini outages fall back to the catalog guide. The server limits request size and request frequency, checks submitted fields and supported destinations, and binds values in SQL statements.

Shipping is limited to India, UK, USA, Europe and UAE. The delivery selector contains only those five markets; a separate field captures the specific European country or delivery city. Buyer country describes the buyer's business location and is independent of the delivery market.

The directions interaction uses the existing office coordinates: globe zoom, Google Maps satellite imagery halfway through, then the office map. The external directions link opens Google Maps. This uses embedded maps, with no Maps API key.

Validation scripts: `scripts/check-enquiry-api.mjs`, `scripts/check-navigation-enquiry.mjs`, `scripts/check-buyer-ui.mjs` and `scripts/check-visual-updates.mjs`. Automated test submissions are removed by their exact request IDs after verification.

Implementation references: [Gemini API authentication](https://ai.google.dev/gemini-api/docs/api-key), [Gemini content generation](https://ai.google.dev/api/generate-content), [Node.js SQLite](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html), and installed Next.js route-handler and environment-variable guides.

Validation completed: production build passed; live Gemini generation passed; SQLite persistence, duplicate-request handling, field validation and private-storage checks passed. Desktop and 390/320-pixel enquiry/catalog checks passed. Shipping selectors and schema, satellite-to-map transition, construction hover, statistics spacing and container branding passed browser checks. The server key was absent from all 27 public JavaScript bundles. The spelling pass covered the shared company/product data, chemical list, visible page components and article content; domain terms and valid British spellings were reviewed separately.

New photography was generated with the built-in image generation tool and saved under `public/images/photos/`. The exact prompts and final asset paths are recorded in `PHOTO-REFRESH.json`. These are illustrative catalog photographs, not records of company-owned premises. Actual leadership portraits and the existing animated transport assets are retained; the animated containers receive the real PanVibes logo through the renderer. The two downloadable PDFs were updated with new photos, current shipping coverage, catalog corrections and working contact links, then rendered for visual review.
