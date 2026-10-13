<script lang="ts">
	import Seo from '#lib/components/seo/Seo.svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { wipe } from '#lib/sites/creative/beffroi8/crisp.ts';
	import { catalog } from '#lib/sites/apps/catalog.ts';
	import { siteUrl } from '#lib/sites/config.ts';
	import {
		booklet,
		contents,
		files,
		pagesLabel,
		previews,
		release
	} from '#lib/sites/creative/privatix-jdr/content.ts';

	// Related works come from the launcher catalogue (ADR-012): one source for the URLs.
	const entry = (id: string) => catalog.find((a) => a.id === id);
	const game = entry('privatix');
	const artbook = entry('privatix-artbook');
	const related = [
		game && {
			href: game.links?.find((l) => l.label === 'Jouer')?.url ?? game.url,
			label: 'Le jeu vidéo',
			title: game.name,
			text: game.pitch,
			cta: 'Jouer'
		},
		artbook && {
			href: artbook.url,
			label: 'Direction artistique',
			title: artbook.name,
			text: artbook.pitch,
			cta: 'Feuilleter'
		}
	].filter((r) => !!r);

	const [cover, ...pages] = previews;

	const base = siteUrl('creative');
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Book',
		name: 'Privatix, le jeu de rôle',
		alternateName: 'Tasse & Ballast',
		genre: 'Jeu de rôle sur table',
		description:
			'Un jeu de rôle sur table dans l’univers de Privatix : une équipe de cheminots en 3x8 défend la gare de Mons contre les consultants et les automates de la mégacorporation.',
		url: `${base}/privatix-jdr`,
		image: `${base}${cover.src}`,
		inLanguage: 'fr',
		numberOfPages: booklet.pages,
		version: release.version,
		bookFormat: 'https://schema.org/EBook',
		isAccessibleForFree: true,
		creator: { '@id': `${base}/#organization` },
		copyrightHolder: { '@id': `${siteUrl('holding')}/#organization` },
		copyrightYear: 2026,
		usageInfo: 'Usage personnel et partage gratuit ; revente interdite.',
		isBasedOn: game ? { '@type': 'VideoGame', name: game.name, url: game.url } : undefined,
		encoding: files.map((f) => ({
			'@type': 'MediaObject',
			name: f.title,
			contentUrl: `${base}${f.href}`,
			encodingFormat: 'application/pdf',
			contentSize: f.size
		}))
	};
</script>

<Seo page="privatix-jdr" {schema} />

<section class="pt-36 pb-16 md:pt-52 md:pb-24" aria-labelledby="jdr-title">
	<div class="grid-cardor gap-y-12">
		<div class="col-span-4 min-w-0 md:col-span-8 lg:col-span-7">
			<p class="label text-ash" use:reveal={{ start: false }}>
				[Jeu de rôle] — CM Creative Lab, d’après le jeu vidéo Privatix
			</p>
			<h1
				id="jdr-title"
				class="mt-8 font-display text-display"
				use:reveal={{ type: 'words', start: false, delay: 0.1 }}
			>
				Privatix, <em class="text-signal">le jeu de rôle</em>
			</h1>
			<p class="mt-10 max-w-[56ch] text-lead text-ash" use:reveal={{ start: false, delay: 0.3 }}>
				Un jeu de rôle sur table dans l’univers de Privatix : une équipe de cheminots en 3x8 défend
				la gare de Mons contre les consultants et les automates de la mégacorporation. Règles en dix
				minutes, six métiers, trois scénarios d’une soirée.
			</p>
			<p class="mt-8 label text-bone" use:reveal={{ start: false, delay: 0.4 }}>
				3 à 6 joueurs + la Voix · une soirée · gratuit
			</p>
			<p class="mt-10 flex flex-wrap gap-3">
				<a
					href={booklet.href}
					download={booklet.name}
					class="cta cta-primary"
					data-cursor="Télécharger"
				>
					Télécharger le livret <span class="sr-only">(PDF, {booklet.size})</span>
					<span aria-hidden="true">↓</span>
				</a>
				<a href="#telecharger" class="cta">Tous les fichiers</a>
			</p>
		</div>

		<figure class="col-span-4 min-w-0 md:col-span-6 lg:col-span-4 lg:col-start-9">
			<div class="page-frame" use:wipe>
				<img
					src={cover.src}
					alt={cover.alt}
					width={cover.width}
					height={cover.height}
					fetchpriority="high"
					decoding="async"
					class="block h-auto w-full"
				/>
			</div>
			<figcaption class="mt-4 label text-ash">
				Livret A5 · {pagesLabel(booklet)} · v{release.version}
			</figcaption>
		</figure>
	</div>
</section>

