<script lang="ts">
	import type { DivisionContent } from './types.ts';
	import SectionHead from './SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { site } from '#lib/sites/config.ts';

	let { soon, index }: { soon: NonNullable<DivisionContent['soon']>; index: string } = $props();
</script>

<section id="productions" class="relative section-y" aria-labelledby="soon-title">
	<SectionHead {index} label="Productions" title={soon.title} id="soon-title" />
	<div class="mt-12 gutter-x lg:ml-[25%]">
		<div
			class="soon relative overflow-clip border border-dashed border-smoke p-8 md:p-12"
			use:reveal={{ type: 'block' }}
		>
			<span class="label text-signal">● En préparation</span>
			<p class="mt-4 max-w-[52ch] text-lead text-ash">{soon.text}</p>
			<a
				href="mailto:{site.email}"
				class="mt-8 inline-block label text-bone underline decoration-1 underline-offset-4"
				>{site.email}</a
			>
		</div>
	</div>
</section>

<style>
	.soon {
		background: repeating-linear-gradient(
			-45deg,
			transparent 0 14px,
			color-mix(in oklab, var(--color-signal) 4%, transparent) 14px 15px
		);
	}
</style>
