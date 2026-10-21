# Homepage loading and animation readiness

The homepage and its mobile preview now have a branded loading overlay. It stays
visible until the opening film, the complete transport image set, the initial
decoded vehicle frames, the globe renderer (or its supported fallback), and fonts
are ready. It does not dismiss after a cosmetic delay or after video metadata.
Page scrolling and controls behind the overlay remain locked while preparing.
Other pages and the admin login do not receive the homepage loader.

`HomeExperience` owns the readiness boundary. The progress bar reflects download
and preparation work reported by the video and journey, rather than an invented
timer. The selected MP4 is downloaded in full, made into a local Blob URL, and
tested at its final and first frames before reporting ready. Random scroll seeks
then use local bytes instead of requesting unbuffered ranges over the network.
Blob URLs and in-flight downloads are released on unmount/breakpoint changes.

The same 296-frame film and its branding/timing are retained. Mobile remains
1920×1080 at 30 fps. Its fast-decode, three-frame GOP copy is 14,157,742 bytes,
down from 16,695,432 bytes. Desktop and the explicit Data Saver copy are unchanged.

The transport's 191 frame/still URLs plus its photos, ship, clouds and land data
are fetched with four workers before starting. Compressed files warm the HTTP
cache; the app does not retain hundreds of fully decoded image objects. Initial
vehicle/phase anchors are decoded before release, while subsequent decoding uses
a bounded neighbourhood cache. A frame awaiting decode holds the previous
rendered frame instead of jumping to an arbitrary cached endpoint. The renderer
also retains the correct end-frame truck until the native video frame has been
presented. Pin geometry is refreshed after the loader unlocks the scrollbar.

These changes move preparation ahead of the experience. Slow connections will
see a longer, accurate progress screen. A download that stops making progress,
an asset error or a decoding error displays Retry loading and Continue without
animation; it never silently exposes a partially loaded animated scene. The
static option removes animation pins and restores a normal scrolling page.
Reduced-motion visitors use the static composition without downloading MP4.

Verification completed against a local production standalone build:

- TypeScript, targeted ESLint, production build and the decoded-cache test.
- Desktop/mobile complete-video startup, forward/reverse seeks and final frame.
- Slow 3G readiness, failed-video static view and reduced-motion download policy.
- Withheld ship asset: loader remains and scrolling is locked even after the
  opening film is ready; releasing the asset permits the complete scene.
- Every truck/crane/road/ship phase and reverse traversal, checking for blank
  canvases and browser errors, plus recovery through Retry loading.
- Public-page metadata, catalog, startup JavaScript budget and MP4 delivery tests.

Application release `cf4dacb3bc26e300f00356503ba95dd2242f143c` was built on the
Lightsail instance and deployed at `https://16.176.182.103` on 22 October 2026
(India time). The user released the previous static IP and removed the
distribution; the current public IP reaches the same Ubuntu-1 instance at
private address `172.26.4.106`. DNS remains unchanged.

The candidate passed route/startup and MP4 delivery checks before activation.
Public HTTPS checks confirmed the readiness lock, all forward/reverse transport
phases without blank canvases or browser errors, and retry after a failed video
download. Nginx serves the compressed media directly. The running Node service
keeps its existing 768 MB heap / 1400 MB service memory limits; no live video
transcoding runs on the instance.

Private runtime configuration and the SQLite database remain outside releases.
A database snapshot and previous service/Nginx configuration are retained at
`/var/backups/panvibes-loader-20261021T192458Z/`. A new, automatically renewed
Let's Encrypt IP certificate covers the current address, and renewal for the
released IP was removed. The HTTP admin-host setting follows the new address.
