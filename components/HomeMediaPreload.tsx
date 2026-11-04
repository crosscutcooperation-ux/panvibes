import videoAssets from '@/lib/hero-video-assets.json';

export default function HomeMediaPreload() {
  // Run while parsing the server HTML, before hydration. Pick the exact same
  // film as ScrollVideoHero, including touch desktops and Data Saver, so the
  // browser can reuse this fetch instead of downloading an unused variant.
  const source=`(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const a=${JSON.stringify(videoAssets)};const v=navigator.connection?.saveData?a.dataSaver:matchMedia('(max-width: 991px)').matches?a.mobile:a.desktop;const l=document.createElement('link');l.rel='preload';l.as='fetch';l.href=v.src;l.crossOrigin='anonymous';document.head.appendChild(l);})();`;
  return <script dangerouslySetInnerHTML={{__html:source}}/>;
}
