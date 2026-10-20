# Hero truck handoff

Home plays `gemini_generated_video_282720c2.mp4`, the exact original file supplied by the owner, with a matching SHA-256 hash recorded in `hero-1020-source.json`. It is not re-encoded, resized or trimmed. The hero section and video are both full-width 16:9 on every screen, with navigation overlaid inside that frame. There is no extra header band, viewport-height letterboxing, mobile zoom crop or desktop cover crop. The 16:9 frame pins during scroll playback. The original file must decode its actual final frame before a 350 ms fade hands over to the overhead truck. Scroll spacing keeps the following journey out of view until that sequence finishes; the visual frame remains 16:9. A soft gradient behind the smaller title improves contrast. The composition uses normalized 1920 × 1080 coordinates in `lib/hero-handoff.ts` for the existing overhead truck handoff. `handoff-reference.png` is the first film's final decoded frame. Earlier videos and metadata are historical.

The single global email shortcut follows the film's measured credit area using the video's displayed object-fit geometry and mobile positioning. It stays opaque over the mark; away from the hero, normal dock placement resumes. The assistant and enquiry button move if needed to avoid the email shortcut. The hero email anchor is positioned inside the video frame in CSS, so it stays attached during every pin/layout update; the normal fixed email shortcut resumes away from the film.

Two project assets were made with the built-in `image_gen` tool (no Higgsfield):

- `handoff-clean-plate.png`: remove only the truck and its shadow from the final frame, preserving the pale concrete, overhead viewpoint, texture, lighting and framing; no new objects.
- `handoff-truck.png`: isolate the same top-down white-container, black-cab truck on real transparency, preserving its perspective, proportions, roof, mirrors, chassis and colors; remove concrete and shadows.

Alpha bounds are recorded in `lib/hero-handoff.ts`. The hero and journey use the same cutout and dimensions. A fixed canvas carries the truck across the section boundary while the journey vehicle canvas is hidden; ownership returns to the journey at the exact initial pose. The transition reverses with scrolling. Generated files were copied into this directory from the built-in image tool's saved output.
