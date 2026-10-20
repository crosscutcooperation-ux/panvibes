import { arrivalTruckLength } from './hero-handoff';
// One scroll clock drives the vehicles, road, content, and ocean camera.
export const JOURNEY_DURATION = 40;
export const JOURNEY_SCREENS = 27;
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const segment = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const smooth = (p: number) => p * p * (3 - 2 * p);

export function receivingContainer(w: number, h: number) {
  const craneWidth = Math.min(w * 1.2, h * 1.7), craneHeight = craneWidth * .5625;
  return {
    x: w * .16 + craneWidth * .001,
    y: h * .70 - craneHeight * .116,
    width: craneWidth * .118,
    height: craneHeight * .24,
  };
}

export function truckWheelAngle(t: number, arrival = false) {
  if (arrival) return smooth(segment(t, 6, 8)) * Math.PI * 4 + smooth(segment(t, 10.8, 12.7)) * Math.PI * 10;
  return -smooth(segment(t, 14, 14.6)) * Math.PI * 8 + Math.max(0, t - 16) * 6;
}

export function tippingTruck(t: number, w: number, h: number) {
  const length = mix(arrivalTruckLength(w),Math.min(w * .58,h * .86),smooth(segment(t,0,2.3))), height = length * 614 / 2664;
  const turn = smooth(segment(t, 6, 8));
  const receiver = receivingContainer(w, h);
  const x = mix(w * .265, receiver.x + length * .497, turn) + w * 1.4 * smooth(segment(t, 10.8, 12.7));
  const y = t < 6 ? mix(h * .12, h * .53, smooth(segment(t, 0, 2.3))) : mix(h * .53, h * .34, turn);
  const tip = -.37 * smooth(segment(t, 8, 9)) * (1 - smooth(segment(t, 10.4, 11.2)));
  const pivotX = x - length * .497, pivotY = y + height * .245;
  // The rear opening is the left edge of the photographed container. Release
  // below its bottom corner, never through the visible corrugated side wall.
  const localX = -length * .01, localY = height * .01;
  return { x, y, length, height, tip, pivotX, pivotY,
    rearX: pivotX + localX * Math.cos(tip) - localY * Math.sin(tip),
    rearY: pivotY + localX * Math.sin(tip) + localY * Math.cos(tip) };
}

export function shipHandoff(t: number, w: number, h: number) {
  const original = truckPose(32.5, w, h), length = original.scale * 16;
  const p = smooth(segment(t, 32.5, 33.7));
  const cargoLength = mix(length * 4347 / 5760, w * 381 / 731, p);
  const shipWidth = cargoLength * 731 / 381;
  const cargoWidth = mix(length * 1056 / 5760, shipWidth * 82 / 731, smooth(segment(t, 32.5, 33.15)));
  return { shipWidth, cargoLength, cargoWidth, y: mix(original.y - length * .098, h * .5, p) };
}

// A quarter-circle gives the long trailer enough clearance on both road edges.
export function roadLayout(width: number, height: number) {
  const radius = Math.min(width * .24, height * .46);
  return { radius, x: width * .5 - radius, y: height * .34, laneWidth: width * .18 };
}

export function roadPresentation(t: number, width: number, height: number) {
  const road = roadLayout(width, height), p = smooth(segment(t, 24, 26));
  const endX = mix(width * 2, width * .5, p);
  return { ...road, x: endX - road.radius, endX, y: mix(height * .66, road.y, p), laneWidth: mix(height * .68, road.laneWidth, p) };
}

export function servicesTruckY(height: number, scale: number) {
  // The lowest tire pixel in the photographic frame meets the black panel edge.
  return height * .32 - (751 / 809 - .5) * scale * 16 * 809 / 2880;
}

export function bendPoint(p: number, width: number, height: number) {
  const road = roadLayout(width, height), angle = p * Math.PI / 2;
  return { x: road.x + road.radius * Math.sin(angle), y: road.y + road.radius * (1 - Math.cos(angle)), heading: -angle };
}

export function truckPose(t: number, width: number, height: number) {
  const liftScale = Math.min(width * .036, height * .068);
  const serviceScale = Math.min(width * .037, height * .068);
  const roadScale = Math.min(width * .018, height * .025);
  const road = roadLayout(width, height);
  const serviceY = servicesTruckY(height, serviceScale);
  let x = width * .675, y = height * .75, scale = liftScale, tilt = .22, heading = 0;
  if (t < 14.6) x = mix(width * 1.5, width * .675, smooth(segment(t, 14, 14.6)));
  if (t >= 16) {
    const p = smooth(segment(t, 16, width<=991?17.1:17.5));
    x = mix(width*.675, width*.46, p); y = mix(height*.75, serviceY,p);
    scale = mix(liftScale,serviceScale,p);
  }
  if (t >= 17.5) x = mix(width*.46,width*.54,segment(t,17.5,24));
  if (t >= 24) {
    const p = smooth(segment(t,24,26));
    x = mix(width*.54,road.x,p); y = mix(serviceY,roadPresentation(t,width,height).y,p);
    scale = mix(serviceScale,roadScale,p); tilt=mix(.22,Math.PI/2,p);
  }
  if (t >= 26 && t < 28) {
    const point=bendPoint(smooth(segment(t,26,28)),width,height);
    x=point.x; y=point.y; heading=point.heading;
  }
  if(t>=28) { x=width*.5; y=mix(road.y+road.radius,height*.48,smooth(segment(t,28,29))); heading=-Math.PI/2; }
  if(t>=32.5) y += height*1.5*smooth(segment(t,32.5,34));
  return {x,y,scale,tilt,heading};
}
