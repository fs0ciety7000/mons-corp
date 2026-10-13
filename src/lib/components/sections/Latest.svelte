<script lang="ts">
	import { catalog, latest } from '#lib/sites/apps/catalog.ts';
	import { divisions } from '#lib/data/divisions.ts';
	import { siteUrl } from '#lib/sites/config.ts';
	import { reveal } from '#lib/motion/actions.ts';

	const division = (id: string) => divisions.find((d) => d.id === id)!;
	const works = latest.map((id) => catalog.find((a) => a.id === id)).filter((a) => a !== undefined);
</script>

<section id="sorties" class="relative section-y" aria-labelledby="sorties-title">
	<div class="grid-cardor gap-y-8">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>[03] — Sorties</p>
		<h2
			id="sorties-title"
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-9"
			use:reveal={{ type: 'chars' }}
		>
			Les derniers <em class="text-ember">mondes</em> ouverts.
		</h2>
	</div>

	<ul class="grid-cardor mt-16 gap-y-6 md:mt-24">
		{#each works as w (w.id)}
			{@const d = division(w.studio)}
			<li class="col-span-4 lg:col-span-4">
				<a
					href={w.url}
					target="_blank"
					rel="noopener"
					class="work group"
					style:--division={d.color}
					data-cursor={d.cursorLabel}
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
						<p class="label text-(--division)">{d.name}</p>
						<div class="flex items-baseline justify-between gap-4">
							<h3 class="font-display text-h2">{w.name}</h3>
							<span
								class="label text-ash transition-colors group-hover:text-(--division)"
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

	<p class="mt-10 gutter-x">
		<a
			href={siteUrl('apps')}
			class="label text-bone underline decoration-1 underline-offset-4 hover:text-ember"
			data-cursor="Ouvrir">Tous les projets de la maison ↗</a
		>
	</p>
</section>

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
		border-color: color-mix(in oklab, var(--division) 45%, var(--color-smoke));
	}
</style>
