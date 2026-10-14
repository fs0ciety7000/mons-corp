<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import type { Project } from '#lib/data/projects.ts';
	import type { Title } from './types.ts';

	/**
	 * A division's projects, from the single source (src/lib/data/projects.ts). Renders nothing
	 * while the list is empty, so a new project appears without touching the page.
	 */
	let {
		index,
		id = 'projets',
		label = 'Projets',
		title,
		works,
		cursor
	}: {
		index: string;
		id?: string;
		label?: string;
		title: Title;
		works: Project[];
		cursor: string;
	} = $props();
</script>

{#if works.length}
	<section {id} class="relative section-y" aria-labelledby="{id}-title">
		<SectionHead {index} {label} {title} id="{id}-title" />
		<ul class="grid-cardor mt-12 gap-y-6">
			{#each works as w (w.id)}
				<li class="col-span-4 md:col-span-8 lg:col-span-6">
					<a
						href={w.url}
						target="_blank"
						rel="noopener"
						class="work group"
						data-cursor={cursor}
						use:reveal={{ type: 'block' }}
					>
						<div class="relative aspect-[16/10] overflow-clip border-b border-smoke bg-graphite">
							<img
								src={w.cover}
								alt="{w.name} — {w.category}"
								loading="lazy"
								decoding="async"
								width="1200"
								height="750"
								class="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-cardor-out) group-hover:scale-[1.04]"
							/>
						</div>
						<div class="flex flex-1 flex-col gap-3 p-6 md:p-8">
							<div class="flex items-baseline justify-between gap-4">
								<h3 class="font-display text-h2">{w.name}</h3>
								<span
									class="label text-ash transition-colors group-hover:text-signal"
									aria-hidden="true">↗</span
								>
							</div>
							<p class="label text-ash">{w.category}</p>
							<p class="font-display text-lead italic">{w.pitch}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.work {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.work:hover,
	.work:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
</style>
