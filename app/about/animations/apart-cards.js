export function startApartCards() {
  const events = new AbortController();
  const section = document.querySelector('.apart-section');
  if (!section) return;

  const sticky = section.querySelector('.apart-sticky');
  const viewport = section.querySelector('.apart-viewport');
  const track = section.querySelector('.apart-track');
  const cards = [...section.querySelectorAll('.apart-card')];
  const progressBar = section.querySelector('.apart-progress span');
  const hint = section.querySelector('.apart-hint');
  const desktop = matchMedia('(min-width: 768px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let travel = 0;
  let targetProgress = 0;
  let renderedProgress = 0;
  let frame = 0;
  let lastFrameTime = 0;
  let inputMode = 'scroll';
  let pointerX = null;
  let lastPointerX = null;
  let touchGesture = null;
  let viewportLeft = 0;
  let viewportWidth = 0;
  let cardCenters = [];
  let activeCard = null;

  const listen = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: events.signal });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function setActive(card) {
    if (card === activeCard) return;
    activeCard = card;
    cards.forEach(item => item.classList.toggle('is-active', item === card));
  }

  function update(time) {
    frame = 0;
    if (desktop.matches || !reducedMotion.matches) {
      const delta = lastFrameTime ? Math.min(64, time - lastFrameTime) : 16;
      lastFrameTime = time;
      const difference = targetProgress - renderedProgress;
      renderedProgress = reducedMotion.matches || Math.abs(difference) < .0005
        ? targetProgress
        : renderedProgress + difference * (1 - Math.exp(-delta / 145));
      track.style.transform = `translate3d(${-renderedProgress * travel}px,0,0)`;
    } else {
      lastFrameTime = 0;
      const scrollable = viewport.scrollWidth - viewport.clientWidth;
      renderedProgress = scrollable ? clamp(viewport.scrollLeft / scrollable, 0, 1) : 0;
    }

    progressBar.style.transform = `scaleX(${Math.max(.08, renderedProgress)})`;
    const focusedIndex = cards.indexOf(document.activeElement);
    const referenceX = desktop.matches && inputMode === 'pointer' && pointerX !== null
      ? pointerX - viewportLeft + renderedProgress * travel
      : (desktop.matches || !reducedMotion.matches ? renderedProgress * travel : viewport.scrollLeft) + viewportWidth / 2;
    let closestIndex = 0;
    for (let index = 1; index < cardCenters.length; index++) {
      if (Math.abs(cardCenters[index] - referenceX) < Math.abs(cardCenters[closestIndex] - referenceX)) closestIndex = index;
    }
    setActive(cards[focusedIndex >= 0 ? focusedIndex : closestIndex]);
    if ((desktop.matches || !reducedMotion.matches) && Math.abs(targetProgress - renderedProgress) >= .0005) scheduleUpdate();
    else lastFrameTime = 0;
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function measure() {
    if (desktop.matches) {
      section.classList.add('is-enhanced');
      viewport.scrollLeft = 0;
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.height = '';
      renderedProgress = targetProgress;
      hint.textContent = 'MOVE YOUR MOUSE OR SCROLL TO EXPLORE';
    } else {
      section.classList.toggle('is-enhanced',!reducedMotion.matches);
      travel = Math.max(0,track.scrollWidth-viewport.clientWidth);
      section.style.height = reducedMotion.matches?'':`${innerHeight+travel*.9}px`;
      if(reducedMotion.matches)track.style.transform = '';
      inputMode = 'scroll';
      pointerX = null;
      hint.textContent = reducedMotion.matches?'SWIPE TO EXPLORE':'SCROLL TO EXPLORE';
    }
    lastFrameTime = 0;
    viewportLeft = viewport.getBoundingClientRect().left;
    viewportWidth = viewport.clientWidth;
    const trackLeft = track.getBoundingClientRect().left;
    cardCenters = cards.map(card => {
      const rect = card.getBoundingClientRect();
      return rect.left - trackLeft + rect.width / 2;
    });
    scheduleUpdate();
  }

  cards.forEach(card => {
    listen(card, 'focus', scheduleUpdate, { signal: events.signal });
    listen(card, 'blur', scheduleUpdate, { signal: events.signal });
  });

  // Hover position maps across the complete card rail; no button press is needed.
  listen(sticky, 'pointermove', event => {
    if (!desktop.matches || event.pointerType === 'touch' || !travel) return;
    // Scrolling can fire a pointermove at the stationary cursor when cards
    // pass underneath it. Only actual sideways mouse motion drives the rail.
    if (Math.abs(event.movementX) < 1) {
      lastPointerX = event.clientX;
      return;
    }
    if (lastPointerX !== null && Math.abs(event.clientX - lastPointerX) < 2) return;
    lastPointerX = event.clientX;
    const rect = sticky.getBoundingClientRect();
    const margin = rect.width * .06;
    pointerX = event.clientX;
    inputMode = 'pointer';
    targetProgress = clamp((pointerX - rect.left - margin) / (rect.width - margin * 2), 0, 1);
    scheduleUpdate();
  });
  listen(sticky, 'pointerleave', event => {
    if (!desktop.matches || event.pointerType === 'touch' || touchGesture) return;
    pointerX = null;
    lastPointerX = null;
    inputMode = 'rest';
    scheduleUpdate();
  });

  // Wheel input advances the cards without intercepting page scrolling. At
  // the page bottom, further wheel motion can still reveal the remaining cards.
  listen(sticky, 'wheel', event => {
    if (!desktop.matches || !travel) return;
    const rawPixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const pixels = clamp(rawPixels, -160, 160);
    if (!pixels) return;
    if (inputMode !== 'wheel') targetProgress = renderedProgress;
    inputMode = 'wheel';
    pointerX = null;
    lastPointerX = event.clientX;
    targetProgress = clamp(targetProgress + pixels / Math.max(1200, travel * 1.6), 0, 1);
    scheduleUpdate();
  }, { passive: true, signal: events.signal });

  // Tablet-width touchscreens can swipe the pinned rail; phones use native touch scrolling.
  listen(viewport, 'pointerdown', event => {
    if (!desktop.matches || event.pointerType !== 'touch' || !travel) return;
    touchGesture = { id: event.pointerId, x: event.clientX, progress: renderedProgress };
    viewport.setPointerCapture(event.pointerId);
  });
  listen(viewport, 'pointermove', event => {
    if (!touchGesture || event.pointerId !== touchGesture.id) return;
    inputMode = 'touch';
    targetProgress = clamp(touchGesture.progress + (touchGesture.x - event.clientX) / travel, 0, 1);
    renderedProgress = targetProgress;
    scheduleUpdate();
  });
  const endTouch = () => { touchGesture = null; };
  listen(viewport, 'pointerup', endTouch, { signal: events.signal });
  listen(viewport, 'pointercancel', endTouch, { signal: events.signal });
  listen(viewport, 'lostpointercapture', endTouch, { signal: events.signal });
  listen(viewport, 'scroll', scheduleUpdate, { passive: true, signal: events.signal });
  listen(window, 'resize', measure, { passive: true, signal: events.signal });
  listen(window,'scroll',()=>{
    if(desktop.matches||reducedMotion.matches)return;
    targetProgress=clamp(-section.getBoundingClientRect().top/Math.max(1,section.offsetHeight-sticky.offsetHeight),0,1);
    scheduleUpdate();
  },{passive:true});
  listen(desktop, 'change', measure);

  // Keyboard arrows reveal each card without taking over vertical scrolling.
  cards.forEach(card => listen(card, 'keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = cards[clamp(cards.indexOf(card) + (event.key === 'ArrowRight' ? 1 : -1), 0, cards.length - 1)];
    next.focus({ preventScroll: true });
    if (desktop.matches && travel) {
      inputMode = 'keyboard';
      pointerX = null;
      targetProgress = clamp((cardCenters[cards.indexOf(next)] - viewportWidth / 2) / travel, 0, 1);
      scheduleUpdate();
    } else next.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));

  measure();
  return () => { events.abort(); cancelAnimationFrame(frame); };
}
