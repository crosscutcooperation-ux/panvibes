'use client';
import { useEffect, useRef } from 'react';
import { destinations } from '@/lib/site-content';
import { officeLocation } from '@/lib/office-location';

export default function InteractiveGlobe({active=true,variant='home',focusOffice=false}:{active?:boolean;variant?:'home'|'contact';focusOffice?:boolean}) {
  const container=useRef<HTMLDivElement>(null),activeRef=useRef(active);
  const focusRef=useRef(focusOffice);
  useEffect(()=>{activeRef.current=active;container.current?.dispatchEvent(new Event('globe-activity'));},[active]);
  useEffect(()=>{focusRef.current=focusOffice;container.current?.dispatchEvent(new Event(focusOffice?'globe-office-focus':'globe-reset'));},[focusOffice]);
  useEffect(()=>{
    const host=container.current!;
    const abort=new AbortController();let cancelled=false,dispose=()=>{};
    async function setup(){
      const [THREE,topojson,land]=await Promise.all([import('three'),import('topojson-client'),fetch('/images/land.json',{signal:abort.signal}).then(response=>response.json())]);
      if(cancelled)return;
      const compact=matchMedia('(max-width:991px), (pointer:coarse)').matches;
      const renderer=new THREE.WebGLRenderer({alpha:true,antialias:!compact,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.25:1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
      const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');
      canvas.setAttribute('aria-label','Interactive 3D globe. Move the mouse or swipe horizontally to rotate. Use plus and minus to zoom. Scroll vertically to continue the page. Arrow keys rotate; Home resets.');
      host.appendChild(canvas);
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.002,30);camera.position.z=3.8;
      const group=new THREE.Group();scene.add(group);
      scene.add(new THREE.AmbientLight('#bddbff',1.2));
      const key=new THREE.DirectionalLight('#e6f3ff',3.3);key.position.set(-3,3,4);scene.add(key);
      const fill=new THREE.DirectionalLight('#388ae8',1.9);fill.position.set(3,-1,-2);scene.add(fill);
      const position=(lat:number,lon:number,r=1)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return new THREE.Vector3(r*Math.cos(a)*Math.sin(b),r*Math.sin(a),r*Math.cos(a)*Math.cos(b));};
      const feature=topojson.feature(land,land.objects.land) as unknown as {features:{geometry:{coordinates:number[][][][]}}[]};
      const polygons=feature.features.flatMap(item=>item.geometry.coordinates);
      const drawLand=(context:CanvasRenderingContext2D,colour:string)=>{
        context.fillStyle=colour;
        for(const polygon of polygons){
          // Unwrap islands crossing ±180°. Otherwise Fiji draws a false stripe
          // across the whole texture and Russia gains an artificial border.
          const rings=polygon.map(ring=>{let previous=(ring[0][0]+180)*4;return ring.map(([lon,lat])=>{let x=(lon+180)*4;while(x-previous>720)x-=1440;while(x-previous< -720)x+=1440;previous=x;return [x,(90-lat)*4];});});
          for(const offset of [-1440,0,1440]){context.beginPath();for(const ring of rings)ring.forEach(([x,y],i)=>{if(i===0)context.moveTo(x+offset,y);else context.lineTo(x+offset,y);});context.fill('evenodd');}
        }
      };
      const mask=document.createElement('canvas');mask.width=1440;mask.height=720;const ink=mask.getContext('2d')!;
      ink.fillStyle='#000';ink.fillRect(0,0,1440,720);ink.fillStyle='#fff';
      drawLand(ink,'#fff');
      const pixels=ink.getImageData(0,0,1440,720).data;
      const colour=document.createElement('canvas');colour.width=1440;colour.height=720;const paint=colour.getContext('2d')!;
      paint.fillStyle='#063b67';paint.fillRect(0,0,1440,720);
      drawLand(paint,'#518aa7');
      // Align the sphere UV longitude with the geographic marker convention.
      const map=new THREE.CanvasTexture(colour),bump=new THREE.CanvasTexture(mask);
      for(const texture of [map,bump]){texture.wrapS=THREE.RepeatWrapping;texture.offset.x=.25;texture.anisotropy=4;}
      map.colorSpace=THREE.SRGBColorSpace;
      const surface=new THREE.Mesh(new THREE.SphereGeometry(1,compact?64:96,compact?32:48),new THREE.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.018,roughness:.52,metalness:.16}));group.add(surface);
      const dots:number[]=[];
      const dotStep=compact?2.4:1.8;
      for(let lat=-57;lat<82;lat+=dotStep)for(let lon=-180;lon<180;lon+=dotStep/Math.max(.25,Math.cos(lat*Math.PI/180))){const i=(Math.floor((90-lat)*4)*1440+Math.floor((lon+180)*4))*4;if(pixels[i]>100)dots.push(...position(lat,lon,1.012).toArray());}
      const dotGeometry=new THREE.BufferGeometry();dotGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dots,3));
      const touch={value:new THREE.Vector3(0,0,1)},strength={value:0},clock={value:0};
      const rippleMaterial=new THREE.MeshBasicMaterial({color:'#ff874c',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
      const ripple=new THREE.Mesh(new THREE.RingGeometry(.022,.028,64),rippleMaterial);group.add(ripple);
      const outward=new THREE.Vector3(0,0,1);
      const dotMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{touch,strength,clock},
        vertexShader:`uniform vec3 touch;uniform float strength;uniform float clock;varying float facing;varying float wave;void main(){float d=distance(normalize(position),touch);wave=exp(-d*d*18.)*strength;vec3 p=position+normalize(position)*wave*(.06+.025*sin(d*35.-clock*9.));vec4 world=modelMatrix*vec4(p,1.);vec3 n=normalize(mat3(modelMatrix)*p);facing=smoothstep(0.,.3,dot(n,normalize(cameraPosition-world.xyz)));gl_Position=projectionMatrix*viewMatrix*world;gl_PointSize=2.+wave*3.;}`,
        fragmentShader:`varying float facing;varying float wave;void main(){if(length(gl_PointCoord-.5)>.5)discard;gl_FragColor=vec4(mix(vec3(.75,.89,1.),vec3(1.,.42,.18),wave),facing*.76);}`});group.add(new THREE.Points(dotGeometry,dotMaterial));
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.065,64,48),new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
        vertexShader:'varying vec3 n;varying vec3 p;void main(){n=normalize(normalMatrix*normal);p=(modelViewMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*vec4(p,1.);}',
        fragmentShader:'varying vec3 n;varying vec3 p;void main(){float rim=pow(1.-max(0.,dot(normalize(n),normalize(-p))),3.5);gl_FragColor=vec4(.25,.64,1.,rim*.85);}'})));
      const locations:readonly (readonly [string,number,number])[]=variant==='contact'?[['Navi Mumbai',officeLocation.latitude,officeLocation.longitude]]:destinations;
      const labels=locations.map(([name,lat,lon])=>{const point=position(lat,lon,1.025);const marker=new THREE.Mesh(new THREE.SphereGeometry(.012,16,12),new THREE.MeshBasicMaterial({color:'#ff874c',transparent:true}));marker.position.copy(point);group.add(marker);const label=document.createElement('span');label.className='globe-label';label.textContent=name;host.appendChild(label);return {point,label,marker};});
      if(variant==='home'){
        // Join consecutive stops so the route passes through every country.
        // Equal angular steps keep long, nearly antipodal legs smooth.
        const routes=destinations.slice(1).map((destination,i)=>{
          const origin=destinations[i];
          const a=position(origin[1],origin[2]),b=position(destination[1],destination[2]);
          const angle=a.angleTo(b),sine=Math.sin(angle);
          const points=Array.from({length:128},(_,n)=>{
            const t=n/127;
            const direction=angle<.0001?a.clone():a.clone().multiplyScalar(Math.sin((1-t)*angle)/sine).addScaledVector(b,Math.sin(t*angle)/sine);
            return direction.normalize().multiplyScalar(1.025+Math.sin(t*Math.PI)*.16);
          });
          const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#ff874c',transparent:true,opacity:.72}));
          line.name=`${origin[0]} → ${destination[0]}`;
          group.add(line);
          return line.name;
        });
        host.dataset.route=destinations.map(([name])=>name).join(' → ');
        host.dataset.routeCount=String(routes.length);
        canvas.setAttribute('aria-description',`Connected trade route: ${host.dataset.route}.`);
      }
      let width=1,height=1,inView=true,frame=0,last=0,lastInteraction=0,dirty=true;
      const reduced=matchMedia('(prefers-reduced-motion: reduce)');
      const initialX=variant==='contact'?19.0788*Math.PI/180:.12,initialY=variant==='contact'?-73.0108*Math.PI/180:-.9;
      let targetX=initialX,targetY=initialY,targetZ=3.8,velocityX=0,velocityY=0,targetStrength=0;
      let hovering=false,hoverBaseX=initialX,hoverBaseY=initialY,officeFocused=false;
      let officeStarted=0,officeStartZ=3.8;
      group.rotation.set(initialX,initialY,0);
      const pointers=new Map<number,{x:number;y:number}>();let pinchDistance=0,pinchZoom=3.8;
      const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
      const hit=(event:PointerEvent)=>{const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const result=raycaster.intersectObject(surface)[0];if(result){touch.value.copy(group.worldToLocal(result.point.clone()).normalize());return true;}return false;};
      const down=(event:PointerEvent)=>{if(officeFocused||event.button!==0||(!pointers.size&&!hit(event)))return;if(event.pointerType==='mouse')event.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});host.dataset.dragging='true';velocityX=velocityY=0;targetStrength=1;lastInteraction=performance.now();if(pointers.size===2){pinchDistance=distance();pinchZoom=targetZ;}};
      const distance=()=>{const [a,b]=[...pointers.values()];return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;};
      const move=(event:PointerEvent)=>{if(officeFocused)return;dirty=true;const previous=pointers.get(event.pointerId);if(previous){const dx=event.clientX-previous.x,dy=event.clientY-previous.y;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size===2){targetZ=Math.max(2.8,Math.min(5.3,pinchZoom*pinchDistance/Math.max(distance(),1)));}else{targetY+=dx*.007;targetX=Math.max(-1.1,Math.min(1.1,targetX+dy*.007));velocityY=dx*.003;velocityX=dy*.003;}targetStrength=1;lastInteraction=performance.now();hit(event);}else if(event.pointerType==='mouse'){if(!hovering){hoverBaseX=targetX;hoverBaseY=targetY;hovering=true;}const rect=canvas.getBoundingClientRect();targetY=hoverBaseY+((event.clientX-rect.left)/rect.width-.5)*1.7;targetX=Math.max(-1.1,Math.min(1.1,hoverBaseX+((event.clientY-rect.top)/rect.height-.5)*.8));velocityX=velocityY=0;targetStrength=hit(event)?.22:0;lastInteraction=performance.now();}};
      const up=(event:PointerEvent)=>{pointers.delete(event.pointerId);host.dataset.dragging=String(pointers.size>0);targetStrength=0;lastInteraction=performance.now();if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);};
      const leave=()=>{hovering=false;if(!pointers.size)targetStrength=0;};
      const reset=()=>{if(focusRef.current)return;officeFocused=false;targetX=initialX;targetY=initialY;targetZ=3.8;camera.fov=35;camera.updateProjectionMatrix();velocityX=velocityY=0;dirty=true;lastInteraction=performance.now();};
      const officeFocus=()=>{officeFocused=true;hovering=false;officeStarted=performance.now();officeStartZ=camera.position.z;targetX=officeLocation.latitude*Math.PI/180;const officeY=-officeLocation.longitude*Math.PI/180;targetY+=Math.atan2(Math.sin(officeY-targetY),Math.cos(officeY-targetY));velocityX=velocityY=0;targetStrength=0;dirty=true;};
      const zoomIn=()=>{targetZ=Math.max(2.8,targetZ-.35);lastInteraction=performance.now();};
      const zoomOut=()=>{targetZ=Math.min(5.3,targetZ+.35);lastInteraction=performance.now();};
      const keydown=(event:KeyboardEvent)=>{if(officeFocused||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','+','=','-'].includes(event.key))return;event.preventDefault();lastInteraction=performance.now();if(event.key==='Home')reset();else if(event.key==='+'||event.key==='=')zoomIn();else if(event.key==='-')zoomOut();else {targetY+=event.key==='ArrowRight' ? .18 : event.key==='ArrowLeft' ? -.18 : 0;targetX=Math.max(-1.1,Math.min(1.1,targetX+(event.key==='ArrowDown' ? .12 : event.key==='ArrowUp' ? -.12 : 0)));}};
      canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('dblclick',reset);canvas.addEventListener('keydown',keydown);
      host.addEventListener('globe-reset',reset);host.addEventListener('globe-zoom-in',zoomIn);host.addEventListener('globe-zoom-out',zoomOut);
      host.addEventListener('globe-office-focus',officeFocus);if(focusRef.current)officeFocus();
      const resize=new ResizeObserver(()=>{dirty=true;width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();});resize.observe(host);
      const syncActivity=()=>{
        if(activeRef.current&&inView&&!document.hidden){if(!frame){last=0;frame=requestAnimationFrame(animate);}}
        else {cancelAnimationFrame(frame);frame=0;}
      };
      const visibility=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncActivity();});visibility.observe(host);
      const animate=(time:number)=>{frame=0;if(!activeRef.current||!inView||document.hidden)return;frame=requestAnimationFrame(animate);if(time-last<30)return;const dt=Math.min((time-last)/1000,.05);last=time;clock.value=reduced.matches?0:time/1000;
        // Orient toward the office first, then descend almost to the surface.
        // A narrower lens continues the dive without crossing the sphere mesh.
        const flight=officeFocused?(reduced.matches?1:Math.min(1,(time-officeStarted)/officeLocation.diveDurationMs)):0;
        if(officeFocused){const p=Math.max(0,(flight-.18)/.82),dive=p*p*(3-2*p);targetZ=officeStartZ+(1.045-officeStartZ)*dive;camera.position.z=targetZ;camera.fov=35-23*dive;camera.updateProjectionMatrix();dirty=true;}
        const settling=Math.abs(targetX-group.rotation.x)+Math.abs(targetY-group.rotation.y)+Math.abs(targetZ-camera.position.z)+Math.abs(targetStrength-strength.value)+Math.abs(velocityX)+Math.abs(velocityY)>.0002;
        if(variant==='contact'&&!pointers.size&&!dirty&&!settling)return;
        if(!pointers.size&&!officeFocused){if(!reduced.matches){targetY+=velocityY;targetX=Math.max(-1.1,Math.min(1.1,targetX+velocityX));velocityX*=.91;velocityY*=.91;if(!hovering&&time-lastInteraction>4000&&variant==='home')targetY+=dt*.045;}else velocityX=velocityY=0;}
        const easing=reduced.matches?1:1-Math.exp(-dt*12);group.rotation.x+=(targetX-group.rotation.x)*easing;group.rotation.y+=(targetY-group.rotation.y)*easing;camera.position.z+=(targetZ-camera.position.z)*easing;strength.value+=(targetStrength-strength.value)*easing;
        ripple.position.copy(touch.value).multiplyScalar(1.025);ripple.quaternion.setFromUnitVectors(outward,touch.value);ripple.scale.setScalar(1+(1-strength.value)*4);rippleMaterial.opacity=strength.value*.9;
        group.updateMatrixWorld();labels.forEach(({point,label,marker})=>{const world=point.clone().applyMatrix4(group.matrixWorld),visible=world.z>.25&&(!officeFocused||flight<.22);const projected=world.project(camera);label.style.opacity=visible?'1':'0';marker.material.opacity=officeFocused?Math.max(0,1-flight*2):1;label.style.transform=`translate(${(projected.x*.5+.5)*width}px,${(-projected.y*.5+.5)*height-12}px) translate(-50%,-100%)`;});
        host.dataset.rotation=`${group.rotation.x.toFixed(3)},${group.rotation.y.toFixed(3)}`;host.dataset.zoom=camera.position.z.toFixed(2);host.dataset.touch=strength.value.toFixed(2);renderer.render(scene,camera);dirty=false;
      };syncActivity();host.classList.add('globe-ready');
      document.addEventListener('visibilitychange',syncActivity);host.addEventListener('globe-activity',syncActivity);
      dispose=()=>{cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',syncActivity);host.removeEventListener('globe-activity',syncActivity);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('dblclick',reset);canvas.removeEventListener('keydown',keydown);host.removeEventListener('globe-reset',reset);host.removeEventListener('globe-zoom-in',zoomIn);host.removeEventListener('globe-zoom-out',zoomOut);host.removeEventListener('globe-office-focus',officeFocus);scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Points||object instanceof THREE.Line){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());}});map.dispose();bump.dispose();renderer.dispose();host.replaceChildren();host.classList.remove('globe-ready');};
    }
    // Defer the WebGL module, textures and geometry until the globe is nearby.
    let nearby=false,started=false;
    const start=()=>{
      if(started||!nearby||!activeRef.current)return;
      started=true;preload.disconnect();
      setup().catch(error=>{if(!cancelled)console.warn('Globe unavailable; displaying the static fallback.',error);});
    };
    const preload=new IntersectionObserver(([entry])=>{nearby=entry.isIntersecting;start();},{rootMargin:'300px'});
    preload.observe(host);
    host.addEventListener('globe-activity',start);
    return()=>{cancelled=true;preload.disconnect();host.removeEventListener('globe-activity',start);abort.abort();dispose();};
  },[variant]);
  return <div className={`globe-shell globe-${variant}`}><div ref={container} className="globe-renderer"/>
    <div className="globe-tools"><span className="mono">Drag to explore · + / − to zoom</span><div><button type="button" aria-label="Zoom globe out" onClick={()=>container.current?.dispatchEvent(new Event('globe-zoom-out'))}>−</button><button type="button" aria-label="Reset globe view" onClick={()=>container.current?.dispatchEvent(new Event('globe-reset'))}>↺</button><button type="button" aria-label="Zoom globe in" onClick={()=>container.current?.dispatchEvent(new Event('globe-zoom-in'))}>+</button></div></div>
  </div>;
}
