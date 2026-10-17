import sequences from './reference-sequences.json';
import mobileAssets from './mobile-journey-assets.json';
import { handoffTruck, handoffCrop } from './hero-handoff';
import { mix, segment, smooth, truckPose, receivingContainer, truckWheelAngle, tippingTruck, shipHandoff } from './journey-motion';

// The reference uses pre-rendered 3D, not low-detail browser geometry. A single
// canvas draws one vehicle per phase, preserving its silhouette during turns.
export function createJourneyScene(host: HTMLElement) {
  const compact=window.matchMedia('(max-width:991px), (pointer:coarse)').matches;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  host.appendChild(canvas);
  const images = new Map<string, HTMLImageElement>();
  const waiting = new Set<string>();
  const queue: string[] = [];
  let disposed = false, loading = 0, raf = 0, time = 0, width = 0, height = 0;
  const framePaths = Object.values(sequences).flat();
  const pinned = new Set<string>(['/images/truck-container.avif', '/images/truck-top.avif', '/images/container-top.avif', '/images/container-blue.avif', '/images/container-orange.avif', '/images/crane-base.avif', '/images/crane-beam.avif', sequences['crane-lift'][0], sequences['truck-turn'][0], sequences['truck-turn'].at(-1)!, sequences['crane-place'].at(-1)!]);
  const redraw = () => { if (!raf && !disposed) raf = requestAnimationFrame(() => { raf = 0; draw(time, width, height); }); };
  function pump() {
    while (!disposed && loading < 4 && queue.length) {
      const path = queue.shift()!, image = new Image();
      loading++; image.decoding = 'async'; image.dataset.asset = path;
      image.onload = () => {
        loading--; waiting.delete(path);
        image.onload = null; image.onerror = null;
        if (!disposed) { images.set(path, image); redraw(); pump(); }
      };
      image.onerror = () => { loading--; waiting.delete(path); pump(); };
      image.src = compact ? (mobileAssets as Record<string,string>)[path] || path : path;
    }
  }
  function request(path: string, urgent = false) {
    if (images.has(path) || disposed) return;
    if (waiting.has(path)) {
      const index = queue.indexOf(path);
      if (urgent && index > 0) { queue.splice(index, 1); queue.unshift(path); }
      return;
    }
    waiting.add(path);
    if (urgent) queue.unshift(path); else queue.push(path);
    pump();
  }
  function image(path: string) { request(path, true); return images.get(path); }
  function frame(name: keyof typeof sequences, progress: number) {
    const list = sequences[name], index = Math.round(progress * (list.length - 1));
    request(list[index], true);
    for (let offset = 1; offset <= 5; offset++) {
      if (list[index + offset]) request(list[index + offset]);
      if (list[index - offset]) request(list[index - offset]);
    }
    if (images.has(list[index])) return images.get(list[index]);
    for (let distance = 1; distance < list.length; distance++) {
      const nearby = images.get(list[index - distance]) || images.get(list[index + distance]);
      if (nearby) return nearby;
    }
  }
  pinned.add(handoffTruck.src);
  pinned.forEach(path => request(path));
  request(sequences['crane-lift'][0]); request(sequences['crane-turn'][0]);
  function photo(asset: HTMLImageElement | undefined, x: number, y: number, w: number, h: number, angle = 0, crop?: [number, number, number, number]) {
    if (!asset) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (crop) ctx.drawImage(asset, crop[0] * asset.naturalWidth, crop[1] * asset.naturalHeight, crop[2] * asset.naturalWidth, crop[3] * asset.naturalHeight, -w / 2, -h / 2, w, h);
    else ctx.drawImage(asset, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  function hydraulic(ax: number, ay: number, bx: number, by: number, diameter: number) {
    const dx = bx - ax, dy = by - ay, length = Math.hypot(dx, dy);
    if (length < diameter * 2) return;
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(Math.atan2(dy, dx));
    const barrel = ctx.createLinearGradient(0, -diameter/2, 0, diameter/2);
    barrel.addColorStop(0, '#171e26'); barrel.addColorStop(.35, '#738795'); barrel.addColorStop(.6, '#d7e1e7'); barrel.addColorStop(1, '#202a34');
    ctx.fillStyle = barrel; ctx.fillRect(0, -diameter/2, length*.58, diameter);
    const chrome = ctx.createLinearGradient(0, -diameter*.28, 0, diameter*.28);
    chrome.addColorStop(0, '#586978'); chrome.addColorStop(.45, '#f8fdff'); chrome.addColorStop(1, '#687984');
    ctx.fillStyle = chrome; ctx.fillRect(length*.55, -diameter*.28, length*.45, diameter*.56);
    ctx.fillStyle = '#273742';
    for (const x of [0, length]) { ctx.beginPath(); ctx.arc(x, 0, diameter*.7, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#b5c4ce';ctx.beginPath();ctx.arc(x,0,diameter*.22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#273742'; }
    ctx.restore();
  }
  function draw(t: number, w: number, h: number) {
    if (disposed || !w || !h) return;
    time = t;
    if (w !== width || h !== height) {
      width = w; height = h;
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    ctx.clearRect(0, 0, w, h);
    const spinningWheels = (asset: HTMLImageElement | undefined, x: number, y: number, length: number, angle: number) => {
      if (!asset) return;
      const frameHeight = length * 809 / 2880, radius = length * .0305, sourceRadius = asset.naturalWidth * .0305;
      [.2025, .276875, .3496875, .674375, .894375].forEach((position, index) => {
        const vertical = index === 4 ? .809 : .814;
        ctx.save();
        ctx.translate(x + (position - .5) * length, y + (vertical - .5) * frameHeight);
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.clip(); ctx.rotate(angle);
        ctx.drawImage(asset, position * asset.naturalWidth - sourceRadius, vertical * asset.naturalHeight - sourceRadius, sourceRadius * 2, sourceRadius * 2, -radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      });
    };
    const chassis = (x: number, y: number, length: number, angle: number) => {
      const asset = frame('truck-turn', 0), bodyHeight = length * 809 / 2880;
      ctx.save(); ctx.translate(x, y);
      // Use the same photographed chassis and correctly placed tires as the
      // loaded truck, clipping only its container during the tipping sequence.
      ctx.beginPath(); ctx.rect(-length / 2, -bodyHeight / 2, length, bodyHeight);
      ctx.rect(-length / 2 + length * .015, -bodyHeight / 2, length * .79, bodyHeight * .70);
      ctx.clip('evenodd'); photo(asset, 0, 0, length, bodyHeight); ctx.restore();
      spinningWheels(asset, x, y, length, angle);
    };
    const smallTruck = tippingTruck(t, w, h), smallLength = smallTruck.length;
    const cameraTurn = smooth(segment(t, 6, 8));
    const smallX = smallTruck.x, smallY = smallTruck.y;
    if (t < 6) photo(image(handoffTruck.src),smallX,smallY,smallLength*handoffTruck.width/handoffTruck.height,smallLength,0,handoffCrop);
    if (t >= 6 && t < 8) photo(frame('truck-turn', 1 - cameraTurn), smallX, smallY, smallLength, smallLength * 809 / 2880, (1 - cameraTurn) * Math.PI / 2);
    if (t >= 8 && t < 13) {
      // The same photographic truck tips its own bed. It does not become a
      // different SVG or a block model when the camera settles.
      const sideHeight = smallTruck.height;
      chassis(smallX, smallY, smallLength, truckWheelAngle(t, true));
      if (smallTruck.tip < -.01) {
        const bedX = smallLength * .42, bedY = -sideHeight * .025;
        const ramX = smallTruck.pivotX + bedX * Math.cos(smallTruck.tip) - bedY * Math.sin(smallTruck.tip);
        const ramY = smallTruck.pivotY + bedX * Math.sin(smallTruck.tip) + bedY * Math.cos(smallTruck.tip);
        hydraulic(smallX-smallLength*.15, smallY+sideHeight*.24, ramX, ramY, Math.max(3, smallLength*.015));
      }
      ctx.save(); ctx.translate(smallTruck.pivotX, smallTruck.pivotY); ctx.rotate(smallTruck.tip);
      photo(image('/images/truck-container.avif'), smallLength * .497, -sideHeight * .20, smallLength, sideHeight);
      ctx.restore();
    }
    const receiver = receivingContainer(w, h);
    const doorImage = image(sequences['crane-lift'][0]);
    const door = (x: number, y: number, color?: 'blue' | 'orange', open = false) => {
      const front = color ? image(`/images/container-${color}.avif`) : doorImage;
      const roofDepth = receiver.height * .055 * (1-smooth(segment(t,10.5,11.3)));
      const left = x-receiver.width/2, top = y-receiver.height/2;
      // A shared, shallow overhead viewpoint reveals the receiving opening and
      // gives the entire stack the same horizon. The front doors stay upright.
      ctx.save(); ctx.beginPath(); ctx.moveTo(left,top); ctx.lineTo(left+receiver.width,top); ctx.lineTo(left+receiver.width+roofDepth,top-roofDepth);ctx.lineTo(left+roofDepth,top-roofDepth);ctx.closePath();
      ctx.fillStyle = open ? '#263e4d' : color==='blue' ? '#345679' : '#bc7041';ctx.fill();
      ctx.strokeStyle=open?'#c6d0d6':color==='blue'?'#7c96b0':'#e6ab70';ctx.lineWidth=Math.max(1,receiver.width*.012);ctx.stroke();ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1);
      // Trim the transparent side padding so neighbouring steel corners meet.
      if (color) photo(front,0,0,receiver.width+1,receiver.height+1,0,[5/369,0,360/369,1]);
      else photo(front, 0, 0, receiver.width, receiver.height, 0, [.857, .344, .118, .24]);
      ctx.restore();
    };
    // Two foundation containers remain in the yard while the upper one is
    // filled and lifted. All three keep the supplied door-facing perspective.
    if (t >= 7.7 && t < 17) {
      const yardTravel = -w * 1.3 * smooth(segment(t, 16, 17.5));
      if(t<10.5)for (const side of [-1, 1]) door(receiver.x + yardTravel + side * receiver.width * .5, receiver.y + receiver.height - 4, side < 0 ? 'blue' : 'orange');
      if (t < 11.3) door(receiver.x, receiver.y, undefined, true);
    }
    if (t >= 7.7 && t < 11.3) {
      // The front wall occludes boxes once they cross the container's top lip.
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, receiver.y - receiver.height / 2 + 2); ctx.clip();
      for (let i = 0; i < 6; i++) {
        const release = 8.7 + i * .14, p = segment(t, release, release + .9);
        if (p <= 0 || p >= 1) continue;
        const origin = tippingTruck(release, w, h), size = Math.max(8, w * .017);
        const x = mix(origin.rearX, receiver.x + (i % 3 - 1) * receiver.width * .12, p);
        const y = mix(origin.rearY + size * .5, receiver.y - receiver.height * .44, p * p);
        ctx.save(); ctx.translate(x, y); ctx.rotate(p * 2); ctx.fillStyle = '#ad7c45'; ctx.fillRect(-size / 2, -size / 2, size, size); ctx.fillStyle = '#d6ba89'; ctx.fillRect(-size * .08, -size / 2, size * .16, size); ctx.restore();
      }
      ctx.restore();
    }
    const pose = truckPose(t, w, h), length = pose.scale * 16, frameHeight = length * 809 / 2880;
    if (t >= 17 && t < 24) sequences['truck-turn'].forEach(path => request(path));
    if (t >= 10.5 && t < 16.9) {
      const placement = smooth(segment(t, 14.6, 15.5));
      const craneWidth = mix(Math.min(w * 1.2, h * 1.7), length * 1.186, placement);
      const craneHeight = craneWidth * .5625;
      const startLeft = w * .16 - craneWidth * .083;
      const endLeft = w * .675 - length * .0865 - craneWidth * .5;
      const left = mix(startLeft, endLeft, smooth(segment(t, 11.3, 14))) + w * .9 * (1 - smooth(segment(t, 10.5, 11.3))) - w * 1.6 * smooth(segment(t, 15.8, 16.9));
      const top = mix(h * .70 - craneHeight * .58, h * .75 + frameHeight * .20 - craneHeight * .711, smooth(segment(t, 11.3, 14)));
      const source = t < 12.2 ? frame('crane-lift', segment(t, 11.3, 12.2)) : t < 14 ? frame('crane-turn', segment(t, 12.2, 14)) : frame('crane-place', segment(t, 14.6, 15.5));
      if (source) {
        ctx.save(); ctx.translate(left + craneWidth, top); ctx.scale(-1, 1);
        if (t < 11.3) {
          // The approaching side view has no machinery behind its door crop.
          ctx.beginPath(); ctx.rect(0, 0, craneWidth, craneHeight);
          ctx.rect(craneWidth * .849, craneHeight * .344, craneWidth * .136, craneHeight * .248);
          ctx.clip('evenodd');
        }
        if (t >= 15.5) {
          // These original transparent assets contain the complete unloaded
          // machine. Removing cargo from a loaded photograph erased its boom.
          const base = image('/images/crane-base.avif'), beam = image('/images/crane-beam.avif');
          const lift = craneHeight * .10 * smooth(segment(t, 15.5, 15.8));
          // Extend the photographed mast with the spreader so raising it never
          // leaves a gap between the lifting head and the handler's body.
          photo(base, craneWidth * .5, craneHeight * .53 - lift / 2, craneWidth * .036, craneHeight * .08 + lift, 0, [.482, .51, .036, .14]);
          if (base) ctx.drawImage(base, 0, 0, craneWidth, craneHeight);
          if (beam) ctx.drawImage(beam, 0, -lift, craneWidth, craneHeight);
        } else {
          // Preserve the complete photographed boom and spreader. Thin lifting
          // links bridge the initial roof gap without erasing any machinery.
          ctx.drawImage(source, 0, 0, craneWidth, craneHeight);
          if(t>=11.3&&t<12.2){
            const gap=craneHeight*35/720*(1-smooth(segment(t,11.3,12.2)));
            if(gap>.5){
              ctx.strokeStyle='#424f59';ctx.lineWidth=Math.max(1,craneWidth*2/1280);
              for(const x of [1106,1238]){ctx.beginPath();ctx.moveTo(craneWidth*x/1280,craneHeight*214/720);ctx.lineTo(craneWidth*x/1280,craneHeight*214/720+gap);ctx.stroke();}
            }
          }
        }
        if (t >= 14) {
          const lift = craneHeight * .10 * smooth(segment(t, 15.5, 15.8));
          const ramTop = t < 15.5 ? craneHeight * (mix(.54,.711,placement)+.012) : craneHeight*.50-lift;
          for (const side of [-1,1]) hydraulic(craneWidth*(.5+side*.026),craneHeight*.765,craneWidth*(.5+side*.024),ramTop,Math.max(2,craneWidth*.008));
        }
        ctx.restore();
      }
    }
    if(t>=10.5&&t<17){
      // The steel foundation is in front of the handler. Drawing it last also
      // prevents the reference frame's pale edge matte washing over its doors.
      const yardTravel=-w*1.3*smooth(segment(t,16,17.5));
      for(const side of [-1,1])door(receiver.x+yardTravel+side*receiver.width*.5,receiver.y+receiver.height-4,side<0?'blue':'orange');
    }
    if (t >= 14 && t < 15.5) {
      chassis(pose.x, pose.y, length, truckWheelAngle(t));
    } else if (t >= 15.5 && t < 24) {
      const side = frame('truck-turn', 0);
      photo(side, pose.x, pose.y, length, frameHeight);
      spinningWheels(side, pose.x, pose.y, length, truckWheelAngle(t));
    } else if (t >= 24 && t < 32.5) {
      photo(frame('truck-turn', smooth(segment(t, 24, 26))), pose.x, pose.y, length, frameHeight, -pose.heading);
    }
    if (t >= 32.5 && t < 33.95) {
      const handoff = shipHandoff(t, w, h);
      // Cab keeps driving away while its single container seats on the deck.
      if (t < 33.7) photo(image('/images/truck-top.avif'), pose.x, pose.y, length, length * 1618 / 5760, Math.PI / 2);
      ctx.globalAlpha = 1 - smooth(segment(t, 33.7, 33.95));
      photo(image('/images/container-top.avif'), w * .5, handoff.y, handoff.cargoLength, handoff.cargoWidth, Math.PI / 2, [143 / 5760, 281 / 1618, 4347 / 5760, 1056 / 1618]);
      ctx.globalAlpha = 1;
    }
    // Keep a bounded decoded-image cache rather than retaining hundreds of
    // full-resolution frames on phones. Nearby frames refill on reverse scroll.
    if (images.size > (compact?40:76)) for (const [path, cached] of images) {
      if (images.size <= (compact?30:60)) break;
      if (!pinned.has(path) && framePaths.includes(path)) { images.delete(path); cached.onload = null; cached.onerror = null; cached.src = ''; }
    }
  }
  return { draw, dispose() { disposed = true; cancelAnimationFrame(raf); queue.length = 0; images.forEach(asset => { asset.onload = null; asset.onerror = null; asset.src = ''; }); images.clear(); canvas.remove(); } };
}
