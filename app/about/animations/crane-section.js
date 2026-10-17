import * as THREE from 'three';

const TAU = Math.PI * 2;
const DROP_SECONDS = .85;
const DROP_DELAY = .1;
const TRAVEL_SECONDS = 1.1;
const SETTLE_SECONDS = Math.max(TRAVEL_SECONDS, DROP_DELAY + DROP_SECONDS);
const MOMENTUM_DAMPING = 4.2;

// A close view of a steel lattice boom travelling right to left with its suspended load.
class LogisticsCrane extends HTMLElement {
  connectedCallback() {
    if (this.mounted) return;
    this.mounted = true;
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        @font-face{font-family:CraneSteinhart;src:url('/images/fonts/BTSteinhart-Bold-subset.woff2') format('woff2');font-weight:700;font-display:swap}
        @font-face{font-family:CraneHelvetica;src:url('/images/fonts/HelveticaNeueRoman-subset.woff2') format('woff2');font-weight:400;font-display:swap}
        :host{display:block;color:#fff;background:#0a3866;isolation:isolate;font-family:Helvetica,Helvetica,Arial,sans-serif}
        *{box-sizing:border-box}
        section{position:relative;height:clamp(760px,94svh,940px);overflow:hidden;border-top:1px solid #ffffff30;background:radial-gradient(ellipse at 30% 50%,#104e87,#0a3866 76%)}
        .scene{position:absolute;inset:0;z-index:2}.scene canvas{display:block;width:100%;height:100%;touch-action:pan-y}
        .fallback{display:none;position:absolute;inset:0}.fallback svg{width:55%;height:100%}.fallback.load-visible{display:block}
        .vision-mission{position:absolute;z-index:3;top:50%;right:clamp(38px,6vw,112px);width:min(39vw,520px);opacity:0;transform:translateY(-50%) translateX(10px);transition:opacity .18s ease,transform .18s ease}
        section.ready .vision-mission{opacity:1;transform:translateY(-50%)}
        .vision-mission article{padding:25px 0 30px;border-top:1px solid #ffffff45}
        .vision-mission article:last-child{padding-bottom:0}
        .vision-mission h2{margin:0 0 13px;color:#fff;font-family:Steinhart,Arial,sans-serif;font-size:clamp(31px,3.05vw,44px);font-weight:700;letter-spacing:-.018em;line-height:1.12;text-transform:uppercase}
        .vision-mission p{margin:0;max-width:52ch;color:#f1f7fc;font-size:clamp(15px,1.24vw,18px);line-height:1.7;text-shadow:0 1px 8px #072c55}
        @media(max-width:900px){
          section{height:auto;min-height:0}
          .scene,.fallback{inset:0 0 auto;height:690px}
          .vision-mission,section.ready .vision-mission{position:relative;top:auto;right:auto;width:auto;max-width:680px;margin:690px auto 0;padding:12px 6vw 70px;opacity:1;transform:none}
          .vision-mission h2{font-size:clamp(30px,5vw,40px)}
          .vision-mission p{font-size:16px}
        }
        @media(max-width:700px){
          .scene,.fallback{height:420px}.fallback svg{width:100%}
          .vision-mission,section.ready .vision-mission{margin-top:420px;padding:10px 24px 60px}
          .vision-mission article{padding:24px 0 29px}
          .vision-mission h2{font-size:32px}
          .vision-mission p{font-size:15px;line-height:1.68}
        }
      </style>
      <section aria-label="Our Vision and Mission with animated crane">
        <div class="scene" aria-hidden="true"></div>
        <div class="fallback" aria-hidden="true">
          <svg viewBox="0 0 1280 820" fill="none">
            <g stroke="#e5643d" stroke-width="12" stroke-linejoin="round">
              <path d="M-60 590 985 150M-40 510 965 75M0 550 50 480 100 508 150 438 200 465 250 395 300 423 350 354 400 380 450 310 500 336 550 267 600 293 650 224 700 250 750 180 800 207 850 138 900 164 955 95"/>
            </g>
            <g stroke="#a6a29b" stroke-width="3"><path d="M970 130V335M985 126V335"/></g>
            <rect x="956" y="330" width="43" height="58" rx="7" fill="#e5643d"/>
            <path d="M978 388v19c-27 35 22 60 30 24" stroke="#b0afab" stroke-width="12" stroke-linecap="round"/>
            <path d="m987 430-150 106m150-106 150 106" stroke="#a6a29b" stroke-width="3"/>
            <rect x="817" y="537" width="340" height="150" rx="3" fill="#d95a38" stroke="#ed7956" stroke-width="6"/>
            <path d="M838 545v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136m22-136v136" stroke="#a43f12" stroke-width="5"/>
          </svg>
        </div>
        <div class="vision-mission">
          <article aria-labelledby="vision-title">
            <h2 id="vision-title">Our Vision</h2>
            <p>To be the world's most trusted and innovative logistics partner, connecting businesses globally with seamless, sustainable, and technology-driven supply chain solutions that empower growth and transform industries.</p>
          </article>
          <article aria-labelledby="mission-title">
            <h2 id="mission-title">Our Mission</h2>
            <p>To provide efficient, reliable, and tailored logistics solutions that facilitate the movement of goods and services across the globe, ensuring customer satisfaction through innovation, integrity, and excellence in every delivery.</p>
          </article>
        </div>
      </section>`;
    this.section = root.querySelector('section');
    this.elapsed = 0;
    this.rotationAngle = 0;
    this.pointerX = null;
    this.activePointer = null;
    this.angularVelocity = 0;
    this.dragDistance = 0;
    this.paused = false;
    this.visible = false;
    this.media = matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = this.media.matches;
    this.scrollMode = matchMedia('(max-width:991px)').matches;
    this.events = new AbortController();
    const signal = this.events.signal;
    this.updateFromScroll = () => {
      if (!this.scrollMode || this.reduced) return;
      const r=this.shadowRoot.querySelector('.scene').getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight*.85-r.top)/(innerHeight*.85+r.height*.55)));
      this.elapsed=progress*SETTLE_SECONDS;
      this.rotationAngle=TAU*Math.max(0,Math.min(1,(progress-.30)/.70));
      this.dataset.scrollProgress=progress.toFixed(3);
      this.render();
    };
    window.addEventListener('scroll',this.updateFromScroll,{passive:true,signal});
    this.media.addEventListener('change', () => {
      this.reduced = this.media.matches;
      if (this.reduced) this.cancelInertia();
      this.lastFrame = null;
      this.render();
      this.requestFrame();
    }, { signal });
    document.addEventListener('visibilitychange', () => {
      this.lastFrame = null;
      if (document.hidden) this.cancelInertia();
      if (!document.hidden) this.requestFrame();
    }, { signal });
    const initialize = () => {
    if (!this.mounted) return;
    try {
      this.setup3D(root.querySelector('.scene'));
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(root.querySelector('.scene'));
      this.resize();
      this.setupInteraction();
      this.hasEntered = false;
      this.observer = new IntersectionObserver(entries => {
        const entering = entries[0].isIntersecting;
        const wasVisible = this.visible;
        this.visible = entering;
        this.lastFrame = null;
        if (!entering) this.cancelInertia();
        if (entering && !wasVisible) {
          if (this.scrollMode) this.updateFromScroll();
          else if (this.hasEntered) this.replay();
          else this.requestFrame();
          this.hasEntered = true;
          this.dataset.enterCount = String((Number(this.dataset.enterCount) || 0) + 1);
        }
      }, { threshold: 0.08 });
      this.observer.observe(root.querySelector('.scene'));
    } catch (error) {
      this.dispose3D();
      root.querySelector('.scene').replaceChildren();
      root.querySelector('.fallback').classList.add('load-visible');
      this.section.classList.add('ready');
      this.dataset.renderMode = 'fallback';
      console.warn('Showing the static crane illustration because WebGL is unavailable.', error);
    }
    };
    this.preloadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.preloadObserver.disconnect();
      initialize();
    }, { rootMargin: '300px' });
    this.preloadObserver.observe(this.section);
  }

  setup3D(host) {
    this.geometries = new Set();
    this.materials = new Set();
    this.textures = new Set();
    const geometry = value => (this.geometries.add(value), value);
    const paintGrain = this.surfaceTexture(false);
    const metalGrain = this.surfaceTexture(true);
    const cargoGrain = this.containerTexture();
    const material = (color, metalness = .4, roughness = .5, surface = null) => {
      const value = new THREE.MeshPhysicalMaterial({ color, metalness, roughness,
        map: surface || (metalness > .7 ? metalGrain : paintGrain),
        bumpMap: surface || metalGrain, bumpScale: surface ? .012 : .006,
        clearcoat: metalness > .7 ? 0 : .08, clearcoatRoughness: .65 });
      this.materials.add(value);
      return value;
    };
    const orange = material('#c75336', .48, .57);
    const lighter = material('#df6b48', .43, .55);
    const darker = material('#853c2b', .52, .68);
    const steel = material('#85898b', .82, .45);
    const darkSteel = material('#34383c', .78, .56);
    const black = material('#171a1c', .7, .61);
    const cargoPaint = material('#d45f3f', .55, .67, cargoGrain);
    const cargoEdge = material('#99432e', .62, .61, cargoGrain);
    const cargoWorn = material('#bd5c42', .48, .76, cargoGrain);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth<=991?1.15:1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(35, 1, .1, 80);
    this.addStudioEnvironment();
    this.scene.add(new THREE.HemisphereLight(0xd9e1ed, 0x16181d, .8));
    const key = new THREE.DirectionalLight(0xfff7ef, 3);
    key.position.set(-5, 8, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(innerWidth<=991?512:1024,innerWidth<=991?512:1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -20;
    key.shadow.camera.right = key.shadow.camera.top = 20;
    key.shadow.camera.far = 40;
    key.shadow.normalBias = .025;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdbe4ff, 1.2);
    fill.position.set(7, 3, -5);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 2.1);
    rim.position.set(-5, 5, -4);
    this.scene.add(rim);

    const boxGeo = geometry(new THREE.BoxGeometry(1, 1, 1));
    const rodGeo = geometry(new THREE.CylinderGeometry(1, 1, 1, 12));
    const box = (parent, size, point, mat) => {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.scale.set(...size);
      mesh.position.set(...point);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const rod = (parent, start, end, radius, mat) => {
      const mesh = new THREE.Mesh(rodGeo, mat);
      this.alignRod(mesh, new THREE.Vector3(...start), new THREE.Vector3(...end), radius);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const beam = (parent, start, end, width, mat) => {
      const mesh = new THREE.Mesh(boxGeo, mat);
      const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
      const direction = b.clone().sub(a);
      mesh.position.copy(a).add(b).multiplyScalar(.5);
      mesh.scale.set(width, direction.length(), width);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      mesh.castShadow = mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const discCache = new Map();
    const disc = (parent, radius, depth, point, mat) => {
      const key = `${radius}:${depth}`;
      if (!discCache.has(key)) discCache.set(key, geometry(new THREE.CylinderGeometry(radius, radius, depth, 32)));
      const geo = discCache.get(key);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(...point);
      parent.add(mesh);
      return mesh;
    };

    // The lower mounting is outside the frame, as in the reference close view.
    this.boom = new THREE.Group();
    this.scene.add(this.boom);
    this.boom.position.set(-10.8, -.45, 0);
    const tip = new THREE.Vector3(3.5, 3.65, 0);
    const direction = tip.clone().sub(this.boom.position);
    const length = direction.length();
    this.boom.rotation.z = Math.atan2(direction.y, direction.x);
    for (const y of [-.32, .32]) for (const z of [-.32, .32]) {
      box(this.boom, [length, .1, .1], [length / 2, y, z], orange);
      box(this.boom, [length, .022, .15], [length / 2, y + .05, z], darker);
    }
    const cells = 19;
    for (let i = 0; i <= cells; i++) {
      const x = length * i / cells;
      for (const z of [-.32, .32]) {
        beam(this.boom, [x, -.32, z], [x, .32, z], .075, orange);
        for (const y of [-.3, .3]) {
          box(this.boom, [.15, .13, .035], [x, y, z + Math.sign(z) * .052], darker);
          disc(this.boom, .021, .022, [x, y, z + Math.sign(z) * .082], steel);
        }
      }
      rod(this.boom, [x, .32, -.32], [x, .32, .32], .035, lighter);
      if (i < cells) {
        const next = length * (i + 1) / cells;
        for (const z of [-.32, .32]) beam(this.boom, [x, i % 2 ? .32 : -.32, z], [next, i % 2 ? -.32 : .32, z], .083, orange);
        beam(this.boom, [x, .32, -.32], [next, .32, .32], .055, darker);
      }
    }
    box(this.boom, [.22, .8, .8], [length, 0, 0], orange);
    for (const z of [-.23, .23]) rod(this.boom, [-.4, .7, z], [length, .47, z], .018, steel);
    disc(this.boom, .5, .72, [.5, .15, 0], orange);
    disc(this.boom, .16, .78, [.5, .15, 0], darkSteel);
    disc(this.boom, .18, .65, [length, -.12, 0], darkSteel);
    disc(this.boom, .25, .53, [length - .18, .06, 0], black);
    disc(this.boom, .19, .55, [length - .18, .06, 0], steel);
    disc(this.boom, .23, .57, [length - .18, .06, 0], darkSteel);
    disc(this.boom, .05, .64, [length - .18, .06, 0], steel);
    for (const z of [-.36, .36]) {
      box(this.boom, [.42, .075, .04], [length - .18, .43, z], darker);
      box(this.boom, [.42, .075, .04], [length - .18, -.42, z], darker);
      for (const y of [-.35, .35]) disc(this.boom, .035, .04, [length - .15, y, z], steel);
    }

    this.hoist = new THREE.Group();
    this.hoist.position.x = tip.x;
    this.scene.add(this.hoist);
    const shape = new THREE.Shape();
    const w = .24, h = .32, r = .055;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h); shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r); shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h); shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r); shape.quadraticCurveTo(-w, -h, -w + r, -h);
    const housingGeo = geometry(new THREE.ExtrudeGeometry(shape, { depth: .32, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 3, steps: 1 }));
    housingGeo.translate(0, 0, -.16);
    const housing = new THREE.Mesh(housingGeo, orange);
    housing.castShadow = true;
    housing.receiveShadow = true;
    this.hoist.add(housing);
    box(this.hoist, [.26, .035, .03], [0, .19, .19], darker);
    for (const z of [-.08, .08]) {
      disc(this.hoist, .18, .035, [0, .05, z], darkSteel);
      disc(this.hoist, .14, .041, [0, .05, z], steel);
    }
    box(this.hoist, [.07, .31, .025], [-.22, 0, .2], lighter);
    for (const x of [-.14, .14]) for (const y of [-.2, .2]) disc(this.hoist, .018, .025, [x, y, .19], steel);

    this.rotor = new THREE.Group();
    this.rotor.position.y = -.38;
    this.hoist.add(this.rotor);
    rod(this.rotor, [0, .1, 0], [0, -.05, 0], .07, steel);
    const hookShape = new THREE.Shape();
    hookShape.moveTo(-.075, .04); hookShape.lineTo(.075, .04);
    hookShape.bezierCurveTo(.075, -.17, -.035, -.3, .005, -.43);
    hookShape.bezierCurveTo(.035, -.68, .33, -.7, .44, -.46);
    hookShape.lineTo(.51, -.37);
    hookShape.bezierCurveTo(.58, -.66, .41, -.87, .16, -.85);
    hookShape.bezierCurveTo(-.18, -.82, -.22, -.5, -.13, -.29);
    hookShape.quadraticCurveTo(-.07, -.15, -.075, .04);
    const hookGeo = geometry(new THREE.ExtrudeGeometry(hookShape,{depth:.13,bevelEnabled:true,bevelSize:.025,bevelThickness:.022,bevelSegments:4,curveSegments:32}));
    hookGeo.translate(0,0,-.065);
    const hook = new THREE.Mesh(hookGeo, darkSteel);
    hook.castShadow = true;
    this.rotor.add(hook);
    rod(this.rotor, [.05, -.24, 0], [.46, -.45, 0], .018, steel);
    disc(this.rotor, .035, .17, [.06, -.24, 0], steel);
    const eye = new THREE.Mesh(geometry(new THREE.TorusGeometry(.115, .024, 10, 28)), steel);
    eye.position.set(.19, -.76, 0);
    this.rotor.add(eye);
    for (const x of [-1.7, 1.7]) for (const z of [-.7, .7]) {
      rod(this.rotor, [.19, -.79, 0], [x, -1.88, z], .017, steel);
      box(this.rotor, [.12, .19, .12], [x, -1.95, z], darkSteel);
    }
    for (const z of [-.72,.72]) box(this.rotor,[3.68,.12,.11],[0,-1.93,z],darkSteel);
    for (const x of [-1.73,1.73]) box(this.rotor,[.12,.12,1.62],[x,-1.93,0],darkSteel);
    box(this.rotor,[3.62,.07,.16],[0,-1.9,0],steel);

    const cargo = new THREE.Group();
    this.cargo = cargo;
    cargo.position.y = -2.72;
    this.rotor.add(cargo);
    box(cargo, [3.65, 1.45, 1.53], [0, 0, 0], cargoPaint);
    const corrugatedWall = sign => {
      const profile = [];
      const period = 3.4 / 25;
      for (let i = 0; i < 25; i++) {
        const x = -1.7 + i * period;
        for (const [step, depth] of [[0, 0], [.15, 0], [.3, .052], [.7, .052], [.85, 0], [1, 0]]) {
          profile.push([x + step * period, depth]);
        }
      }
      const positions = [], uvs = [];
      for (let i = 0; i < profile.length - 1; i++) {
        const [left, leftDepth] = profile[i], [right, rightDepth] = profile[i + 1];
        if (right - left < .0001) continue;
        const corners = [
          [left, -.65, sign * (.77 + leftDepth)],
          [right, -.65, sign * (.77 + rightDepth)],
          [right, .65, sign * (.77 + rightDepth)],
          [left, .65, sign * (.77 + leftDepth)]
        ];
        const indices = sign > 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
        for (const index of indices) {
          const point = corners[index];
          positions.push(...point);
          uvs.push((point[0] + 1.7) / 3.4, (point[1] + .65) / 1.3);
        }
      }
      const wallGeometry = geometry(new THREE.BufferGeometry());
      wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      wallGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      wallGeometry.computeVertexNormals();
      const wall = new THREE.Mesh(wallGeometry, cargoPaint);
      wall.castShadow = wall.receiveShadow = true;
      cargo.add(wall);
    };
    for (const sign of [-1, 1]) {
      corrugatedWall(sign);
      box(cargo, [3.72, .11, .095], [0, .72, sign * .78], cargoEdge);
      box(cargo, [3.72, .13, .095], [0, -.72, sign * .78], cargoEdge);
      for (const y of [-.69, .69]) box(cargo, [3.68, .042, .065], [0, y, sign * .78], cargoWorn);
    }
    for (let x = -1.7; x <= 1.7; x += .13) box(cargo, [.04, .022, 1.45], [x, .738, 0], cargoPaint);
    box(cargo, [3.76, .085, 1.6], [0, -.765, 0], darkSteel);
    for (const x of [-1.55, -.5, .5, 1.55]) box(cargo, [.085, .075, 1.66], [x, -.81, 0], darkSteel);
    for (const x of [-1.79, 1.79]) for (const z of [-.76, .76]) {
      box(cargo, [.085, 1.48, .085], [x, 0, z], cargoEdge);
      for (const y of [-.66, .66]) {
        box(cargo, [.145, .13, .145], [x, y, z], cargoWorn);
        box(cargo, [.055, .036, .055], [x + Math.sign(x) * .077, y, z], darkSteel);
      }
    }
    // Doors on the short end become visible during the full turn.
    box(cargo, [.05, 1.4, .045], [1.854, 0, 0], black);
    for (let z = -.69; z <= .7; z += .13) box(cargo, [.04, 1.31, .037], [1.85, 0, z], cargoPaint);
    for (const z of [-.61, -.22, .22, .61]) {
      rod(cargo, [1.9, -.64, z], [1.9, .64, z], .016, steel);
      for (const y of [-.48, 0, .48]) box(cargo, [.045, .05, .09], [1.92, y, z], darkSteel);
      box(cargo, [.045, .03, .16], [1.94, -.15, z + .04], steel);
    }
    for (let z = -.69; z <= .7; z += .13) box(cargo, [.04, 1.31, .037], [-1.85, 0, z], cargoPaint);

    this.mainCables = [-1, 1].map(sign => ({
      mesh: rod(this.scene, [tip.x + sign * .13, tip.y, 0], [tip.x + sign * .13, 3.6, 0], .018, steel),
      anchor: new THREE.Vector3(tip.x + sign * .13, tip.y, 0),
      offset: new THREE.Vector3(sign * .13, .34, 0)
    }));
    this.rig = new THREE.Group();
    for (const child of [...this.scene.children]) if (!child.isLight) this.rig.add(child);
    this.scene.add(this.rig);
    this.dataset.renderMode = 'webgl';
  }

  containerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const base = ctx.createLinearGradient(0, 0, 0, 512);
    base.addColorStop(0, '#f2e9df');
    base.addColorStop(.68, '#e9ddd0');
    base.addColorStop(1, '#d6c3ae');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 512);
    let seed = 97185;
    const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 10500; i++) {
      const x = random() * 1024, y = random() * 512;
      const dark = random() > .38;
      ctx.fillStyle = dark ? `rgba(63,37,23,${.025 + random() * .08})` : `rgba(255,251,242,${.04 + random() * .1})`;
      ctx.fillRect(x, y, .5 + random() * 3, .4 + random() * 2);
    }
    for (let i = 0; i < 180; i++) {
      const x = random() * 1024, y = random() * 480;
      ctx.strokeStyle = `rgba(67,40,26,${.025 + random() * .09})`;
      ctx.lineWidth = .3 + random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + random() * 3 - 1.5, Math.min(512, y + 8 + random() * 130));
      ctx.stroke();
    }
    for (let i = 0; i < 95; i++) {
      const x = random() * 1024, y = random() * 512;
      ctx.strokeStyle = `rgba(255,252,243,${.07 + random() * .13})`;
      ctx.lineWidth = .4 + random();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(Math.min(1024, x + 4 + random() * 42), y + random() * 3 - 1.5);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.textures.add(texture);
    return texture;
  }

  surfaceTexture(metal) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = metal ? '#e7e7e7' : '#f0edea';
    ctx.fillRect(0,0,512,512);
    let seed = 78231;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i=0;i<11000;i++) {
      const value = 140 + Math.floor(random()*90);
      ctx.fillStyle = `rgba(${value},${value},${value},${metal ? .2 : .12})`;
      ctx.fillRect(random()*512,random()*512,metal ? 1+random()*9 : 1,1);
    }
    if (!metal) for(let i=0;i<28;i++) {
      ctx.strokeStyle='rgba(62,46,34,.12)'; ctx.lineWidth=.5;
      const x=random()*512,y=random()*512;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+random()*22,y+random()*3);ctx.stroke();
    }
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    this.textures.add(texture);
    return texture;
  }

  addStudioEnvironment() {
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
    const ctx=canvas.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,'#b7bac0');gradient.addColorStop(.4,'#656a74');
    gradient.addColorStop(.6,'#252a32');gradient.addColorStop(1,'#101218');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,512);
    for(const x of [70,390,820]){
      const panel=ctx.createLinearGradient(x,0,x+110,0);
      panel.addColorStop(0,'rgba(255,255,255,0)');panel.addColorStop(.35,'rgba(255,255,255,.85)');
      panel.addColorStop(.65,'rgba(255,255,255,.85)');panel.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=panel;ctx.fillRect(x,80,110,220);
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.mapping=THREE.EquirectangularReflectionMapping;
    const generator=new THREE.PMREMGenerator(this.renderer);
    this.environmentTarget=generator.fromEquirectangular(texture);
    this.scene.environment=this.environmentTarget.texture;
    this.scene.environmentIntensity=.8;
    generator.dispose();texture.dispose();
  }

  alignRod(mesh, start, end, radius) {
    const direction = new THREE.Vector3().subVectors(end, start);
    mesh.position.copy(start).add(end).multiplyScalar(.5);
    mesh.scale.set(radius, Math.max(direction.length(), .001), radius);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  }

  resize() {
    if (!this.renderer) return;
    const { width, height } = this.shadowRoot.querySelector('.scene').getBoundingClientRect();
    if (!width || !height) return;
    this.compact = width < 700;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    if (width < 700) {
      this.camera.position.set(5, 3, 19.5);
      this.camera.lookAt(1.5, .1, 0);
    } else {
      this.camera.position.set(4.3, 2.4, 17.3);
      this.camera.lookAt(.1, .3, 0);
    }
    this.camera.updateProjectionMatrix();
    this.render();
  }

  setupInteraction() {
    const canvas = this.renderer.domElement;
    const signal = this.events.signal;
    const nearContainer = event => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      const center = this.cargo.getWorldPosition(new THREE.Vector3());
      const projected = center.clone().project(this.camera);
      const right = center.clone().add(new THREE.Vector3(2.4, 0, 0).applyQuaternion(this.camera.quaternion)).project(this.camera);
      const above = center.clone().add(new THREE.Vector3(0, 1.25, 0).applyQuaternion(this.camera.quaternion)).project(this.camera);
      const x = bounds.left + (projected.x + 1) * bounds.width / 2;
      const y = bounds.top + (1 - projected.y) * bounds.height / 2;
      const halfWidth = Math.max(70, Math.abs(right.x - projected.x) * bounds.width / 2) * 1.15;
      const halfHeight = Math.max(55, Math.abs(above.y - projected.y) * bounds.height / 2) * 1.45;
      return Math.abs(event.clientX - x) < halfWidth && Math.abs(event.clientY - y) < halfHeight;
    };

    const beginMotion = event => {
      this.cancelInertia();
      this.pointerX = event.clientX;
      this.pointerTime = event.timeStamp;
      this.angularVelocity = 0;
      this.dragDistance = 0;
      this.dragRadiansPerPixel = 3 * TAU / Math.max(360, canvas.clientWidth);
    };
    const moveLoad = event => {
      const dx = event.clientX - this.pointerX;
      const dt = Math.max(.008, (event.timeStamp - this.pointerTime) / 1000);
      if (dx) {
        const change = dx * this.dragRadiansPerPixel;
        this.rotationAngle = (this.rotationAngle + change) % TAU;
        this.angularVelocity = this.angularVelocity * .55 + Math.max(-12, Math.min(12, change / dt)) * .45;
        this.dragDistance += Math.abs(dx);
        this.render();
      }
      this.pointerX = event.clientX;
      this.pointerTime = event.timeStamp;
    };
    const endMotion = (event, coast, hovering) => {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
      const idleTime = Math.max(0, event.timeStamp - this.pointerTime);
      const distanceFactor = Math.min(1, this.dragDistance / (canvas.clientWidth * (hovering ? .07 : .2)));
      const speed = this.angularVelocity * distanceFactor * (hovering ? .55 : 1) * Math.max(0, 1 - idleTime / 180);
      this.activePointer = null;
      this.pointerX = null;
      this.angularVelocity = 0;
      this.dragDistance = 0;
      if (coast && !this.reduced && !this.paused && Math.abs(speed) > .025) this.startInertia(speed);
    };

    // A desktop cursor turns the suspended load just by moving near it.
    canvas.addEventListener('pointermove', event => {
      if (this.activePointer != null) {
        if (event.pointerId === this.activePointer) moveLoad(event);
        return;
      }
      if (event.pointerType !== 'mouse') return;
      const nearby = nearContainer(event);
      canvas.style.cursor = nearby ? 'ew-resize' : '';
      if (!nearby) {
        if (this.pointerX != null) endMotion(event, true, true);
        return;
      }
      if (this.pointerX == null) {
        beginMotion(event);
        return;
      }
      if (event.clientX === this.pointerX) return;
      this.cancelInertia();
      moveLoad(event);
      this.hoverTimer = setTimeout(() => {
        if (this.pointerX != null && this.activePointer == null) endMotion({ timeStamp: performance.now() }, true, true);
      }, 95);
    }, { signal });
    canvas.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || this.activePointer != null || !event.isPrimary || !nearContainer(event)) return;
      beginMotion(event);
      this.activePointer = event.pointerId;
      canvas.setPointerCapture(event.pointerId);
    }, { signal });
    canvas.addEventListener('pointerup', event => {
      if (event.pointerId === this.activePointer) endMotion(event, true, false);
    }, { signal });
    canvas.addEventListener('pointercancel', event => {
      if (event.pointerId === this.activePointer) endMotion(event, false, false);
    }, { signal });
    canvas.addEventListener('pointerleave', event => {
      canvas.style.cursor = '';
      if (event.pointerType === 'mouse' && this.pointerX != null && this.activePointer == null) endMotion(event, true, true);
    }, { signal });
  }

  cancelInertia() {
    cancelAnimationFrame(this.inertiaFrame);
    this.inertiaFrame = null;
    this.inertiaVelocity = 0;
    clearTimeout(this.hoverTimer);
    this.hoverTimer = null;
  }

  startInertia(speed) {
    this.inertiaVelocity = Math.max(-12, Math.min(12, speed));
    let previousTime = null;
    const coast = time => {
      this.inertiaFrame = null;
      if (!this.mounted || !this.visible || document.hidden || this.paused || this.reduced || this.activePointer != null) return;
      if (previousTime != null) {
        const dt = Math.min(.05, (time - previousTime) / 1000);
        const nextVelocity = this.inertiaVelocity * Math.exp(-MOMENTUM_DAMPING * dt);
        this.rotationAngle = (this.rotationAngle + (this.inertiaVelocity + nextVelocity) * .5 * dt) % TAU;
        this.inertiaVelocity = nextVelocity;
        this.render();
      }
      previousTime = time;
      if (Math.abs(this.inertiaVelocity) >= .025) this.inertiaFrame = requestAnimationFrame(coast);
      else this.inertiaVelocity = 0;
    };
    this.inertiaFrame = requestAnimationFrame(coast);
  }

  render() {
    if (!this.renderer || !this.hoist) return;
    this.section.classList.toggle('ready', this.reduced || this.elapsed >= SETTLE_SECONDS);
    const travel = this.reduced ? 1 : Math.min(1, this.elapsed / TRAVEL_SECONDS);
    const easedTravel = 1 - Math.pow(1 - travel, 2);
    this.rig.position.x = (this.compact ? -2.4 : -2) - easedTravel*(this.compact ? 1.25 : 4.2);
    this.rig.rotation.y = .2 - easedTravel*.23;
    const progress = this.reduced ? 1 : Math.max(0,Math.min(1, (this.elapsed-DROP_DELAY) / DROP_SECONDS));
    const lowered = 1 - Math.pow(1 - progress, 3);
    this.hoist.position.y = 3.25 - lowered * 1.9;
    this.rotor.rotation.y = -.35 + this.rotationAngle;
    this.rotor.rotation.z = this.reduced ? 0 : -.026*Math.sin(travel*Math.PI);
    this.rig.updateMatrixWorld(true);
    for (const cable of this.mainCables) {
      const bottom = cable.offset.clone().applyMatrix4(this.hoist.matrix);
      this.alignRod(cable.mesh, cable.anchor, bottom, .018);
    }
    // Expose current visual state for integration and non-invasive browser verification.
    this.dataset.liftProgress = progress.toFixed(3);
    this.dataset.travelProgress = travel.toFixed(3);
    this.dataset.craneX = this.rig.position.x.toFixed(2);
    this.dataset.rotation = (((this.rotationAngle % TAU + TAU) % TAU) / TAU * 360).toFixed(1);
    this.renderer.render(this.scene, this.camera);
  }

  requestFrame() {
    if(this.scrollMode)return;
    if (this.frame || !this.visible || this.paused || this.reduced || this.elapsed >= SETTLE_SECONDS || document.hidden || !this.renderer) return;
    this.frame = requestAnimationFrame(time => this.tick(time));
  }

  tick(time) {
    this.frame = null;
    if (!this.mounted || !this.visible || this.paused || this.reduced || document.hidden) return;
    if (this.lastFrame != null) this.elapsed += Math.min((time - this.lastFrame) / 1000, .05);
    this.lastFrame = time;
    this.render();
    this.requestFrame();
  }

  replay() {
    this.cancelInertia();
    this.elapsed = 0;
    this.rotationAngle = 0;
    this.lastFrame = null;
    this.paused = false;
    this.render();
    this.requestFrame();
    this.dispatchEvent(new CustomEvent('crane-replay', { bubbles: true, composed: true }));
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) this.cancelInertia();
    this.lastFrame = null;
    this.requestFrame();
  }

  dispose3D() {
    this.geometries?.forEach(value => value.dispose());
    this.materials?.forEach(value => value.dispose());
    this.textures?.forEach(value => value.dispose());
    this.environmentTarget?.dispose();
    this.renderer?.dispose();
  }

  disconnectedCallback() {
    this.mounted = false;
    this.cancelInertia();
    cancelAnimationFrame(this.frame);
    this.frame = null;
    this.events?.abort();
    this.resizeObserver?.disconnect();
    this.preloadObserver?.disconnect();
    this.observer?.disconnect();
    this.dispose3D();
  }
}

if (!customElements.get('logistics-crane')) customElements.define('logistics-crane', LogisticsCrane);

