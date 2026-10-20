// Start expensive assets once per mount, before their section enters view.
// Geometry/pinning can be established immediately without fetching the artwork.
export function whenNear(element: Element, work: () => void, margin = 1600) {
  let stopped = false;
  const observer = new IntersectionObserver(entries => {
    if (stopped || !entries.some(entry => entry.isIntersecting)) return;
    stopped = true;
    observer.disconnect();
    work();
  }, { rootMargin: `${margin}px` });
  observer.observe(element);
  return () => { stopped = true; observer.disconnect(); };
}
