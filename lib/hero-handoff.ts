import brandedAssets from './container-branding-assets.json';

// Alpha bounds were measured from the extracted truck, not guessed from a
// browser viewport. Both renderers use the same image and visible dimensions.
export const handoffTruck = {
  src:'/media/home-hero/handoff-truck.png',
  imageWidth:948,imageHeight:1659,
  x:301,y:94,width:356,height:1494,
};
export const handoffCrop:[number,number,number,number]=[
  handoffTruck.x/handoffTruck.imageWidth,handoffTruck.y/handoffTruck.imageHeight,
  handoffTruck.width/handoffTruck.imageWidth,handoffTruck.height/handoffTruck.imageHeight,
];
export const heroFilm={width:1920,height:1080,frameRate:30};
export const videoTruckBounds={x:342,y:36,width:234,height:993};

// Keep the original PNG silhouette, with the roof branding matched to the
// desert film. Both canvases use the same image through the section boundary.
let preparedTruck:Promise<HTMLImageElement>|undefined;
export function loadHandoffTruck(){
  if(!preparedTruck)preparedTruck=(async()=>{
    const image=new Image();image.decoding='async';image.src=(brandedAssets as Record<string,string>)[handoffTruck.src]||handoffTruck.src;
    await image.decode();return image;
  })();
  return preparedTruck;
}

// Match the film's actual cover/contain sizing, including its mobile letterbox.
export function arrivalTruckLength(width:number,height:number){
  const scale=width<768?width/heroFilm.width:width/height>=1.6?Math.max(width/heroFilm.width,height/heroFilm.height):Math.min(width/heroFilm.width,height/heroFilm.height);
  return videoTruckBounds.height*scale;
}
