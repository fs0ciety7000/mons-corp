<script lang="ts">
	import Seo from '#lib/components/seo/Seo.svelte';
	import { divisions } from '#lib/data/divisions.ts';
	import { site } from '#lib/data/site.ts';
	import { reveal } from '#lib/motion/actions.ts';
</script>

<Seo page="contact" />

<section class="pt-40 pb-24 md:pt-56" aria-labelledby="contact-title">
	<div class="grid-cardor gap-y-10">
		<p class="col-span-4 label text-ash md:col-span-8 lg:col-span-12" use:reveal={{ start: false }}>
			Contact
		</p>
		<h1
			id="contact-title"
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-10"
			use:reveal={{ type: 'chars', start: false, delay: 0.2 }}
		>
			Parlons de votre <em class="text-signal">prochain</em> monde.
		</h1>
		<p
			class="col-span-4 max-w-[48ch] text-lead text-ash md:col-span-6"
			use:reveal={{ start: false, delay: 0.5 }}
		>
			Production, partenariat, presse ou candidature : écrivez-nous, la bonne équipe vous répond
			sous 48 heures.
		</p>
		<a
			href="mailto:{site.email}"
			class="col-span-4 font-display text-h2 italic underline decoration-smoke decoration-1 underline-offset-8 transition-colors hover:decoration-signal md:col-span-8"
			data-cursor="Écrire"
			use:reveal={{ type: 'block', start: false, delay: 0.6 }}>{site.email}</a
		>
	</div>

	<ul class="grid-cardor mt-24 gap-y-6">
		{#each divisions as d, i (d.id)}
			<li
				class="col-span-4 border-t border-smoke pt-6 md:col-span-8 lg:col-span-4"
				style:--division={d.color}
				use:reveal={{ type: 'block', delay: i * 0.1 }}
			>
				<p class="label text-(--division)">{d.index} — {d.short}</p>
				<p class="mt-3 font-display text-h2">{d.name}</p>
				<a href={d.url} class="mt-4 inline-block label text-ash hover:text-bone">{d.host} ↗</a>
			</li>
		{/each}
	</ul>
</section>
