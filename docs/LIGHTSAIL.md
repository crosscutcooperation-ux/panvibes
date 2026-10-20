# Lightsail deployment and video performance

The production site is https://panvibes.com. On 20 October 2026, its desktop MP4
returned the correct `video/mp4` type and `206 Partial Content` for byte ranges.
The live desktop source was 28,762,839 bytes at 23.3 Mbps. A browser test reached
only metadata readiness after ten seconds. The IP's default nginx welcome page
is a different virtual host; test the domain, not the bare IP.

## Installed deployment (20 October 2026)

Code release `c5c733a675a0d0e9b34d1888ecd724408bf29711` was built on the Ubuntu
instance and verified at https://panvibes.com. The source checkout remains
`/var/www/panvibes`; the running artifact is under
`/var/www/panvibes-releases/c5c733a675a0d0e9b34d1888ecd724408bf29711/.next/standalone`.
The existing `panvibes.service` uses a `20-release.conf` systemd override, retains
the existing Ubuntu service account, and loads private settings from the original
`/var/www/panvibes/.env.production.local` with Node's `--env-file` option.
`SQLITE_PATH` remains `/var/lib/panvibes/panvibes.sqlite`. No real enquiries or
emails were sent during deployment tests.

Nginx retains its Certbot HTTPS configuration and now serves versioned MP4s,
images, PDFs and static browser bundles directly. Previously emitted hashed JS
bundles were retained so already-open browser tabs can finish loading. The
application uses a 768 MB V8 heap limit and a 1,400 MB systemd process memory cap.
The instance actually reports about 4 GB RAM; the application budget leaves room
on a 2 GB machine, but this deployment was not a load test on a 2 GB instance.

The service used approximately 70–100 MB during validation. Public checks passed
for all 18 checked pages, 27 articles and 73 referenced assets, MP4 range requests,
desktop/mobile seeking, the final frame, slow 3G, blocked-video retry, reduced
motion and admin access protection. This is an observed validation footprint,
not a peak-memory or traffic-capacity guarantee.

Deployment metadata is recorded in `/home/ubuntu/panvibes-deployed.txt`. The
rollback command for this release is
`sudo sh /var/backups/panvibes/20261020T133240Z/rollback.sh`.
That backup contains the prior service/nginx configuration; it does not roll
back or delete enquiries received after deployment. For future releases, build
and test another Linux artifact, update the service override and nginx asset
paths, then restart/reload. Pulling source alone does not update the running
standalone artifact. The generic `/srv/panvibes` examples below are for a fresh
installation; use the existing paths above on this instance.

## Media and loading behavior

The same branded footage, all 296 frames, timings and transparent-truck handoff
are retained. The web copies use H.264/yuv420p, no audio, no B-frames, fast-start
MP4, and a closed short GOP of six frames (200 ms). The desktop copy is 720p;
phones and connections advertising Save-Data/2G/3G use 432p. See
`lib/hero-video-assets.json` for the exact generated sizes and hashed URLs.
Original masters are preserved. Re-encode only offline with
`node scripts/prepare-web-video.mjs` (requires FFmpeg); do not run it on requests
or at server startup. No video hosting subscription or API key is required.

The loading overlay is styled again and releases within 1.5 seconds after
hydration even on a failed/slow media request. A local video status remains over
the poster while the video downloads. A failed load (12 seconds) or stalled seek
(10 seconds) releases the pinned scene, keeps the poster and offers Retry video.
Reduced-motion visitors get the poster and no video download. The scroll
controller coalesces seeks instead of queueing a decode for every wheel event.

Lenis, already in this repository, is a smooth-scroll library, not a video
transcoder or delivery service. Adding another scroll controller will not reduce
MP4 bandwidth. This short clip is delivered with native video/range requests;
adding HLS segments/player JavaScript is unnecessary for its random-access
scroll choreography. For higher traffic, the hashed MP4s and images can be
offloaded to a CDN without running a media processor on Lightsail.

## Production runtime (Ubuntu, Node 24+)

Do not run `next dev` in production. Keep one application process; video decoding
happens in the visitor's browser. The included systemd example caps Node's V8
heap at 768 MB and has process memory limits, leaving capacity for nginx and the
OS on a 2 GB VM. This is a runtime budget, not a concurrent-visitor guarantee.
Native image processing and builds consume memory outside that heap budget.

Build on a **Linux machine/CI matching the instance architecture**, preferably
outside the 2 GB serving instance:

```sh
npm ci
npm run build
node scripts/stage-standalone.mjs
```

Upload the resulting release (including `public`, `.next/static` and
`.next/standalone`) to `/srv/panvibes/current`, or adjust the example paths to the
actual installation. Windows-built standalone output contains Windows-native
dependencies and is not a Linux deployment artifact. Keep the previous release
available for rollback. `public` must be present: standalone output alone omits
it unless you run the staging script. The staging command copies it into
standalone too, so direct app requests work if nginx isn't serving it yet.

Create a dedicated `panvibes` service user if needed. Install runtime environment
variables (existing Gemini, SMTP and admin settings) in `/etc/panvibes.env`, owned
by root and readable only by the service group (mode 0640). Do not copy `.env.local`
into Git or a public artifact. Next may copy a local env file into standalone
during builds; production builds should obtain secrets from a private runtime
environment instead. Ensure no `.env*` is included in the uploaded build artifact.

**Preserve the live SQLite database.** Set `SQLITE_PATH` to its existing persistent
absolute path, or move it using SQLite's backup command into
`/var/lib/panvibes/panvibes.sqlite` during a maintenance window with the app stopped.
Preserve all admin/enquiry data; never replace it with a development database.
Make the directory writable by `panvibes` and back it up independently of releases.

Adapt `deploy/panvibes.service`, verify `/usr/bin/node` is Node 24+, then install
the unit under `/etc/systemd/system/`. Stop the old PM2/systemd app on port 3000
before enabling this one; do not run duplicate processes.

Merge the static-file and proxy locations from `deploy/nginx-panvibes.conf` into
the **existing HTTPS virtual host**, preserving certificates and redirects. The
current deployment already supports ranges; do not replace functioning TLS
configuration with the port-80 example. Check actual root paths and file access
permissions. Then:

```sh
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable --now panvibes
sudo systemctl reload nginx
```

After each updated release, restart `panvibes`. It reads the standalone build,
not the source checkout. Verify the hashed video URL in the browser points to the
new manifest; hashed names avoid the old seven-day cached video.

## Check the release

```sh
BASE_URL=https://panvibes.com node scripts/check-video-delivery.mjs
sudo systemctl status panvibes
sudo journalctl -u panvibes -n 50 --no-pager
free -m
```

Verify desktop and mobile video scrubbing in both directions, enquiry/admin
access, and a blocked MP4 request falling back to the poster. Runtime settings
and nginx changes require server access; a Git push alone does not install them.

References: [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting),
[Next.js videos](https://nextjs.org/docs/app/guides/videos),
[Lenis](https://github.com/darkroomengineering/lenis).
