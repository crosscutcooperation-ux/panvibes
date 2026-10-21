// A homepage lease owns compressed Blob URLs. Decoding remains bounded in the
// renderer; releasing the lease frees every URL, including on a breakpoint change.
const sources=new Map<string,string>();
export function preparedAsset(path:string){return sources.get(path)||path;}
export function registerPreparedAssets(blob:Blob,entries:[string,number,number,string][],start:number){
  const owned:[string,string][]=[];
  try{
    for(const [path,offset,length,type] of entries){
      if(!path.startsWith('/images/')||!Number.isSafeInteger(offset)||!Number.isSafeInteger(length)||offset<0||length<=0||start+offset+length>blob.size)throw new Error('Invalid journey asset');
      const url=URL.createObjectURL(blob.slice(start+offset,start+offset+length,type));sources.set(path,url);owned.push([path,url]);
    }
  }catch(error){owned.forEach(([path,url])=>{if(sources.get(path)===url)sources.delete(path);URL.revokeObjectURL(url);});throw error;}
  return ()=>owned.forEach(([path,url])=>{if(sources.get(path)===url)sources.delete(path);URL.revokeObjectURL(url);});
}
