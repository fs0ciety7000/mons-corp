<script lang="ts">
	import Seo from '#lib/components/seo/Seo.svelte';
	import { socials } from '#lib/data/social.ts';
	import { divisions } from '#lib/data/divisions.ts';
	import { site } from '#lib/data/site.ts';
	import { reveal } from '#lib/motion/actions.ts';
	import { SITE, type SiteId } from '#lib/sites/config.ts';

	// One heading and lead per site: six contact pages, six distinct answers to « why write? ».
	const copy: Record<SiteId, { before: string; em: string; after: string; lead: string }> = {
		holding: {
			before: 'Parlons de votre',
			em: 'prochain',
			after: 'monde.',
			lead: 'Production, partenariat, presse ou candidature : écrivez-nous, la bonne équipe vous répond sous 48 heures.'
		},
		interactive: {
			before: 'Un jeu ou une app',
			em: 'à forger',
			after: '?',
			lead: 'Jeu vidéo, application web, outil métier ou expérience WebGL : écrivez à CM Interactive, le studio vous répond sous 48 heures.'
		},
		sound: {
			before: 'Un projet',
			em: 'à faire résonner',
			after: '?',
			lead: 'Sound design, doublage, musique originale ou mixage : écrivez à CM Soundworks, le studio vous répond sous 48 heures.'
		},
		creative: {
			before: 'Une histoire',
			em: 'à faire naître',
			after: '?',
			lead: 'Illustration, direction artistique, écriture ou identité : écrivez à CM Creative Lab, l’atelier vous répond sous 48 heures.'
		},
		publishing: {
			before: 'Un livre',
			em: 'à faire paraître',
			after: '?',
			lead: 'Manuscrit, roman graphique, jeu de rôle ou question sur la liseuse : écrivez à CM Publishing, la maison vous répond sous 48 heures.'
		},
		apps: {
			before: 'Une question sur',
			em: 'nos mondes',
			after: '?',
			lead: 'Un jeu qui coince, une application à découvrir ou une idée : écrivez-nous, nous répondons sous 48 heures.'
		}
	};
	const c = copy[SITE];
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
			{c.before} <em class="text-signal">{c.em}</em>
			{c.after}
		</h1>
		<p
			class="col-span-4 max-w-[48ch] text-lead text-ash md:col-span-6"
			use:reveal={{ start: false, delay: 0.5 }}
		>
			{c.lead}
		</p>
		<a
			href="mailto:{site.email}"
			class="col-span-4 font-display text-h2 italic underline decoration-smoke decoration-1 underline-offset-8 transition-colors hover:decoration-signal md:col-span-8"
			data-cursor="Écrire"
			use:reveal={{ type: 'block', start: false, delay: 0.6 }}>{site.email}</a
		>
		<ul
			class="col-span-4 flex flex-wrap gap-3 md:col-span-8"
			aria-label="CARDOR Media sur les réseaux sociaux"
			use:reveal={{ type: 'block', start: false, delay: 0.7 }}
		>
			{#each socials as s (s.id)}
				<li>
					<a
						href={s.url}
						target="_blank"
						rel="noopener me"
						class="inline-flex min-h-11 items-center gap-3 rounded-full border border-smoke px-5 text-bone transition-colors hover:border-signal"
						aria-label="{s.name} {s.handle} (nouvel onglet)"
						data-cursor={s.name}
					>
						<svg viewBox="0 0 24 24" class="size-5 fill-current" aria-hidden="true"
							><path d={s.path} /></svg
						>
						<span>{s.name}</span>
						<span class="font-mono text-xs text-ash">{s.handle}</span>
					</a>
				</li>
			{/each}
		</ul>
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
