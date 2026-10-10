<script lang="ts">
	import { onMount } from 'svelte';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { Drone } from './drone.ts';

	let playing = $state(false);
	let drone: Drone | null = null;

	async function toggle() {
		drone ??= new Drone();
		if (drone.playing) {
			drone.stop();
			playing = false;
		} else {
			await drone.start();
			playing = true;
		}
	}

	// Feed the audio level into the shared state: the Core and the wave pulse with the sound.
	onMount(() => {
		const tick = () => {
			const target = drone?.playing ? drone.level() : 0;
			core.audio += (target - core.audio) * 0.2;
		};
		gsap.ticker.add(tick);
		return () => {
			gsap.ticker.remove(tick);
			core.audio = 0;
			drone?.dispose();
		};
	});

	const reduce = typeof window !== 'undefined' && prefersReducedMotion();
</script>

<button
	type="button"
	onclick={toggle}
	aria-pressed={playing}
	class="listen inline-flex items-center gap-3 rounded-full border border-smoke px-5 py-3.5 label text-bone transition-colors hover:border-signal"
	data-cursor={playing ? 'Couper' : 'Écouter'}
>
	<span class={['bars', playing && !reduce && 'is-on']} aria-hidden="true">
		<i></i><i></i><i></i><i></i>
	</span>
	{playing ? 'Couper le carillon' : 'Écouter le Noyau'}
</button>

<style>
	.bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 14px;
	}
	.bars i {
		width: 2px;
		height: 30%;
		background: var(--color-signal);
	}
	.bars.is-on i {
		animation: eq 0.9s ease-in-out infinite alternate;
	}
	.bars.is-on i:nth-child(2) {
		animation-delay: -0.3s;
	}
	.bars.is-on i:nth-child(3) {
		animation-delay: -0.6s;
	}
	.bars.is-on i:nth-child(4) {
		animation-delay: -0.15s;
	}
	@keyframes eq {
		to {
			height: 100%;
		}
	}
</style>
