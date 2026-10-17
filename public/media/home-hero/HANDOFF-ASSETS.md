# Hero truck handoff

The original user videos are unchanged. `handoff-reference.png` is the first film's final decoded frame. Home now plays `hero-1016-smooth.mp4`, a 1080p/30 fps all-intra copy of the latest supplied `1016_1.mp4`; `hero-1016-source.json` records it. Its final overhead truck uses the same cutout below, with updated 1920 × 1080 film coordinates in `lib/hero-handoff.ts`. Earlier video metadata files are historical.

Two project assets were made with the built-in `image_gen` tool (no Higgsfield):

- `handoff-clean-plate.png`: remove only the truck and its shadow from the final frame, preserving the pale concrete, overhead viewpoint, texture, lighting and framing; no new objects.
- `handoff-truck.png`: isolate the same top-down white-container, black-cab truck on real transparency, preserving its perspective, proportions, roof, mirrors, chassis and colors; remove concrete and shadows.

Alpha bounds are recorded in `lib/hero-handoff.ts`. The hero and journey use the same cutout and dimensions. A fixed canvas carries the truck across the section boundary while the journey vehicle canvas is hidden; ownership returns to the journey at the exact initial pose. The transition reverses with scrolling. Generated files were copied into this directory from the built-in image tool's saved output.
