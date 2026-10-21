import branded from './container-branding-assets.json';
import sequences from './reference-sequences.json';
import mobile from './mobile-journey-assets.json';
import { services, industries } from './site-content';
import packs from './journey-packs.json';
import { registerPreparedAssets } from './prepared-assets';

export const journeyStills=['truck-container','truck-top','container-top','container-blue','container-orange','crane-base','crane-beam'].map(name=>`/images/${name}.avif`);
export function journeyAsset(path:string,compact:boolean){const resolved=compact?(mobile as Record<string,string>)[path]||path:path;return (branded as Record<string,string>)[resolved]||resolved;}
export function journeyDownloads(compact:boolean){
  return [...new Set([
    ...Object.values(sequences).flat(),...journeyStills,'/media/home-hero/handoff-truck.png',
    '/images/branded/ship.webp','/images/cloud-left.avif','/images/cloud-right.avif','/images/land.json',
    ...services.map(service=>`/images/${service.image}`),...industries.map(industry=>`/images/${industry.image}`),
  ].map(path=>journeyAsset(path,compact)))];
}

// A single static download avoids hundreds of round trips. Its compressed Blob
// slices share backing bytes; the canvas still decodes only a bounded window.
export async function prepareJourneyDownloads(compact:boolean,signal:AbortSignal,progress:(value:number)=>void){
  const asset=compact?packs.mobile:packs.desktop;
  const blob=await downloadBytes(asset.src,asset.bytes,signal,progress,'application/octet-stream');
  const prefix=await blob.slice(0,4).arrayBuffer(),size=new DataView(prefix).getUint32(0,true);
  if(size<=0||size>128000||size+4>=blob.size)throw new Error('Invalid journey download');
  const entries=JSON.parse(await blob.slice(4,4+size).text()) as [string,number,number,string][];
  if(entries.length!==asset.entries)throw new Error('Incomplete journey download');
  return registerPreparedAssets(blob,entries,4+size);
}

// A complete local Blob makes every scroll seek independent of the network.
// Abort on inactivity, not an arbitrary total duration on a slow connection.
export async function downloadHero(source:string,bytes:number,signal:AbortSignal,progress:(value:number)=>void){
  return downloadBytes(source,bytes,signal,progress,'video/mp4');
}
async function downloadBytes(source:string,bytes:number,signal:AbortSignal,progress:(value:number)=>void,type:string){
  const controller=new AbortController();
  const cancel=()=>controller.abort();signal.addEventListener('abort',cancel,{once:true});
  let timeout:ReturnType<typeof setTimeout>;
  const heartbeat=()=>{clearTimeout(timeout);timeout=setTimeout(cancel,30000);};
  heartbeat();
  try{
    if(signal.aborted)throw new DOMException('Aborted','AbortError');
    const response=await fetch(source,{signal:controller.signal,cache:'force-cache'});
    if(!response.ok||!response.body)throw new Error('The opening film could not be downloaded');
    const reader=response.body.getReader(),chunks:Uint8Array<ArrayBuffer>[]=[];
    const total=Number(response.headers.get('content-length'))||bytes;let received=0,last=0;
    for(;;){const {value,done}=await reader.read();if(done)break;chunks.push(value);received+=value.byteLength;heartbeat();
      if(performance.now()-last>100){last=performance.now();progress(Math.min(.96,received/total*.96));}}
    if(!received)throw new Error('The opening film is empty');
    progress(.96);return new Blob(chunks,{type});
  }finally{clearTimeout(timeout!);signal.removeEventListener('abort',cancel);}
}
