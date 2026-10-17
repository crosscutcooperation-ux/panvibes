export function startContentReveals() {
  const main = document.querySelector('.panvibes-content');
  if (!main) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  // Animate only elements entering the viewport; the source remains visible without JavaScript.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const offset = target.classList.contains('fadeInLeft') ? [-32, 0]
        : target.classList.contains('fadeInRight') ? [32, 0]
        : target.classList.contains('fadeInDown') ? [0, -24] : [0, 24];
      target.animate([
        { opacity: 0, transform: `translate(${offset[0]}px, ${offset[1]}px)` },
        { opacity: 1, transform: 'translate(0, 0)' }
      ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
      observer.unobserve(target);
    });
  }, { threshold: 0.12 });
  main.querySelectorAll('.wow').forEach(element => observer.observe(element));
  return () => observer.disconnect();
}
