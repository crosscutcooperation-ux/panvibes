# IP-accessible Lightsail installation

Current public URL: https://panvibes.com. Admin: https://panvibes.com/admin.

Updated 24 October 2026 (India time): the owner's DNS records now point the apex
to `16.176.182.103`, with `www` as a CNAME to `panvibes.com`. Both names have a
trusted Let's Encrypt certificate. HTTP and HTTPS `www` requests redirect to
`https://panvibes.com`, preserving the path and query. Direct HTTPS access to
`https://16.176.182.103` remains available with its separate IP certificate.
The historical notes below describe earlier deployment stages.

Updated 22 October 2026 (India time): the user deleted the distribution and
released static IP `13.239.180.235`. Ubuntu-1 now uses the public address above.
The historical filename and verification notes below retain the earlier setup.
This address is not a reserved static IP and can change if the instance is
stopped and started; update Nginx, the IP certificate and the HTTP admin-host
setting if it changes.

Private IPv4: `172.26.4.106`. Primary domain: `panvibes.com`. DNS is managed
separately; the domain rollout verified the owner's records without editing DNS.
Nginx serves the apex and public IP over HTTPS, and redirects `www` to the apex.
Canonical SEO URLs retain `https://panvibes.com`.

The Ubuntu instance uses official Node 24 LTS, Nginx and one production systemd
service. Source is cloned from `crosscutcooperation-ux/panvibes` into
`/var/www/panvibes`. Builds use the repository lockfile and are staged into
`/var/www/panvibes-releases/<commit>`. The service runs that standalone artifact;
Nginx serves images, PDFs, JavaScript and byte-range MP4 requests directly.

Private Gemini, SMTP and admin bootstrap settings are stored outside the checkout
in `/etc/panvibes.env` (root-owned, mode 0640, service group readable). Credentials
are not embedded in the public bundle or committed to Git. SQLite data persists
at `/var/lib/panvibes/panvibes.sqlite`, independently of releases. Node is bound to
loopback port 3000 behind Nginx and starts automatically after a reboot. Its heap
is capped at 768 MB and its service memory at 1400 MB.

Admin URL: https://panvibes.com/admin. HTTPS sessions retain secure,
HttpOnly/SameSite Strict cookies. The legacy numeric-IP HTTP-host setting is
still present in the private runtime environment, but Nginx now redirects all
HTTP application requests to HTTPS before they reach the application. No
additional frontend login link is introduced.

Useful checks on the instance:

```sh
sudo systemctl status panvibes nginx
sudo journalctl -u panvibes -n 30 --no-pager
sudo nginx -t
cd /var/www/panvibes
BASE_URL=https://panvibes.com node scripts/check-video-delivery.mjs
BASE_URL=https://panvibes.com node scripts/check-startup.mjs
SITE_URL=https://panvibes.com node scripts/check-site.mjs
```

The exact deployed commit and release directory are recorded in
`/home/ubuntu/panvibes-deployed.txt`. Updating source alone does not rebuild or
restart the running release. Preserve `/etc/panvibes.env` and the SQLite database
when changing release paths.

## Domain HTTPS rollout on 24 October 2026

The application remains at release `fa158151d0629001649b7b88c1a85f49220fdd6c`;
this rollout changed Nginx domain/TLS routing without rebuilding the application.
Both the apex HTTPS server and the IP HTTPS server retain direct static media
delivery, immutable versioned assets, video range support and the application
proxy. When updating a release, update both server blocks' artifact paths.

The domain certificate is `/etc/letsencrypt/live/panvibes.com/`, covers both
`panvibes.com` and `www.panvibes.com`, and initially expires 21 January 2027.
Renewal uses the enabled `snap.certbot.renew.timer`, the HTTP ACME webroot at
`/var/www/panvibes-acme`, and the Nginx validation/reload deploy hook. Port 80
keeps the ACME challenge location available ahead of the HTTPS redirect.

