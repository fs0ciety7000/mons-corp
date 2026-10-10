<script lang="ts">
	import Logo from '#lib/components/brand/Logo.svelte';
	import SectionHead from './SectionHead.svelte';
	import type { DivisionContent } from './types.ts';
	import { site, siteUrl } from '#lib/sites/config.ts';
	import { reveal } from '#lib/motion/actions.ts';

	let { emblem, index }: { emblem: DivisionContent['emblem']; index: string } = $props();
</script>

<section id="emblème" class="relative overflow-clip section-y" aria-labelledby="emblem-title">
	<SectionHead {index} label="Emblème — {emblem.motif}" title={emblem.title} id="emblem-title" />
	<div class="grid-cardor mt-16 items-center gap-y-12 md:mt-24">
		<div class="col-span-4 md:col-span-4 lg:col-span-6" use:reveal={{ type: 'block' }}>
			<div class="relative aspect-square border border-smoke bg-ink">
				<div class="emblem-glow absolute inset-0" aria-hidden="true"></div>
				<div class="absolute inset-[14%]">
					<Logo
						name={site.emblem}
						animate="loop"
						drawIn
						class="size-full"
						title="Emblème {site.name} : {emblem.motif}"
					/>
				</div>
			</div>
		</div>
		<div class="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-8">
			{#each emblem.story as para, i (i)}
				<p
					class={['text-ash', i === 0 ? 'text-lead text-bone' : 'mt-6']}
					use:reveal={{ delay: i * 0.1 }}
				>
					{para}
				</p>
			{/each}
			<p class="mt-10 label text-ash" use:reveal>{emblem.detail}</p>
			<a
				href="{siteUrl('holding')}/marque"
				class="mt-6 inline-block label text-signal underline decoration-1 underline-offset-4"
				>Charte du cortège montois ↗</a
			>
		</div>
	</div>
</section>

<style>
	.emblem-glow {
		background: radial-gradient(
			circle at 50% 55%,
			color-mix(in oklab, var(--color-signal) 18%, transparent),
			transparent 60%
		);
	}
</style>
