<script lang="ts">
	import { onMount } from 'svelte';
	import { core } from '#lib/state/core.svelte.ts';
	import { coreStates } from '#lib/webgl/states.ts';
	import { gsap, ScrollTrigger } from '#lib/motion/gsap.ts';
	import { isFinePointer, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import type { CoreScene } from '#lib/webgl/CoreScene.ts';

	let { trigger }: { trigger?: HTMLElement } = $props();

	let canvas: HTMLCanvasElement;
	let scene: CoreScene | null = $state(null);
	let failed = $state(false);
	let revealed = false;

	const fallbackColor = $derived(coreStates[core.active].color);

	// DOM → WebGL: morph whenever the active state changes.
	$effect(() => {
		const id = core.active;
		const reduce = prefersReducedMotion();
		scene?.setState(id, reduce).then(() => reduce && scene?.render());
	});

	// Birth of the Core once the preloader lifts (motion report §5, t = 1.90 s).
	$effect(() => {
		if (!core.ready || !scene || revealed) return;
		revealed = true;
		if (prefersReducedMotion()) {
			scene.showImmediately();
			scene.render();
		} else {
			scene.reveal().delay(0.3);
		}
	});

	onMount(() => {
		const reduce = prefersReducedMotion();
		const lowPower = !isFinePointer() || Math.min(window.innerWidth, window.innerHeight) < 700;
		let instance: CoreScene | null = null;
		let disposed = false;
		let visible = true;
		let running = false;
		const cleanups: Array<() => void> = [];

		const markFailed = () => {
			failed = true;
			core.webglFailed = true;
			stop();
		};

		const tick = (_time: number, delta: number) => {
			instance?.setExternalEnergy(core.audio);
			instance?.render(delta);
		};
		const start = () => {
			if (running || reduce || !instance) return;
			gsap.ticker.add(tick);
			running = true;
		};
		function stop() {
			if (!running) return;
			gsap.ticker.remove(tick);
			running = false;
		}
		const sync = () => (visible && !document.hidden ? start() : stop());

		(async () => {
			try {
				const { CoreScene } = await import('#lib/webgl/CoreScene.ts');
				if (disposed) return;
				instance = new CoreScene(canvas, { lowPower, still: reduce, onError: markFailed });
				if (!(await instance.init(core.active))) return disposed ? undefined : markFailed();
				if (disposed) return;
				scene = instance;
			} catch {
				return markFailed();
			}

			const ro = new ResizeObserver(() => {
				instance?.resize();
				if (reduce) instance?.render();
			});
			ro.observe(canvas);
			cleanups.push(() => ro.disconnect());

			const io = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				sync();
			});
			io.observe(canvas);
			cleanups.push(() => io.disconnect());

			document.addEventListener('visibilitychange', sync);
			cleanups.push(() => document.removeEventListener('visibilitychange', sync));

			if (!reduce) {
				const onMove = (e: PointerEvent) =>
					instance?.setPointer(
						(e.clientX / window.innerWidth) * 2 - 1,
						-((e.clientY / window.innerHeight) * 2 - 1)
					);
				window.addEventListener('pointermove', onMove, { passive: true });
				cleanups.push(() => window.removeEventListener('pointermove', onMove));

				if (isFinePointer() && trigger) {
					const down = (e: PointerEvent) => {
						if ((e.target as HTMLElement).closest('a, button')) return;
						instance?.setCharge(true);
					};
					const up = () => instance?.setCharge(false);
					trigger.addEventListener('pointerdown', down);
					window.addEventListener('pointerup', up);
					cleanups.push(() => {
						trigger.removeEventListener('pointerdown', down);
						window.removeEventListener('pointerup', up);
					});
				}

				if (trigger) {
					const st = ScrollTrigger.create({
						trigger,
						start: 'top top',
						end: 'bottom top',
						onUpdate: (self) => instance?.setScroll(self.progress)
					});
					cleanups.push(() => st.kill());
				}
			}

			sync();
			if (reduce) instance.render();
		})();

		return () => {
			disposed = true;
			stop();
			cleanups.forEach((fn) => fn());
			instance?.dispose();
			instance = null;
			scene = null;
		};
	});
</script>

<div class="absolute inset-0 overflow-hidden" aria-hidden="true">
	<!-- CSS fallback: always present underneath, visible if WebGL is unavailable. -->
	<div
		class="fallback absolute inset-0 transition-[background] duration-1000"
		style:--c={fallbackColor}
	></div>
	<canvas bind:this={canvas} class="absolute inset-0 size-full" class:hidden={failed}></canvas>
</div>

<style>
	.fallback {
		background:
			radial-gradient(
				circle at var(--fx, 61%) var(--fy, 27%),
				color-mix(in oklab, var(--c) 55%, transparent) 0%,
				color-mix(in oklab, var(--c) 18%, transparent) 18%,
				transparent 42%
			),
			var(--color-void);
	}
	/* Same framing as the WebGL emblem (CoreScene `framing`). */
	@media (min-width: 768px) {
		.fallback {
			--fx: 65%;
			--fy: 35%;
		}
	}
	@media (min-width: 1024px) {
		.fallback {
			--fx: 68%;
			--fy: 44%;
		}
	}
</style>
