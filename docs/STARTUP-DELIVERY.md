# Homepage delivery

The hero uses native MP4 sources with `preload="auto"` and the original poster.
Do not fetch the MP4 into a Blob or preload it as a fetch resource. The browser
selects the responsive source and can request byte ranges before the full file
is downloaded. The existing scroll-controlled seeks and final-frame handoff
remain in `ScrollVideoHero`.

The initial loader resolves on a usable native frame (`loadeddata` / `canplay`,
including a ready-state check for events that precede hydration) and fonts. A
12-second startup timeout or media error releases the page to its poster with
a retry action. Once dismissed, this loader cannot reopen while scrolling or
changing breakpoints. The initial indeterminate bar does not show a false 0%
download reading.

Journey downloads start when the visitor begins scrolling the film or approaches
the journey. The globe starts warming near its later phase. Neither blocks the
initial screen or locks scrolling. A local journey status can appear if the
visitor reaches it before its HD assets finish. Original video and journey files
are unchanged; no frames, image resolution, or templates were removed.

Regression checks:

- `scripts/check-home-preload.mjs`: cold-cache native Media requests, no initial
  journey/map fetches, responsive resize, a first-frame-only 256 KB response, and
  a stream that never responds.
- `scripts/check-home-readiness.mjs`: held journey download without another
  modal/scroll lock, complete HD preparation, forward/reverse scenes and retry.
- `scripts/check-video-performance.mjs`: native seeking, handoff, slow network,
  failed media and reduced motion.

On the current Lightsail instance, BBR is enabled through
`/etc/sysctl.d/99-panvibes-bbr.conf` and
`/etc/modules-load.d/panvibes-bbr.conf`. The existing `fq_codel` queue is retained.
The previous congestion-control setting was `cubic`; a rollback record is kept
with the deployment backup. This is a server setting, not required to run the app.
