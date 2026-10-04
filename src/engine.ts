interface EngineRelease {
  version: string;
  assets: Array<{path:string;sha256:string;size:number}>;
  localAssets: Array<{path:string;sha256:string;size:number}>;
}
/** Cache upstream engine bytes, never documents. Native bundles already contain these assets. */
export async function prepareEngine(progress:(message:string)=>void) {
  if(!crossOriginIsolated || typeof SharedArrayBuffer==='undefined') throw Error('This platform cannot run the local office engine. Use a browser or desktop app with shared WebAssembly memory support.');
  const response=await fetch('/office-release.json');
  if(!response.ok)throw Error('Install the office engine on this app host with npm run office:prepare, then rebuild the app.');
  const release=await response.json() as EngineRelease;
  if(!/^[a-f0-9]{40}$/.test(release.version))throw Error('Invalid office release');
  if(!/^https?:$/.test(location.protocol))return;
  const cache=await caches.open('taskasaur-office-'+release.version);
  const assets=[...release.assets,...release.localAssets];
  for(let index=0;index<assets.length;index++) {
    const asset=assets[index],url='/office-engine/'+asset.path+'?v='+release.version;
    if(!/^[a-zA-Z0-9.]+$/.test(asset.path) || asset.size>256*1024*1024)throw Error('Invalid office asset');
    if(await cache.match(url,{ignoreVary:true}))continue;
    progress(`Preparing LibreOffice for offline use (${index+1}/${assets.length})…`);
    const download=await fetch(url);
    if(!download.ok)throw Error('Office assets are not installed on this host. Run npm run office:prepare and rebuild.');
    const bytes=await download.arrayBuffer();
    const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
    if(bytes.byteLength!==asset.size || sha!==asset.sha256)throw Error('Office asset failed integrity verification: '+asset.path);
    await cache.put(url,new Response(bytes,{headers:{'Content-Type':download.headers.get('Content-Type')??'application/octet-stream','Cross-Origin-Resource-Policy':'same-origin'}}));
  }
  progress('LibreOffice is available offline.');
}