<section id="contenu" class="relative section-y" aria-labelledby="contenu-title">
	<SectionHead
		index="01"
		label="Dans le livret"
		title={{ before: 'Tout pour', em: 'une soirée.' }}
		id="contenu-title"
	/>
	<ul class="grid-cardor mt-12 gap-y-10 md:mt-16">
		{#each contents as c, i (c.title)}
			<li
				class="col-span-4 min-w-0 border-t border-smoke pt-6 md:col-span-4 lg:col-span-4"
				use:reveal={{ type: 'block', delay: 0.05 * (i % 3) }}
			>
				<p class="label text-signal" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
				<h3 class="mt-3 font-display text-h2">{c.title}</h3>
				<p class="mt-3 max-w-[40ch] text-ash">{c.text}</p>
				{#if c.list}
					<ul class="mt-4 space-y-1 font-display text-lead italic">
						{#each c.list as item (item)}
							<li>{item}</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<section id="apercu" class="relative section-y" aria-labelledby="apercu-title">
	<SectionHead
		index="02"
		label="Aperçu"
		title={{ before: 'Quelques', em: 'pages.' }}
		id="apercu-title"
	/>
	<div class="grid-cardor mt-12 gap-y-10 md:mt-16">
		{#each pages as p (p.id)}
			<figure
				class={[
					'col-span-4 min-w-0',
					p.width > p.height ? 'md:col-span-8 lg:col-span-8' : 'md:col-span-4 lg:col-span-4'
				]}
			>
				<div class="page-frame" use:reveal={{ type: 'block' }}>
					<img
						src={p.src}
						alt={p.alt}
						width={p.width}
						height={p.height}
						loading="lazy"
						decoding="async"
						class="block h-auto w-full"
					/>
				</div>
				<figcaption class="mt-4 label text-ash">{p.caption}</figcaption>
			</figure>
		{/each}
	</div>
</section>

<section id="telecharger" class="relative section-y" aria-labelledby="telecharger-title">
	<SectionHead
		index="03"
		label="Téléchargements"
		title={{ before: 'À imprimer,', em: 'à partager.' }}
		id="telecharger-title"
	/>
	<div class="grid-cardor mt-12 gap-y-10 md:mt-16">
		<ul class="col-span-4 min-w-0 space-y-3 md:col-span-8 lg:col-span-7" aria-label="Fichiers PDF">
			{#each files as f, i (f.id)}
				<li use:wipe={{ delay: 0.05 * i }}>
					<a href={f.href} download={f.name} class="file group" data-cursor="Télécharger">
						<span class="min-w-0">
							<span class="block font-display text-h2">{f.title}</span>
							<span class="mt-2 block text-sm text-ash"
								>PDF · {pagesLabel(f)}{f.detail ? ` · ${f.detail}` : ''}</span
							>
						</span>
						<span class="flex shrink-0 items-center gap-3">
							<span class="label text-ash">{f.size}</span>
							<span
								aria-hidden="true"
								class="text-signal transition-transform group-hover:translate-y-1">↓</span
							>
						</span>
					</a>
				</li>
			{/each}
		</ul>

		<div class="col-span-4 min-w-0 md:col-span-8 lg:col-span-5">
			<div class="notice" use:wipe={{ delay: 0.1 }}>
				<p class="label text-signal">Mentions</p>
				<p class="mt-3 text-ash">
					Personnages et entreprises fictifs, à l’exception d’une caricature bon enfant d’une
					personnalité publique.
				</p>
				<p class="mt-3 font-display text-lead italic">
					Usage personnel et partage gratuit ; revente interdite.
				</p>
			</div>
		</div>
	</div>
</section>

{#if related.length}
	<section id="univers" class="relative section-y" aria-labelledby="univers-title">
		<SectionHead
			index="04"
			label="Autour du jeu"
			title={{ before: 'Le même', em: 'monde.' }}
			id="univers-title"
		/>
		<ul class="grid-cardor mt-12 gap-y-6 md:mt-16">
			{#each related as r (r.href)}
				<li class="col-span-4 min-w-0 md:col-span-4 lg:col-span-6">
					<a href={r.href} target="_blank" rel="noopener" class="related group" use:wipe>
						<span class="label text-ash">{r.label}</span>
						<span class="flex items-baseline justify-between gap-4">
							<span class="font-display text-h2">{r.title}</span>
							<span
								class="label text-ash transition-colors group-hover:text-signal"
								aria-hidden="true">{r.cta} ↗</span
							>
						</span>
						<span class="font-display text-lead text-ash italic">{r.text}</span>
						<span class="sr-only">(s’ouvre dans un nouvel onglet)</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.page-frame {
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		overflow: clip;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.75rem;
		padding: 0 1.5rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		color: var(--color-bone);
		transition:
			border-color 0.2s var(--ease-cardor-out),
			background-color 0.2s var(--ease-cardor-out),
			color 0.2s var(--ease-cardor-out);
	}
	.cta:hover {
		border-color: var(--color-bone);
	}
	.cta-primary {
		background: var(--color-bone);
		border-color: var(--color-bone);
		color: var(--color-void);
	}
	.cta-primary:hover {
		background: var(--color-signal);
		border-color: var(--color-signal);
	}
	.cta:active {
		scale: 0.97;
	}
	.file {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 2.75rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition: border-color 0.3s var(--ease-cardor-out);
	}
	.file:hover,
	.file:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
	.notice {
		border-left: 1px solid var(--color-signal);
		padding-left: 1.5rem;
	}
	.related {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
		padding: 1.5rem;
		border: 1px solid var(--color-smoke);
		transition: border-color 0.3s var(--ease-cardor-out);
	}
	@media (width >= 48rem) {
		.related {
			padding: 2rem;
		}
	}
	.related:hover,
	.related:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
	@media (prefers-reduced-motion: reduce) {
		.cta,
		.file,
		.related,
		.file :global(*) {
			transition: none;
		}
		.cta:active {
			scale: none;
		}
	}
</style>
