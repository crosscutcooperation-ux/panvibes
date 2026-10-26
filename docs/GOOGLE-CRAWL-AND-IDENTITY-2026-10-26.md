# Google crawl evidence and company identity

Audit date: 26 October 2026. The owner's Bing screenshot shows results for
`panvibes.com` and `/about`, with an earlier page title. This is evidence of
Bing discovery/indexing, not evidence of Google's index status.

## What was verified

The available Nginx access logs cover 21–26 October 2026. Requests identifying
as Googlebot were checked against Google's published common-crawler IP ranges:
https://developers.google.com/static/crawling/ipranges/common-crawlers.json.
User-agent text alone was not treated as identity verification.

The audit found 355 requests matching Googlebot user agents and those ranges:

| Response | Requests |
| --- | ---: |
| 200 | 281 |
| 308 | 72 |
| 404 | 2 |

There were no verified Googlebot 403 or 5xx responses in this log set. Successful
public-page requests include product pages and `robots.txt`. The latest listed
verified `robots.txt` request was 26 October at 17:04:18 India time, returning
200. Redirects are expected for the site's HTTP/`www` canonicalisation.

Limitations matter: the existing combined logs do not include the requested
hostname or TLS scheme, so the audit does not establish the exact hostname of
each request. A successful request to this instance does not prove a page is
indexed, selected as canonical, shown for a query or ranked. Requests not
matching the published common-crawler ranges were left unverified rather than
called genuine Googlebot or malicious traffic.

Live checks also found a working homepage, `index, follow` directives, the
`https://panvibes.com` canonical, an accessible sitemap and public crawl access.
Admin/API/preview exclusions remain intentional. Today's earlier SEO changes
did not change the domain, canonical destination or crawler permissions.

## Focused GEO/entity improvements

- Added a visible About-page company-information block: business name, official
  domain, founder, head-office address, enquiry email and shipping coverage.
- Connected AboutPage, WebSite and Organization structured data using stable
  identifiers. The founder name already appears in the public About content
  and existing assistant knowledge; it was not inferred from a search result.
- Added a visible buyer FAQ identifying the official PanVibes Exim website.
- Kept supplier titles, product URLs, robots rules, video assets, loader and
  caching unchanged. No hidden keyword lists or special AI-ranking files added.

These are identity and content-clarity improvements, not a mechanism for
forcing Google indexing or an assertion that the previous title caused an
indexing change.

## Still requires Search Console access

The owner cannot sign in at present. URL Inspection is needed to determine
Google's reported index status, last crawl, selected canonical and any exclusion
reason. Sitemap submission and a recrawl request have not been represented as
completed. Lack of a result from a `site:` query is not definitive proof that
no URL is indexed.

The older PanVibes domains remain outside the owner's control. No change was
made to them. A future migration should map relevant old URLs to the new ones
with permanent redirects once access is restored.

## References

- [Verifying Google crawler requests](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)
- [Google site-name guidance](https://developers.google.com/search/docs/appearance/site-names)
- [Google AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features)
- [Limitations of site searches](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)
