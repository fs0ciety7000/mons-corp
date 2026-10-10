<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import type { DivisionContent } from './types.ts';
	import { reveal, scramble } from '#lib/motion/actions.ts';
	import { SITE } from '#lib/sites/config.ts';

	let { offer, index }: { offer: DivisionContent['offer']; index: string } = $props();
</script>

<section id={offer.id} class="relative section-y" aria-labelledby="{offer.id}-title">
	<SectionHead {index} label={offer.label} title={offer.title} id="{offer.id}-title" />
	<p class="mt-8 max-w-[56ch] gutter-x text-lead text-ash lg:ml-[25%]" use:reveal={{ delay: 0.15 }}>
		{offer.intro}
	</p>

	<ol class="mt-16 border-t border-smoke md:mt-24">
		{#each offer.items as item, i (item.title)}
			<li
				class="offer-row group border-b border-smoke"
				use:reveal={{ type: 'block', delay: i * 0.06 }}
			>
				<div class="grid-cardor items-baseline gap-y-4 py-8 md:py-10">
					<span class="col-span-1 label text-ash group-hover:text-signal">0{i + 1}</span>
					<h3 class="col-span-3 font-display text-h2 md:col-span-3 lg:col-span-4">
						{#if SITE === 'interactive'}
							<span use:scramble={{ onReveal: false, hoverParent: '.offer-row', duration: 0.5 }}
								>{item.title}</span
							>
						{:else}
							<span class="transition-[color] duration-500 group-hover:text-signal"
								>{item.title}</span
							>
						{/if}
					</h3>
					<p class="col-span-4 text-ash md:col-span-4 lg:col-span-4">{item.text}</p>
					<ul
						class="col-span-4 flex flex-wrap gap-2 md:col-span-8 md:col-start-2 lg:col-span-3 lg:col-start-10 lg:justify-end"
					>
						{#each item.tags as tag (tag)}
							<li class="rounded-full border border-smoke px-3 py-1.5 label text-ash">{tag}</li>
						{/each}
					</ul>
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.offer-row {
		position: relative;
		transition: background-color 0.5s var(--ease-cardor-out);
	}
	.offer-row:hover {
		background-color: color-mix(in oklab, var(--color-signal) 5%, transparent);
	}
</style>
