<script lang="ts">
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { catalog } from '#lib/sites/apps/catalog.ts';
	import { reveal } from '#lib/motion/actions.ts';

	let { index }: { index: string } = $props();

	/** The studio's playable works (e.g. Le Carillon): single source with the app launcher (ADR-012). */
	const works = catalog.filter((a) => a.studio === 'sound');
</script>

{#if works.length}
	<section id="experiences" class="relative section-y" aria-labelledby="experiences-title">
		<SectionHead
			{index}
			label="Expériences"
			title={{ before: 'À jouer', em: 'ensemble.' }}
			id="experiences-title"
		/>
		<ul class="grid-cardor mt-12 gap-y-6">
			{#each works as w (w.id)}
				<li class="col-span-4 md:col-span-8 lg:col-span-6">
					<a
						href={w.url}
						target="_blank"
						rel="noopener"
						class="work group"
						data-cursor="Écouter"
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
