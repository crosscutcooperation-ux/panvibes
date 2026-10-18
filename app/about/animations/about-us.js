import * as THREE from 'three';

// Drop <logistics-about> into any page. All styles are scoped to its Shadow DOM.
class LogisticsAbout extends HTMLElement {
  connectedCallback() {
    if (this.mounted) return;
    this.mounted = true;
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        @font-face{font-family:AboutSteinhart;src:url('/images/fonts/BTSteinhart-Bold-subset.woff2') format('woff2');font-weight:700;font-display:swap}
        @font-face{font-family:AboutHelvetica;src:url('/images/fonts/HelveticaNeueRoman-subset.woff2') format('woff2');font-weight:400;font-display:swap}
        :host{display:block;--about-bg:#0a3866;--about-cream:#fff;--about-orange:#e5643d;--about-nav-space:0px;color:var(--about-cream);font-family:Helvetica,Helvetica,Arial,sans-serif;isolation:isolate}
        *{box-sizing:border-box}.nav-space{height:var(--about-nav-space);background:var(--about-bg)}section{position:relative;min-height:calc(700px - var(--about-nav-space));height:calc(100svh - var(--about-nav-space));overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none;background:radial-gradient(ellipse at 50% 43%,#15558e 0%,var(--about-bg) 68%)}
        section:after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='white' filter='url(%23n)' d='M0 0h160v160H0z'/%3E%3C/svg%3E")}
        .title{position:absolute;top:calc(50% - 85px);left:0;width:100%;display:flex;justify-content:center;margin:0;font-family:Steinhart,Arial,sans-serif;font-weight:700;font-size:clamp(68px,14.5vw,250px);line-height:1.06;letter-spacing:-.035em;white-space:nowrap;transform:translateY(60px);opacity:0;will-change:transform,opacity}
        .title span{display:inline-block;will-change:transform;color:#fff}.title span:nth-child(5){margin-right:.12em}.scene{position:absolute;inset:0;z-index:2;pointer-events:none}.scene canvas{display:block;width:100%;height:100%}.fallback{position:absolute;left:50%;top:43%;transform:translateX(-50%);width:24%;height:30%;background:repeating-linear-gradient(90deg,#8d2c10 0px,#bf491b 9px,#6f210c 11px,#d75e29 15px);border:8px ridge #a9431c;box-shadow:0 30px 80px #0008;z-index:2}.fallback:before,.fallback:after{content:'';position:absolute;bottom:100%;width:2px;height:80vh;background:#8c8b88}.fallback:before{left:8%}.fallback:after{right:8%}
        @media(max-width:700px){:host{--about-nav-space:0px}section{height:100svh;min-height:640px}.title{top:45%;font-size:18vw;letter-spacing:-.045em}.fallback{width:36%;height:24%}}
        .scroll-cue{display:none}
        @media(max-width:991px){:host{height:180svh}section{position:sticky;top:0;height:100svh;min-height:0}.scroll-cue{display:block;position:absolute;left:24px;bottom:24px;font:10px SteinhartMono,monospace;color:#d4e5f3}}
      </style>
      <div class="nav-space" aria-hidden="true"></div>
      <section aria-labelledby="about-title">
        <h1 class="title" id="about-title" aria-label="About Us">${[...'ABOUTUS'].map(c=>`<span aria-hidden="true">${c}</span>`).join('')}</h1>
        <div class="scene" aria-hidden="true"></div>
        <div class="scroll-cue">Scroll to explore ↓</div>
      </section>`;
    this.section=root.querySelector('section');this.headingElement=root.querySelector('.title');
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollMode=matchMedia('(max-width:991px)').matches;
    this.pointer={x:0,y:0};this.start=performance.now();
    this.tilt=0;this.tiltTarget=0;this.lastFrameTime=null;
    this.events=new AbortController();
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;this.lastFrameTime=null;}
      else this.requestFrame();
    },{signal:this.events.signal});
    this.onPointer=e=>{const r=this.section.getBoundingClientRect();this.pointer.x=((e.clientX-r.left)/r.width-.5)*2;this.pointer.y=((e.clientY-r.top)/r.height-.5)*2;this.tiltTarget=Math.max(-.2,Math.min(.2,this.pointer.x*.6));};
    this.onLeave=()=>{this.pointer.x=0;this.pointer.y=0;this.tiltTarget=0;};
    this.section.addEventListener('pointermove',this.onPointer,{signal:this.events.signal});this.section.addEventListener('pointerleave',this.onLeave,{signal:this.events.signal});
    try{this.setup3D(root.querySelector('.scene'));}catch(e){root.querySelector('.scene').innerHTML='<div class="fallback"></div>';this.headingElement.style.opacity=1;this.headingElement.style.transform='none';console.warn('Using the static container fallback',e);}
  }
  setup3D(host){
    const scene=new THREE.Scene();this.scene=scene;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});this.renderer=renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=991?1.25:2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;host.appendChild(renderer.domElement);
    const camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.35,10.8);camera.lookAt(0,0,0);this.camera=camera;
    scene.add(new THREE.HemisphereLight(0xfff1dc,0x303343,1.5));
    const key=new THREE.DirectionalLight(0xffe6cd,3.1);key.position.set(-4,7,7);scene.add(key);
    const rim=new THREE.DirectionalLight(0xff7930,1.5);rim.position.set(5,2,-3);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xe6eaff,1.0);fill.position.set(4,2,5);scene.add(fill);
    this.materials=[];this.geometries=[];
    const material=(c,m=.1,r=.65)=>{const a=new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});this.materials.push(a);return a};
    const orange=material('#bf491b',.38,.6),darkOrange=material('#7f290e',.35,.75),lightOrange=material('#da632d',.4,.6),steel=material('#a6a29b',.82,.3),darkSteel=material('#484849',.8,.5),bolt=material('#b2aea4',.8,.4);
    const box=(w,h,d,mat,x,y,z,parent)=>{const geo=new THREE.BoxGeometry(w,h,d);this.geometries.push(geo);const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);parent.add(mesh);return mesh};
    const cylinder=(radius,length,mat,x,y,z,parent)=>{const geo=new THREE.CylinderGeometry(radius,radius,length,12);this.geometries.push(geo);const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);parent.add(mesh);return mesh};
    const group=new THREE.Group();this.container=group;scene.add(group);
    // A real end-on shipping container with corrugations, two doors and four locking bars.
    box(2.42,2.52,1.42,orange,0,0,0,group);
    for(let x=-1.12;x<=1.12;x+=.125){box(.038,2.35,.055,darkOrange,x,0,.728,group);box(.044,2.35,.033,lightOrange,x+.029,0,.754,group);}
    // Corrugated roof and side walls remain visible as the suspended load rotates.
    for(let z=-.66;z<.66;z+=.125){box(2.26,.035,.035,lightOrange,0,1.276,z,group);box(.039,2.35,.044,darkOrange,1.221,0,z,group);box(.035,2.35,.044,lightOrange,1.243,0,z+.035,group);}
    box(2.5,.095,1.48,darkOrange,0,-1.25,0,group);box(2.5,.085,1.48,lightOrange,0,1.25,0,group);
    for(const x of [-1.19,0,1.19])box(.055,2.5,.065,darkOrange,x,0,.775,group);
    for(const y of [-1.2,1.2])box(2.4,.065,.07,lightOrange,0,y,.782,group);
    for(const x of [-.86,-.3,.3,.86]){
      cylinder(.018,2.34,steel,x,0,.825,group);
      for(const y of [-.86,-.25,.5,.96]){box(.1,.052,.047,darkSteel,x,y,.815,group);box(.051,.035,.025,bolt,x,y,.85,group);}
      box(.19,.031,.032,steel,x+.06,-.5,.873,group);box(.026,.14,.045,darkSteel,x+.14,-.53,.87,group);
    }
    for(const x of [-1.04,1.04])for(const y of [-.77,0,.77])box(.16,.08,.06,steel,x,y,.81,group);
    for(const x of [-1.18,1.18])for(const y of [-1.19,1.19]){box(.14,.14,.12,darkSteel,x,y,.79,group);box(.055,.063,.02,bolt,x,y,.858,group);}
    // Industrial stencilling, not a new brand or logo.
    const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=256;const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#f7d7a3';ctx.font='bold 17px monospace';['MAX.GR 30,480 KG','TARE    2,180 KG','NET    28,300 KG','CU.CAP   33.2 M³'].forEach((t,i)=>ctx.fillText(t,8,28+i*24));
    const tex=new THREE.CanvasTexture(labelCanvas);this.labelTexture=tex;const labelMat=new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.65});this.materials.push(labelMat);const labelGeo=new THREE.PlaneGeometry(.55,.55);this.geometries.push(labelGeo);const label=new THREE.Mesh(labelGeo,labelMat);label.position.set(.64,-.8,.8);group.add(label);
    // Crane spreader and corner lifting fittings.
    box(2.65,.16,1.7,darkSteel,0,1.42,0,group);box(2.52,.035,1.73,steel,0,1.51,0,group);
    for(const x of [-1.12,1.12])for(const z of [-.61,.61]){box(.13,.2,.14,steel,x,1.58,z,group);cylinder(.027,.22,steel,x,1.77,z,group);}
    this.cables=[];
    for(const x of [-1.12,1.12])for(const z of [-.61,.61]){const geo=new THREE.CylinderGeometry(.011,.011,1,8);this.geometries.push(geo);const mesh=new THREE.Mesh(geo,steel);scene.add(mesh);this.cables.push({mesh,lower:new THREE.Vector3(x,1.88,z),upper:new THREE.Vector3(x*.62,9,z*.75)});}
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.section);this.resize();
    this.visible=false;this.hasEntered=false;
    this.observer=new IntersectionObserver(entries=>{
      const entering=entries[0].isIntersecting;
      if(entering&&!this.visible){
        if(this.hasEntered)this.replay();
        else this.start=performance.now();
        this.hasEntered=true;
        this.dataset.enterCount=String((Number(this.dataset.enterCount)||0)+1);
      }
      this.visible=entering;
      if(entering)this.requestFrame();
      else {cancelAnimationFrame(this.frame);this.frame=0;this.lastFrameTime=null;}
    },{threshold:.08});
    this.observer.observe(this.section);
    this.requestFrame();
  }
  resize(){const r=this.section.getBoundingClientRect();this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.container.scale.setScalar(r.width<700?.9:1);this.camera.position.z=r.width<700?13:10.8;this.camera.updateProjectionMatrix();}
  replay(){this.start=performance.now();this.pointer={x:0,y:0};this.tilt=0;this.tiltTarget=0;this.lastFrameTime=null;this.dispatchEvent(new CustomEvent('about-replay',{bubbles:true,composed:true}));}
  requestFrame(){if(!this.frame&&this.mounted&&this.visible&&!document.hidden)this.frame=requestAnimationFrame(()=>this.animate());}
  animate(){
    this.frame=0;if(!this.visible||document.hidden){this.lastFrameTime=null;return;}this.requestFrame();
    const now=performance.now();
    if(innerWidth<=991&&this.lastFrameTime!==null&&now-this.lastFrameTime<32)return;
    const dt=this.lastFrameTime===null?0:Math.min(.05,Math.max(0,(now-this.lastFrameTime)/1000));
    this.lastFrameTime=now;
    this.tilt+=(this.tiltTarget-this.tilt)*Math.min(1,dt*6);
    this.dataset.tilt=(this.tilt*180/Math.PI).toFixed(1);
    const elapsed=(now-this.start)/1000;
    let t=elapsed;
    if(this.scrollMode&&!this.reduced){const r=this.getBoundingClientRect(),range=Math.max(1,this.offsetHeight-this.section.offsetHeight);const progress=Math.max(0,Math.min(1,-r.top/range));t=.8+progress*4.2;this.dataset.scrollProgress=progress.toFixed(3);}
    else if(this.getAttribute('mode')==='scroll'&&!this.reduced){const r=this.section.getBoundingClientRect();t=Math.max(0,Math.min(5,(innerHeight-r.top)/innerHeight*3.7));}
    this.dataset.animationTime=t.toFixed(3);
    const motionTime=this.scrollMode?t:elapsed;
    const ease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
    const appear=this.reduced?1:ease(t/1.25);this.headingElement.style.opacity=appear;this.headingElement.style.transform=`translateY(${(1-appear)*65}px)`;
    this.headingElement.querySelectorAll('span').forEach((s,i)=>{s.style.transform=`translateY(${this.reduced?0:(1-ease((t-i*.075)/1.05))*90}px)`;});
    const p=this.reduced?1:Math.max(0,Math.min(1,(t-.65)/2.35));
    const drop=1-Math.pow(1-p,3);
    const settle=this.reduced?0:(p===1?Math.sin((t-3)*2.7)*Math.exp(-(t-3)*1.15)*.07:Math.sin(p*Math.PI*3)*.09*p);
    const g=this.container;g.position.set(this.reduced?0:Math.sin(motionTime*.64)*.035,.25+(1-drop)*7+settle,0);
    g.rotation.set(-.045+this.pointer.y*.011,-.05+this.tilt,this.reduced?0:Math.sin(motionTime*.75)*.012+settle*.25);
    g.updateMatrixWorld();
    for(const c of this.cables){const lower=c.lower.clone().applyMatrix4(g.matrixWorld);const upper=c.upper;const direction=new THREE.Vector3().subVectors(lower,upper);c.mesh.position.copy(upper).add(lower).multiplyScalar(.5);c.mesh.scale.y=direction.length();c.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());}
    this.renderer.clear(true,true,true);
    this.renderer.render(this.scene,this.camera);
  }
  disconnectedCallback(){this.mounted=false;cancelAnimationFrame(this.frame);this.events?.abort();this.resizeObserver?.disconnect();this.observer?.disconnect();this.geometries?.forEach(g=>g.dispose());this.materials?.forEach(m=>m.dispose());this.labelTexture?.dispose();this.renderer?.dispose();}
}
if(!customElements.get('logistics-about'))customElements.define('logistics-about',LogisticsAbout);



