/** Position the opaque email shortcut over the film's lower-right credit area.
 * Coordinates follow the actual object-fit geometry, including mobile zoom. */
export function heroEmailPosition(box: {left:number;top:number;width:number;height:number}, viewport: {width:number;height:number}, cover: boolean) {
  const scale=(cover?Math.max:Math.min)(box.width/16,box.height/9);
  const width=16*scale,height=9*scale;
  const left=box.left+(box.width-width)/2,top=box.top+(box.height-height)/2;
  // Measured from the supplied 1280×720 film: the Gemini sparkle is inset
  // from the corner, around (1160, 600), rather than at the video's edge.
  const mark={left:left+width*1130/1280,top:top+height*568/720,right:left+width*1190/1280,bottom:top+height*632/720};
  const visible={left:Math.max(0,box.left,mark.left),top:Math.max(0,box.top,mark.top),right:Math.min(viewport.width,box.left+box.width,mark.right),bottom:Math.min(viewport.height,box.top+box.height,mark.bottom)};
  if(visible.right<=visible.left||visible.bottom<=visible.top)return null;
  const w=Math.max(48,visible.right-visible.left+8),h=Math.max(48,visible.bottom-visible.top+8);
  return {left:Math.max(0,Math.min(viewport.width-w,(visible.left+visible.right-w)/2)),top:Math.max(0,Math.min(viewport.height-h,(visible.top+visible.bottom-h)/2)),width:w,height:h};
}
