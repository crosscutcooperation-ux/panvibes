# Hero truck handoff

Home uses the restored desert-road film with transparent PanVibes branding tracked to the side and roof of the container. `hero-desert-branded-desktop.mp4` is 1920 × 1080; `hero-desert-branded-mobile.mp4` is 960 × 540. Both retain the original 296 frames at 30 fps, use all-intra H.264 without audio or B frames, and seek only in response to scrolling. The viewport-height hero retains responsive mobile framing. It has no title background gradient.

`scripts/brand-desert-hero.py` prepares the branded videos, poster and transparent truck PNG from the preserved `hero-1016-smooth.mp4`, original `handoff-truck.png` and existing transparent company logo. It uses OpenCV and NumPy for planar tracking and FFmpeg for encoding. `hero-desert-branding.json` records the measured planes and encoding. The normal email/assistant dock remains outside the hero.

Two project assets were made with the built-in `image_gen` tool (no Higgsfield):

- `handoff-clean-plate.png`: remove only the truck and its shadow from the final frame, preserving the pale concrete, overhead viewpoint, texture, lighting and framing; no new objects.
- `handoff-truck.png`: isolate the same top-down white-container, black-cab truck on real transparency, preserving its perspective, proportions, roof, mirrors, chassis and colors; remove concrete and shadows.

Alpha bounds are recorded in `lib/hero-handoff.ts`. The original PNG silhouette is preserved in `/images/branded/home-hero/desert-handoff-truck.png`, with the roof logo matching the video's final frame. The hero and journey use the same image and visible dimensions. A fixed canvas carries the truck across the section boundary while the journey vehicle canvas is hidden; it meets the measured position of the following canvas before returning ownership. The transition reverses with scrolling. Earlier videos and their metadata remain historical assets.
