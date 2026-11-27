# Enquiry lead event — 27 November 2026

Successful enquiries now push:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({event: 'generate_lead', enquiry_ref: saved.reference});
```

The existing direct GA4 generate_lead call and Meta Lead call remain. The GA4 call now includes enquiry_ref alongside the existing reference parameter. Events run after a successful response and confirmed reference. Validation errors, server errors, missing references and pending requests do not track leads. Retrying the same reference does not track it again within the current page session.

The dataLayer push is a local notification. It does not install Google Tag Manager, configure a Google Ads conversion action or bypass cookie choices. Direct analytics services continue to load according to existing consent settings. If the SEO team uses the custom event to fire tags, those tags must respect consent and avoid sending the same GA4 lead again through a second tracking path.

Verified lint, production build and scripts/check-lead-tracking.mjs. Browser tests intercept API responses, stub CAPTCHA and tracking, and block external requests; no test record, email or analytics lead is created. These tests verify the website event, not receipt or conversion configuration in GA4 or Google Ads.

Run the browser check against a preview (or deployment):

```sh
SITE_URL=http://localhost:3100 PLAYWRIGHT_MODULE=/path/to/playwright BROWSER_PATH=/path/to/chromium node scripts/check-lead-tracking.mjs
```

If conversions remain missing: use Tag Assistant/GA4 DebugView to confirm receipt of generate_lead for a consented legitimate submission, verify its key-event setting and Google Ads conversion import/linking, and check any GTM custom-event trigger named generate_lead.
