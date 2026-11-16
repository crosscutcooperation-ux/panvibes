# PanVibes website update — SEO handoff

**Live website:** [panvibes.com](https://panvibes.com)
**Deployment date:** 15 November 2026
**Website release commit:** [`974e50ab89322a05ceac4befdc03d5637003ea28`](https://github.com/crosscutcooperation-ux/panvibes/commit/974e50ab89322a05ceac4befdc03d5637003ea28)
**Canonical domain:** `https://panvibes.com`

## P1 — contact details and enquiry form: live

- The public website, product enquiry popup, desktop/mobile contact links, footer, WhatsApp actions, and downloadable brochure/company profile now use **+91 86554 81884** and **omkar@panvibes.com**. The PDF contact links and QR codes point to `panvibes.com`.
- The enquiry form at [panvibes.com/contact](https://panvibes.com/contact) has two location fields: required **Your country** and optional **Delivery destination (country / city)**. Only name, email, your country, product required and quantity are required. The server validates the same five fields. Older saved enquiry records retain their historical database field; new enquiries use the simplified destination field.
- Product and COA links can prefill the product and request type. The COA request type is **COA & specifications**.

## P2 — buyer trust and export content: live

- [Quality](https://panvibes.com/quality) shows both redesigned laboratory summary cards from the supplied buyer HTML. [Ginger](https://panvibes.com/products/ginger) and [Makhana](https://panvibes.com/products/makhana) each show their own card. The cards identify the third-party lab and tested-lot results; full laboratory COAs remain available on request.
- The ginger page also includes a separate **PanVibes specification sheet** with forms, grades, origin, physicochemical and microbiological values, GMO/allergen statement, shelf life and commercial terms. It is expressly labelled as a specification, not a laboratory COA.
- The makhana page includes sizes, selection options and commercial terms. Its microbiology and aflatoxin results remain in the laboratory summary card.
- The sitewide footer lists **FSSAI Central License 11525998000895**, **Spice Board Registration (Merchant Exporter) CRES/SBCB/27019/2025-2026**, and **IEC AAQCP2809P**.
- [Export from India](https://panvibes.com/export-from-india) states MOQ **50 kg**, **FOB / CIF / DDP**, Indian origin, and bulk/custom/private-label packaging on request. Product pages and the website assistant now use the 50 kg MOQ. No INR prices were found in export or product content; quotes remain on request.

## P3 — privacy and tracking: live

- [Privacy Policy](https://panvibes.com/privacy) covers enquiries, Google Analytics 4, Meta Pixel, cookies, website assistant processing, retention and contact rights.
- Visitors see a cookie-choice banner. **GA4 (`G-ZN15YNQLKK`) and Meta Pixel (`4451149778467989`) load only after consent** for their respective categories. Visitors can reject optional tracking, choose categories independently, accept all, and change their choice through the footer. Withdrawing consent stops future loading and removes accessible first-party tracking cookies.
- The earlier [12 November analytics handoff](SEO-ANALYTICS-HANDOFF-2026-11-12.md) describes the original integration. This update supersedes its statement that tags load immediately after page interaction.

## Search Console and release checks

- [sitemap.xml](https://panvibes.com/sitemap.xml) is live and includes the Privacy Policy. Canonicals remain on `panvibes.com`; `panvibesexim.com` was not made the master domain.
- After deployment, 21 main pages, 27 articles, 105 assets, metadata, canonical URLs, structured data, robots.txt, sitemap and missing-page handling passed the site check. The Quality, Ginger, Makhana, Export, Contact and Privacy pages returned HTTP 200 with the new content. Both public PDFs matched the committed files by SHA-256. PanVibes, PanPops and Nginx remained active.

## Mail routing detail

**16 November public contact update:** Website contact links and both PDFs now show `omkar@panvibes.com`. The phone number remains +91 86554 81884. The update is deployed from [commit `69af425`](https://github.com/crosscutcooperation-ux/panvibes/commit/69af4251787d0d4aca4363e107cca797925b78e2); all checked public pages returned HTTP 200 and both public PDFs matched the committed files.

**16 November 2026 update:** Gmail accepted authentication for `enquiry@panvibes.com` using its app password. The production website now uses that address as its SMTP sender and sends enquiry notifications to `omkar@panvibes.com`. Admin password-reset codes also go to `omkar@panvibes.com`. The app password is stored only in the server environment file and is not in GitHub. Authentication and website service health were verified; no test email was sent.
