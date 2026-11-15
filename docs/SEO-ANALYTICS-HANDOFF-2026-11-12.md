# PanVibes SEO, Analytics and Quality Content Handoff

**Website:** [https://panvibes.com](https://panvibes.com)

**Deployment date:** 12 November 2026

**GitHub repository:** [crosscutcooperation-ux/panvibes](https://github.com/crosscutcooperation-ux/panvibes)
**Deployed commit:** [`306bfc9e69244a8830832897a4cbeec26aaf7f4a`](https://github.com/crosscutcooperation-ux/panvibes/commit/306bfc9e69244a8830832897a4cbeec26aaf7f4a)

## Executive summary

Google Analytics 4, Meta Pixel and Google Search Console verification have been integrated and deployed to the live PanVibes website. Lead and contact conversion events are connected to the website's enquiry and WhatsApp actions. Representative laboratory-result cards were also added to the Quality, Ginger and Makhana pages.

The release was published to both GitHub and the production AWS server. Public SEO, metadata, asset, startup and media-delivery checks passed after deployment.

## 1. Google Analytics 4

The following GA4 Measurement ID is installed site-wide:

```text
G-ZN15YNQLKK
```

The Google tag is loaded with Next.js's optimized script component after the page becomes interactive.

### GA4 events implemented

| Website action | GA4 event | Parameters |
|---|---|---|
| Initial page load | `page_view` | Standard GA4 page information |
| Successfully saved enquiry | `generate_lead` | `product`, `country`, `reference` |
| Enquiry button click | `contact` | `source: enquiry_button` |
| WhatsApp or export-sales click | `contact` | `source: whatsapp` |

The `generate_lead` event is sent only after the enquiry API confirms that the enquiry was saved successfully. Failed submissions do not produce a lead event.

## 2. Meta Pixel

The following Meta Pixel/Dataset ID is installed site-wide:

```text
4451149778467989
```

### Meta events implemented

| Website action | Meta event | Parameters |
|---|---|---|
| Initial page load | `PageView` | Standard page information |
| Successfully saved enquiry | `Lead` | `product`, `country`, `reference` |
| Enquiry button click | `Contact` | `source: enquiry_button` |
| WhatsApp or export-sales click | `Contact` | `source: whatsapp` |

The tracking IDs are format-validated before being inserted into browser scripts. If an invalid or blank ID is configured, that analytics integration does not load.

## 3. Contact actions covered

Contact tracking was applied to the shared enquiry-button component, so it covers enquiry buttons throughout the site. WhatsApp tracking was applied to these entry points:

- Mobile navigation WhatsApp link
- Service-detail WhatsApp links
- Product-enquiry WhatsApp link
- “Talk to Export Sales” links on product pages

## 4. Google Search Console

The Google Search Console verification token is installed in the root Next.js metadata:

```text
lQTr3PGNnCMmdUTdaRGump3BZnrwxfdkuWewFtaFo7k
```

It renders on live pages as:

```html
<meta name="google-site-verification" content="lQTr3PGNnCMmdUTdaRGump3BZnrwxfdkuWewFtaFo7k">
```

The SEO/Search Console administrator can now click **Verify** for the `panvibes.com` property.

## 5. Quality and COA content added

Representative laboratory-result summaries were added without publishing the underlying raw laboratory PDF reports.

### Quality page

URL: [https://panvibes.com/quality](https://panvibes.com/quality)

The page displays both:

- Dry Ginger pesticide-residue summary
- Makhana/Fox Nuts microbiological and aflatoxin summary

### Ginger product page

URL: [https://panvibes.com/products/ginger](https://panvibes.com/products/ginger)

The page displays the Dry Ginger summary, including:

- 527 pesticide molecules tested
- Analysed pesticides reported as below the limit of quantification for the tested lot
- EU Regulation (EC) 396/2005 context
- Laboratory, accreditation, report number and report date

### Makhana product page

URL: [https://panvibes.com/products/makhana](https://panvibes.com/products/makhana)

The page displays the Makhana/Fox Nuts summary, including:

- Coliform, yeast and mould, and Enterobacteriaceae results
- Salmonella result
- Aerobic plate count
- Total aflatoxin result
- Laboratory, accreditation, report number and report date

Each summary links to the enquiry form with the purpose prefilled as **COA and specifications**. Full reports remain available only on request.

## 6. Technical and security implementation

- Analytics IDs are supplied through production environment variables and compiled into the public browser bundle as required by Next.js.
- Private server credentials and the SSH key were not committed to GitHub.
- No `.env` files are included in the deployed release artifact.
- The production environment file remains permission-restricted on the server.
- The Next.js application listens only on `127.0.0.1:3000` behind Nginx.
- Public traffic is served over HTTPS.
- `www.panvibes.com` redirects to the canonical `https://panvibes.com` domain while preserving paths.
- The existing enquiry database was preserved during deployment.
- Raw laboratory-report PDFs were not added to the public website.

## 7. Post-deployment validation completed

The following checks passed:

- Production Next.js build and TypeScript validation
- ESLint with no errors
- 11 automated repository tests
- 21 public pages and 27 articles
- Unique metadata and canonical URLs
- JSON-LD structured data
- Sitemap and robots.txt
- Social image and shared contact widgets
- 103 referenced assets
- Homepage and 11-route startup/readiness checks
- Protected admin-route check
- Desktop, mobile and data-saver video delivery
- MP4 byte-range requests and versioned caching
- Nginx configuration validation
- Production service health
- Production dependency audit: zero known vulnerabilities
- Live Search Console meta tag
- Live GA4 ID
- Compiled Meta Pixel ID
- Live Ginger and Makhana quality summaries

## 8. Actions for the SEO/marketing team

1. Open Google Search Console and click **Verify** for `panvibes.com`.
2. Open **GA4 Realtime** and visit the website to confirm `page_view`.
3. Submit a controlled test enquiry and confirm `generate_lead` in GA4 Realtime/DebugView.
4. Click an enquiry button and a WhatsApp link, then confirm the `contact` events.
5. Open **Meta Events Manager → Test Events** and confirm `PageView`, `Lead` and `Contact`.
6. Mark `generate_lead` as a key event/conversion in GA4 if it is not already configured.
7. Use the `Lead` event as the primary Meta ads conversion only after Test Events confirms the expected payload.
8. Exclude internal/team traffic from reporting where appropriate.
9. Confirm consent-banner requirements for every advertising market before activating paid campaigns.

## 9. Items not included in this release

The integration notes also listed content changes that require final commercial data from the PanVibes/SEO team. These were not guessed or published:

- Final product-specific specification tables
- Confirmed MOQ, packing and lead-time values
- Final decision on one public email domain and one WhatsApp number
- Any additional certification or compliance values not present in the supplied material

These items should be supplied as approved, product-specific values before a later content release.

## 10. Release reference

The code for this release is available in GitHub at:

[https://github.com/crosscutcooperation-ux/panvibes/commit/306bfc9e69244a8830832897a4cbeec26aaf7f4a](https://github.com/crosscutcooperation-ux/panvibes/commit/306bfc9e69244a8830832897a4cbeec26aaf7f4a)

## Update: company social profiles — 15 November 2026

**Live website:** [https://panvibes.com](https://panvibes.com)

**Social-link release:** [`a06404f67475ff1225ce25c522e4243aa3e6db84`](https://github.com/crosscutcooperation-ux/panvibes/commit/a06404f67475ff1225ce25c522e4243aa3e6db84)

The website footer now links to the four company profiles supplied by Robin. The About page's leadership cards use the same company profiles in place of generic social-platform homepages. The site's Organization JSON-LD `sameAs` field includes all four profiles alongside the existing YouTube channel.

| Platform | Company profile |
|---|---|
| Facebook | [facebook.com/panvibes.exim](https://www.facebook.com/panvibes.exim) |
| LinkedIn | [linkedin.com/company/panvibes-exim](https://www.linkedin.com/company/panvibes-exim/) |
| Instagram | [instagram.com/panvibes.exim](https://www.instagram.com/panvibes.exim/) |
| X | [x.com/panvibesexim](https://x.com/panvibesexim) |

The production build passed. The live homepage, About page and sitemap returned HTTP 200, and both pages contained all four profile URLs. PanVibes and the separate PanPops service remained active after deployment.

The separate 13 November marketing change request was reviewed as reference material for this update. Its contact, form, specification, COA replacement, certification, pricing and consent changes were not part of the social-link release.
