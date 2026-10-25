// Copy the complete rear wheel pair from the same camera frame. Working below
// the container rail preserves the photographed roof/body and the alpha cutout.
export function trailerWheelPairCrop(camera: number, width: number, height: number) {
  const keys = [[0, .665], [.18, .67], [.36, .70], [.55, .77], [.73, .80], [.91, .80], [1, .843]];
  const p = Math.max(0, Math.min(1, camera));
  const end = keys.findIndex(row => row[0] >= p);
  const a = keys[Math.max(0, end - 1)], b = keys[Math.max(0, end)];
  const t = b[0] === a[0] ? 0 : (p - a[0]) / (b[0] - a[0]);
  const top = Math.round((a[1] + (b[1] - a[1]) * t + .005) * height);
  return {
    left: Math.round(width * .165), top,
    width: Math.round(width * .15), height: height - top,
    destinationLeft: Math.round(width * .5625),
  };
}
