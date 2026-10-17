export type HeaderScrollState = {
  y:number;
  direction:number;
  distance:number;
  hidden:boolean;
};

export const initialHeaderScroll = (y:number):HeaderScrollState => ({y,direction:0,distance:0,hidden:false});

// Accumulate movement across animation frames so slow scrolling works too.
// Small direction changes are ignored to prevent touchpad jitter.
export function nextHeaderScroll(previous:HeaderScrollState,y:number,locked=false):HeaderScrollState {
  if(locked||y<=24)return initialHeaderScroll(y);
  const delta=y-previous.y,direction=Math.sign(delta);
  if(!direction)return previous;
  const distance=direction===previous.direction?previous.distance+Math.abs(delta):Math.abs(delta);
  const threshold=direction>0?12:6;
  return {y,direction,distance,hidden:distance>=threshold?direction>0:previous.hidden};
}