The Nginx and deployment-record rollback snapshot is
`/var/backups/panvibes-domain-20261023T190028Z/`. Runtime credentials and enquiry
data were preserved. Public TLS certificate validation, HTTP/`www` redirects,
home/admin access and all three video variants were verified. Some recursive
DNS resolvers initially retained the old `16.176.7.6` record; public resolvers
and the instance already returned the current address during deployment.

## Loading and animation rollout on 22 October 2026

The subsequent startup optimization is deployed as
`c290e3f8ed3989337201de0644005cedf7e4daa9`, with measured median animation-ready
startup improving 3.60× on desktop and 3.96× on mobile under the documented test
connection. See [PERFORMANCE-2026-10-22.md](PERFORMANCE-2026-10-22.md).
The current rollback snapshot is `/var/backups/panvibes-speed-20261021T202947Z/`.

Release `cf4dacb3bc26e300f00356503ba95dd2242f143c` adds the complete animation
readiness screen, preloads video and transport assets, and bounds decoded-frame
memory. See [ANIMATION-READINESS.md](ANIMATION-READINESS.md) for behavior and checks.
The active standalone artifact, Nginx paths and systemd service were switched
after a candidate passed startup and media checks. SQLite and private runtime
settings were preserved; rollback files are under
`/var/backups/panvibes-loader-20261021T192458Z/`.

The current certificate is `/etc/letsencrypt/live/16.176.182.103/`; automatic
renewal uses the existing Certbot timer and Nginx reload hook. The old IP
certificate was deleted because that address is no longer assigned to this
instance. The domain certificate was subsequently added as documented above.

## Verification on 21 October 2026

Application release `90dd1a6e5a0955273ac3a64da4dedf9da53585f5` passed the public
checks for 18 pages, 27 articles and 93 referenced assets, all three MP4 delivery
variants, 11 first-paint routes, desktop/mobile forward and reverse seeking,
slow 3G, blocked-video retry and reduced motion. Admin login was tested through
the IP with a persistent browser cookie; dashboard access, CSV export and logout
all worked. A real chatbot query returned Gemini mode successfully.

SMTP settings are installed, but Google returns `534 5.7.9 WebLoginRequired` when
the new instance authenticates. Google requires browser/account verification
for the sending account before SMTP can send enquiry notifications or reset
codes. This is an upstream authentication restriction, not missing server
configuration. Enquiries are retained in SQLite and accessible through admin
even when notification delivery fails. No real test email was sent.

## HTTPS added on 21 October 2026

A trusted Let's Encrypt IP-address certificate is installed at
`/etc/letsencrypt/live/13.239.180.235/`. Nginx listens on port 443 with TLS 1.2/1.3
and HTTP/2. This fixes direct HTTPS links and supplies an HTTPS-capable origin
for the Lightsail distribution's HTTPS-only origin policy. No DNS records or
distribution settings were changed. Public HTTPS, secure admin session cookies,
dashboard access, CSV downloads and MP4 byte ranges were verified.

Certbot 5.8.0 uses the shortlived profile for this numeric-IP certificate.
`snap.certbot.renew.timer` checks automatically, and a deploy hook validates and
reloads Nginx after renewal. A simulated renewal and its deploy hook succeeded.
HTTP-01 challenges are served from `/var/www/panvibes-acme/.well-known/acme-challenge/`
using a dedicated Nginx location ahead of the hidden-file restriction. Preserve
that path, the Certbot snap/timer, the renewal configuration and port 80 access.
The prior Nginx configuration was backed up at
`/var/backups/panvibes-https-20261021T171730Z/nginx.conf`.

The instance role cannot change Lightsail firewall/distribution settings. Public
443 was reachable once the Nginx TLS listener was installed, so no firewall
change was required. This IP certificate does not cover `panvibes.com`; request
a domain certificate when its DNS is connected.
