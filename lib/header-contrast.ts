type Colour = [number, number, number, number];
const WHITE: Colour = [255, 255, 255, 1];
const BLUE: Colour = [16, 78, 135, 1];

function colour(value: string): Colour | null {
  const match = value.match(/^rgba?\(([^)]+)\)$/);
  if (!match) return null;
  const parts = match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}
function over(front: Colour, back: Colour): Colour {
  const a = front[3] + back[3] * (1 - front[3]);
  if (!a) return [0, 0, 0, 0];
  return [0, 1, 2].map(i => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / a).concat(a) as Colour;
}
function luminance(rgb: Colour) {
  const [r, g, b] = rgb.slice(0, 3).map(value => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b;
}
function contrast(a: Colour, b: Colour) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
export function contrastingNavInk(backgrounds: Colour[]): '#ffffff' | '#104e87' {
  const score = (ink: Colour) => backgrounds.reduce((total, background) => total + Math.log(contrast(ink, background)), 0);
  return score(WHITE) >= score(BLUE) ? '#ffffff' : '#104e87';
}

/** Sample the painted surfaces under each navigation item, independently of route names. */
export function startHeaderContrast(header: HTMLElement, menuOpen: boolean) {
  let disposed = false, frame = 0;
  const pixels = document.createElement('canvas'); pixels.width = 64; pixels.height = 40;
  const context = pixels.getContext('2d', { willReadFrequently: true });
  const cssImages = new Map<string, HTMLImageElement>();
  let framePixels = new Map<CanvasImageSource, { data: Uint8ClampedArray; width: number; height: number } | null>();
  let styles = new Map<Element, CSSStyleDeclaration>();
  const styleOf = (element: Element) => { let value = styles.get(element); if (!value) { value = getComputedStyle(element); styles.set(element, value); } return value; };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };

  function imagePixel(source: CanvasImageSource, width: number, height: number, box: DOMRect, x: number, y: number, fit = 'fill', position = '50% 50%'): Colour | null {
    if (!context || !width || !height) return null;
    let cached = framePixels.get(source);
    if (cached === undefined) {
      try {
        context.clearRect(0, 0, 64, 40); context.drawImage(source, 0, 0, 64, 40);
        cached = { data: context.getImageData(0, 0, 64, 40).data, width: 64, height: 40 };
      } catch { cached = null; }
      framePixels.set(source, cached);
    }
    if (!cached) return null;
    const scale = fit === 'cover' ? Math.max(box.width / width, box.height / height) : fit === 'contain' ? Math.min(box.width / width, box.height / height) : null;
    const drawnWidth = scale ? width * scale : box.width, drawnHeight = scale ? height * scale : box.height;
    const offsets = position.split(' ').map(value => value.endsWith('%') ? parseFloat(value) / 100 : .5);
    const left = box.left + (box.width - drawnWidth) * (offsets[0] ?? .5), top = box.top + (box.height - drawnHeight) * (offsets[1] ?? .5);
    const u = (x - left) / drawnWidth, v = (y - top) / drawnHeight;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    const index = (Math.min(39, Math.floor(v * 40)) * 64 + Math.min(63, Math.floor(u * 64))) * 4;
    return [cached.data[index], cached.data[index + 1], cached.data[index + 2], cached.data[index + 3] / 255];
  }

  function paint(element: Element, x: number, y: number): Colour | null {
    const style = styleOf(element), opacity = Number(style.opacity);
    if (opacity < .02 || style.visibility === 'hidden' || style.display === 'none') return null;
    const box = element.getBoundingClientRect();
    let media: Colour | null = null;
    if (element instanceof HTMLVideoElement && element.readyState >= 2) media = imagePixel(element, element.videoWidth, element.videoHeight, box, x, y, style.objectFit, style.objectPosition);
    else if (element instanceof HTMLImageElement && element.complete) media = imagePixel(element, element.naturalWidth, element.naturalHeight, box, x, y, style.objectFit, style.objectPosition);
    else if (element instanceof HTMLCanvasElement) media = imagePixel(element, element.width, element.height, box, x, y);
    let base = colour(style.backgroundColor) ?? [0, 0, 0, 0] as Colour;
    const background = style.backgroundImage;
    const url = background.match(/^url\(["']?([^"')]+)["']?\)$/)?.[1];
    if (url) {
      let image = cssImages.get(url);
      if (!image) { image = new Image(); image.crossOrigin = 'anonymous'; image.onload = schedule; image.src = url; cssImages.set(url, image); }
      if (image.complete) { const sampled = imagePixel(image, image.naturalWidth, image.naturalHeight, box, x, y, style.backgroundSize === 'contain' ? 'contain' : 'cover', style.backgroundPosition); if (sampled) base = over(sampled, base); }
    } else if (background.includes('gradient(')) {
      const stops = [...background.matchAll(/rgba?\([^)]+\)/g)].map(match => colour(match[0])).filter((value): value is Colour => Boolean(value));
      if (stops.length) {
        const ratio = Math.max(0, Math.min(1, (y - box.top) / Math.max(1, box.height)));
        const first = stops[0], last = stops.at(-1)!;
        base = over(first.map((value, index) => value + (last[index] - value) * ratio) as Colour, base);
      }
    }
    const result = media ? over(media, base) : base;
    result[3] *= opacity;
    return result[3] > .01 ? result : null;
  }

  function underlay(x: number, y: number): Colour {
    const stack: Element[] = [];
    for (const element of document.elementsFromPoint(x, y)) {
      if (header.contains(element) || element === header) continue;
      if (element.shadowRoot) stack.push(...element.shadowRoot.elementsFromPoint(x, y).filter(child => child !== element));
      stack.push(element);
    }
    let result: Colour = [0, 0, 0, 0];
    for (const element of [...new Set(stack)]) {
      const layer = paint(element, x, y);
      if (layer) result = over(result, layer);
      if (result[3] >= .99) break;
    }
    return over(result, WHITE);
  }

  function update() {
    frame = 0;
    if (disposed || document.hidden) return;
    const headerBox = header.getBoundingClientRect();
    if (headerBox.bottom <= 0 || header.dataset.hidden === 'true') return;
    styles = new Map(); framePixels = new Map();
    const items = header.querySelectorAll<HTMLElement>('.desktop-nav a,.mobile-quick-links a,.site-menu-toggle,.news-bar span,.header-brand');
    let whites = 0, count = 0;
    for (const item of items) {
      const box = item.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const y = Math.max(0, Math.min(innerHeight - 1, box.top + box.height / 2));
      const backgrounds = menuOpen ? [WHITE] : [.2, .5, .8].map(ratio => underlay(Math.max(0, Math.min(innerWidth - 1, box.left + box.width * ratio)), y));
      const ink = contrastingNavInk(backgrounds);
      if (item.style.getPropertyValue('--nav-item-ink') !== ink) item.style.setProperty('--nav-item-ink', ink);
      item.dataset.ink = ink === '#ffffff' ? 'white' : 'blue';
      if (ink === '#ffffff') whites++; count++;
    }
    header.dataset.tone = !menuOpen && whites > count / 2 ? 'light' : 'blue';
  }

  const observer = new MutationObserver(records => { if (records.some(record => record.target !== header && !header.contains(record.target) || record.attributeName === 'data-hidden')) schedule(); });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-hidden', 'data-ready'] });
  const resize = new ResizeObserver(schedule); resize.observe(header);
  window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); window.addEventListener('panvibes:header-tone', schedule);
  document.addEventListener('load', schedule, true); document.fonts.ready.then(schedule);
  const interval = window.setInterval(schedule, 240); schedule();
  return () => { disposed = true; cancelAnimationFrame(frame); clearInterval(interval); observer.disconnect(); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('panvibes:header-tone', schedule); document.removeEventListener('load', schedule, true); };
}
