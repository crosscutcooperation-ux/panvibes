'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './blog.module.css';

const letters = [
  { value: 'B', x: '-142px', y: '-52px', turn: '-25deg' },
  { value: 'L', x: '-52px', y: '65px', turn: '18deg' },
  { value: 'O', x: '58px', y: '-68px', turn: '28deg' },
  { value: 'G', x: '145px', y: '48px', turn: '-20deg' },
];

function EditorialGraphic({ type }) {
  if (type === 'spark') return <svg viewBox="0 0 64 64" fill="none"><path d="m32 2 5 20L54 10 43 27l19 5-20 5 12 17-17-11-5 19-5-20L10 54l11-17-19-5 20-5L10 10l17 11L32 2Z" fill="currentColor" /></svg>;
  if (type === 'play') return <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2"/><path d="m27 20 18 12-18 12V20Z" fill="currentColor"/></svg>;
  if (type === 'speech') return <svg viewBox="0 0 64 64" fill="none"><path d="M10 10h44v32H30L16 54V42h-6V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="23" cy="26" r="2.5" fill="currentColor"/><circle cx="32" cy="26" r="2.5" fill="currentColor"/><circle cx="41" cy="26" r="2.5" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 64 64" fill="none"><path d="M8 23V8h15m18 0h15v15m0 18v15H41m-18 0H8V41" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg>;
}

export default function BlogTitle() {
  const [burst, setBurst] = useState(false);
  const [cycle, setCycle] = useState(0);
  const scene = useRef(null);
  const active = useRef(false);
  const hovering = useRef(false);
  const holding = useRef(false);
  const pointerType = useRef('mouse');
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function animate() {
    window.clearTimeout(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.current = false;
      setBurst(false);
      return;
    }

    // Restart the existing animations without replacing the button or moving its hit area.
    // This also lets a fresh tap or mouse re-entry replay immediately during a cycle.
    if (active.current) {
      for (const animation of scene.current.getAnimations({ subtree: true })) {
        if (/blogScatter|editorialScatter|editorialRing/.test(animation.animationName || '')) {
          animation.currentTime = 0;
          animation.play();
        }
      }
    }
    active.current = true;
    setCycle(value => value + 1);
    setBurst(true);
    timer.current = window.setTimeout(() => {
      if (hovering.current || holding.current) {
        animate();
      } else {
        active.current = false;
        setBurst(false);
      }
    }, 2400);
  }

  return <header className={`${styles.blogTitle} ${burst ? styles.titleBurst : ''}`} data-header-theme="light" data-burst={burst} data-cycle={cycle}>
    <div
      ref={scene}
      className={styles.titleScene}
      onPointerEnter={event => {
        pointerType.current = event.pointerType;
        if (event.pointerType !== 'touch') {
          hovering.current = true;
          animate();
        }
      }}
      onPointerLeave={() => { hovering.current = false; }}
      onPointerDown={event => {
        pointerType.current = event.pointerType;
        if (event.pointerType !== 'mouse') {
          holding.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          animate();
        }
      }}
      onPointerUp={() => { holding.current = false; }}
      onPointerCancel={() => { holding.current = false; hovering.current = false; }}
      onLostPointerCapture={() => { holding.current = false; }}
    >
      <div className={styles.titleOrbit} aria-hidden="true" />
      <div className={styles.titleGhost} aria-hidden="true">BLOG</div>
      {['speech', 'spark', 'frame', 'play'].map((type, index) => <span key={type} aria-hidden="true" className={`${styles.titleGraphic} ${styles[`graphic${index}`]}`}><EditorialGraphic type={type} /></span>)}
      <h1 aria-label="Blog"><button type="button" className={styles.titleTrigger} aria-label="Animate Blog title" aria-describedby="blog-animation-hint" onClick={event => { if (event.detail === 0 || pointerType.current === 'mouse') animate(); }}>
        {letters.map((letter, index) => <span key={letter.value} aria-hidden="true" className={styles.titleLetter} style={{ '--letter-index': index, '--fly-x': letter.x, '--fly-y': letter.y, '--fly-turn': letter.turn }}>{letter.value}</span>)}
      </button></h1>
    </div>
    <span className={styles.titleAccent} aria-hidden="true" />
    <p id="blog-animation-hint" className={styles.titleHint}>Ideas take flight. <span>Stay here to keep them flying. Tap to replay.</span></p>
  </header>;
}
