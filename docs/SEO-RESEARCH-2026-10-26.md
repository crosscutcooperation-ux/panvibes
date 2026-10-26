# PanVibes buyer-search research and implementation

Research date: 26 October 2026. Scope: the confirmed catalogue at
`https://panvibes.com`, serving India, UK, USA, Europe and UAE.

## What the research establishes

A research agent reviewed ten focused search queries and supplier-owned pages.
The observations identify commercial language and useful procurement content;
they are not a reliable Google rank audit. Search volumes, keyword difficulty,
Search Console impressions, backlinks and conversion data were not available.
No first-place, traffic, citation or sales outcome is promised.

Broad words such as "ginger" have multiple possible intentions. This change
prioritises a buyer looking for a supplier, product form, bulk quotation or
technical document. Adding hidden lists of every possible word would not make
the site more useful and is not an appropriate SEO strategy.

## Query-to-page plan

| Priority | Buyer-intent query cluster | Principal page |
| --- | --- | --- |
| 1 | bulk ginger powder supplier India; ginger flakes supplier; Indian ginger supplier | `/products/ginger` |
| 1 | turmeric powder supplier India; bulk turmeric powder; curcumin specification enquiry | `/products/turmeric-powder` |
| 1 | moringa powder bulk supplier; wholesale moringa powder India; organic grade enquiry | `/products/moringa-powder` |
| 1 | makhana wholesale supplier; bulk fox nuts; makhana size and selection quotation | `/products/makhana` |
| 2 | dehydrated vegetables supplier India; vegetable flakes and powders in bulk | `/products/dehydrated-vegetables` |
| 2 | banana powder bulk supplier India; banana powder ingredient specification | `/products/banana-powder` |
| 2 | ashwagandha B2B sourcing India; form and documentation enquiry | `/products/ashwagandha` |
| 2 | Indian spice powder supplier; bulk ginger and turmeric sourcing | `/products/spices` |
| 2 | industrial chemical supplier India; water-treatment chemical quotation; caustic soda enquiry | `/products/chemicals` |

The chemical query suggestions come from PanVibes' own catalogue and procurement
intent. The chemical search did not yield enough useful primary supplier
evidence to validate demand. Organic sourcing, grades and certificates remain
enquiries requiring confirmation. The banana-only fruit category links buyers
to the dedicated banana powder page; it does not advertise additional fruits.

## Supplier-page observations

- [Lokavia ginger powder](https://www.lokaviainternational.com/products/ginger-powder)
  and [Shree Bharat ginger powder](https://www.shreebharateximx.com/products/ginger-powder.html)
  address bulk buyers using product forms, specifications, packaging and
  document requirements. PanVibes now explains the information to request,
  without copying either supplier's numerical specifications.
- [Sunita turmeric powder](https://www.sunitaexports.com/products/indian-spices/turmeric-powder/)
  organises form, grade, curcumin and quotation requirements. PanVibes' own
  documented 1–5% curcumin enquiry options support more specific buying copy.
- [Aayuritz moringa](https://aayuritz.com/products/moringa-powder/)
  and [Dhatu bulk moringa](https://b2b.dhatuorganics.com/product/moringa-powder-bulk/)
  discuss applications and business procurement. Their forms, approvals and
  testing claims are not evidence for PanVibes' stock or certifications.
- [Amphichiral makhana](https://amphichiral.com/makhana-supplier-india)
  uses size/grade and quotation language. PanVibes' copy explains its confirmed
  size labels and hand-picked selection without importing competitor MOQ or
  quality claims.
- [Dehydrated Veg directory](https://www.dehydratedveg.com/product/)
  illustrates discoverable vegetable/form combinations. Relevant PanVibes
  content remains in crawlable text and links, alongside the animated catalogue.
- [PAX ashwagandha](https://paxherbal.in/ashwagandha/)
  illustrates form-specific procurement information. PanVibes does not infer
  extract availability, standardised actives or medical benefits from this.

## Changes implemented

1. Replaced generic product metadata with concise commercial titles, retaining
   PanVibes Exim first. Example: "PanVibes Exim | Ginger Powder & Flakes Supplier
   India". The homepage metadata now identifies bulk food ingredients and
   chemical sourcing; its visible brand slogan is preserved.
2. Added specific product headings, comparison tables and sourcing questions on
   the nine ingredient/category pages. Prices are requested against a brief;
   no price, review, certification, manufacturing or stock claim is invented.
3. Added two distinct, original buying guides: choosing ginger forms and
   preparing a comparable bulk ingredient RFQ. Both link to actual products,
   documentation and an inline quotation form.
4. Added a buyer-guide index, homepage supplier introduction and contextual
   links from product pages, ginger articles and the footer. The pages are
   server-rendered and discoverable without relying on the animation.
5. Added the guides to the sitemap, included Article/Breadcrumb structured data,
   added homepage WebSite identity markup and repaired the organisation contact
   phone reference. No fake SearchAction, offers or aggregate ratings are added.
6. Kept video variants, journey packs, loader lifecycle, product image delivery,
   standalone output and server caching unchanged. New comparison tables scroll
   within their container on narrow screens.

## Old websites and indexing

The research also found the older `panvibesexim.com` and `panvibesexim.co.in`
websites. The owner confirmed that they are previous websites, currently outside
their control. No changes or redirects were made to those domains. Results
showing an older domain are not proof that `panvibes.com` is unindexed, nor a
measurement of how much the older sites affect rankings.

When access is recovered, map relevant old URLs to matching new pages and use
permanent server-side redirects. Keep the domains available while carrying out
the move. Deleting the domains alone does not migrate old links or visitors.
See [Google's site migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

The earlier Search Console attempt stopped at Google sign-in. This work does
not claim account verification, sitemap submission, recrawl submission or
confirmed index coverage. Once access is available, inspect the key URLs,
submit `https://panvibes.com/sitemap.xml`, and use query/impression/click data to
prioritise future work. Track actual qualified enquiries alongside search data.

## Verification commands

- `next typegen` and `tsc --noEmit` for route and TypeScript checks.
- Targeted ESLint for the changed source.
- Linux production build and standalone staging.
- `scripts/check-buyer-search.mjs` for descriptive titles/headings, initial HTML,
  buyer comparisons/FAQs, guide depth, sitemap links and structured data.
- `scripts/check-site.mjs` for all main/product/guide pages and existing articles.
- `scripts/check-startup.mjs` and `scripts/check-video-delivery.mjs` for the loader,
  initial JavaScript budget, protected admin and cached byte-range video delivery.
- Desktop/mobile browser checks for the guide pages, product comparison tables,
  inline enquiry actions and preserved navigation behaviour.

## Primary SEO references

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

These sources support helpful, accessible content and truthful structured data;
they do not support keyword stuffing, doorway pages or guaranteed rankings.
