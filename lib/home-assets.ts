import branded from './container-branding-assets.json';
import sequences from './reference-sequences.json';
import mobile from './mobile-journey-assets.json';
import { services, industries } from './site-content';

export const journeyStills=['truck-container','truck-top','container-top','container-blue','container-orange','crane-base','crane-beam'].map(name=>`/images/${name}.avif`);
export function journeyAsset(path:string,compact:boolean){const resolved=compact?(mobile as Record<string,string>)[path]||path:path;return (branded as Record<string,string>)[resolved]||resolved;}
export function journeyDownloads(compact:boolean){
  return [...new Set([
    ...Object.values(sequences).flat(),...journeyStills,'/media/home-hero/handoff-truck.png',
    '/images/branded/ship.webp','/images/cloud-left.avif','/images/cloud-right.avif','/images/land.json',
    ...services.map(service=>`/images/${service.image}`),...industries.map(industry=>`/images/${industry.image}`),
  ].map(path=>journeyAsset(path,compact)))];
}

// Warm compressed HTTP-cache entries, not hundreds of decoded canvases. The
// renderer decodes a bounded window of neighbouring frames only when needed.
export async function prepareJourneyDownloads(compact:boolean,signal:AbortSignal,progress:(value:number)=>void){
  const paths=journeyDownloads(compact);let index=0,done=0;
  await Promise.all(Array.from({length:4},async()=>{
    while(index<paths.length){
      const path=paths[index++];
      const response=await fetch(path,{signal,cache:'force-cache'});
      if(!response.ok)throw new Error('A journey image could not be downloaded');
      await response.arrayBuffer();
      progress(++done/paths.length);
    }
  }));
}

// A complete local Blob makes every scroll seek independent of the network.
// Abort on inactivity, not an arbitrary total duration on a slow connection.
export async function downloadHero(source:string,bytes:number,signal:AbortSignal,progress:(value:number)=>void){
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
    progress(.96);return new Blob(chunks,{type:'video/mp4'});
  }finally{clearTimeout(timeout!);signal.removeEventListener('abort',cancel);}
}
