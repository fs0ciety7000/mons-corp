import {
	BufferAttribute,
	BufferGeometry,
	Group,
	LinearSRGBColorSpace,
	Mesh,
	OrthographicCamera,
	PerspectiveCamera,
	PlaneGeometry,
	Points,
	Scene,
	ShaderMaterial,
	Vector2,
	Vector3,
	WebGLRenderTarget,
	WebGLRenderer,
	AdditiveBlending,
	HalfFloatType
} from 'three';
import { gsap } from '#lib/motion/gsap.ts';
import type { CoreStateId } from '#lib/data/divisions.ts';
import { coreStates, hexToRgb } from './states.ts';
import { buildEmblem, emblemSources, type Emblem } from './emblem.ts';

import noise from './shaders/noise.glsl?raw';
import emblemVert from './shaders/emblem.vert?raw';
import emblemFrag from './shaders/emblem.frag?raw';
import dustVert from './shaders/dust.vert?raw';
import dustFrag from './shaders/dust.frag?raw';
import postVert from './shaders/post.vert?raw';
import postFrag from './shaders/post.frag?raw';

export interface CoreSceneOptions {
	/** Lower geometry & DPR budget (motion report §4.5). */
	lowPower?: boolean;
	/** Single still frame: 3/4 pose, no tilt, glitch or pulse. */
	still?: boolean;
	onError?: () => void;
}

const vec3 = (hex: string) => new Vector3(...hexToRgb(hex));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Framing of the emblem per breakpoint (design review, 2026-10-10): the object sits above the
 * title on phones and to the right on wider screens so it never lies under the lead paragraph.
 * `x`/`y` are the emblem centre in NDC, `size` its largest side relative to the viewport.
 */
function framing(w: number) {
	if (w < 768) return { x: 0.22, y: 0.45, size: 0.62, of: 'width' as const, scrim: 0.45 };
	if (w < 1024) return { x: 0.3, y: 0.3, size: 0.48, of: 'height' as const, scrim: 0.3 };
	return { x: 0.36, y: 0.12, size: 0.6, of: 'height' as const, scrim: 0.3 };
}

/**
 * "Le Noyau" — imperative Three.js scene (ADR-003), embodied by the emblem of the active state:
 * the wheel (holding), the dragon (Interactive), the belfry (Soundworks), the monkey (Creative Lab).
 * Rendering is driven externally via `render()` from gsap.ticker (ADR-004).
 */
export class CoreScene {
	private renderer: WebGLRenderer;
	private scene = new Scene();
	private camera = new PerspectiveCamera(35, 1, 0.1, 50);
	private postScene = new Scene();
	private postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	private target: WebGLRenderTarget;
	private holder = new Group();
	private emblems = new Map<CoreStateId, Promise<Emblem>>();
	private shown: { id: CoreStateId; emblem: Emblem } | null = null;
	private wanted: CoreStateId = 'holding';
	private dust: Points<BufferGeometry, ShaderMaterial>;
	private post: Mesh<PlaneGeometry, ShaderMaterial>;
	private startTime = performance.now();
	private lastTime = 0;

	private pointer = new Vector2();
	private pointerSmooth = new Vector2();
	private pointerVelocity = 0;
	private scroll = 0;
	private charge = 0;
	private external = 0;
	private baseScale = 1;
	/** Swap transition: 1 = emblem fully present. */
	private presence = 1;
	/** Wheel spin weight (holding only) and accumulated angle. */
	private spin = 0;
	private angle = 0;
	private maxDpr: number;
	private dpr: number;
	private frameTimes: number[] = [];
	private disposed = false;

	readonly uniforms = {
		uTime: { value: 0 },
		uColor: { value: vec3(coreStates.holding.color) },
		uFacet: { value: 0 },
		uPulse: { value: 0 },
		uFlow: { value: coreStates.holding.flow },
		uReveal: { value: 0 },
		uEnergy: { value: 0 },
		uFade: { value: 1 }
	};

	private dustUniforms = {
		uTime: this.uniforms.uTime,
		uColor: this.uniforms.uColor,
		uReveal: this.uniforms.uReveal,
		uPixelRatio: { value: 1 },
		uScatter: { value: 0 }
	};

