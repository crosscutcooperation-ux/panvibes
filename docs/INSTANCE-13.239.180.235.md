# IP-accessible Lightsail installation

Current public URL: https://16.176.182.103 (HTTP is also available).

Updated 22 October 2026 (India time): the user deleted the distribution and
released static IP `13.239.180.235`. Ubuntu-1 now uses the public address above.
The historical filename and verification notes below retain the earlier setup.
This address is not a reserved static IP and can change if the instance is
stopped and started; update Nginx, the IP certificate and the HTTP admin-host
setting if it changes.

Private IPv4: `172.26.4.106`. Primary domain: `panvibes.com`. DNS is managed
separately and has not been changed by this deployment. Nginx accepts the public
IP, `panvibes.com` and `www.panvibes.com` without redirecting the IP to the domain.
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

Admin URL: https://16.176.182.103/admin. `ADMIN_HTTP_HOST=16.176.182.103` explicitly
enables the session cookie on this one numeric HTTP host. The cookie remains
HttpOnly/SameSite Strict. HTTPS hosts always retain secure cookies; arbitrary
other HTTP hosts do not inherit the exception. When using HTTPS for the domain,
remove that temporary HTTP-host setting. No additional frontend login link is
introduced.

Useful checks on the instance:

```sh
sudo systemctl status panvibes nginx
sudo journalctl -u panvibes -n 30 --no-pager
sudo nginx -t
cd /var/www/panvibes
BASE_URL=https://16.176.182.103 node scripts/check-video-delivery.mjs
BASE_URL=https://16.176.182.103 node scripts/check-startup.mjs
SITE_URL=https://16.176.182.103 node scripts/check-site.mjs
```

The exact deployed commit and release directory are recorded in
`/home/ubuntu/panvibes-deployed.txt`. Updating source alone does not rebuild or
restart the running release. Preserve `/etc/panvibes.env` and the SQLite database
when changing release paths.

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
instance. Domain DNS and any domain certificate remain separate.

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
