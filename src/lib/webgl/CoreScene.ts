import {
	BufferAttribute,
	BufferGeometry,
	IcosahedronGeometry,
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

import noise from './shaders/noise.glsl?raw';
import coreVert from './shaders/core.vert?raw';
import coreFrag from './shaders/core.frag?raw';
import dustVert from './shaders/dust.vert?raw';
import dustFrag from './shaders/dust.frag?raw';
import postVert from './shaders/post.vert?raw';
import postFrag from './shaders/post.frag?raw';

export interface CoreSceneOptions {
	/** Lower geometry & DPR budget (motion report §4.5). */
	lowPower?: boolean;
	onError?: () => void;
}

const vec3 = (hex: string) => new Vector3(...hexToRgb(hex));

/**
 * "Le Noyau" — imperative Three.js scene (ADR-003).
 * Rendering is driven externally via `render()` from gsap.ticker (ADR-004).
 */
export class CoreScene {
	private renderer: WebGLRenderer;
	private scene = new Scene();
	private camera = new PerspectiveCamera(35, 1, 0.1, 50);
	private postScene = new Scene();
	private postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	private target: WebGLRenderTarget;
	private core: Mesh<IcosahedronGeometry, ShaderMaterial>;
	private dust: Points<BufferGeometry, ShaderMaterial>;
	private post: Mesh<PlaneGeometry, ShaderMaterial>;
	private startTime = performance.now();

	private pointer = new Vector2();
	private pointerSmooth = new Vector2();
	private pointerVelocity = 0;
	private scroll = 0;
	private charge = 0;
	private external = 0;
	private maxDpr: number;
	private dpr: number;
	private frameTimes: number[] = [];
	private disposed = false;

	readonly uniforms = {
		uTime: { value: 0 },
		uColor: { value: vec3(coreStates.holding.color) },
		uNoiseFreq: { value: coreStates.holding.noiseFreq },
		uNoiseAmp: { value: coreStates.holding.noiseAmp },
		uFacet: { value: 0 },
		uPulse: { value: 0 },
		uFlow: { value: coreStates.holding.flow },
		uReveal: { value: 0 },
		uEnergy: { value: 0 }
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
		uCenter: { value: new Vector2(0.5, 0.5) }
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

		// The Core
		const detail = lowPower ? 32 : 56;
		this.core = new Mesh(
			new IcosahedronGeometry(1, detail),
			new ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: noise + coreVert,
				fragmentShader: coreFrag
			})
		);
		this.scene.add(this.core);

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

	/** Compile shaders up-front so the reveal never hitches. Returns false on failure. */
	compile(): boolean {
		try {
			this.renderer.compile(this.scene, this.camera);
			this.renderer.compile(this.postScene, this.postCamera);
			const gl = this.renderer.getContext();
			return !gl.isContextLost();
		} catch {
			this.fail();
			return false;
		}
	}

	resize() {
		const { clientWidth: w, clientHeight: h } = this.canvas;
		if (!w || !h) return;
		this.renderer.setSize(w, h, false);
		this.target.setSize(Math.floor(w * this.dpr), Math.floor(h * this.dpr));
		this.postUniforms.uResolution.value.set(w * this.dpr, h * this.dpr);
		this.dustUniforms.uPixelRatio.value = this.dpr;

		this.camera.aspect = w / h;
		// Keep the Core comfortably framed on portrait screens.
		this.camera.position.z = w / h < 1 ? 6 + (1 - w / h) * 5 : 6;
		this.camera.updateProjectionMatrix();
	}

	/** Morph towards one of the four states (1.4 s, cardor.inOut). */
	setState(id: CoreStateId, immediate = false) {
		const s = coreStates[id];
		const [r, g, b] = hexToRgb(s.color);
		const d = immediate ? 0 : 1.4;
		const ease = 'cardor.inOut';
		const u = this.uniforms;
		gsap.to(u.uColor.value, { x: r, y: g, z: b, duration: d, ease, overwrite: true });
		gsap.to(u.uNoiseFreq, { value: s.noiseFreq, duration: d, ease, overwrite: true });
		gsap.to(u.uNoiseAmp, { value: s.noiseAmp, duration: d, ease, overwrite: true });
		gsap.to(u.uFacet, { value: s.facet, duration: d * 0.8, ease, overwrite: true });
		gsap.to(u.uPulse, { value: s.pulse, duration: d, ease, overwrite: true });
		gsap.to(u.uFlow, { value: s.flow, duration: d, ease, overwrite: true });
		// A small surge of energy on every morph: the Core "reacts".
		if (!immediate) {
			gsap.fromTo(
				u.uEnergy,
				{ value: 0.5 },
				{ value: 0, duration: 1.6, ease: 'cardor.out', overwrite: true }
			);
		}
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
			overwrite: true
		});
	}

	/** One frame. `delta` in ms (gsap.ticker signature). */
	render(delta = 16.7) {
		if (this.disposed) return;
		const elapsed = (performance.now() - this.startTime) / 1000;
		this.uniforms.uTime.value = elapsed;

		// Pointer smoothing + decaying velocity energy.
		this.pointerSmooth.lerp(this.pointer, 0.06);
		this.pointerVelocity *= 0.94;
		const energyBoost = this.pointerVelocity * 0.25 + this.charge * 0.6 + this.external * 1.4;

		this.core.rotation.y = elapsed * 0.08 + this.pointerSmooth.x * 0.45;
		this.core.rotation.x = -this.pointerSmooth.y * 0.3;
		this.dust.rotation.y = this.pointerSmooth.x * 0.15;
		this.dust.rotation.x = -this.pointerSmooth.y * 0.1;

		// Scroll exit: recede, dilate, scatter (motion report §4.3).
		const s = this.scroll;
		this.core.position.z = -s * 2.2;
		this.core.position.y = s * 0.6;
		this.core.scale.setScalar(1 + s * 0.35 + this.charge * 0.08);
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
		this.core.geometry.dispose();
		this.core.material.dispose();
		this.dust.geometry.dispose();
		this.dust.material.dispose();
		this.post.geometry.dispose();
		this.post.material.dispose();
		this.target.dispose();
		this.renderer.dispose();
		this.renderer.forceContextLoss();
	}
}
