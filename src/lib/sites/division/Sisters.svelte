<script lang="ts">
	import Logo from '#lib/components/brand/Logo.svelte';
	import { divisionSites, site, siteUrl } from '#lib/sites/config.ts';
	import { reveal } from '#lib/motion/actions.ts';

	const others = divisionSites.filter((s) => s.id !== site.id);
</script>

<section class="relative section-y pt-0" aria-labelledby="sisters-title">
	<div class="grid-cardor gap-y-8">
		<p class="col-span-4 label text-ash md:col-span-8 lg:col-span-12" use:reveal>La maison</p>
		<h2
			id="sisters-title"
			class="col-span-4 font-display text-h1 md:col-span-8 lg:col-span-9"
			use:reveal={{ type: 'words' }}
		>
			Un studio du cortège <em class="text-or">CARDOR</em>.
		</h2>
	</div>
	<ul class="grid-cardor mt-12 gap-y-4">
		<li class="col-span-4 md:col-span-4 lg:col-span-6" use:reveal={{ type: 'block' }}>
			<a href={siteUrl('holding')} class="sister group" style:--c="var(--color-or)">
				<span class="size-14 shrink-0 text-or"
					><Logo name="cardor-monogram" animate="hover" host=".sister" class="size-full" /></span
				>
				<span class="flex-1">
					<span class="block label text-ash">Maison mère</span>
					<span class="block font-display text-h2">CARDOR <em class="text-or">Media</em></span>
				</span>
				<span aria-hidden="true">↗</span>
			</a>
		</li>
		{#each others as s, i (s.id)}
			<li
				class="col-span-4 md:col-span-4 lg:col-span-6"
				use:reveal={{ type: 'block', delay: (i + 1) * 0.08 }}
			>
				<a
					href={siteUrl(s.id)}
					class="sister group"
					style:--c={s.signal}
					data-cursor={s.cursorLabel}
				>
					<span class="size-14 shrink-0 text-ash transition-colors group-hover:text-(--c)">
						<Logo name={s.emblem} swap animate="hover" host=".sister" class="size-full" />
					</span>
					<span class="flex-1">
						<span class="block label text-ash">Studio frère</span>
						<span class="block font-display text-h2">{s.name}</span>
					</span>
					<span aria-hidden="true">↗</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.sister {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		height: 100%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		padding: 1.5rem;
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.sister:hover,
	.sister:focus-visible {
		border-color: color-mix(in oklab, var(--c) 50%, var(--color-smoke));
	}
</style>
