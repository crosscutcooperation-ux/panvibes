# IP-accessible Lightsail installation

Public URL: http://13.239.180.235

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

Admin URL: http://13.239.180.235/admin. `ADMIN_HTTP_HOST=13.239.180.235` explicitly
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
BASE_URL=http://13.239.180.235 node scripts/check-video-delivery.mjs
BASE_URL=http://13.239.180.235 node scripts/check-startup.mjs
SITE_URL=http://13.239.180.235 node scripts/check-site.mjs
```

The exact deployed commit and release directory are recorded in
`/home/ubuntu/panvibes-deployed.txt`. Updating source alone does not rebuild or
restart the running release. Preserve `/etc/panvibes.env` and the SQLite database
when changing release paths.

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
