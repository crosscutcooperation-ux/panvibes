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
1920×1080 at 30 fps. Its current H.264 copy is 4,101,081 bytes, down from the
14,157,742-byte first rollout. Desktop is 2,115,649 bytes, down from 4,562,674;
the explicit Data Saver copy remains 1,669,238 bytes. Offline encoding retains
all 296 frames, one reference frame, no B frames and fast-start metadata.
The keyframe intervals are 15 frames on desktop and 30 on mobile. Forward and
reverse seeking and final-frame presentation are tested before deployment.

The transport's 203 frame/still/photo/ship/cloud images are fetched as one
content-addressed pack: 6,016,677 bytes for desktop or 2,907,754 for mobile.
The offline generator keeps every animation frame and alpha channel, with
desktop sequence copies sized to 1200 pixels for trucks / 960 for cranes, and
640-pixel mobile copies. Original source assets are retained. HTML preloads the
matching pack before hydration, except for reduced-motion visitors. There is
one network request for the selected pack, followed by compressed Blob slices
used by the image elements and canvas; no archive library or server-side
decompression is needed. The globe's small land data is fetched separately.
The app does not retain hundreds of fully decoded image objects. Initial
vehicle/phase anchors are decoded before release, while subsequent decoding uses
a bounded neighbourhood cache. A frame awaiting decode holds the previous
rendered frame instead of jumping to an arbitrary cached endpoint. Pack URL
leases are revoked on cleanup and breakpoint changes. The renderer
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
- Withheld transport pack: loader remains and scrolling is locked even after
  the opening film is ready; releasing the pack permits the complete scene.
- Indexed pack hashes, byte ranges, image aspect ratios and transparency.
- No separate frame-image requests during forward/reverse scene traversal.
- Every truck/crane/road/ship phase and reverse traversal, checking for blank
  canvases and browser errors, plus recovery through Retry loading.
- Public-page metadata, catalog, startup JavaScript budget and MP4 delivery tests.

Application release `c290e3f8ed3989337201de0644005cedf7e4daa9` was built on the
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
`/var/backups/panvibes-speed-20261021T202947Z/`. A new, automatically renewed
Let's Encrypt IP certificate covers the current address, and renewal for the
released IP was removed. The HTTP admin-host setting follows the new address.
