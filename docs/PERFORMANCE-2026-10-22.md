# Homepage startup optimization — 22 October 2026

The optimized site is deployed at https://16.176.182.103/. The running
application is release `c290e3f8ed3989337201de0644005cedf7e4daa9`.

## Measured result

These timings measure **complete animated-homepage readiness**, from navigation
until the loading screen can release scrolling with the full film, image set,
decoded scene anchors, globe and fonts ready. They do not describe first paint,
every page, every network, or a universal speed guarantee.

| Device | Original median | Optimized median | Improvement |
| --- | ---: | ---: | ---: |
| Desktop, 1440×900 | 29.055 s | 8.079 s | 3.60× |
| Mobile, 390×844 | 31.333 s | 7.912 s | 3.96× |

Three cold browser contexts per device and release, interleaved before/after,
ran against the **same public HTTPS origin** on the same Lightsail instance.
Chromium network emulation used 2,500,000 bytes/s (20 Mbps), 100 ms latency and
256 KiB/s upload. Natural network/server latency remains part of these results.
The original `cf4dacb` standalone release briefly ran on a loopback-only port;
a temporary Nginx request-header map selected it for baseline measurements.
Normal visitors continued to receive the current release throughout. That map
and its baseline service were removed after measurement. The database and
credentials were shared unchanged; the benchmark made no enquiry submissions.

Raw results are in [performance-2026-10-22.json](performance-2026-10-22.json).
All measured navigations reached ready video and scene states without browser
errors. Every optimized navigation requested exactly one matching image pack.
Median captured request counts fell from 266 to 60. Transfer totals fell from
17.66 MB to 9.21 MB on desktop and 20.89 MB to 8.16 MB on mobile. Browser cache
remains enabled within each fresh context, so preparation can reuse its own
downloads; disabling cache for every request would distort this architecture.

## Changes

- One indexed, versioned static pack carries all 203 journey images. Compressed
  Blob slices feed image/canvas decoding; no ZIP library or server decompression
  is needed. The existing bounded decoded-frame cache and every animation frame
  are retained. Offline copies match the rendered size and preserve alpha.
- Viewport-specific HTML hints start the pack download before hydration.
  Reduced-motion visitors skip both packs and MP4. The scene module is available
  immediately rather than waiting for a second import after all images arrive.
- H.264 copies shrink from 4.56 MB to 2.12 MB on desktop and 14.16 MB to 4.10 MB
  on mobile. Mobile stays 1920×1080, 30 fps, 296 frames with the same duration and
  crop/branding/handoff geometry. No B frames, one reference, and bounded 15/30
  frame keyframe intervals support seeking. The Data Saver source is retained.
- A 53 KB transparent WebP logo replaces a 615 KB PNG in rendered UI. The
  827 KB transition truck becomes a 93 KB WebP with the same dimensions and
  alpha bounds. Original PNGs remain for source/legacy use and SEO references.
- Nginx serves both hashed MP4 and image packs directly with immutable yearly
  caching. No video encoding occurs during requests or on the instance.

The loader still waits for complete readiness. Retry and a static fallback
remain available for genuine failures. Static pages/admin, SQLite data, private
credentials, DNS and HTTPS settings are preserved. Service configuration and a
SQLite snapshot are backed up in
`/var/backups/panvibes-speed-20261021T202947Z/`.

## Verification and reproduction

Production builds passed locally and on Linux, plus targeted lint, pack byte
range/hash/aspect/alpha checks, and bounded decoded-cache checks. Browser checks
cover desktop/mobile forward/reverse seeking and truck handoff, every transport
phase, blocked-pack readiness, retry, static failure recovery, reduced motion,
slow 3G, route/startup budgets, catalog/SEO assets and byte-range MP4 delivery.

Run the current-release benchmark with an installed Playwright module:

```sh
BASE_URL=https://16.176.182.103 PERF_RATE=2500000 PERF_RUNS=3 \
  node scripts/benchmark-startup.mjs
```

Set `PLAYWRIGHT_MODULE` when Playwright is supplied by an external runtime.
`PERF_COMPARE=1` is for an explicitly prepared before/after staging route, not
the normal production configuration. Results default to ignored `tmp/performance/`.
Rebuild image packs offline with `node scripts/prepare-journey-packs.mjs` when
sequence/photo source data changes. Rebuild MP4 variants offline with
`node scripts/prepare-web-video.mjs desktop mobile`.
