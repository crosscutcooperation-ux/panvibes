# Worldwide delivery for panvibes.com

The application and origin server can run while the CDN is configured. CloudFront
is a separate step: it has not been enabled by these website changes. The current
instance role cannot administer CloudFront or ACM. Keep the existing live DNS
until the distribution and its certificates are ready.

## 1. Give CloudFront a stable origin

In Namecheap → Domain List → panvibes.com → Manage → Advanced DNS, add:

| Type | Host | Value |
| --- | --- | --- |
| A | origin | 16.176.7.6 |

Leave this record pointing directly to the server permanently. Using the public
apex as the origin would create a loop after that apex points to CloudFront.

After `origin.panvibes.com` resolves to the server, connect to Ubuntu and add
`origin.panvibes.com` alongside the existing names in the `server_name` directives
in `/etc/nginx/sites-available/panvibes`. Back up that file first. Then run:

```sh
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx --expand --cert-name panvibes.com \
  -d panvibes.com -d www.panvibes.com -d origin.panvibes.com
curl -I https://origin.panvibes.com/
```

Continue when that HTTPS request returns 200 with a valid certificate.

## 2. Request the viewer certificate

Open AWS Certificate Manager in **US East (N. Virginia), us-east-1**. Request a
public certificate for `panvibes.com` and `www.panvibes.com` with DNS validation.
Add the supplied CNAME validation records in Namecheap. Namecheap appends your
domain to the Host field, so enter only the record-name part before `.panvibes.com`.
Keep those validation records for automatic renewal. Wait for **Issued**.

[AWS certificate and domain instructions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CreatingCNAME.html)

## 3. Create the CloudFront distribution

Use these settings; console grouping can vary:

| Setting | Value |
| --- | --- |
| Origin | `origin.panvibes.com`, custom/other HTTP origin |
| Origin path | Empty |
| Origin protocol | HTTPS only, port 443, TLS 1.2 |
| Alternate domains | `panvibes.com`, `www.panvibes.com` |
| Viewer certificate | The issued us-east-1 ACM certificate |
| Viewer protocol policy | Redirect HTTP to HTTPS |
| HTTP versions | HTTP/2; HTTP/3 can also be enabled |
| Default root object | Leave empty; Next.js serves `/` |
| Default cache policy | Managed **CachingDisabled** |
| Default origin request policy | Managed **AllViewer** |
| Default allowed methods | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE |
| Supported locations | All edge locations for worldwide delivery |

Keep all Next.js HTML, RSC navigation, admin, image-optimization queries and APIs
on that uncached default behavior. AllViewer forwards the original host, cookies,
query strings and application headers. Do not use an S3 origin or rewrite errors
to `/index.html` for this server-rendered application.

[AWS origin request policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html)

## 4. Cache public files separately

Create five additional behaviors pointing to the same origin:

| Path pattern | Cache policy | Origin request policy | Methods |
| --- | --- | --- | --- |
| `/_next/static/*` | CachingOptimized | None | GET, HEAD, OPTIONS |
| `/media/*` | CachingOptimized | None | GET, HEAD, OPTIONS |
| `/images/*` | CachingOptimized | None | GET, HEAD, OPTIONS |
| `/assets/*` | CachingOptimized | None | GET, HEAD, OPTIONS |
| `/documents/*` | CachingOptimized | None | GET, HEAD, OPTIONS |

For these behaviors enable automatic compression and redirect HTTP to HTTPS.
The origin already supports video byte ranges and long caching of versioned
assets. Keep `/_next/image` on the default uncached behavior so its query-string
variants remain correct. Never apply CachingOptimized to `/admin`, `/api/*`,
`/contact`, or all paths: its positive minimum TTL can cache private responses.

[AWS managed cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html)

## 5. Switch Namecheap only after CloudFront finishes deploying

Copy the distribution's actual `d….cloudfront.net` hostname. In Namecheap
Advanced DNS replace only the conflicting web records for `@` and `www`:

| Type | Host | Value |
| --- | --- | --- |
| ALIAS | @ | Your distribution's `d….cloudfront.net` hostname |
| CNAME | www | The same CloudFront hostname |
| A | origin | 16.176.7.6 — keep this record |

Remove A/AAAA/URL Redirect/CNAME records that conflict with the new records at
the same web host. Preserve MX, TXT, email records and certificate-validation
CNAMEs. ALIAS at the apex requires Namecheap BasicDNS, FreeDNS or PremiumDNS;
if the domain uses another DNS service, make equivalent changes there.

[Namecheap ALIAS setup](https://www.namecheap.com/support/knowledgebase/article.aspx/10128/2237/how-to-create-an-alias-record/)

## 6. Verify before announcing the launch

Check `https://panvibes.com` and `https://www.panvibes.com`, open an article and
both PDF buttons, scrub the hero forward/back on a phone, and open the enquiry
form. Verify CloudFront response headers (`Via` / `X-Amz-Cf-Pop`) on the public
site. A repeated request to a cached static file should show `X-Cache: Hit from
cloudfront`. Admin and API responses must stay uncached and unauthenticated
enquiry records must still return 401.

For automated read-only checks, run from the repository:

```sh
BASE_URL=https://panvibes.com node scripts/check-startup.mjs
BASE_URL=https://panvibes.com node scripts/check-video-delivery.mjs
```

If the DNS switch fails, restore the previous apex A record `16.176.7.6` and the
previous www record. That restores direct origin delivery while the CDN settings
are corrected. Existing origin TLS and the running application remain in place.