	private postUniforms = {
		tScene: { value: null as WebGLRenderTarget['texture'] | null },
		uResolution: { value: new Vector2(1, 1) },
		uColor: this.uniforms.uColor,
		uTime: this.uniforms.uTime,
		uAberration: { value: 0.004 },
		uGlow: { value: 0 },
		uCenter: { value: new Vector2(0.5, 0.5) },
		uScrimTop: { value: 0.3 }
	};

	constructor(
		private canvas: HTMLCanvasElement,
		private options: CoreSceneOptions = {}
	) {
		const lowPower = !!options.lowPower;
		this.maxDpr = lowPower ? 1.5 : 2;
		this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);

		this.renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false,
			powerPreference: 'high-performance',
			stencil: false
		});
		this.renderer.outputColorSpace = LinearSRGBColorSpace;
		this.renderer.setClearColor(0x07070a, 1);
		this.renderer.setPixelRatio(this.dpr);
		this.renderer.debug.onShaderError = () => this.fail();

		this.target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: lowPower ? 0 : 4 });
		this.postUniforms.tScene.value = this.target.texture;

		this.camera.position.set(0, 0, 6);
		this.scene.add(this.holder);

		// Dust halo
		const count = lowPower ? 2000 : 6000;
		const positions = new Float32Array(count * 3);
		const seeds = new Float32Array(count);
		const sizes = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			const r = 1.5 + Math.pow(Math.random(), 1.6) * 3.2;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
			positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
			seeds[i] = Math.random();
			sizes[i] = 0.6 + Math.random() * 2.2;
		}
		const dustGeo = new BufferGeometry();
		dustGeo.setAttribute('position', new BufferAttribute(positions, 3));
		dustGeo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
		dustGeo.setAttribute('aSize', new BufferAttribute(sizes, 1));
		this.dust = new Points(
			dustGeo,
			new ShaderMaterial({
				uniforms: this.dustUniforms,
				vertexShader: noise + dustVert,
				fragmentShader: dustFrag,
				transparent: true,
				depthWrite: false,
				blending: AdditiveBlending
			})
		);
		this.scene.add(this.dust);

		// Post pass
		this.post = new Mesh(
			new PlaneGeometry(2, 2),
			new ShaderMaterial({
				uniforms: this.postUniforms,
				vertexShader: postVert,
				fragmentShader: postFrag,
				depthTest: false,
				depthWrite: false
			})
		);
		this.postScene.add(this.post);

		this.resize();
	}

	private fail() {
		if (this.disposed) return;
		this.options.onError?.();
	}

	private material = (tone: number) =>
		new ShaderMaterial({
			uniforms: { ...this.uniforms, uTone: { value: tone } },
			vertexShader: noise + emblemVert,
			fragmentShader: emblemFrag
		});

	/** Fetches and extrudes an emblem once; later calls share the same promise. */
	private load(id: CoreStateId): Promise<Emblem> {
		let pending = this.emblems.get(id);
		if (!pending) {
			pending = fetch(emblemSources[id])
				.then((r) => {
					if (!r.ok) throw new Error(`emblem ${id}: ${r.status}`);
					return r.text();
				})
				.then((svg) => buildEmblem(svg, this.material));
			this.emblems.set(id, pending);
		}
		return pending;
	}

	/** Loads the first emblem and compiles every shader up-front. Returns false on failure. */
	async init(id: CoreStateId): Promise<boolean> {
		try {
			const emblem = await this.load(id);
			if (this.disposed) return false;
			this.show(id, emblem);
			this.setState(id, true);
			this.renderer.compile(this.scene, this.camera);
			this.renderer.compile(this.postScene, this.postCamera);
			return !this.renderer.getContext().isContextLost();
		} catch {
			this.fail();
			return false;
		}
	}

	private show(id: CoreStateId, emblem: Emblem) {
		if (this.shown) this.holder.remove(this.shown.emblem.group);
		this.holder.add(emblem.group);
		this.shown = { id, emblem };
	}

	resize() {
		const { clientWidth: w, clientHeight: h } = this.canvas;
		if (!w || !h) return;
		this.renderer.setSize(w, h, false);
		this.target.setSize(Math.floor(w * this.dpr), Math.floor(h * this.dpr));
		this.postUniforms.uResolution.value.set(w * this.dpr, h * this.dpr);
		this.dustUniforms.uPixelRatio.value = this.dpr;

		const f = framing(w);
		this.camera.aspect = w / h;
		this.camera.position.z = 6;
		// Shift the frame instead of the object, so tilt and scroll exit stay centred on the emblem.
		this.camera.setViewOffset(w, h, (-f.x * w) / 2, (f.y * h) / 2, w, h);
		this.camera.updateProjectionMatrix();

		const visibleH = 2 * 6 * Math.tan((this.camera.fov * Math.PI) / 360);
		const target = f.size * (f.of === 'width' ? visibleH * this.camera.aspect : visibleH);
		this.baseScale = target / 2.5;
		this.postUniforms.uCenter.value.set(0.5 + f.x / 2, 0.5 + f.y / 2);
		this.postUniforms.uScrimTop.value = f.scrim;
	}

	/** Morph towards one of the four states (1.4 s, cardor.inOut) and swap the emblem. */
	setState(id: CoreStateId, immediate = false): Promise<void> {
		const s = coreStates[id];
		const [r, g, b] = hexToRgb(s.color);
		const d = immediate ? 0 : 1.4;
		const ease = 'cardor.inOut';
		const u = this.uniforms;
		gsap.to(u.uColor.value, { x: r, y: g, z: b, duration: d, ease, overwrite: true });
		gsap.to(u.uFacet, { value: s.facet, duration: d * 0.8, ease, overwrite: true });
		gsap.to(u.uPulse, { value: s.pulse, duration: d, ease, overwrite: true });
		gsap.to(u.uFlow, { value: s.flow, duration: d, ease, overwrite: true });
		gsap.to(this, { spin: id === 'holding' ? 1 : 0, duration: d, ease, overwrite: 'auto' });
		// A small surge of energy on every morph: the Core "reacts".
		if (!immediate) {
			gsap.fromTo(
				u.uEnergy,
				{ value: 0.4 },
				{ value: 0, duration: 1.6, ease: 'cardor.out', overwrite: true }
			);
		}
		return this.swap(id, immediate);
	}

	/** Emblem change: the current one turns away and shrinks, the next one turns in. */
	private async swap(id: CoreStateId, immediate: boolean) {
		this.wanted = id;
		if (this.shown?.id === id) {
			gsap.to(this, { presence: 1, duration: immediate ? 0 : 0.5, overwrite: 'auto' });
			return;
		}
		const next = this.load(id);
		if (!immediate && this.shown) {
			await gsap.to(this, { presence: 0, duration: 0.35, ease: 'cardor.in', overwrite: 'auto' });
		}
		let emblem: Emblem;
		try {
			emblem = await next;
		} catch {
			return;
		}
		// A later hover may have asked for another emblem in the meantime: the last request wins.
		if (this.disposed || this.wanted !== id) return;
		this.show(id, emblem);
		if (immediate) this.presence = 1;
		else gsap.to(this, { presence: 1, duration: 0.8, ease: 'cardor.out', overwrite: 'auto' });
	}

	/** Birth of the Core — returns the tween so it can sit in a master timeline. */
	reveal(duration = 1.8) {
		return gsap
			.timeline()
			.to(this.uniforms.uReveal, { value: 1, duration, ease: 'cardor.out' }, 0)
			.to(this.postUniforms.uGlow, { value: 1, duration: duration * 1.2, ease: 'cardor.out' }, 0);
	}

	showImmediately() {
		this.uniforms.uReveal.value = 1;
		this.postUniforms.uGlow.value = 1;
	}

	/** Pointer in normalised device coords [-1, 1]. */
	setPointer(x: number, y: number) {
		const dx = x - this.pointer.x;
		const dy = y - this.pointer.y;
		this.pointerVelocity = Math.min(this.pointerVelocity + Math.hypot(dx, dy) * 2.5, 1);
		this.pointer.set(x, y);
	}

	/** Hero scroll progress 0 → 1. */
	setScroll(p: number) {
		this.scroll = p;
	}

	/** External energy 0–1 (e.g. audio level), added to the surface amplitude. */
	setExternalEnergy(v: number) {
		this.external += (v - this.external) * 0.25;
	}

	/** Hold-to-charge interaction (desktop). */
	setCharge(on: boolean) {
		gsap.to(this, {
			charge: on ? 1 : 0,
			duration: on ? 1.2 : 1.4,
			ease: on ? 'cardor.out' : 'elastic.out(1, 0.35)',
			overwrite: 'auto'
		});
	}

	/** One frame. `delta` in ms (gsap.ticker signature). */
	render(delta = 16.7) {
		if (this.disposed) return;
		const still = !!this.options.still;
		const elapsed = still ? 0 : (performance.now() - this.startTime) / 1000;
		const dt = Math.min(elapsed - this.lastTime, 0.1);
		this.lastTime = elapsed;
		this.uniforms.uTime.value = elapsed;

		// Pointer smoothing + decaying velocity energy.
		this.pointerSmooth.lerp(this.pointer, 0.05);
		this.pointerVelocity *= 0.94;
		const energyBoost = Math.min(
			this.pointerVelocity * 0.25 + this.charge * 0.4 + this.external * 1.4,
			0.4
		);

		// Calm tilt (≤ 0.18 rad), slow idle sway; the wheel turns once every ~42 s.
		this.angle += dt * 0.15 * this.spin;
		const turn = (1 - this.presence) * 1.4;
		if (still) {
			this.holder.rotation.set(0.12, -0.35, 0);
		} else {
			this.holder.rotation.y = Math.sin(elapsed * 0.21) * 0.22 + this.pointerSmooth.x * 0.18 + turn;
			this.holder.rotation.x = Math.sin(elapsed * 0.17) * 0.06 - this.pointerSmooth.y * 0.1;
			this.holder.rotation.z = 0;
		}
		if (this.shown?.id === 'holding') this.shown.emblem.group.rotation.z = -this.angle;
		this.dust.rotation.y = this.pointerSmooth.x * 0.15;
		this.dust.rotation.x = -this.pointerSmooth.y * 0.1;

		// Scroll exit: recede, rise and fade out before the next section covers it (motion report §4.3).
		const s = this.scroll;
		this.holder.position.z = -s * 2.2;
		this.holder.position.y = s * 0.6;
		const presence = 0.55 + 0.45 * this.presence;
		this.holder.scale.setScalar(this.baseScale * presence * (1 + s * 0.35 + this.charge * 0.06));
		this.uniforms.uFade.value = clamp01(1 - s * 1.6) * this.presence;
		this.dustUniforms.uScatter.value = s * 1.2 + this.pointerVelocity * 0.4 + this.charge * 0.5;
		this.postUniforms.uAberration.value = 0.003 + s * 0.02 + this.charge * 0.008;

		const base = this.uniforms.uEnergy.value;
		this.uniforms.uEnergy.value = base + energyBoost;

		this.renderer.setRenderTarget(this.target);
		this.renderer.render(this.scene, this.camera);
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.postScene, this.postCamera);

		this.uniforms.uEnergy.value = base;
		this.adaptQuality(delta);
	}

	/** Drop DPR one notch if the rolling average exceeds 22 ms/frame. */
	private adaptQuality(delta: number) {
		this.frameTimes.push(delta);
		if (this.frameTimes.length < 60) return;
		const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		this.frameTimes.length = 0;
		if (avg > 22 && this.dpr > 1) {
			this.dpr = Math.max(1, this.dpr - 0.5);
			this.renderer.setPixelRatio(this.dpr);
			this.resize();
		}
	}

	dispose() {
		this.disposed = true;
		gsap.killTweensOf([
			this,
			this.uniforms.uColor.value,
			...Object.values(this.uniforms),
			this.postUniforms.uGlow
		]);
		for (const pending of this.emblems.values()) {
			pending.then((e) => e.dispose()).catch(() => {});
		}
		this.emblems.clear();
		this.dust.geometry.dispose();
		this.dust.material.dispose();
		this.post.geometry.dispose();
		this.post.material.dispose();
		this.target.dispose();
		this.renderer.dispose();
		this.renderer.forceContextLoss();
	}
}
